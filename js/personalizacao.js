document.addEventListener("DOMContentLoaded", () => {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            const userId = user.uid;

            // Espera o Firebase buscar os dados do usuário
            database.ref("users/" + userId).once("value").then((snapshot) => {
                if (snapshot.exists()) {
                    const userData = snapshot.val();
                    const nome = userData.displayName;  // Nome do usuário
                    const inicial = nome.charAt(0).toUpperCase();  // Pega a inicial

                    // Atualiza o atributo data-inicial no canvas
                    document.getElementById("canvas").setAttribute("data-inicial", inicial);

                    console.log(inicial);  // Agora vai imprimir a inicial correta

                    // Agora você pode continuar com o resto do código para desenhar o avatar
                    const cores = ["#FF5733", "#33FF57", "#3357FF", "#FF33A8", "#A833FF", "#FFD733", "#33FFF5", "#FF9133", "#9133FF", "#FF3333"];
                    const corAleatoria = cores[Math.floor(Math.random() * cores.length)];

                    const canvas = document.getElementById("canvas");
                    const ctx = canvas.getContext("2d");

                    // Gerar avatar com a inicial
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.beginPath();
                    ctx.arc(60, 60, 60, 0, Math.PI * 2);
                    ctx.fillStyle = corAleatoria;
                    ctx.fill();

                    ctx.font = "40px Arial";
                    ctx.fillStyle = "white";
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";
                    ctx.fillText(inicial, 60, 60);

                    // Criar bloco de cores
                    const colorPicker = document.getElementById("colorPicker");
                    cores.forEach(cor => {
                        const colorBlock = document.createElement("div");
                        colorBlock.classList.add("color-block");
                        colorBlock.style.backgroundColor = cor;

                        colorBlock.addEventListener("click", () => {
                            ctx.clearRect(0, 0, canvas.width, canvas.height);  // Limpa o canvas
                            ctx.beginPath();
                            ctx.arc(60, 60, 60, 0, Math.PI * 2);
                            ctx.fillStyle = cor;  // Cor selecionada
                            ctx.fill();
                            ctx.font = "40px Arial";
                            ctx.fillStyle = "white";
                            ctx.textAlign = "center";
                            ctx.textBaseline = "middle";
                            ctx.fillText(inicial, 60, 60);
                        });

                        colorPicker.appendChild(colorBlock);
                    });
                }
            }).catch((error) => {
                console.error("Erro ao buscar dados do usuário:", error);
            });
        }
    });
});



firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        const userId = user.uid;

        database
            .ref("users/" + userId)
            .once("value")
            .then((snapshot) => {
                if (snapshot.exists()) {
                    const userData = snapshot.val();
                    const nome = userData.displayName;
                    const bio = userData.bio || "";

                    document.getElementById("bio").value = bio;

                    const fotoUrl = user.photoURL || document.getElementById("canvas").toDataURL();

                    document.getElementById("canvas").setAttribute("data-inicial", nome.charAt(0).toUpperCase());
                }
            })
            .catch((error) => {
                console.error("Erro ao buscar dados do usuário:", error);
            });

        document
            .getElementById("personalizacaoForm")
            .addEventListener("submit", (event) => {
                event.preventDefault();

                const bio = document.getElementById("bio").value.trim();
                const fotoUrl = document.getElementById("canvas").toDataURL();

                database
                    .ref("users/" + userId)
                    .update({
                        bio: bio,
                        photoURL: fotoUrl,
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
