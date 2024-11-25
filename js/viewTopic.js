function loadPopularTopics() {
  const popularTopicsContainer = document.getElementById("popular-topics-list");

  database
    .ref("topics")
    .orderByChild("views")
    .limitToLast(5)
    .once("value")
    .then((snapshot) => {
      popularTopicsContainer.innerHTML = "";
      snapshot.forEach((childSnapshot) => {
        const topic = childSnapshot.val();
        const listItem = document.createElement("li");
        listItem.innerHTML = `
              <a href="/viewTopic.html?id=${childSnapshot.key}">
                ${topic.title} (${topic.views} visualizações)
              </a>`;
        popularTopicsContainer.appendChild(listItem);
      });
    })
    .catch((error) => {
      console.error("Erro ao carregar tópicos populares:", error);
    });
}

// Carregar tópicos populares ao carregar a página
window.onload = loadPopularTopics;

// Função para registrar a visualização de um tópico
function registerView(topicId) {
  const topicRef = database.ref(`topics/${topicId}/views`);

  topicRef
    .transaction((currentViews) => {
      return (currentViews || 0) + 1; // Incrementa a contagem de visualizações
    })
    .then(() => {
      console.log("Visualização registrada com sucesso.");
    })
    .catch((error) => {
      console.error("Erro ao registrar visualização:", error);
    });
}

// Função para exibir os detalhes do tópico
function displayTopicDetails(topicId) {
  const topicRef = database.ref(`topics/${topicId}`);

  topicRef
    .once("value")
    .then((snapshot) => {
      const topic = snapshot.val();
      // Exibir título
      document.getElementById("topic-title").textContent = topic.title;

      // Exibir categoria
      document.getElementById("topic-category").textContent = `Categoria: ${
        topic.category || "Não definida"
      }`;

      // Exibir nome do autor
      document.getElementById("topic-author").textContent = `${
        topic.nome || "Autor desconhecido"
      }`;
// Exibir nome do autor
     document.getElementById("topic-content").textContent = `${topic.conteudo}`;
      // Exibir foto do autor
      document.getElementById("topic-author-photo").src = topic.foto;
      // Exibir visualizações
      document.getElementById(
        "topic-views"
      ).textContent = `${topic.views} visualizações`;
    })
    .catch((error) => {
      console.error("Erro ao carregar detalhes do tópico:", error);
    });
}

