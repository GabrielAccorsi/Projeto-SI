// controlar o menu/navbar
function carregarNavbar() {
  firebase.auth().onAuthStateChanged((user) => {
    fetch("navbar.html")
      .then((response) => response.text())
      .then((data) => {
        document.getElementById("navbar").innerHTML = data;
        inicializarMenuHamburger();

        const profileDropdownList = document.querySelector(
          ".profile-dropdown-list"
        );
        const btn = document.querySelector(".profile-dropdown-btn");

        if (user) {
            profileDropdownList.classList.remove("active");
            const nomeEntrar = document.getElementById("nome_entrar");
    
            const dbRef1 = firebase.database().ref("users/" + user.uid);
            dbRef1.once("value", (snapshot) => {
              const userData = snapshot.val();
              const nameFromDb = userData?.nome;
          
              const userName =
                nameFromDb || userData.displayName || user.displayName || user.email.split("@")[0]; 
              const formattedUserName =
                userName.charAt(0).toUpperCase() + userName.slice(1).toLowerCase();
          
              const maxLength = 8; // Limite de caracteres
              let truncatedUserName =
                formattedUserName.length > maxLength
                  ? formattedUserName.slice(0, maxLength) 
                  : formattedUserName;
          
              // Ajuste dinâmico do tamanho da fonte
              const maxFontSize = 16; 
              const minFontSize = 10; 
              const containerWidth = nomeEntrar.offsetWidth; 
          
              let currentFontSize = maxFontSize;
          
             
              while (
                nomeEntrar.scrollWidth > containerWidth && 
                currentFontSize > minFontSize
              ) {
                currentFontSize -= 1; 
                nomeEntrar.style.fontSize = `${currentFontSize}px`;
              }
          
              
              if (nomeEntrar.scrollWidth > containerWidth) {
                truncatedUserName = formattedUserName.slice(0, maxLength) + "...";
              }
          
              
              nomeEntrar.innerHTML = `${truncatedUserName} <i class="fa-solid fa-angle-down"></i>`;
            });

         
            
            dbRef1.once("value", (snapshot) => {
              const userData = snapshot.val();
              const userPhotoURL = userData?.photoURL || user?.photoURL || "URL_PADRAO_AQUI";
            
              if (userPhotoURL) {
                document.querySelector(
                  ".profile-img"
                ).style.backgroundImage = `url('${userPhotoURL}')`;
              } else {
                console.warn("Foto do usuário não disponível, usando padrão.");
                document.querySelector(
                  ".profile-img"
                ).style.backgroundImage = "url('URL_PADRAO_AQUI')";
              }
            });
            
          // mostrar/ocultar menu
          btn.addEventListener("click", () => {
            profileDropdownList.classList.toggle("active");
          });

          window.addEventListener("click", (e) => {
            if (
              !btn.contains(e.target) &&
              !profileDropdownList.contains(e.target)
            ) {
              profileDropdownList.classList.remove("active");
            }
          });

          if (user.providerData && user.providerData.length > 0) {
            const provider = user.providerData[0].providerId;
            console.log("Login realizado com o provedor:", provider);
          }

          // tipo de usuário
          const dbRef = firebase.database().ref("users/" + user.uid);
          dbRef.once("value", function (snapshot) {
            const userData = snapshot.val();
            const userType = userData ? userData.tipo : "aluno";

            // alterar o link da pagina contato se for adm, pra aparecer as mensagens
            if (userType === "adm") {
              document
                .querySelector("#link-contato")
                .setAttribute("href", "mensagens.html");
            }

            // redirecionar perfil
            if (userType === "aluno") {
              document
                .querySelector("#Perfil")
                .addEventListener("click", function (event) {
                  event.preventDefault();
                  window.location.href = "pagina_aluno.html";
                });
            } else if (userType === "adm") {
              document
                .querySelector("#Perfil")
                .addEventListener("click", function (event) {
                  event.preventDefault();
                  window.location.href = "pagina_adm.html";
                });
            }
          });

          // logout
          const exitItem = document.getElementById("Deslogar");
          exitItem.addEventListener("click", function () {
            firebase
              .auth()
              .signOut()
              .then(function () {
                window.location.href = "login.html";
              })
              .catch(function (error) {
                console.error("Erro ao sair:", error);
              });
          });
        } else {
          // quando não tá logado
          const nomeEntrar = document.getElementById("nome_entrar");
          nomeEntrar.innerHTML = `Entrar`;

          const btn = document.querySelector(".profile-dropdown-btn");
          btn.addEventListener("click", function () {
            window.location.href = "login.html";
          });

          document
            .querySelector(".profile-dropdown-list")
            .classList.remove("active");

          // Define uma foto de perfil padrão quando o usuário não estiver logado
          const profileImg = btn.querySelector(".profile-img");
          const defaultImage =
            "https://gabrielaccorsi.github.io/Projeto-SI/imagens/entrar.png";
          profileImg.style.backgroundImage = `url('${defaultImage}')`;
        }
      })
      .catch((error) => console.error("Erro ao carregar a navbar:", error));
  });
}

// menu hambúrguer
function inicializarMenuHamburger() {
  const hamburgerMenu = document.querySelector(".hamburger-menu");
  const navLinks = document.querySelector(".nav_links");

  if (hamburgerMenu && navLinks) {
    hamburgerMenu.addEventListener("click", function (event) {
      event.stopPropagation();
      navLinks.classList.toggle("open");
    });

    document.addEventListener("click", function (event) {
      if (
        !navLinks.contains(event.target) &&
        !hamburgerMenu.contains(event.target)
      ) {
        navLinks.classList.remove("open");
      }
    });
  }
}

// Inicializa a navbar ao carregar a página
document.addEventListener("DOMContentLoaded", carregarNavbar);
