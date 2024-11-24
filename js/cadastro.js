// esconder a senha e confirmação de senha
const togglePassword = document.querySelector("#togglePassword")
const passwordField = document.querySelector("#senha")

togglePassword.addEventListener("click", () => {
    const type = passwordField.getAttribute("type") === "password" ? "text" : "password"
    passwordField.setAttribute("type", type)

    togglePassword.classList.toggle("fa-eye")
    togglePassword.classList.toggle("fa-eye-slash")
})

const togglePasswordConfirm = document.querySelector("#togglePasswordConfirm")
const passwordConfirmField = document.querySelector("#senhaConfirm")

togglePasswordConfirm.addEventListener("click", () => {
    const type = passwordConfirmField.getAttribute("type") === "password" ? "text" : "password"
    passwordConfirmField.setAttribute("type", type)

    togglePasswordConfirm.classList.toggle("fa-eye")
    togglePasswordConfirm.classList.toggle("fa-eye-slash")
})

// alternar entre as páginas de login e cadastro
const togglePage = () => {
    const indicator = document.getElementById('indicator')
    const currentPage = window.location.pathname

    if (currentPage.includes("cadastro.html")) {
        indicator.style.left = '0px'  
        setTimeout(() => {
            window.location.href = 'login.html' 
        }, 300)  
    } else if (currentPage.includes("login.html")) {
        indicator.style.left = '100px'  
        setTimeout(() => {
            window.location.href = 'cadastro.html'  
        }, 300)  
    }
}

//menu
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


//remover mensagens de erro padrão
document.querySelector("form").noValidate = true;
   
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

const showAlert = (message) => {
    const alertBox = document.getElementById('alertBox')
    const alertMessage = document.getElementById('alertMessage')
    alertMessage.textContent = message
    alertBox.classList.remove('hidden')

    const alertOkButton = document.getElementById('alertOkButton')
    alertOkButton.onclick = () => {
        closeAlert() 
    }
}

function closeAlert() {
    const alertBox = document.getElementById('alertBox')
    alertBox.classList.add('hidden')
}

// cadastro
document.getElementById('cadastroForm').addEventListener('submit', (event) => {
    event.preventDefault()  

    const nome = document.getElementById('nome').value.trim()
    const email = document.getElementById('email').value.trim()
    const senha = document.getElementById('senha').value.trim()
    const senhaConfirm = document.getElementById('senhaConfirm').value.trim()

    const auth = firebase.auth()

    // usuário
    auth.createUserWithEmailAndPassword(email, senha)
    .then((userCredential) => {
        const user = userCredential.user;

        // Adiciona o tipo de usuário ao banco de dados
        const tipo = email.endsWith('@admin.com') ? 'adm' : 'aluno';

        database.ref('users/' + user.uid).set({
            nome: nome,
            email: email,
            tipo: tipo // Adiciona o tipo do usuário
        }).then(() => {
            if (tipo === 'adm') {
                window.location.href = "pagina_adm.html";
            } else {
                window.location.href = "pagina_aluno.html";
            }
        });
    })
    .catch((error) => {
        const errorCode = error.code;
        if (errorCode === 'auth/email-already-in-use') {
            showAlert("O e-mail inserido já está cadastrado. Tente usar outro e-mail ou faça login.");
        } else {
            showAlert("Por favor, preencha todos os campos corretamente.");
        }
    });

})

