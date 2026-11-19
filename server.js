// server.js
const express = require('express');
const https = require('https');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;
const API_KEY = 'AIzaSyBxwRz7nPRg7lYjfNUNB2HlocrhWliOU7g'; // Sua chave mantida intacta

app.use(cors());
// Limite aumentado para 50mb por causa do envio de imagens em base64 para a IA
app.use(express.json({ limit: '50mb' })); 
app.use(express.static(__dirname)); // Serve todos os seus HTML, CSS e JS automaticamente

// ============================================================
// 1. ROTA DA IA (GEMINI) - Lógica original do seu proxy.js preservada
// ============================================================
app.post('/api/chat', (req, res) => {
    console.log('[TrocaAI] Recebeu requisição do frontend...');
    
    const parsed = req.body;
    if (!parsed || !parsed.messages) {
        return res.status(400).json({ error: 'Body JSON inválido' });
    }

    console.log('[TrocaAI] Convertendo formato e enviando para o Gemini...');

    const geminiContents = parsed.messages.map(msg => {
        let parts = [];
        if (Array.isArray(msg.content)) {
            msg.content.forEach(c => {
                if (c.type === 'text') parts.push({ text: c.text });
                if (c.type === 'image') {
                    parts.push({
                        inlineData: { mimeType: c.source.media_type, data: c.source.data }
                    });
                }
            });
        } else {
            parts.push({ text: msg.content });
        }
        return { role: msg.role === 'assistant' ? 'model' : 'user', parts };
    });

    const geminiPayload = JSON.stringify({
        systemInstruction: { parts: [{ text: parsed.system }] },
        contents: geminiContents,
        generationConfig: { responseMimeType: "application/json" }
    });

    const options = {
        hostname: 'generativelanguage.googleapis.com',
        path: `/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(geminiPayload)
        }
    };

    const apiReq = https.request(options, apiRes => {
        let data = '';
        apiRes.on('data', chunk => data += chunk);
        apiRes.on('end', () => {
            if (apiRes.statusCode !== 200) {
                console.error('[TrocaAI] Erro do Gemini:', data);
                return res.status(apiRes.statusCode).send(data);
            }
            try {
                const jsonRes = JSON.parse(data);
                const textoResposta = jsonRes.candidates[0].content.parts[0].text;
                console.log('[TrocaAI] Resposta gerada com sucesso!');
                res.json({ content: [{ text: textoResposta }] });
            } catch (err) {
                console.error('[TrocaAI] Erro ao fazer parse da resposta:', err);
                res.status(500).json({ error: "Erro ao ler a resposta da IA" });
            }
        });
    });

    apiReq.on('error', err => {
        console.error('[TrocaAI] Erro de rede:', err.message);
        res.status(500).json({ error: err.message });
    });

    apiReq.write(geminiPayload);
    apiReq.end();
});

// ============================================================
// 2. NOVAS ROTAS (Usuários e Anúncios)
// ============================================================

// Mock de banco de dados em memória (substitua por MongoDB/Postgres depois)
const usuariosDB = [];
const anunciosDB = [];

// Rota de Login
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    
    // Lógica básica de validação
    if (email === "teste@email.com" && password === "123456") {
        return res.json({ success: true, token: "jwt_token_ficticio", message: "Login realizado com sucesso!" });
    }
    
    return res.status(401).json({ success: false, message: "Email ou senha incorretos." });
});

// Rota de Busca de Produtos (Barra de pesquisa)
app.get('/api/produtos', (req, res) => {
    const query = req.query.q || '';
    // Filtra anúncios (lógica básica)
    const resultados = anunciosDB.filter(p => p.titulo.toLowerCase().includes(query.toLowerCase()));
    res.json({ success: true, data: resultados });
});

// Tratamento de rotas do front-end (ex: /buscar)
app.get('/buscar', (req, res) => {
    // Retorna a página principal (que deve ler os parâmetros de URL no JS para renderizar a busca)
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`✅ Servidor API e TrocaAI rodando na porta ${PORT}!`);
    console.log(`🌐 Acesse: http://localhost:${PORT}`);
});