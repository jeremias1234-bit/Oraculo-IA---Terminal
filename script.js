// --- 💾 HISTORIAL EN LOCALSTORAGE ---
let historialChats = JSON.parse(localStorage.getItem('oraculo_chats')) || {};
let chatIdActivo = null;

const canvas = document.getElementById('networkCanvas');
const ctx = canvas.getContext('2d');

// --- 🔐 AUTENTICACIÓN ASÍNCRONA ---
async function ejecutarLogin() {
    const userVal = document.getElementById('usernameInput').value.trim();
    const passVal = document.getElementById('passwordInput').value.trim();

    if (!userVal || !passVal) {
        alert("⚠️ Por favor, completa todos los campos.");
        return;
    }

    try {
        const response = await fetch('http://localhost:8000/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: userVal, password: passVal })
        });
        
        if (response.ok) {
            document.getElementById('loginScreen').style.display = 'none';
            document.getElementById('appScreen').style.display = 'flex';
            resizeCanvas();
            inicializarEntorno();
        } else { 
            alert("🔥 Acceso Denegado: Firma criptográfica no coincide."); 
        }
    } catch (err) { 
        alert("❌ Error de enlace. Verifica que app.py esté corriendo."); 
    }
}

function inicializarEntorno() {
    renderizarListaChats();
    const keys = Object.keys(historialChats);
    if (keys.length > 0) { cargarChat(keys[keys.length - 1]); } 
    else { crearNuevoChat(); }
}

function crearNuevoChat() {
    const id = 'CHAT_' + Date.now();
    historialChats[id] = { title: "Matriz de consulta " + (Object.keys(historialChats).length + 1), messages: [] };
    guardarEnDisco();
    renderizarListaChats();
    cargarChat(id);
}

function cargarChat(id) {
    chatIdActivo = id;
    document.getElementById('chatTitle').innerText = `MATRIZ_ACTIVA: ${historialChats[id].title}`;
    const container = document.getElementById('chatMessages');
    container.innerHTML = `<div class="msg system">[SISTEMA]: Restaurando nodos de memoria indexados...</div>`;
    
    historialChats[id].messages.forEach(m => {
        const userHeader = m.role === 'user' ? '> Tú:' : '🤖 Oráculo:';
        container.innerHTML += `<div class="msg ${m.role}"><b>${userHeader}</b><br>${m.text.replace(/\n/g, '<br>')}</div>`;
    });
    container.scrollTop = container.scrollHeight;
    renderizarListaChats();
}

function renderizarListaChats() {
    const list = document.getElementById('chatList');
    if (!list) return;
    list.innerHTML = '';
    Object.keys(historialChats).forEach(id => {
        const item = document.createElement('div');
        const isActive = id === chatIdActivo ? 'active' : '';
        item.className = `history-item ${isActive}`;
        item.innerText = historialChats[id].title;
        item.onclick = () => cargarChat(id);
        list.appendChild(item);
    });
}

// --- 🚀 MOTOR STREAMING ULTRA VELOCIDAD ---
async function enviarPrompt() {
    const input = document.getElementById('promptInput');
    const chatBox = document.getElementById('chatMessages');
    const prompt = input.value.trim();
    if (!prompt || !chatIdActivo) return;

    historialChats[chatIdActivo].messages.push({ role: 'user', text: prompt });
    if(historialChats[chatIdActivo].messages.length === 1) {
        historialChats[chatIdActivo].title = prompt.substring(0, 20) + "...";
    }
    
    chatBox.innerHTML += `<div class="msg user"><b>> Tú:</b><br>${prompt.replace(/\n/g, '<br>')}</div>`;
    input.value = '';
    chatBox.scrollTop = chatBox.scrollHeight;

    const aiMsgId = 'ai_' + Date.now();
    chatBox.innerHTML += `<div class="msg ai" id="${aiMsgId}"><b>🤖 Oráculo:</b><br></div>`;
    const aiMessageDiv = document.getElementById(aiMsgId);
    chatBox.scrollTop = chatBox.scrollHeight;

    const formData = new FormData();
    formData.append('user_message', prompt);

    try {
        const response = await fetch('http://localhost:8000/api/preguntar', { method: 'POST', body: formData });
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let respuestaCompleta = "";

        while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            const token = decoder.decode(value, { stream: true });
            respuestaCompleta += token;
            aiMessageDiv.innerHTML = `<b>🤖 Oráculo:</b><br>${respuestaCompleta.replace(/\n/g, '<br>')}`;
            chatBox.scrollTop = chatBox.scrollHeight;
        }

        historialChats[chatIdActivo].messages.push({ role: 'ai', text: respuestaCompleta });
        guardarEnDisco();

    } catch (err) {
        aiMessageDiv.innerHTML += `<br><span style="color:#ef4444;">[ERROR]: Enlace de red local interrumpido.</span>`;
    }
}

function guardarEnDisco() { localStorage.setItem('oraculo_chats', JSON.stringify(historialChats)); }

document.getElementById('newChatBtn').addEventListener('click', crearNuevoChat);
document.getElementById('sendBtn').addEventListener('click', enviarPrompt);

document.getElementById('promptInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); enviarPrompt(); }
});

// --- 🌌 ANIMACIÓN DEL FONDO (CANVAS) ---
function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
const particles = [];
class Particle {
    constructor() { this.x = Math.random()*canvas.width; this.y = Math.random()*canvas.height; this.vx = (Math.random()-0.5)*0.5; this.vy = (Math.random()-0.5)*0.5; this.radius = Math.random()*1.5+1; }
    draw() { ctx.beginPath(); ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2); ctx.fillStyle = '#0070e0'; ctx.fill(); }
    update() { this.x += this.vx; this.y += this.vy; if (this.x<0||this.x>canvas.width) this.vx = -this.vx; if (this.y<0||this.y>canvas.height) this.vy = -this.vy; }
}
for(let i=0;i<65;i++) particles.push(new Particle());
function animate() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    for(let i=0; i<particles.length; i++){
        for(let j=i+1; j<particles.length; j++){
            const dx = particles[i].x - particles[j].x; const dy = particles[i].y - particles[j].y; const d = Math.sqrt(dx*dx+dy*dy);
            if(d<120){ ctx.beginPath(); ctx.moveTo(particles[i].x,particles[i].y); ctx.lineTo(particles[j].x,particles[j].y); ctx.strokeStyle=`rgba(0,112,224,${(1-d/120)*0.25})`; ctx.lineWidth=0.7; ctx.stroke(); }
        }
    }
    requestAnimationFrame(animate);
}
window.addEventListener('resize', resizeCanvas);
animate();
