// minha cabeça nao pensar mais 

// carrega o html do nav e suas funçoes
function carregarNavbar() {
    fetch('navbar.html') 
        .then(response => response.text())
        .then(data => {
            document.getElementById('navbar').innerHTML = data;
            menu(); 
            inicializarMenuHamburger();
        })
        .catch(error => console.error('Erro ao carregar a navbar:', error));
}
// se tiver nas paginas exclusivas sai e se for numa normal só carrega a pagina
function logout() {
    localStorage.removeItem('usuarioLogado');
    const currentPage = window.location.pathname;
    
    if (currentPage.includes('pagina_aluno.html') || currentPage.includes('pagina_adm.html')) {
        window.location.href = 'login.html';
    } else {
        location.reload();
    }
}
// o menu 
function menu() {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    const profileDropdownList = document.querySelector(".profile-dropdown-list");
    const btn = document.querySelector(".profile-dropdown-btn");
    const nomeEntrar = document.getElementById("nome_entrar");
    const profileImg = btn.querySelector('.profile-img');

    const toggle = () => {
        profileDropdownList.classList.toggle("active");
    };

    if (usuarioLogado) {
        btn.addEventListener('click', toggle);

        window.addEventListener('click', function (e) {
            if (!btn.contains(e.target) && !profileDropdownList.contains(e.target)) {
                profileDropdownList.classList.remove("active");
            }
        });

        profileImg.style.backgroundImage = `url('${usuarioLogado.foto}')`;
        nomeEntrar.innerHTML = `${usuarioLogado.nome} <i class="fa-solid fa-angle-down"></i>`;

        // redirecionamento com base no tipo de usuário
        if (usuarioLogado.tipo === 'aluno') {  
            document.querySelector('#Perfil').addEventListener('click', function(event) {
                event.preventDefault(); 
                window.location.href = 'pagina_aluno.html';
            });
        } else if (usuarioLogado.tipo === 'adm') {
            document.querySelector('#Perfil').addEventListener('click', function(event) {
                event.preventDefault(); 
                window.location.href = 'pagina_adm.html'; 
            });
        }

        // redirecionamento para a página de posts
        document.querySelector('#Posts').addEventListener('click', function(event) {
            event.preventDefault(); 
            window.location.href = 'forum/forums.html'; 
        });

        // logout
        const exitItem = document.getElementById('Deslogar');
        exitItem.addEventListener('click', logout);
    } else {
        //modo entrar quando nao tem ninguem logado
        profileImg.style.backgroundImage = `url('https://gabrielaccorsi.github.io/Projeto-SI/imagens/entrar.png')`;
        nomeEntrar.innerHTML = `Entrar`;

        btn.addEventListener('click', function () {
            window.location.href = 'login.html';
        });
    }
}
//menu hamburguer em tela menor
function inicializarMenuHamburger() {
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const navLinks = document.querySelector('.nav_links');

    if (hamburgerMenu && navLinks) { 
        hamburgerMenu.addEventListener('click', function (event) {
            event.stopPropagation();
            navLinks.classList.toggle('open');
        });

        document.addEventListener('click', function (event) {
            if (!navLinks.contains(event.target) && !hamburgerMenu.contains(event.target)) {
                navLinks.classList.remove('open');
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', carregarNavbar);
