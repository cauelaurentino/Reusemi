// script.js

document.addEventListener('DOMContentLoaded', () => {
    carregarProdutos();
});

function carregarProdutos() {
    const listaProdutos = document.getElementById('lista-produtos');
    if (!listaProdutos) {
        console.error("ERRO: Div #lista-produtos não encontrada no index.html!");
        return;
    }
    
    listaProdutos.innerHTML = '<p style="grid-column: 1 / -1; text-align: center;">Carregando anúncios...</p>';

    fetch('http://localhost:8080/api/produtos')
        .then(response => response.json())
        .then(resposta => {
            console.log("DEBUG INDEX 1 - Dados recebidos do Java:", resposta);
            listaProdutos.innerHTML = '';
            
            if (resposta.success && resposta.data.length > 0) {
                resposta.data.forEach(produto => {
                    console.log(`DEBUG INDEX 2 - Produto "${produto.titulo}" | Campo imagem:`, produto.imagem ? `OK (${produto.imagem.length} caracteres)` : "NULL / VAZIO");
                    const card = criarCardProduto(produto);
                    listaProdutos.appendChild(card);
                });
            } else {
                listaProdutos.innerHTML = '<p style="grid-column: 1 / -1; text-align: center;">Nenhum anúncio encontrado.</p>';
            }
        })
        .catch(error => {
            console.error('ERRO INDEX - Falha ao buscar produtos:', error);
            listaProdutos.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: red;">Erro ao conectar no Java (porta 8080).</p>';
        });
}

function criarCardProduto(produto) {
    const div = document.createElement('div');
    div.className = 'product-card';
    div.style.cursor = 'pointer';
    
    const temImagemValida = produto.imagem && produto.imagem.startsWith('data:image');
    const imagemFinal = temImagemValida ? produto.imagem : 'images/logo.png';
    
    const valor = produto.valor || 'Negociável';
    const titulo = produto.titulo || 'Produto sem título';
    const localizacao = produto.localizacao || 'Local não informado';

    div.innerHTML = `
        <div class="product-image">
            <span class="product-badge">${produto.condicao || 'Novo'}</span>
            <img src="${imagemFinal}" 
                 alt="${titulo}" 
                 style="object-fit: cover; width: 100%; height: 200px;">
        </div>
        <div class="product-info">
            <div class="product-price">${valor}</div>
            <div class="product-title">${titulo}</div>
            <div class="product-location"><i class="fas fa-map-marker-alt"></i> ${localizacao}</div>
        </div>
    `;

    // Abre a página individual passando o ID do anúncio na URL
    div.addEventListener('click', () => {
        window.location.href = `produto.html?id=${produto.id}`;
    });
    
    return div;
}

document.addEventListener('DOMContentLoaded', function() {
    // Elementos do chat
    const chatLink = document.getElementById('chat-link');
    const chatWindow = document.getElementById('chat-window');
    const closeChat = document.getElementById('close-chat');
    const tabButtons = document.querySelectorAll('.tab-button');
    
    // Função para abrir o chat
    function openChat() {
        chatWindow.style.display = 'flex';
    }
    
    // Função para fechar o chat
    function closeChatWindow() {
        chatWindow.style.display = 'none';
    }
    
    // Função para trocar de aba
    function switchTab(event) {
        // Remove a classe active de todos os botões
        tabButtons.forEach(button => {
            button.classList.remove('active');
        });
        
        // Adiciona a classe active ao botão clicado
        event.target.classList.add('active');
        
        // Oculta todos os conteúdos das abas
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        
        // Mostra o conteúdo da aba correspondente
        const tabId = event.target.getAttribute('data-tab') + '-tab';
        document.getElementById(tabId).classList.add('active');
    }
    
    // Event Listeners
    chatLink.addEventListener('click', function(e) {
        e.preventDefault();
        openChat();
    });
    
    closeChat.addEventListener('click', closeChatWindow);
    
    tabButtons.forEach(button => {
        button.addEventListener('click', switchTab);
    });
    
    // Fechar o chat ao clicar fora dele (opcional)
    document.addEventListener('click', function(e) {
        if (chatWindow.style.display === 'flex' && 
            !chatWindow.contains(e.target) && 
            e.target !== chatLink) {
            closeChatWindow();
        }
    });
    
    // Adicionar funcionalidade aos botões de mensagem na aba de contatos
    const messageButtons = document.querySelectorAll('.message-button');
    messageButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Alternar para a aba de conversas
            tabButtons[0].click();
            
            // Aqui você poderia adicionar lógica para iniciar uma nova conversa
            // com o contato específico
            alert('Iniciando conversa com este contato...');
        });
    });
});