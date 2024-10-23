// Simulação de "banco de dados" usando uma matriz
let topicos = [];

// Elementos do DOM
const formTopico = document.getElementById('form-topico');
const listaTopicos = document.getElementById('lista-topicos');
const buscarInput = document.getElementById('buscar');

// Função para renderizar os tópicos na tela
function renderizarTopicos(filtro = '') {
    listaTopicos.innerHTML = ''; // Limpa a lista de tópicos

    // Filtra os tópicos com base no texto de busca
    const topicosFiltrados = topicos.filter(topico =>
        topico.assunto.toLowerCase().includes(filtro.toLowerCase())
    );

    // Exibe cada tópico filtrado
    topicosFiltrados.forEach((topico, index) => {
        const div = document.createElement('div');
        div.classList.add('topico');

        div.innerHTML = `
            <h2>${topico.assunto}</h2>
            <p><strong>Criador:</strong> ${topico.criador}</p>
            <p>${topico.texto}</p>
            <button class="deletar" onclick="deletarTopico(${index})">Deletar</button>
        `;

        listaTopicos.appendChild(div);
    });
}

// Função para adicionar um novo tópico
formTopico.addEventListener('submit', function (e) {
    e.preventDefault(); // Evita recarregar a página

    const assunto = document.getElementById('assunto').value;
    const criador = document.getElementById('criador').value;
    const texto = document.getElementById('texto').value;

    // Adiciona o novo tópico à matriz
    topicos.push({ assunto, criador, texto });

    // Limpa o formulário
    formTopico.reset();

    // Re-renderiza a lista de tópicos
    renderizarTopicos();
});

// Função para deletar um tópico
function deletarTopico(index) {
    topicos.splice(index, 1); // Remove o tópico da matriz
    renderizarTopicos(); // Re-renderiza a lista de tópicos
}

// Função para buscar tópicos em tempo real
buscarInput.addEventListener('input', function (e) {
    renderizarTopicos(e.target.value); // Renderiza com base no texto digitado
});

// Renderiza os tópicos ao carregar a página
renderizarTopicos();
