// Função para salvar os capítulos no localStorage
function salvarCapitulos(capitulos) {
    localStorage.setItem('capitulos', JSON.stringify(capitulos));
}

// Função para carregar os capítulos do localStorage
function carregarCapitulos() {
    const capitulosSalvos = localStorage.getItem('capitulos');
    return capitulosSalvos ? JSON.parse(capitulosSalvos) : [];
}

// Função para renderizar os capítulos na página
function renderizarCapitulos() {
    const listaCapitulos = document.getElementById('listaCapitulos');
    listaCapitulos.innerHTML = '';

    const capitulos = carregarCapitulos();
    capitulos.forEach((capitulo, index) => {
        const divCapitulo = document.createElement('div');
        divCapitulo.classList.add('capitulo');
        
        const linkCapitulo = document.createElement('a');
        linkCapitulo.href = `capitulo.html?id=${index}`;
        linkCapitulo.innerText = capitulo.titulo;

        divCapitulo.appendChild(linkCapitulo);
        listaCapitulos.appendChild(divCapitulo);
    });
}

// Função para adicionar um novo capítulo
document.getElementById('formAdicionarCapitulo').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const titulo = document.getElementById('titulo').value;
    const conteudo = document.getElementById('conteudo').value;
    
    // Carregar capítulos atuais
    const capitulos = carregarCapitulos();
    
    // Adicionar novo capítulo à lista
    capitulos.push({ titulo, conteudo });
    
    // Salvar no localStorage
    salvarCapitulos(capitulos);
    
    // Limpar o formulário
    document.getElementById('titulo').value = '';
    document.getElementById('conteudo').value = '';
    
    // Renderizar a lista de capítulos
    renderizarCapitulos();
});

// Carregar os capítulos ao iniciar a página
window.onload = function() {
    renderizarCapitulos();
}; 

// Evento para mostrar o formulário ao clicar no ícone de lápis
document.querySelector('.lapis').addEventListener('click', function() {
    const form = document.getElementById('formAdicionarCapitulo');
    form.style.display = form.style.display === 'block' ? 'none' : 'block';
});

// Carregar os capítulos ao iniciar a página
window.onload = function() {
    renderizarCapitulos();
};