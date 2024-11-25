// Função para abrir e fechar modal do novo tópico
function openNewTopicModal() {
    document.getElementById('new-topic-modal').style.display = 'flex';
}

function closeNewTopicModal() {
    document.getElementById('new-topic-modal').style.display = 'none';
}

// Função para carregar tópicos salvos e exibir na tela
function carregarTopico() {
    const topicContainer = document.getElementById('topics-container');
    const topicosSalvos = JSON.parse(localStorage.getItem("topicos")) || [];

    topicosSalvos.forEach((topico) => {
        const newTopic = document.createElement('div');
        newTopic.className = 'forum-topic';
        newTopic.setAttribute('data-category', topico.category);
        newTopic.setAttribute('data-usuario', topico.usuarioId || '');

        newTopic.innerHTML = `
            <div class="forum-topic-details">
                <img src="${topico.foto}" alt="Avatar">
                <div>
                    <h3 class="forum-topic-title"><a href="#">${topico.title}</a></h3>
                    <p>${topico.nome} - ${topico.data}</p>
                </div>
            </div>
            <button class="apagar" style="display: none;">Excluir</button>
            <p>${topico.category}</p>
        `;
        topicContainer.appendChild(newTopic);
    });

    atualizarExibicaoBotoes(); 
}

function atualizarExibicaoBotoes() {
    const user = firebase.auth().currentUser;

    if (user) {
        // dados do usuário no firebase
        const userRef = firebase.database().ref('users/' + user.uid);

        userRef.once('value').then((snapshot) => {
            const usuario = snapshot.val();
            const excluirPost = document.querySelectorAll(".apagar");
            excluirPost.forEach((botao) => {
                const forumTopic = botao.closest('.forum-topic');
                const criadorPost = forumTopic.getAttribute("data-usuario");

                // botão de exclusão 
                if (usuario && (usuario.tipo === "adm" || usuario.id === criadorPost)) {
                    botao.style.display = "block";
                } else {
                    botao.style.display = "none";
                }
            });
        });
    }
}


// Função para adicionar um novo tópico
function addNewTopic() {
    const title = document.getElementById('new-topic-title').value;
    const category = document.getElementById('new-topic-category').value || 'Geral';

    if (title.trim() === '') {
        alert('O título do tópico não pode estar vazio!');
        return;
    }

    const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));
    if (!usuario) {
        alert('Nenhum usuário logado.');
        return;
    }

    const novoTopico = {
        title,
        category,
        foto: usuario.foto,
        nome: usuario.nome,
        data: new Date().toLocaleString(),
        usuarioId: usuario.id
    };

    const topicContainer = document.getElementById('topics-container');
    const newTopic = document.createElement('div');
    newTopic.className = 'forum-topic';
    newTopic.setAttribute('data-category', category);
    newTopic.setAttribute('data-usuario', usuario.id);

    newTopic.innerHTML = `
        <div class="forum-topic-details">
            <img src="${novoTopico.foto}" alt="Avatar">
            <div>
                <h3 class="forum-topic-title"><a href="#">${novoTopico.title}</a></h3>
                <p>${novoTopico.nome} - ${novoTopico.data}</p>
            </div>
        </div>
        <button class="apagar" style="display: none;">Excluir</button>
        <p>${novoTopico.category}</p>
    `;
    topicContainer.appendChild(newTopic);

    const topicosSalvos = JSON.parse(localStorage.getItem("topicos")) || [];
    topicosSalvos.push(novoTopico);
    localStorage.setItem("topicos", JSON.stringify(topicosSalvos));

    closeNewTopicModal();
    atualizarExibicaoBotoes();
}

// Função para remover tópicos e atualizar localStorage
function removerTopico() {
    const excluirPost = document.querySelectorAll(".apagar");

    excluirPost.forEach((botao) => {
        botao.addEventListener('click', function() {
            const forumTopic = this.closest('.forum-topic');
            forumTopic.remove();
            atualizarLocalStorage(); 
        });
    });
}

function atualizarLocalStorage() {
    const topicosSalvos = [];
    const topics = document.querySelectorAll('.forum-topic'); 

    topics.forEach(topic => {
        const isPredefined = topic.getAttribute('data-predefined') === 'true';

        if (!isPredefined) {
            const title = topic.querySelector('.forum-topic-title a').textContent;
            const category = topic.getAttribute('data-category');
            const nome = topic.querySelector('.forum-topic-details div p').textContent.split(' - ')[0];
            const foto = topic.querySelector('.forum-topic-details img').src;
            const data = topic.querySelector('.forum-topic-details div p').textContent.split(' - ')[1];

            topicosSalvos.push({
                title,
                category,
                foto,
                nome,
                data
            });
        }
    });

    
    localStorage.setItem("topicos", JSON.stringify(topicosSalvos));
    atualizarExibicaoBotoes()
}


function removerTopico() {
    const excluirPost = document.querySelectorAll(".apagar");

    excluirPost.forEach((botao) => {
        botao.addEventListener('click', function() {
            const forumTopic = this.closest('.forum-topic');
            forumTopic.remove();
            atualizarLocalStorage(); 
        });
    });

}


document.addEventListener('DOMContentLoaded', () => {
    carregarTopico();
    removerTopico();
    atualizarExibicaoBotoes()
});



// Filtrar tópicos por categoria
function filterTopics(category) {
    const topics = document.querySelectorAll('.forum-topic');
    topics.forEach(topic => {
        if (category === 'all' || topic.getAttribute('data-category') === category) {
            topic.style.display = 'flex';
        } else {
            topic.style.display = 'none';
        }
    });

    document.querySelectorAll('.categories button').forEach(button => {
        button.classList.remove('active');
    });
    event.target.classList.add('active');
}

// Pesquisar tópicos
function searchTopics() {
    const query = document.getElementById('search').value.toLowerCase();
    const topics = document.querySelectorAll('.forum-topic');
    topics.forEach(topic => {
        const title = topic.querySelector('.forum-topic-title').textContent.toLowerCase();
        topic.style.display = title.includes(query) ? 'flex' : 'none';
    });
}




