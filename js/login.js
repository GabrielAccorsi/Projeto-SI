// esconder a senha
const togglePassword = document.querySelector("#togglePassword")
const passwordField = document.querySelector("#senha")

togglePassword.addEventListener("click", () => {
    const type = passwordField.getAttribute("type") === "password" ? "text" : "password"
    passwordField.setAttribute("type", type)

    togglePassword.classList.toggle("fa-eye")
    togglePassword.classList.toggle("fa-eye-slash")
})

// alternar entre as páginas de login e cadastro
const togglePage = () => {
    const indicator = document.getElementById('indicator')
    const currentPage = window.location.pathname

    if (currentPage.includes("login.html")) {
        indicator.style.left = '100px'
        setTimeout(() => {
            window.location.href = 'cadastro.html'
        }, 300)
    } else if (currentPage.includes("cadastro.html")) {
        indicator.style.left = '0px'
        setTimeout(() => {
            window.location.href = 'login.html'
        }, 300)
    }
}

// menu
document.addEventListener('DOMContentLoaded', () => {
    const hamburgerMenu = document.querySelector('.hamburger-menu')
    const navLinks = document.querySelector('.nav_links')

    hamburgerMenu.addEventListener('click', (event) => {
        event.stopPropagation()
        navLinks.classList.toggle('open')
    })

    document.addEventListener('click', (event) => {
        if (!navLinks.contains(event.target) && !hamburgerMenu.contains(event.target)) {
            navLinks.classList.remove('open')
        }
    })
})

// remover mensagens de erro padrão
document.querySelector("form").noValidate = true

// banco de dados - firebase
const firebaseConfig = {
    apiKey: "AIzaSyD8MrXhpxNRCYVoXE0biVkBvq-QW5WQbng",
    authDomain: "projeto-devlab.firebaseapp.com",
    databaseURL: "https://projeto-devlab-default-rtdb.firebaseio.com",
    projectId: "projeto-devlab",
    storageBucket: "projeto-devlab.firebasestorage.app",
    messagingSenderId: "238801747466",
    appId: "1:238801747466:web:b3e99bec5bf628f2ac29f3",
    measurementId: "G-37HJJQGQ44"
  }
  
  firebase.initializeApp(firebaseConfig)
  const database = firebase.database()
  
  document.addEventListener('DOMContentLoaded', () => {
   
    const showError = (message) => {
        document.getElementById('alertMessage').innerText = message
        document.getElementById('alertBox').classList.remove('hidden')
    }
  
    const hideError = () => {
        document.getElementById('alertBox').classList.add('hidden')
    }

    document.getElementById('alertOkButton').addEventListener('click', () => {
        hideError()
    })
  
    // login
    document.getElementById('loginForm').addEventListener('submit', (e) => {
        e.preventDefault();
        hideError();
    
        const email = document.getElementById('email').value;
        const senha = document.getElementById('senha').value;
    
        if (!email || !senha) {
            showError('Por favor, preencha todos os campos corretamente!');
            return;
        }
    
        firebase.auth().signInWithEmailAndPassword(email, senha)
            .then((userCredential) => {
                const user = userCredential.user;
    
                // Recupera o tipo de usuário do banco de dados
                database.ref('users/' + user.uid).once('value')
                    .then((snapshot) => {
                        const usuario = snapshot.val();
                        if (usuario.tipo === 'adm') {
                            window.location.href = "pagina_adm.html";
                        } else {
                            window.location.href = "pagina_aluno.html";
                        }
                    });
            })
            .catch((error) => {
                const errorCode = error.code;
    
                if (errorCode === 'auth/user-not-found') {
                    showError('Este email não está cadastrado. Verifique ou cadastre-se.');
                } else if (errorCode === 'auth/wrong-password') {
                    showError('Senha incorreta. Tente novamente.');
                } else if (errorCode === 'auth/invalid-email') {
                    showError('Email inválido. Verifique o formato do seu email.');
                } else if (errorCode === 'auth/too-many-requests') {
                    showError('Muitas tentativas de login. Tente novamente mais tarde.');
                } else if (error.message.includes('400')) {
                    showError('Houve um erro ao autenticar. Verifique a senha ou o e-mail.');
                } else {
                    showError('Ocorreu um erro desconhecido. Tente novamente.');
                }
            });
    });    
  })
  
  // validar email
  document.addEventListener("DOMContentLoaded", () => {
    const emailInput = document.getElementById('email')
    const emailError = document.getElementById('emailError') 

    const validateEmail = () => {
        const email = emailInput.value.trim()
        let errorMessage = ''
  
        if (email === '') {
            errorMessage = 'Preencha o campo.'
        }
  
        if (errorMessage) {
            emailError.textContent = errorMessage
            emailError.style.color = 'red'
        } else {
            emailError.textContent = ''
        }
    }
  
    emailInput.addEventListener('input', () => {
        if (emailInput.value.trim() !== '') {
            emailError.textContent = ''
        }
        validateEmail()
    })
  
    emailInput.addEventListener('blur', () => {
        const email = emailInput.value.trim()
        if (email !== '' && (!email.includes('@') || !email.includes('.'))) {
            emailError.innerHTML = 'O e-mail deve conter "@" seguido por <br>  um domínio. (Ex: devlab@gmail.com)'
            emailError.style.color = 'red'
        }
    })
  })
  
  // validar senha
  document.addEventListener("DOMContentLoaded", () => {
    const senhaInput = document.getElementById('senha') 
    const senhaError = document.getElementById('senhaError') 
  
    const validateSenha = () => {
        const senha = senhaInput.value.trim()
  
        if (senha === '') {
            senhaError.textContent = 'Preencha o campo.'
            senhaError.style.color = 'red'
        } else if (senha.length < 8) {
            senhaError.textContent = 'A senha tem no mínimo 8 caracteres.'
            senhaError.style.color = 'red'
        } else {
            senhaError.textContent = ''
        }
    }
  
    senhaInput.addEventListener('input', () => {
        validateSenha()
    })
  
    senhaInput.addEventListener('blur', () => {
        validateSenha()
    })
  })
  
  // google
  document.getElementById('google-login').addEventListener('click', () => {
      const provider = new firebase.auth.GoogleAuthProvider()
  
      firebase.auth().signInWithPopup(provider)
          .then(() => {
              window.location.href = "pagina_aluno.html"
          })
          .catch((error) => {
              showAlert("Erro ao logar com Google.")
          })
  })
  
  // gitHub
  document.getElementById('login-github').addEventListener('click', () => {
      const provider = new firebase.auth.GithubAuthProvider()
  
      firebase.auth().signInWithPopup(provider)
          .then(() => {
              window.location.href = "pagina_aluno.html"
          })
          .catch((error) => {
              showAlert("Erro ao logar com GitHub.")
          })
  })
  