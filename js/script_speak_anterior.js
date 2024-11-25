//Teste de implementação de acessibilidade
let audioEnabled = false;
//speakText("Olá! Seja bem-vindo ao meu site! Você está na página home! Pressione control mais alt mais s, para acessar a página sobre! Ou Pressione control mais alt mais c, para acessar a página contato!")

// Função para alternar o estado do áudio
function toggleAudio() {
    audioEnabled = !audioEnabled;
    const button = document.getElementById("audio-toggle-button");
    if (audioEnabled) {
        speakText("Olá! Seja bem-vindo ao meu site! Você está na página home! Pressione control mais alt mais s, para acessar a página sobre! Ou Pressione control mais alt mais c, para acessar a página contato!")
        button.textContent = "Desativar Áudio";
        
        //alert("Áudio ativado! Agora o áudio será reproduzido ao passar o mouse nos links.");
    } else {
        speakText("O audio será desativado! Para reativa-lo pressione control mais alt mais a.")
        button.textContent = "Ativar Áudio";
        
        //alert("Áudio desativado.");
    }
}

// Função para tocar o áudio do texto usando ResponsiveVoice
function speakText(text) {
    if (audioEnabled && typeof responsiveVoice !== "undefined" && typeof text === "string" && text.trim() !== "") {
        responsiveVoice.speak(text, "Brazilian Portuguese Female");
    } else if (!audioEnabled) {
        console.warn("Áudio está desativado.");
    }
}

// Adiciona atalhos de teclado para ativação e navegação
document.addEventListener("keydown", function(event) {
    // Atalho para alternar o estado do áudio: Ctrl + Shift + A
    if (event.ctrlKey && event.altKey && event.key.toLowerCase() === "a") {
        toggleAudio();
    }

    // Navegação com Ctrl + Shift + teclas específicas
    if (event.ctrlKey && event.altKey && audioEnabled) {
        switch (event.key.toLowerCase()) {
            case "h": // Ctrl + alt + H para "Home"
                window.location.href = document.getElementById("link-home").href;
                speakText("Início");
                break;
            case "t": // Ctrl + alt + t para "tutoriais"
                window.location.href = document.getElementById("link-tutorial").href;
                speakText("Tutorial");
                break;
            case "f": // Ctrl + alt + f para "ferramentas"
                window.location.href = document.getElementById("link-ferramenta").href;
                speakText("Ferramenta");
                break;
            case "p": // Ctrl + alt + p para "forum"
                window.location.href = document.getElementById("link-forum").href;
                speakText("Fórum");
                break;
            case "s": // Ctrl + alt + s para "sobre"
                window.location.href = document.getElementById("link-sobre").href;
                speakText("Sobre");
            case "c": // Ctrl + alt + C para "Contato"
                window.location.href = document.getElementById("link-contato").href;
                speakText("Contato");
                break;
            case "e": // Ctrl + alt + e para "entrar"
                window.location.href = document.getElementById("nome-entrar").href;
                speakText("Entrar");
                break;
            default:
                break;
        }
    }
});