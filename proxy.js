// ============================================================
//  TrocaAI Proxy — proxy.js (Versão Gemini - 100% Gratuito)
//  Para iniciar o servidor: node proxy.js
// ============================================================

const http  = require('http');
const https = require('https');
const fs    = require('fs');
const path  = require('path');
const url   = require('url');

const PORT       = 3000;
// COLOQUE SUA CHAVE DO GOOGLE AI STUDIO AQUI DENTRO DAS ASPAS:
const API_KEY    = 'AIzaSyBxwRz7nPRg7lYjfNUNB2HlocrhWliOU7g'; 
const PUBLIC_DIR = __dirname;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css' : 'text/css',
  '.js'  : 'application/javascript',
  '.png' : 'image/png',
  '.jpg' : 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif' : 'image/gif',
  '.svg' : 'image/svg+xml',
  '.ico' : 'image/x-icon',
};

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin',  '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }

  // ── Proxy da API (Tradutor Anthropic -> Gemini) ────────────
  if (req.url === '/api/chat' && req.method === 'POST') {
    console.log('[TrocaAI] Recebeu requisição do frontend...');

    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      let parsed;
      try { parsed = JSON.parse(body); }
      catch(e) {
        res.writeHead(400, {'Content-Type':'application/json'});
        res.end(JSON.stringify({error:'Body JSON inválido'}));
        return;
      }

      console.log('[TrocaAI] Convertendo formato e enviando para o Gemini...');

      // 1. Converter o histórico de mensagens para o formato do Gemini
      const geminiContents = parsed.messages.map(msg => {
        let parts = [];
        if (Array.isArray(msg.content)) {
          msg.content.forEach(c => {
            if (c.type === 'text') parts.push({ text: c.text });
            if (c.type === 'image') {
              parts.push({
                inlineData: {
                  mimeType: c.source.media_type,
                  data: c.source.data
                }
              });
            }
          });
        } else {
          // Histórico salvo como string (mensagens anteriores da IA)
          parts.push({ text: msg.content });
        }
        // Gemini usa 'model' em vez de 'assistant'
        return { role: msg.role === 'assistant' ? 'model' : 'user', parts };
      });

      // 2. Montar o Payload do Gemini (forçando saída em JSON)
      const geminiPayload = JSON.stringify({
        systemInstruction: { parts: [{ text: parsed.system }] },
        contents: geminiContents,
        generationConfig: { 
          responseMimeType: "application/json" 
        }
      });

      const options = {
        hostname: 'generativelanguage.googleapis.com',
        path    : `/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
        method  : 'POST',
        headers : {
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
            res.writeHead(apiRes.statusCode, {'Content-Type':'application/json'});
            res.end(data);
            return;
          }

          try {
            const jsonRes = JSON.parse(data);
            const textoResposta = jsonRes.candidates[0].content.parts[0].text;

            console.log('[TrocaAI] Resposta gerada com sucesso!');

            // 3. Devolver no exato formato que o widget do frontend já espera
            res.writeHead(200, {'Content-Type':'application/json'});
            res.end(JSON.stringify({
              content: [{ text: textoResposta }]
            }));
          } catch (err) {
            console.error('[TrocaAI] Erro ao fazer parse da resposta:', err);
            res.writeHead(500, {'Content-Type':'application/json'});
            res.end(JSON.stringify({error: "Erro ao ler a resposta da IA"}));
          }
        });
      });

      apiReq.on('error', err => {
        console.error('[TrocaAI] Erro de rede:', err.message);
        res.writeHead(500, {'Content-Type':'application/json'});
        res.end(JSON.stringify({error: err.message}));
      });

      apiReq.write(geminiPayload);
      apiReq.end();
    });
    return;
  }

  // ── Arquivos estáticos ───────────────────────────────────
  let pathname = url.parse(req.url).pathname;
  if (pathname === '/' || pathname === '') pathname = '/index.html';

  const filePath = path.join(PUBLIC_DIR, pathname);

  fs.stat(filePath, (err, stat) => {
    if (err || !stat.isFile()) {
      res.writeHead(404);
      res.end('Não encontrado: ' + pathname);
      return;
    }
    const ext  = path.extname(filePath).toLowerCase();
    const mime = MIME[ext] || 'application/octet-stream';
    res.writeHead(200, {'Content-Type': mime});
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, () => {
  console.log('');
  console.log('  ✅ TrocaAI Proxy (GEMINI) rodando!');
  console.log(`  🌐 Abra no browser: http://localhost:${PORT}/index.html`);
  console.log('  ⏹  Para parar: Ctrl+C');
  console.log('');
});