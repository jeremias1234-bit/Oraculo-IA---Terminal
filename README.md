# Oráculo IA - Terminal 🚀

Es un asistente inteligente local de arquitectura asíncrona diseñado para optimizar los procesos de consulta y soporte de la comunidad estudiantil. El sistema procesa peticiones en tiempo real mediante un backend de alto rendimiento y un motor de Inteligencia Artificial que ejecuta modelos de lenguaje (LLM) de forma 100% local.

## 🏗️ Arquitectura y Flujo del Sistema

El proyecto está diseñado bajo un modelo monolítico ligero, estructurado en tres componentes principales interconectados:

```text
[ index.html ]  🌐 (Interfaz de usuario y estilos CSS)
      │
      ▼  ↕ (Persistencia en LocalStorage / Peticiones Asíncronas)
[ script.js ]  ⚡ (Lógica del lado del cliente y manejo de flujos)
      │
      ▼  ↕ (Fetch API / Protocolo HTTP)
[  app.py   ]  🐍 (Backend asíncrono con FastAPI y cliente HTTPX)
      │
      ▼  ↕ (Canalización de Streaming de datos)
[ Ollama / Llama 3.1 ] 🤖 (Procesamiento y generación de IA Local)
```



## 🛠️ Componentes y Tecnologías Utilizadas

* **Backend (`app.py`):** Desarrollado en **Python** utilizando el framework asíncrono **FastAPI**. Implementa el cliente de red de última generación **HTTPX** para gestionar la concurrencia, optimizar la velocidad de respuesta y evitar el bloqueo de hilos de ejecución (*thread blocking*) ante peticiones multiproceso.
* **Frontend e Interfaz (`index.html`):** Estructura modular construida con HTML5 y estilizada mediante CSS3 con una estética de alto impacto visual inspirada en terminales de ciberseguridad (*Netrunner*).
* **Lógica del Cliente (`script.js`):** Desarrollado en **JavaScript** plano (Vanilla JS). Administra la captura de eventos, las llamadas asíncronas hacia el servidor y gestiona la persistencia de datos local mediante **LocalStorage** en formato JSON estructurado, reteniendo el historial del usuario sin requerir bases de datos pesadas en esta fase.
* **Motor de IA Local:** Integración nativa con **Ollama** ejecutando el modelo **Llama 3.1 (8B)**, configurado mediante canalizaciones (*pipelines*) de streaming que envían las respuestas "token por token" para mitigar la latencia percibida por el usuario.

## 🚀 Requisitos e Instalación Local

### Prerrequisitos
1. Tener instalado [Python 3.10+](https://python.org).
2. Tener instalado [Ollama](https://ollama.com) ejecutando el modelo Llama 3.1:
   ```bash
   ollama run llama3.1
   ```

### Configuración del Entorno
1. Cloná este repositorio en tu máquina local.
2. Instalá las dependencias necesarias de Python mediante la terminal:
   ```bash
   pip install fastapi uvicorn httpx
   ```
3. Ejecutá el servidor de desarrollo del Backend:
   ```bash
   uvicorn app:app --reload
   ```
4. Abrí el archivo `index.html` en tu navegador web preferido y comenzá a interactuar con el Oráculo.

## 🎯 Próximos Pasos (Roadmap del Proyecto)
* [ ] **Fase 2:** Migración del almacenamiento local hacia una base de datos relacional robusta (PostgreSQL) para centralizar perfiles de alumnos.
* [ ] **Fase 3:** Incorporación de un módulo transaccional securizado para la gestión automatizada de inscripciones y analíticos universitarios.

---
*Desarrollado con enfoque autodidacta y asistido por herramientas de IA como copiloto técnico para optimización de flujos de código.*
