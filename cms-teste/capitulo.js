// Função para carregar os capítulos do localStorage
function carregarCapitulos() {
    const capitulosSalvos = localStorage.getItem('capitulos');
    return capitulosSalvos ? JSON.parse(capitulosSalvos) : [];
}

// Função para carregar o conteúdo de um capítulo específico
function carregarCapitulo(id) {
    const capitulos = carregarCapitulos();
    return capitulos[id] || null;
}

// Pegar o parâmetro da URL (id do capítulo)
const urlParams = new URLSearchParams(window.location.search);
const idCapitulo = urlParams.get('id');

// Carregar o capítulo e renderizar na página
if (idCapitulo !== null) {
    const capitulo = carregarCapitulo(idCapitulo);
    if (capitulo) {
        document.getElementById('tituloCapitulo').innerText = capitulo.titulo;
        document.getElementById('conteudoCapitulo').innerText = capitulo.conteudo;
    } else {
        document.getElementById('tituloCapitulo').innerText = 'Capítulo não encontrado';
        document.getElementById('conteudoCapitulo').innerText = '';
    }
}
