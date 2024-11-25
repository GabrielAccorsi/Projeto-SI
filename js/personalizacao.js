

function gerarAvatar(nome) { 
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
 
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    
    const inicial = nome.charAt(0).toUpperCase();
    const corFundo = "#" + Math.floor(Math.random() * 16777215).toString(16);

    ctx.beginPath();
    ctx.arc(50, 50, 50, 0, Math.PI * 2);
    ctx.fillStyle = corFundo;
    ctx.fill();

    ctx.font = "40px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(inicial, 50, 50);
}


document.addEventListener("DOMContentLoaded", () => {
    const cores = ["#FF5733", "#33FF57", "#3357FF", "#FF33A8", "#A833FF", "#FFD733", "#33FFF5", "#FF9133", "#9133FF", "#FF3333"];
    
    
    const colorPicker = document.getElementById("colorPicker");
    
    
    cores.forEach(cor => {
        const colorBlock = document.createElement("div");
        colorBlock.classList.add("color-block");
        colorBlock.style.backgroundColor = cor;
        
       
        colorBlock.addEventListener("click", () => {
            const ctx = document.getElementById("canvas").getContext("2d");

            
            ctx.clearRect(0, 0, 100, 100); 
            
            ctx.beginPath();
            ctx.arc(50, 50, 50, 0, Math.PI * 2);
            ctx.fillStyle = cor;
            ctx.fill();
            
           
            const inicial = document.getElementById("canvas").getAttribute("data-inicial");  
            ctx.font = "40px Arial";
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(inicial, 50, 50);
        });
        
        colorPicker.appendChild(colorBlock);
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

        // Evento ao salvar as alterações
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