function carregarComentarios(topicId) {
  const dbRef = firebase.database().ref("topics/" + topicId + "/comments");
  const commentsContainer = document.getElementById("comments-container");

  dbRef.on("value", (snapshot) => {
    commentsContainer.innerHTML = "";
    const comments = snapshot.val();
    if (comments) {
      Object.keys(comments).forEach((commentId) => {
        const comment = comments[commentId];
        const commentElement = document.createElement("div");
        commentElement.className = "comment";
        const commentTime = new Date(comment.data).toLocaleString();

        commentElement.innerHTML = `
            <p><strong>${comment.nome}</strong> <span class="comment-time">(${commentTime})</span></p>
            <p>${comment.text}</p>
            <button class="reply-button" data-id="${commentId}">Responder</button>
            <button class="delete-button" data-id="${commentId}">Excluir</button>
            
          `;

     
        const modal = document.getElementById("delete-modal");
        const confirmButton = document.getElementById("confirm-delete");
        const cancelButton = document.getElementById("cancel-delete");

        // Mostrar o modal
        function showModal(onConfirm) {
          modal.classList.remove("hidden");

          // Confirmar exclusão
          confirmButton.onclick = () => {
            onConfirm(); // Executa a ação passada
            modal.classList.add("hidden");
          };

          // Cancelar exclusão
          cancelButton.onclick = () => {
            modal.classList.add("hidden");
          };
        }

        // Adicionar evento ao botão de excluir
        commentElement
          .querySelector(".delete-button")
          .addEventListener("click", () => {
            showModal(() => {
              dbRef.child(commentId).remove(); 
            });
          });
        
        // Campo de resposta
        const replyField = document.createElement("div");
        replyField.className = "reply-field";
        replyField.innerHTML = `
            <textarea placeholder="Digite sua resposta aqui..."></textarea>
            <button class="send-reply-button">Enviar</button>
          `;

        // Enviar resposta
        replyField
          .querySelector(".send-reply-button")
          .addEventListener("click", () => {
            const replyText = replyField.querySelector("textarea").value;
            if (replyText) {
              const reply = {
                nome: firebase.auth().currentUser.displayName || "Anônimo",
                text: replyText,
                data: new Date().toISOString(),
                userId: firebase.auth().currentUser.uid,
                likes: 0,
              };
              const replyRef = dbRef.child(`${commentId}/replies`);
              replyRef.push(reply);
              replyField.querySelector("textarea").value = ""; // Limpar o campo
            }
          });

        // Mostrar ou esconder o campo de resposta
        commentElement
          .querySelector(".reply-button")
          .addEventListener("click", () => {
            if (!replyField.classList.contains("active")) {
              replyField.classList.add("active");
              replyField.querySelector("textarea").focus();
            } else {
              replyField.classList.remove("active");
            }
          });

        
        commentElement.appendChild(replyField);

        
        const repliesContainer = document.createElement("div");
        repliesContainer.className = "replies-container";

        const repliesRef = dbRef.child(`${commentId}/replies`);
        repliesRef.on("value", (replySnapshot) => {
          repliesContainer.innerHTML = "";
          const replies = replySnapshot.val();
          if (replies) {
            Object.keys(replies).forEach((replyId) => {
              const reply = replies[replyId];
              const replyElement = document.createElement("div");
              replyElement.className = "reply";
              const replyTime = new Date(reply.data).toLocaleString();

              replyElement.innerHTML = `
                  <p><strong>${reply.nome}</strong> <span class="reply-time">(${replyTime})</span></p>
                  <p>${reply.text}</p>
                  <button class="delete-reply-button" data-id="${replyId}">Excluir</button>
                `;

              function showReplyModal(onConfirm) {
                modal.classList.remove("hidden");

                
                confirmButton.onclick = () => {
                  onConfirm(); 
                  modal.classList.add("hidden");
                };

               
                cancelButton.onclick = () => {
                  modal.classList.add("hidden");
                };
              }

              
              replyElement
                .querySelector(".delete-reply-button")
                .addEventListener("click", () => {
                  showReplyModal(() => {
                    repliesRef.child(replyId).remove(); 
                  });
                });

              repliesContainer.appendChild(replyElement);
            });
          }
        });

        commentElement.appendChild(repliesContainer);
        commentsContainer.appendChild(commentElement);
      });
    }
  });
}

function deleteComment(topicId, commentId) {
  if (!commentId) {
    console.error("ID do comentário inválido!");
    return;
  }

  const dbRef = firebase.database().ref(`topics/${topicId}/comments`);
  dbRef
    .child(commentId)
    .remove()
    .then(() => {
      console.log("Comentário excluído com sucesso");
      carregarComentarios(topicId);
    })
    .catch((error) => {
      console.error("Erro ao excluir o comentário:", error);
    });
}

function likeComment(topicId, commentId) {
  const commentRef = firebase
    .database()
    .ref("topics/" + topicId + "/comments/" + commentId);
  commentRef.transaction((comment) => {
    if (comment) {
      comment.likes = (comment.likes || 0) + 1;
    }
    return comment;
  });
}

document.getElementById("add-comment").addEventListener("click", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const topicId = urlParams.get("id");
  if (!topicId) {
    alert("ID do tópico inválido!");
    return;
  }

  const user = firebase.auth().currentUser;
  const dbRef1 = firebase.database().ref("users/" + user.uid);

  dbRef1
    .once("value")
    .then((snapshot) => {
      const userData = snapshot.val();
      const nome = userData.displayName || "Anônimo";
      const commentText = document.getElementById("new-comment").value.trim();
      if (commentText === "") {
        alert("O comentário não pode estar vazio!");
        return;
      }

      const dbRef = firebase.database().ref("topics/" + topicId + "/comments");
      const newComment = {
        nome: nome,
        text: commentText,
        data: new Date().toISOString(), 
        userId: user.uid,
        likes: 0, 
      };

      dbRef.push(newComment);

      // Limpar o campo de comentário após enviar
      document.getElementById("new-comment").value = "";
    })
    .catch((error) => {
      console.error("Erro ao pegar os dados do usuário:", error);
    });
});

// Inicialização ao carregar a página
document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const topicId = urlParams.get("id");
  if (topicId) {
    if (!sessionStorage.getItem(`viewed_${topicId}`)) {
      registerView(topicId);
      sessionStorage.setItem(`viewed_${topicId}`, true);
    }
    displayTopicDetails(topicId);
    carregarComentarios(topicId);
  } else {
    alert("Nenhum tópico selecionado!");
    window.location.href = "index.html";
  }
});
