// Vetor que simula o JSON de usuários
let usuarios = [
  {
      id: 1,
      nome: 'Juan',
      email: 'juan@gmail.com',
      tipo: 'aluno',
      senha: '1234',
      foto: 'imagens/juan.png' // Caminho para a foto de perfil
  },
  {
      id: 2,
      nome: 'Gabriel',
      email: 'gabriel@gmail.com',
      tipo: 'adm',
      senha: 'gaga2',
      foto: 'imagens/gabriel.png' // Caminho para a foto de perfil
  },
  {
      id: 3,
      nome: 'Paula',
      email: 'paula@gmail.com',
      tipo: 'aluno',
      senha: '1234',
      foto: 'imagens/paula.png' // Caminho para a foto de perfil
  }
];

// Função de login
document.getElementById('loginForm')?.addEventListener('submit', function(event) {
  event.preventDefault();

  const email = document.getElementById('email').value;
  const senha = document.getElementById('senha').value;

  const usuario = usuarios.find(user => user.email === email && user.senha === senha);
  if (email === "" || senha === "") {
    document.getElementById("incorreto").innerHTML = 'Preencha todos os campos!';
    return; 
  }

  if (usuario) {
      // Armazena as informações do usuário no localStorage
      localStorage.setItem('usuarioLogado', JSON.stringify({
          nome: usuario.nome,
          foto: usuario.foto,
          tipo: usuario.tipo
      }));

      if (usuario.tipo === 'aluno') {
          window.location.href = 'pagina_aluno.html';
      } else if (usuario.tipo === 'adm') {
          window.location.href = 'pagina_adm.html';
      }
  } else { 
    document.getElementById("incorreto").innerHTML= 'Email ou senha incorretos!';
  }
});


// Função para adicionar um novo usuário
function cadastrarUsuario(nome, email, tipo, senha) {
  const novoUsuario = {
      id: usuarios.length + 1, // ID automático
      nome: nome,
      email: email,
      tipo: tipo,
      senha: senha
  };

  usuarios.push(novoUsuario); // Adiciona o novo usuário ao vetor
  console.log('Usuário cadastrado com sucesso!', novoUsuario);
}

// Função para adicionar um novo usuário
function cadastrarUsuario(nome, email, tipo, senha) {
  const novoUsuario = {
      id: usuarios.length + 1, // ID automático
      nome: nome,
      email: email,
      tipo: tipo,
      senha: senha
  };

  usuarios.push(novoUsuario); // Adiciona o novo usuário ao vetor
  console.log('Usuário cadastrado com sucesso!', novoUsuario);
}

// Função para listar usuários
function listarUsuarios() {
  let lista = 'Usuários:';
  usuarios.forEach(user => {
      lista += `<br>ID: ${user.id}<br>, Nome: ${user.nome}<br>, Email: ${user.email}<br>, Tipo: ${user.tipo}<br><br>`;
  });
  //alert(lista); // Exibe a lista em um alerta. Pode ser substituído por outra forma de exibição.
  document.getElementById('listausr').innerHTML = '\n<h2>Lista de Usuários</h2>' + lista + '\n'; // Exibe a lista em um elemento
}

// Função para cadastrar novos usuários (usada na página do administrador)
function cadastrar() {
  const nome = prompt('Digite o nome do usuário:');
  const email = prompt('Digite o email do usuário:');
  const tipo = prompt('Digite o tipo do usuário (aluno ou adm):');
  const senha = prompt('Digite a senha do usuário:');

  if (nome && email && tipo && senha) {
      cadastrarUsuario(nome, email, tipo, senha);
      alert('Usuário cadastrado com sucesso!');
  } else {
      alert('Todos os campos são obrigatórios!');
  }
}