// validar nome
document.addEventListener("DOMContentLoaded", () => {
    const nomeInput = document.getElementById('nome')
    const nomeError = document.getElementById('nomeError') 

    const validateNome = () => {
        const nome = nomeInput.value.trim()

        if (nome === '') {
            nomeError.textContent = 'Preencha o campo.'
            nomeError.style.color = 'red'
        } else if (nome.length < 3) {
            nomeError.textContent = 'O nome deve ter no mínimo 3 caracteres.'
            nomeError.style.color = 'red'
        } else if (/\d/.test(nome)) {
            nomeError.textContent = 'Números não são permitidos.'
            nomeError.style.color = 'red'
        } else if (/[^a-zA-ZáéíóúãõâêîôûàèìòùäëïöüçÇ\s]/.test(nome)) {
            nomeError.textContent = 'Caracteres especiais não são permitidos.'
            nomeError.style.color = 'red'
        } else {
            nomeError.textContent = ''
        }
    }

    nomeInput.addEventListener('blur', validateNome)

    nomeInput.addEventListener('input', () => {
        if (nomeInput.value.trim() !== '') {
            nomeError.textContent = ''
        }

        validateNome()
    })
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

// google
document.getElementById('google-login').addEventListener('click', () => {
    const provider = new firebase.auth.GoogleAuthProvider()

    firebase.auth().signInWithPopup(provider)
        .then(() => {
            window.location.href = "pagina_aluno.html" 
        })
        .catch((error) => {
            showAlert("Erro ao logar com Google. ")
        })
})

// github
document.getElementById('login-github').addEventListener('click', () => {
    const provider = new firebase.auth.GithubAuthProvider()

    firebase.auth().signInWithPopup(provider)
        .then(() => {
            window.location.href = "pagina_aluno.html"
        })
        .catch((error) => {
            showAlert("Erro ao logar com GitHub. ")
        })
})

// validar senha
document.addEventListener("DOMContentLoaded", () => {
    const senhaInput = document.getElementById('senha')
    const passwordRules = document.getElementById('passwordRules')
    const senhaError = document.getElementById('senhaError')
    passwordRules.style.display = 'none'

    const validateSenha = () => {
        const senha = senhaInput.value.trim()

        if (senha === '') {
            senhaError.innerHTML = 'Preencha o campo.'
            senhaError.style.color = 'red'
            passwordRules.style.display = 'none'
        } else {
            senhaError.textContent = ''
            passwordRules.style.display = 'block'
        }

        rules.forEach((rule) => {
            const ruleElement = document.getElementById(rule.id)
            if (rule.regex.test(senha)) {
                ruleElement.classList.remove('invalid')
                ruleElement.classList.add('valid')
            } else {
                ruleElement.classList.remove('valid')
                ruleElement.classList.add('invalid')
            }
        })
    }

    const rules = [
        { id: 'ruleMinLength', text: '* Mínimo de 8 caracteres', regex: /.{8,}/ },
        { id: 'ruleSpecialChar', text: '* Caractere especial', regex: /[!@#$%^&*(),.?":{}|<>]/ },
        { id: 'ruleUpperCase', text: '* Letra maiúscula', regex: /[A-Z]/ },
        { id: 'ruleLowerCase', text: '* Letra minúscula', regex: /[a-z]/ },
        { id: 'ruleNumeric', text: '* Um número', regex: /\d/ }
    ]

    passwordRules.innerHTML = rules
        .map(rule => `<p id="${rule.id}" class="invalid">${rule.text}</p>`)
        .join('')

    senhaInput.addEventListener('focus', () => {
        if (senhaInput.value !== '') {
            passwordRules.style.display = 'block'
        }
    })

    senhaInput.addEventListener('input', validateSenha)

    senhaInput.addEventListener('blur', () => {
        passwordRules.style.display = 'none'
    })
})

// validar confirmação de senha
document.addEventListener("DOMContentLoaded", () => {
    const senhaConfirmInput = document.getElementById('senhaConfirm')
    const senhaConfirmError = document.getElementById('senhaConfirmError') 

    const validateSenhaConfirm = () => {
        const senha = document.getElementById('senha').value.trim()
        const senhaConfirm = senhaConfirmInput.value.trim()

        if (senhaConfirm === '') {
            senhaConfirmError.innerHTML = 'Preencha o campo.'
            senhaConfirmError.style.color = 'red'
        } else if (senha !== senhaConfirm) {
            senhaConfirmError.innerHTML = 'As senhas não coincidem.'
            senhaConfirmError.style.color = 'red'
        } else {
            senhaConfirmError.innerHTML = ''
        }
    }

    senhaConfirmInput.addEventListener('blur', validateSenhaConfirm)

    senhaConfirmInput.addEventListener('input', () => {
        if (senhaConfirmInput.value.trim() !== '') {
            senhaConfirmError.textContent = ''
        }

        validateSenhaConfirm()
    })
})
