var qtdEmailCorreto = 0;
var qtdCelularCorreto = 0;
var qtdNomeCorreto = 0;

var EmailDefinitivo = '';
var TelefoneDefinitivo = '';
var NomeDefinitivo = '';

var Email = ""
var Telefone = ""
var Nome = ""
var Tipo = ""
var idUser = 0

function validacoes() {
  Email = inp_email.value.trim();
  Telefone = inp_telefone.value.trim();
  Nome = inp_nome.value.trim();

  // Validação de Email
  const emailValido = /^[^\s@]+@[^\s@]+\.(com|br|com\.br)$/i.test(Email);

  if (Email === '') {
    inp_email.style.borderColor = 'black';
    qtdEmailCorreto = 0;
  } else if (emailValido) {
    inp_email.style.borderColor = 'green';
    EmailDefinitivo = Email;
    qtdEmailCorreto = 1;
  } else {
    inp_email.style.borderColor = 'red';
    qtdEmailCorreto = 0;
  }

  // Validação de Telefone
  const telefoneValido = /^\d{11}$/.test(Telefone);

  if (Telefone === '') {
    inp_telefone.style.borderColor = 'black';
    qtdCelularCorreto = 0;
  } else if (telefoneValido) {
    inp_telefone.style.borderColor = 'green';
    TelefoneDefinitivo = Telefone;
    qtdCelularCorreto = 1;
  } else {
    inp_telefone.style.borderColor = 'red';
    qtdCelularCorreto = 0;
  }

  // Validação de Nome
  const nomeValido = /^[A-Za-zÀ-ÿ\s]+$/.test(Nome);

  if (Nome === '') {
    inp_nome.style.borderColor = 'black';
    qtdNomeCorreto = 0;
  } else if (nomeValido) {
    inp_nome.style.borderColor = 'green';
    NomeDefinitivo = Nome;
    qtdNomeCorreto = 1;
  } else {
    inp_nome.style.borderColor = 'red';
    qtdNomeCorreto = 0;
  }
}
var senhaAleatoria = []

function listarFuncionarios() {
  const fkEmpresa = sessionStorage.FK_EMPRESA;

  fetch(`/usuarios/listar-funcionarios?fkEmpresa=${fkEmpresa}`)
    .then(res => res.json())
    .then(dados => {
      const tbody = document.getElementById("tableCampo");
      tbody.innerHTML = ""; // limpa tabela

      dados.forEach(func => {
        tbody.innerHTML += `
                    <tr>
                        <td>${func.idUsuario}</td>
                        <td>${func.tipoUsuario}</td>
                        <td>${func.nome}</td>
                        <td>${func.email}</td>
                        <td>${func.telefone}</td>
                        <td>
               <button class="delete-btn" onclick="deletarPerfil(${func.idUsuario})">
                <span class="material-symbols-outlined">delete</span>
               </button>
            </td>
                    </tr>
                `;
      });
    })
    .catch(erro => console.error("Erro ao listar funcionários:", erro));
}

function deletarPerfil(idUsuario) {
  if (!confirm("Tem certeza que deseja excluir o usuário?")) return;

  fetch(`/usuarios/deletar/${idUsuario}`, {
    method: 'DELETE'
  })
    .then(res => {
      if (res.ok) {
        alert("Usuário excluído com sucesso!");
        listarFuncionarios(); // recarrega a tabela
      } else {
        return res.json().then(err => { throw new Error(err.erro || "Erro desconhecido"); });
      }
    })
    .catch(err => {
      console.error("Erro ao excluir usuário:", err);
      alert("Erro ao excluir usuário.");
    });
}

function redirecionarDash() {
    const fkEmpresa = sessionStorage.getItem("FK_EMPRESA");
  
    if (!fkEmpresa) {
      alert("Você precisa estar logado para continuar.");
      window.location.href = "login.html";
      return;
    }
  
    if (fkEmpresa > "6") {
      window.location.href = "dashboardConstrutora.html";
    } else {
      window.location.href = "dashboard.html";
    }
  };

function cadastrar2() {

  var TipoUser = inp_tipo.value;


  var letras = 'abcdefghijklmnopqrstuvwxyz';

  for (var contador = 1; contador <= 10; contador++) {
    var numeroAleatorio = Math.floor(Math.random() * 10);
    var letraAleatoria = letras[Math.floor(Math.random() * letras.length)];

    if (contador % 2 == 0) {
      senhaAleatoria.push(numeroAleatorio);
    } else {
      senhaAleatoria.push(letraAleatoria);
    }
  }
  senhaAleatoria = senhaAleatoria.concat(['#', '#']);

  var senhaFinal = senhaAleatoria.join('');


  if (qtdEmailCorreto >= 1 && qtdCelularCorreto >= 1 && qtdNomeCorreto >= 1 && TipoUser != 0) {
    idUser++
    cadastrar()
    alert(`Usuário cadastrado com sucesso!\n\nNome: ${Nome}\nEmail: ${Email}\nSenha: ${senhaFinal}`)

    listarFuncionarios();

    // window.location.reload()

    //COLOQUEI AQUI COMO TESTE, MAS O CERTO É RECARREGAR A PAGINA E DEPOIS CHAMAR A FUNÇÃO LISTAR FUNCIONARIOS


  } else {
    alert('Inválido')
  }
}

function cadastrar() {
  // aguardar();
  var TipoUser = inp_tipo.value;

  //Recupere o valor da nova input pelo nome do id
  // Agora vá para o método fetch logo abaixo
  var nomeVar = Nome;
  var emailVar = Email;
  var senhaVar = senhaAleatoria.join('');
  var telefoneVar = Telefone;
  var tipoVar = TipoUser;
  // caso der erro olhe aqui a fkEmpresa
  // var fkEmpresaVar = req.params.fkEmpresa;
  var fkEmpresaVar = sessionStorage.FK_EMPRESA;

  // Enviando o valor da nova input
  fetch("/usuarios/cadastrar", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      // crie um atributo que recebe o valor recuperado aqui
      // Agora vá para o arquivo routes/usuario.js
      nomeServer: nomeVar,
      emailServer: emailVar,
      telefoneServer: telefoneVar,
      senhaServer: senhaVar,
      tipoServer: tipoVar,
      // caso der erro olhe aqui a fkEmpresa
      fkEmpresaServer: fkEmpresaVar
    }),
  })
    .then(function (resposta) {
      console.log("resposta: ", resposta);

      if (resposta.ok) {
        cardErro.style.display = "block";

        mensagem_erro.innerHTML =
          "Cadastro realizado com sucesso! Redirecionando para tela de Login...";

        setTimeout(() => {
          window.location = "entrar.html";
        }, "2000");

        limparFormulario();
        finalizarAguardar();
      } else {
        throw "Houve um erro ao tentar realizar o cadastro!";
      }
    })
    .catch(function (resposta) {
      console.log(`#ERRO: ${resposta}`);
      finalizarAguardar();
    });

  return false;
}