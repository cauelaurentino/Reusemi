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
    // Mantemos a classe principal caso precise no futuro, mas forçamos o estilo inline
    div.className = 'product-card'; 
    div.style.cursor = 'pointer';
    div.style.borderRadius = '8px';
    div.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
    div.style.backgroundColor = '#fff';
    div.style.display = 'flex';
    div.style.flexDirection = 'column';
    div.style.overflow = 'hidden'; // Garante que a imagem não vaza pelas bordas arredondadas
    div.style.height = '100%';
    
    // Lógica para pegar a imagem correta (nova ou antiga)
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

    // Removemos as classes antigas para o seu CSS não quebrar o layout
    div.innerHTML = `
        <div style="position: relative; width: 100%; height: 200px; overflow: hidden;">
            <span style="position: absolute; top: 10px; right: 10px; background: #58cc02; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; z-index: 1;">${condicao}</span>
            <img src="${imagemFinal}" alt="${titulo}" style="object-fit: cover; width: 100%; height: 100%;">
        </div>
        <div style="padding: 18px; display: flex; flex-direction: column; gap: 10px; flex-grow: 1;">
            <div style="font-size: 18px; font-weight: 800; color: #1c6400;">${valor}</div>
            <div style="font-size: 14px; color: #333; font-weight: 500; line-height: 1.4;">${titulo}</div>
            <div style="font-size: 13px; color: #777; margin-top: auto;"><i class="fas fa-map-marker-alt"></i> ${localizacao}</div>
        </div>
    `;

    // Redireciona para os detalhes do produto
    div.addEventListener('click', () => {
        window.location.href = `produto.html?id=${produto.id}`;
    });
    
    return div;
}