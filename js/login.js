//Pra esconder a senha
const togglePassword = document.querySelector("#togglePassword");
const passwordField = document.querySelector("#senha");

togglePassword.addEventListener("click", function () {
    const type = passwordField.getAttribute("type") === "password" ? "text" : "password";
    passwordField.setAttribute("type", type);

    this.classList.toggle("fa-eye");
    this.classList.toggle("fa-eye-slash");
});

// Pra alternar entre as páginas de login e cadastro
function togglePage() {
    const indicator = document.getElementById('indicator');
    const currentPage = window.location.pathname; 

   
    if (currentPage.includes("login.html")) {
        indicator.style.left = '100px';  
        setTimeout(() => {
            window.location.href = 'cadastro.html';  
        }, 300);  
    } 
    
    else if (currentPage.includes("cadastro.html")) {
        indicator.style.left = '0px';
        setTimeout(() => {
            window.location.href = 'login.html';  
        }, 300); 
    }
}

//Menu
document.addEventListener('DOMContentLoaded', function () {
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const navLinks = document.querySelector('.nav_links');

    hamburgerMenu.addEventListener('click', function (event) {
      event.stopPropagation();
      navLinks.classList.toggle('open');
    });

    document.addEventListener('click', function (event) {
      if (!navLinks.contains(event.target) && !hamburgerMenu.contains(event.target)) {
        navLinks.classList.remove('open');
      }
    });
  });
  