document.addEventListener('DOMContentLoaded', () => {
    carregarProdutos();
});

function carregarProdutos() {
    fetch('http://localhost:8080/api/produtos')
        .then(response => response.json())
        .then(data => {
            const lista = data.data || data; 
            if (!Array.isArray(lista)) {
                console.error("Erro: A API não retornou uma lista válida.", lista);
                return;
            }
            renderizarCards(lista);
        })
        .catch(error => console.error('Erro ao carregar produtos:', error));
}

function renderizarCards(produtos) {
    // Procura por 'lista-produtos' ou 'produtos-grid' no seu index.html
    const grid = document.getElementById('lista-produtos') || document.getElementById('produtos-grid'); 
    
    if (!grid) {
        console.error("ERRO NO HTML: Não encontrei a div #lista-produtos nem #produtos-grid no index.html!");
        return;
    }
    
    grid.innerHTML = '';
    
    if (produtos.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1 / -1; text-align: center;">Nenhum anúncio cadastrado ainda.</p>';
        return;
    }

    // Cria uma cópia da lista e inverte para mostrar os mais novos primeiro
    [...produtos].reverse().forEach(produto => {
        grid.appendChild(criarCardProduto(produto));
    });
}

function criarCardProduto(produto) {
    const div = document.createElement('div');
    div.className = 'product-card';
    div.style.cursor = 'pointer';
    
    // Pega a capa (posição 0 da lista) ou a foto única antiga, ou a logo como reserva
    let imagemFinal = 'images/logo.png'; 
    if (produto.imagens && Array.isArray(produto.imagens) && produto.imagens.length > 0 && produto.imagens[0].startsWith('data:image')) {
        imagemFinal = produto.imagens[0];
    } else if (produto.imagem && typeof produto.imagem === 'string' && produto.imagem.startsWith('data:image')) {
        imagemFinal = produto.imagem;
    }
    
    const valor = produto.valor || 'A combinar';
    const titulo = produto.titulo || 'Produto sem título';
    const localizacao = produto.localizacao || 'Local não informado';
    const condicao = produto.condicao || 'Usado';

    div.innerHTML = `
        <div class="product-image">
            <span class="product-badge">${condicao}</span>
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

    // Redireciona para os detalhes do produto
    div.addEventListener('click', () => {
        window.location.href = `produto.html?id=${produto.id}`;
    });
    
    return div;
}