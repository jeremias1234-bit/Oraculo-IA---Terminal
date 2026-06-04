from fastapi import FastAPI, Form, HTTPException
from fastapi.responses import HTMLResponse, StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
import httpx
import json
from pydantic import BaseModel

app = FastAPI(title="Oráculo IA - Backend Pro")

# Evitamos colisiones de puertos (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🛡️ DEFINICIÓN DEL MODELO DE DATOS JSON
class LoginRequest(BaseModel):
    username: str
    password: str

OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL_NAME = "llama3.1:8b"

@app.get("/", response_class=HTMLResponse)
async def server_status():
    return "<h1>⚡ SERVIDOR DEL ORÁCULO IA PRO ONLINE ⚡</h1>"

# 🔐 ENDPOINT DE AUTENTICACIÓN JSON ÚNICO
@app.post("/api/login")
async def login_process(request: LoginRequest):
    if request.username == "admin" and request.password == "oraculo2026":
        return {"status": "success"}
    raise HTTPException(status_code=401, detail="Credenciales incorrectas")

# 🧠 GENERADOR ASÍNCRONO DE TOKENS (VELOCIDAD ULTRA)
async def ollama_stream_generator(user_message: str):
    system_prompt = (
        "Sos el Oráculo de la facultad, un asistente inteligente para alumnos ingresantes. "
        "Respondé de forma clara, tecnológica, precisa y siempre en español."
    )
    payload = {
        "model": MODEL_NAME,
        "prompt": f"{system_prompt}\n\nAlumno: {user_message}\nOráculo:",
        "stream": True # 🚀 Habilitamos que Ollama escupa palabra por palabra
    }
    
    async with httpx.AsyncClient(timeout=60.0) as client:
        try:
            # Iniciamos la conexión por stream
            async with client.stream("POST", OLLAMA_URL, json=payload) as response:
                async for chunk in response.aiter_lines():
                    if chunk:
                        chunk_data = json.loads(chunk)
                        token = chunk_data.get("response", "")
                        yield token # Envía el fragmento de texto al frontend al instante
        except Exception as e:
            yield f"\n[ERROR DE ENLACE LOCAL]: {str(e)}"

@app.post("/api/preguntar")
async def preguntar_oraculo(user_message: str = Form(...)):
    # FastAPI retorna la respuesta como un río continuo de datos
    return StreamingResponse(ollama_stream_generator(user_message), media_type="text/plain")
