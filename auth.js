document.addEventListener('DOMContentLoaded', () => {
    configurarMenuConta();
});

function configurarMenuConta() {
    const usuarioJson = localStorage.getItem('usuarioLogado');
    if (!usuarioJson) return;

    const usuario = JSON.parse(usuarioJson);

    const linksHeader = document.querySelectorAll('header nav a');
    let linkLogin = null;

    linksHeader.forEach(link => {
        if (link.getAttribute('href') === 'login.html' || link.textContent.trim().toLowerCase() === 'login') {
            linkLogin = link;
        }
    });

    if (!linkLogin) return;

    const style = document.createElement('style');
    style.textContent = `
        header nav {
            align-items: center;
        }
        .conta-dropdown-wrapper {
            position: relative;
            display: inline-flex;
            align-items: center;
            margin: 10px 15px 0px 15px;
            line-height: 1;
        }
        .conta-trigger {
            display: inline-flex;
            align-items: center;
            gap: 7px;
            cursor: pointer;
            color: #1c6400;
            font-weight: 600;
            text-decoration: none;
            user-select: none;
            transition: color 0.2s ease;
        }
        .conta-trigger:hover {
            color: #6bb422;
        }
        .conta-avatar-mini {
            width: 22px;
            height: 22px;
            border-radius: 50%;
            object-fit: cover;
            border: 1.5px solid #6bb422;
            margin: -3px 0;
        }
        .conta-trigger i.fa-user-circle {
            font-size: 18px;
            margin: -2px 0;
        }
        .conta-chevron {
            font-size: 11px;
            transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .conta-dropdown-wrapper.aberto .conta-chevron {
            transform: rotate(180deg);
        }
        .conta-menu {
            position: absolute;
            top: calc(100% + 14px);
            right: 0;
            min-width: 195px;
            background: #ffffff;
            border-radius: 12px;
            box-shadow: 0 10px 28px rgba(0, 0, 0, 0.14);
            border: 1px solid #e6efe3;
            padding: 8px;
            z-index: 9999;
            overflow: hidden;
            opacity: 0;
            visibility: hidden;
            transform: translateY(-10px) scale(0.95);
            transform-origin: top right;
            transition: opacity 0.25s ease, transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), visibility 0.25s;
        }
        .conta-dropdown-wrapper.aberto .conta-menu {
            opacity: 1;
            visibility: visible;
            transform: translateY(0) scale(1);
        }
        .conta-menu-header {
            padding: 8px 12px;
            border-bottom: 1px solid #f0f4ee;
            margin-bottom: 6px;
            text-align: left;
        }
        .conta-menu-nome {
            font-size: 13px;
            font-weight: 700;
            color: #1c6400;
            display: block;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .conta-menu-item {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 10px 12px;
            border-radius: 8px;
            color: #3b3b3b;
            text-decoration: none;
            font-size: 14px;
            box-sizing: border-box;
            width: 100%;
            transition: background-color 0.2s ease, color 0.2s ease, padding-left 0.2s ease;
            cursor: pointer;
            border: none;
            background: transparent;
            text-align: left;
        }
        .conta-menu-item:hover {
            background-color: #f1faec;
            color: #1c6400;
            padding-left: 16px;
        }
        .conta-menu-item.sair {
            color: #d93025;
            margin-top: 4px;
            border-top: 1px solid #f0f4ee;
            padding-top: 10px;
        }
        .conta-menu-item.sair:hover {
            background-color: #fdecea;
            color: #b31412;
        }
    `;
    document.head.appendChild(style);

    const avatarHtml = usuario.fotoPerfil
        ? `<img src="${usuario.fotoPerfil}" class="conta-avatar-mini" alt="Avatar">`
        : `<i class="fas fa-user-circle"></i>`;

    const wrapper = document.createElement('div');
    wrapper.className = 'conta-dropdown-wrapper';
    wrapper.innerHTML = `
        <div class="conta-trigger" id="btn-conta-trigger">
            ${avatarHtml}
            <span>Conta</span>
            <i class="fas fa-chevron-down conta-chevron"></i>
        </div>
        <div class="conta-menu" id="menu-conta-dropdown">
            <div class="conta-menu-header">
                <span class="conta-menu-nome">Olá, ${usuario.nome.split(' ')[0]}!</span>
            </div>
            <a href="#" class="conta-menu-item" onclick="event.preventDefault();">
                <i class="fas fa-user"></i> Perfil
            </a>
            <a href="#" class="conta-menu-item" onclick="event.preventDefault();">
                <i class="fas fa-box-open"></i> Meus Anúncios
            </a>
            <button type="button" class="conta-menu-item sair" id="btn-logout-conta">
                <i class="fas fa-sign-out-alt"></i> Sair
            </button>
        </div>
    `;

    linkLogin.replaceWith(wrapper);

    const trigger = document.getElementById('btn-conta-trigger');
    trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        wrapper.classList.toggle('aberto');
    });

    document.addEventListener('click', (e) => {
        if (!wrapper.contains(e.target)) {
            wrapper.classList.remove('aberto');
        }
    });

    document.getElementById('btn-logout-conta').addEventListener('click', () => {
        localStorage.removeItem('token');
        localStorage.removeItem('usuarioLogado');
        window.location.href = 'login.html';
    });
}