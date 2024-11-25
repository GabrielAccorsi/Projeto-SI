
// Função que gera o avatar
function gerarAvatar(nome) { 
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    // Limpa o canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Gera cor de fundo aleatória e inicial
    const inicial = nome.charAt(0).toUpperCase();
    const corFundo = "#" + Math.floor(Math.random() * 16777215).toString(16);

    // Desenha o fundo circular
    ctx.beginPath();
    ctx.arc(50, 50, 50, 0, Math.PI * 2);
    ctx.fillStyle = corFundo;
    ctx.fill();

    // Adiciona a inicial no círculo
    ctx.font = "40px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(inicial, 50, 50);
}

// Aguarda o DOM ser carregado completamente
document.addEventListener("DOMContentLoaded", () => {
    const cores = ["#FF5733", "#33FF57", "#3357FF", "#FF33A8", "#A833FF", "#FFD733", "#33FFF5", "#FF9133", "#9133FF", "#FF3333"];
    
    // Seleciona o contêiner onde os blocos de cores serão adicionados
    const colorPicker = document.getElementById("colorPicker");
    
    // Gera os blocos de cores
    cores.forEach(cor => {
        const colorBlock = document.createElement("div");
        colorBlock.classList.add("color-block");
        colorBlock.style.backgroundColor = cor;
        
        // Adiciona o evento de clique para mudar a cor do canvas
        colorBlock.addEventListener("click", () => {
            const ctx = document.getElementById("canvas").getContext("2d");

            // Limpa o canvas
            ctx.clearRect(0, 0, 100, 100); 
            // Desenha o fundo circular com a cor selecionada
            ctx.beginPath();
            ctx.arc(50, 50, 50, 0, Math.PI * 2);
            ctx.fillStyle = cor;
            ctx.fill();
            
            // Adiciona a inicial novamente
            const inicial = document.getElementById("canvas").getAttribute("data-inicial");  // Use data-inicial
            ctx.font = "40px Arial";
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(inicial, 50, 50);
        });
        
        // Adiciona o bloco de cor ao contêiner
        colorPicker.appendChild(colorBlock);
    });
});

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        const userId = user.uid;

        // Obtém os dados do usuário do Firebase
        database
            .ref("users/" + userId)
            .once("value")
            .then((snapshot) => {
                if (snapshot.exists()) {
                    const userData = snapshot.val();
                    const nome = userData.displayName;
                    const bio = userData.bio || "";
                    
                    // Atualiza os campos com os dados do usuário
                    document.getElementById("bio").value = bio;

                    // Gera o avatar com base no nome ou usa o avatar do Google
                    const fotoUrl = user.photoURL || document.getElementById("canvas").toDataURL();

                    // Armazena a inicial do usuário para ser reutilizada ao mudar a cor
                    document.getElementById("canvas").setAttribute("data-inicial", nome.charAt(0).toUpperCase());
                }
            })
            .catch((error) => {
                console.error("Erro ao buscar dados do usuário:", error);
            });

        // Evento ao salvar as alterações
        document
            .getElementById("personalizacaoForm")
            .addEventListener("submit", (event) => {
                event.preventDefault();

                const bio = document.getElementById("bio").value.trim();
                const fotoUrl = document.getElementById("canvas").toDataURL(); // Foto gerada

                // Atualiza os dados do usuário no Firebase
                database
                    .ref("users/" + userId)
                    .update({
                        bio: bio,
                        photoURL: fotoUrl, // Salva a foto gerada no Firebase
                    })
                    .then(() => {
                        window.location.href = "pagina_aluno.html";
                    })
                    .catch((error) => {
                        console.error("Erro ao atualizar perfil:", error);
                        alert("Erro ao atualizar perfil. Tente novamente.");
                    });
            });
    } else {
        alert("Usuário não autenticado. Redirecionando para o login.");
        window.location.href = "login.html";
    }
});


