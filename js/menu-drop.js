function logout() {
    localStorage.removeItem('usuarioLogado');
    location.reload();
}

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
        document.querySelector('#Posts').addEventListener('click', function(event) {
            event.preventDefault(); 
            window.location.href = 'forum/forums.html'; 
          });
        

        const exitItem = document.getElementById('Deslogar');
        exitItem.addEventListener('click', logout);
    } else {
        profileImg.style.backgroundImage = `url('../imagens/entrar.png')`;
        nomeEntrar.innerHTML = `Entrar`;

        btn.addEventListener('click', function () {
            window.location.href = 'login.html';
        });
    }
}

document.addEventListener('DOMContentLoaded', menu);
const toggle = () => {
    console.log("Clique detectado no menu!");
    profileDropdownList.classList.toggle("active");
};

