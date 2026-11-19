// ============================================================
//  TrocaAI Widget — cole este arquivo como troca-ai-widget.js
//  e chame <script src="troca-ai-widget.js"></script> antes de
//  fechar o </body> em index.html e anunciar.html
// ============================================================

(function () {

  // ── 1. Injeta o HTML do botão flutuante + modal ──────────────

  const widgetHTML = `
  <!-- Botão flutuante IA -->
  <button id="trocaai-fab" title="Assistente de IA">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
         stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 2a5 5 0 0 1 5 5c0 1.8-.95 3.37-2.37 4.26L16 20H8l1.37-8.74A5 5 0 0 1 12 2z"/>
      <circle cx="12" cy="7" r="1.5" fill="currentColor" stroke="none"/>
      <path d="M9 20v1a3 3 0 0 0 6 0v-1"/>
    </svg>
    <span class="trocaai-badge">IA</span>
  </button>

  <!-- Modal da IA -->
  <div id="trocaai-modal" role="dialog" aria-label="Assistente TrocaAI">
    <div class="trocaai-header">
      <div class="trocaai-header-info">
        <div class="trocaai-avatar-sm">✦</div>
        <div>
          <strong>TrocaAI</strong>
          <span>Assistente de cadastro</span>
        </div>
      </div>
      <button id="trocaai-close" title="Fechar">✕</button>
    </div>

    <div id="trocaai-msgs"></div>

    <!-- Preview de imagem pendente -->
    <div id="trocaai-img-strip">
      <img id="trocaai-thumb" src="" alt="preview">
      <div class="trocaai-strip-info">
        <span id="trocaai-fname">foto.jpg</span>
        <small>✦ A IA vai analisar</small>
      </div>
      <button id="trocaai-rm-img" title="Remover">×</button>
    </div>

    <div class="trocaai-input-row">
      <textarea id="trocaai-input" rows="1"
        placeholder="Descrição ou foto do produto..."></textarea>
      <div class="trocaai-actions">
        <label id="trocaai-upload-lbl" title="Enviar foto">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
               stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21 15 16 10 5 21"/>
          </svg>
          <input type="file" id="trocaai-file" accept="image/*">
        </label>
        <button id="trocaai-send" title="Enviar">
          <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"
               stroke-linecap="round" stroke-linejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"/>
            <polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
        </button>
      </div>
    </div>
    <p class="trocaai-hint">📷 Arraste, cole (Ctrl+V) ou clique no ícone para enviar foto</p>
  </div>
  `;

  document.body.insertAdjacentHTML('beforeend', widgetHTML);

  // ── 2. Injeta o CSS ──────────────────────────────────────────

  const css = `
  /* ── Botão flutuante ── */
  #trocaai-fab {
    position: fixed;
    bottom: 28px;
    left: 28px;
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: linear-gradient(135deg, #1c6400, #6bb422);
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 18px rgba(0,0,0,0.25);
    z-index: 9998;
    transition: transform .2s, box-shadow .2s;
    color: white;
  }
  #trocaai-fab:hover { transform: scale(1.1); box-shadow: 0 6px 24px rgba(0,0,0,0.3); }
  #trocaai-fab svg { width: 26px; height: 26px; }

  .trocaai-badge {
    position: absolute;
    top: -4px; right: -4px;
    background: #80e71a;
    color: #0f3600;
    font-size: 9px;
    font-weight: bold;
    padding: 2px 5px;
    border-radius: 20px;
    letter-spacing: .04em;
    font-family: sans-serif;
  }

  /* ── Modal ── */
  #trocaai-modal {
    position: fixed;
    bottom: 96px;
    left: 28px;
    width: 360px;
    max-height: 540px;
    background: #18181c;
    border: 1px solid #2e2e38;
    border-radius: 16px;
    display: none;
    flex-direction: column;
    z-index: 9999;
    box-shadow: 0 12px 40px rgba(0,0,0,0.5);
    font-family: 'medium', sans-serif;
    overflow: hidden;
    animation: trocaai-in .2s ease;
  }

  #trocaai-modal.open { display: flex; }

  @keyframes trocaai-in {
    from { opacity: 0; transform: translateY(12px) scale(.97); }
    to   { opacity: 1; transform: translateY(0)   scale(1);    }
  }

  /* Header */
  .trocaai-header {
    background: linear-gradient(90deg, #0f3600, #1c6400);
    padding: 12px 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-shrink: 0;
  }

  .trocaai-header-info {
    display: flex;
    align-items: center;
    gap: 10px;
    color: white;
  }

  .trocaai-header-info strong { display: block; font-size: 14px; }
  .trocaai-header-info span   { font-size: 11px; opacity: .75; }

  .trocaai-avatar-sm {
    width: 30px; height: 30px;
    border-radius: 8px;
    background: rgba(255,255,255,.15);
    display: flex; align-items: center; justify-content: center;
    font-size: 14px; color: #c5ff6e;
  }

  #trocaai-close {
    background: none; border: none;
    color: rgba(255,255,255,.7);
    font-size: 16px; cursor: pointer;
    padding: 4px 8px; border-radius: 6px;
    transition: background .15s;
  }
  #trocaai-close:hover { background: rgba(255,255,255,.15); color: white; }

  /* Mensagens */
  #trocaai-msgs {
    flex: 1;
    overflow-y: auto;
    padding: 14px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  #trocaai-msgs::-webkit-scrollbar { width: 3px; }
  #trocaai-msgs::-webkit-scrollbar-thumb { background: #2e2e38; border-radius: 2px; }

  .tai-msg { display: flex; gap: 8px; }
  .tai-msg.user { flex-direction: row-reverse; }

  .tai-av {
    width: 26px; height: 26px;
    border-radius: 7px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; margin-top: 2px;
  }
  .tai-msg.ai   .tai-av { background: linear-gradient(135deg,#1c6400,#6bb422); color:white; }
  .tai-msg.user .tai-av { background: #222228; border: 1px solid #2e2e38; }

  .tai-bubble {
    padding: 10px 13px;
    border-radius: 12px;
    font-size: 13px;
    line-height: 1.55;
    max-width: 270px;
    color: #f0f0f5;
    animation: trocaai-in .2s ease;
  }

  .tai-msg.user .tai-bubble {
    background: #2a2740;
    border: 1px solid rgba(107,180,34,.35);
    border-radius: 12px 3px 12px 12px;
  }
  .tai-msg.ai .tai-bubble {
    background: #1c1c24;
    border: 1px solid #2e2e38;
    border-radius: 3px 12px 12px 12px;
  }

  .tai-thumb {
    display: block;
    max-width: 160px; max-height: 120px;
    border-radius: 7px; object-fit: cover;
    margin-bottom: 6px;
    border: 1px solid #2e2e38;
  }

  /* Cards de resultado */
  .tai-cards {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 6px; margin-top: 8px;
  }

  .tai-card {
    background: #222228; border: 1px solid #2e2e38;
    border-radius: 8px; padding: 8px 10px;
  }

  .tai-card-label {
    font-size: 9px; text-transform: uppercase;
    letter-spacing: .07em; color: #888899; margin-bottom: 3px;
  }

  .tai-card-val {
    font-size: 12px; font-weight: bold;
  }

  .tai-c1 .tai-card-val { color: #6bb422; }
  .tai-c2 .tai-card-val { color: #ff6b6b; }
  .tai-c3 .tai-card-val { color: #6bffb8; font-size: 10px; }

  .tai-tags { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 6px; }

  .tai-tag {
    background: #222228; border: 1px solid #2e2e38;
    padding: 2px 8px; border-radius: 20px;
    font-size: 11px; color: #f0f0f5;
  }

  .tai-tag.hi {
    border-color: #6bb422; color: #6bb422;
    background: rgba(107,180,34,.08);
  }

  .tai-dica {
    margin-top: 8px; padding: 8px 10px;
    background: rgba(107,255,184,.05);
    border: 1px solid rgba(107,255,184,.2);
    border-radius: 8px; font-size: 11px;
    color: #6bffb8;
  }

  /* Typing */
  .tai-typing { display: flex; gap: 4px; align-items: center; padding: 2px 0; }
  .tai-dot {
    width: 5px; height: 5px; background: #888899;
    border-radius: 50%; animation: tai-blink 1.2s infinite;
  }
  .tai-dot:nth-child(2){ animation-delay:.2s }
  .tai-dot:nth-child(3){ animation-delay:.4s }
  @keyframes tai-blink{0%,100%{opacity:.3;transform:translateY(0)}50%{opacity:1;transform:translateY(-3px)}}

  /* Strip de imagem pendente */
  #trocaai-img-strip {
    display: none; align-items: center; gap: 8px;
    margin: 0 12px 8px; padding: 7px 10px;
    background: #222228; border: 1px solid #2e2e38;
    border-radius: 8px; flex-shrink: 0;
  }
  #trocaai-img-strip img {
    width: 38px; height: 38px; object-fit: cover;
    border-radius: 5px; border: 1px solid #2e2e38;
  }
  .trocaai-strip-info { flex:1; }
  .trocaai-strip-info span  { display:block; font-size:11px; color:#f0f0f5; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:170px; }
  .trocaai-strip-info small { font-size:10px; color:#6bffb8; }
  #trocaai-rm-img { background:none; border:none; color:#888899; cursor:pointer; font-size:16px; padding:2px 5px; border-radius:4px; }
  #trocaai-rm-img:hover { color:#ff6b6b; }

  /* Input row */
  .trocaai-input-row {
    display: flex; align-items: flex-end; gap: 8px;
    padding: 10px 12px; border-top: 1px solid #2e2e38;
    background: #18181c; flex-shrink: 0;
  }

  #trocaai-input {
    flex: 1; background: #222228; border: 1px solid #2e2e38;
    border-radius: 10px; padding: 9px 12px;
    color: #f0f0f5; font-size: 13px;
    resize: none; outline: none; max-height: 80px;
    line-height: 1.45; font-family: inherit;
    transition: border-color .2s;
  }
  #trocaai-input:focus { border-color: #6bb422; }
  #trocaai-input::placeholder { color: #888899; }

  .trocaai-actions { display: flex; gap: 5px; align-items: center; }

  #trocaai-upload-lbl {
    width: 32px; height: 32px;
    background: #222228; border: 1px solid #2e2e38;
    border-radius: 8px; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: all .15s;
    color: #888899;
  }
  #trocaai-upload-lbl:hover { border-color: #6bffb8; color: #6bffb8; background: rgba(107,255,184,.06); }
  #trocaai-upload-lbl.has-img { border-color: #6bffb8; background: rgba(107,255,184,.1); color: #6bffb8; }
  #trocaai-upload-lbl svg { width: 15px; height: 15px; }
  #trocaai-file { display: none; }

  #trocaai-send {
    width: 32px; height: 32px;
    background: linear-gradient(135deg, #1c6400, #6bb422);
    border: none; border-radius: 8px; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: opacity .2s, transform .1s;
  }
  #trocaai-send:hover  { opacity: .85; transform: scale(1.05); }
  #trocaai-send:active { transform: scale(.95); }
  #trocaai-send:disabled { opacity: .3; cursor: not-allowed; }
  #trocaai-send svg { width: 14px; height: 14px; }

  .trocaai-hint {
    font-size: 10px; color: #444455;
    text-align: center; padding: 4px 12px 8px;
    flex-shrink: 0;
  }

  /* Drop overlay global */
  #trocaai-drop {
    display: none; position: fixed; inset: 0;
    background: rgba(107,180,34,.12);
    border: 3px dashed #6bb422;
    z-index: 10000;
    align-items: center; justify-content: center;
    font-size: 20px; font-weight: bold; color: #6bb422;
    pointer-events: none;
  }
  #trocaai-drop.on { display: flex; }
  `;

  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  // Adicionar drop overlay
  document.body.insertAdjacentHTML('beforeend', '<div id="trocaai-drop">📷 Solte a imagem aqui</div>');

  // ── 3. Lógica da IA ──────────────────────────────────────────

  const SYS = `Você é o TrocaAI, assistente da plataforma Reusemi para cadastro de produtos em TROCAS (sem dinheiro, somente escambo).

Quando o usuário enviar imagem ou descrever produto, responda APENAS em JSON puro (sem markdown, sem backticks):
{
  "resposta": "Mensagem amigável ao usuário",
  "identificado": "O que identificou na imagem/texto (marca, modelo, cor, estado visual)",
  "categoria": "Smartphones | Eletrônicos | Móveis | Livros | Roupas | Esportes | Games | Instrumentos | Utensílios | Veículos | Reciclados | Outros",
  "subcategoria": "Subcategoria específica",
  "estado": "Novo | Usado | Recondicionado",
  "valor_estimado": "R$ X.XXX — R$ X.XXX",
  "sugestoes_troca": ["item1","item2","item3","item4"],
  "tags": ["tag1","tag2","tag3","tag4"],
  "dica": "Dica útil para o anúncio"
}

Para saudações e dúvidas gerais, responda em texto simples sem JSON.
Analise imagens com atenção: marca, modelo, estado visual, acessórios.
Valor estimado = referência para filtros de troca, NÃO preço de venda.
Use referências do mercado brasileiro (BRL). As categorias devem coincidir com as do site: Eletrônicos, Móveis, Moda, Esportes, Veículos, Imóveis, Reciclados.`;

  let history  = [];
  let isBusy   = false;
  let imgB64   = null;
  let imgType  = null;
  let imgFname = null;

  // Elementos
  const fab      = document.getElementById('trocaai-fab');
  const modal    = document.getElementById('trocaai-modal');
  const closeBtn = document.getElementById('trocaai-close');
  const msgs     = document.getElementById('trocaai-msgs');
  const input    = document.getElementById('trocaai-input');
  const sendBtn  = document.getElementById('trocaai-send');
  const fileInp  = document.getElementById('trocaai-file');
  const strip    = document.getElementById('trocaai-img-strip');
  const thumb    = document.getElementById('trocaai-thumb');
  const fname    = document.getElementById('trocaai-fname');
  const rmImg    = document.getElementById('trocaai-rm-img');
  const upLbl    = document.getElementById('trocaai-upload-lbl');
  const dropOvl  = document.getElementById('trocaai-drop');

  // Abrir / fechar
  fab.addEventListener('click', () => {
    const isOpen = modal.classList.toggle('open');
    if (isOpen && msgs.children.length === 0) greet();
  });

  closeBtn.addEventListener('click', () => modal.classList.remove('open'));

  // Upload
  fileInp.addEventListener('change', e => {
    if (e.target.files[0]) loadImage(e.target.files[0]);
    fileInp.value = '';
  });

  // Drag & drop
  document.addEventListener('dragover', e => {
    e.preventDefault();
    if ([...e.dataTransfer.items].some(i => i.type.startsWith('image/')))
      dropOvl.classList.add('on');
  });
  document.addEventListener('dragleave', e => {
    if (!e.relatedTarget) dropOvl.classList.remove('on');
  });
  document.addEventListener('drop', e => {
    e.preventDefault();
    dropOvl.classList.remove('on');
    const f = [...e.dataTransfer.files].find(f => f.type.startsWith('image/'));
    if (f) { modal.classList.add('open'); loadImage(f); }
  });

  // Colar imagem
  document.addEventListener('paste', e => {
    const img = [...(e.clipboardData?.items || [])].find(i => i.type.startsWith('image/'));
    if (img) { e.preventDefault(); modal.classList.add('open'); loadImage(img.getAsFile()); }
  });

  function loadImage(file) {
    const r = new FileReader();
    r.onload = e => {
      const url = e.target.result;
      imgB64   = url.split(',')[1];
      imgType  = file.type;
      imgFname = file.name;
      thumb.src = url;
      fname.textContent = file.name;
      strip.style.display = 'flex';
      upLbl.classList.add('has-img');
      input.placeholder = 'Adicione uma descrição (opcional)...';
      input.focus();
    };
    r.readAsDataURL(file);
  }

  rmImg.addEventListener('click', clearImage);

  function clearImage() {
    imgB64 = imgType = imgFname = null;
    strip.style.display = 'none';
    upLbl.classList.remove('has-img');
    input.placeholder = 'Descreva ou envie uma foto do produto...';
  }

  // Auto-resize textarea
  input.addEventListener('input', () => {
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 80) + 'px';
  });
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  });

  sendBtn.addEventListener('click', send);

  // ── Mensagens ────────────────────────────────────────────────

  function addMsg(role, content, rich = false, imgUrl = null) {
    const wrap = document.createElement('div');
    wrap.className = `tai-msg ${role}`;

    const av = document.createElement('div');
    av.className = 'tai-av';
    av.textContent = role === 'ai' ? '✦' : '👤';

    const bub = document.createElement('div');
    bub.className = 'tai-bubble';

    if (imgUrl) {
      const img = document.createElement('img');
      img.src = imgUrl; img.className = 'tai-thumb';
      bub.appendChild(img);
    }

    if (rich && role === 'ai') {
      const d = document.createElement('div');
      d.innerHTML = content;
      bub.appendChild(d);
    } else {
      bub.appendChild(document.createTextNode(content));
    }

    wrap.appendChild(av);
    wrap.appendChild(bub);
    msgs.appendChild(wrap);
    msgs.scrollTop = msgs.scrollHeight;
    return wrap;
  }

  function addTyping() {
    const w = addMsg('ai', '', true);
    w.id = 'tai-typing';
    w.querySelector('.tai-bubble').innerHTML =
      '<div class="tai-typing"><div class="tai-dot"></div><div class="tai-dot"></div><div class="tai-dot"></div></div>';
    return w;
  }

  function buildRich(d) {
    let h = `<div style="margin-bottom:6px">${d.resposta}</div>`;

    if (d.identificado)
      h += `<div style="font-size:11px;color:#888899;margin-bottom:6px">🔍 <span style="color:#f0f0f5">${d.identificado}</span></div>`;

    if (d.categoria)
      h += `<div class="tai-cards">
        <div class="tai-card tai-c1"><div class="tai-card-label">Categoria</div><div class="tai-card-val">${d.categoria}</div></div>
        <div class="tai-card"><div class="tai-card-label">Subcategoria</div><div class="tai-card-val" style="color:#f0f0f5;font-size:11px">${d.subcategoria||'—'}</div></div>
        <div class="tai-card tai-c2"><div class="tai-card-label">Estado</div><div class="tai-card-val">${d.estado||'—'}</div></div>
        <div class="tai-card tai-c3"><div class="tai-card-label">Valor ref.</div><div class="tai-card-val">${d.valor_estimado||'—'}</div></div>
      </div>`;

    if (d.sugestoes_troca?.length) {
      h += `<div style="margin-top:8px;font-size:10px;color:#888899;text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px">Pode trocar por</div><div class="tai-tags">`;
      d.sugestoes_troca.forEach(s => h += `<span class="tai-tag hi">⇄ ${s}</span>`);
      h += `</div>`;
    }

    if (d.tags?.length) {
      h += `<div class="tai-tags" style="margin-top:6px">`;
      d.tags.forEach(t => h += `<span class="tai-tag">#${t}</span>`);
      h += `</div>`;
    }

    if (d.dica)
      h += `<div class="tai-dica">💡 ${d.dica}</div>`;

    return h;
  }

  // ── Enviar mensagem ──────────────────────────────────────────

  async function send() {
    const txt = input.value.trim();
    const hasImg = !!imgB64;
    if (!txt && !hasImg) return;
    if (isBusy) return;

    const content = [];
    let preview = null;

    if (hasImg) {
      preview = `data:${imgType};base64,${imgB64}`;
      content.push({ type: 'image', source: { type: 'base64', media_type: imgType, data: imgB64 } });
    }

    const finalTxt = txt || (hasImg ? 'Analise este produto para cadastro na plataforma de trocas.' : '');
    content.push({ type: 'text', text: finalTxt });

    addMsg('user', txt || '📷 Foto enviada', false, preview);
    history.push({ role: 'user', content });

    input.value = ''; input.style.height = 'auto';
    input.placeholder = 'Descrição ou foto do produto...';
    clearImage();

    isBusy = true; sendBtn.disabled = true;
    const typing = addTyping();

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: SYS,
          messages: history
        })
      });

      const data = await res.json();
      typing.remove();

      // Erro retornado pela API (ex: chave inválida, sem créditos)
      if (!res.ok || data.error || data.type === 'error') {
        const errMsg = data.error?.message || data.message || `Erro ${res.status}`;
        const errType = data.error?.type || '';
        console.error('[TrocaAI] Erro API:', errType, errMsg);

        let userMsg = '⚠️ Erro ao chamar a IA.';
        if (res.status === 401) userMsg = '⚠️ Chave de API inválida. Verifique a chave no proxy.js.';
        else if (res.status === 429) userMsg = '⚠️ Limite de uso atingido. Aguarde alguns instantes.';
        else if (res.status === 400) userMsg = '⚠️ Requisição inválida: ' + errMsg;
        else if (errMsg) userMsg = '⚠️ ' + errMsg;

        addMsg('ai', userMsg);
        // Remove a última mensagem do histórico pois falhou
        history.pop();
      } else {
        const raw = data.content?.map(b => b.text || '').join('') || '';
        history.push({ role: 'assistant', content: raw });

        try {
          const parsed = JSON.parse(raw.replace(/```json|```/g, '').trim());
          addMsg('ai', buildRich(parsed), true);
        } catch {
          addMsg('ai', raw || '(resposta vazia)');
        }
      }
    } catch (err) {
      typing.remove();
      // fetch falhou completamente = proxy não está rodando
      const isOffline = err.message.includes('fetch') || err.message.includes('Failed') || err.message.includes('NetworkError');
      const msg = isOffline
        ? '⚠️ Proxy não encontrado. Verifique se rodou <strong>node proxy.js</strong> no terminal e acesse via <strong>http://localhost:3000</strong>.'
        : '⚠️ Erro inesperado: ' + err.message;
      addMsg('ai', msg, true);
      console.error('[TrocaAI]', err);
    }

    isBusy = false; sendBtn.disabled = false;
  }

  // ── Saudação inicial ─────────────────────────────────────────

  function greet() {
    addMsg('ai',
      `Olá! 👋 Sou a <strong>TrocaAI</strong>, assistente da Reusemi.<br><br>
       Me envie uma <strong>foto</strong> ou <strong>descrição</strong> do produto e eu te ajudo com:<br>
       · Categoria e condição<br>
       · Valor de referência para trocas<br>
       · Sugestões de itens para trocar<br>
       · Tags para o anúncio`,
      true
    );
  }

})(); // IIFE — sem poluir o escopo global