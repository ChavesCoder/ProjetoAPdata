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
  const Email = inp_email.value.trim();
  const Telefone = inp_telefone.value.trim();
  const RazaoSocial = inp_razao.value.trim();
  const CNPJ = inp_CNPJ.value.trim();
  const NomeFantasia = inp_nomeFantasia.value.trim();
  const Endereco = inp_endereco.value.trim();

  // Validação de Email
  const emailValido = /^[^\s@]+@[^\s@]+\.(com|br|com\.br)$/i.test(Email);
  inp_email.style.borderColor = Email === '' ? 'black' : (emailValido ? 'green' : 'red');

  // Validação de Telefone (Celular com 11 dígitos numéricos)
  const telefoneValido = /^\d{11}$/.test(Telefone);
  inp_telefone.style.borderColor = Telefone === '' ? 'black' : (telefoneValido ? 'green' : 'red');

  // Validação de Razão Social (mínimo 3 caracteres)
  const razaoValida = RazaoSocial.length >= 3;
  inp_razao.style.borderColor = RazaoSocial === '' ? 'black' : (razaoValida ? 'green' : 'red');

  // Validação de CNPJ (14 dígitos numéricos)
  const cnpjValido = /^\d{14}$/.test(CNPJ);
  inp_CNPJ.style.borderColor = CNPJ === '' ? 'black' : (cnpjValido ? 'green' : 'red');

  // Validação de Nome Fantasia (mínimo 3 caracteres)
  const nomeFantasiaValido = NomeFantasia.length >= 3;
  inp_nomeFantasia.style.borderColor = NomeFantasia === '' ? 'black' : (nomeFantasiaValido ? 'green' : 'red');

  // Validação de Endereço (mínimo 5 caracteres)
  const enderecoValido = Endereco.length >= 5;
  inp_endereco.style.borderColor = Endereco === '' ? 'black' : (enderecoValido ? 'green' : 'red');
}

var senhaAleatoria = []

let idEmpresa = 0;

function cadastrar2() {
  const RazaoSocial = inp_razao.value.trim();
  const CNPJ = inp_CNPJ.value.trim();
  const NomeFantasia = inp_nomeFantasia.value.trim();
  const Telefone = inp_telefone.value.trim();
  const Email = inp_email.value.trim();
  const Endereco = inp_endereco.value.trim();

  // Validações (mantidas)
  const emailValido = /^[^\s@]+@[^\s@]+\.(com|br|com\.br)$/i.test(Email);
  const telefoneValido = /^\d{11}$/.test(Telefone);
  const cnpjValido = /^\d{14}$/.test(CNPJ);
  const razaoValida = RazaoSocial.length >= 3;
  const nomeFantasiaValido = NomeFantasia.length >= 3;
  const enderecoValido = Endereco.length >= 5;

  if (emailValido && telefoneValido && cnpjValido && razaoValida && nomeFantasiaValido && enderecoValido) {
    // Gerar senha
    const letras = 'abcdefghijklmnopqrstuvwxyz';
    let senhaAleatoria = [];
    for (let i = 1; i <= 10; i++) {
      let num = Math.floor(Math.random() * 10);
      let letra = letras[Math.floor(Math.random() * letras.length)];
      senhaAleatoria.push(i % 2 === 0 ? num : letra);
    }
    senhaAleatoria.push('#', '#');
    let senhaFinal = senhaAleatoria.join('');

    // Enviar para backend
    fetch('/cadastroEmpresa/cadastrar-com-admin', {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        razaoSocial: RazaoSocial,
        nomeFantasia: NomeFantasia,
        cnpj: CNPJ,
        telefone: Telefone,
        email: Email,
        endereco: Endereco,
        senha: senhaFinal
      })
    })
      .then(res => res.json())
      .then(data => {
        const idEmpresa = data.idEmpresa;
        alert(`Empresa e administrador cadastrados com sucesso! O email do administrador é: ${Email} e a senha é: ${senhaFinal}`);

        const tbody = document.getElementById("tableCampo");

        tbody.innerHTML += `
        <tr>
          <td>${idEmpresa}</td>
          <td>${RazaoSocial}</td>
          <td>${NomeFantasia}</td>
          <td>${Email}</td>
          <td>
            <button class="delete-btn">
              <span class="material-symbols-outlined">delete</span>
            </button>
          </td>
        </tr>
      `;

        inp_razao.value = "";
        inp_CNPJ.value = "";
        inp_nomeFantasia.value = "";
        inp_telefone.value = "";
        inp_email.value = "";
        inp_endereco.value = "";

        inp_email.style.borderColor = 'black';
        inp_telefone.style.borderColor = 'black';
        inp_razao.style.borderColor = 'black';
        inp_CNPJ.style.borderColor = 'black';
        inp_nomeFantasia.style.borderColor = 'black';
        inp_endereco.style.borderColor = 'black';

      })
      .catch(err => {
        console.error("Erro:", err);
      });
  } else {
    alert('Por favor, preencha todos os campos corretamente.');
  }
}


function listarEmpresas() {
  fetch("/cadastroEmpresa/listar")
    .then(res => res.json())
    .then(empresas => {
      const tbody = document.getElementById("tableCampo");
      tbody.innerHTML = ""; // limpa antes de adicionar

      empresas.forEach(empresa => {
        tbody.innerHTML += `
          <tr>
            <td>${empresa.idEmpresa}</td>
            <td>${empresa.razaoSocial}</td>
            <td>${empresa.nomeFicticio}</td>
            <td>${empresa.email}</td>
            <td>
               <button class="delete-btn" onclick="excluirEmpresa(${empresa.idEmpresa})">
                <span class="material-symbols-outlined">delete</span>
               </button>
            </td>
          </tr>
        `;
      });
    })
    .catch(err => {
      console.error("Erro ao listar empresas:", err);
    });
}

function excluirEmpresa(idEmpresa) {
  if (!confirm("Tem certeza que deseja excluir esta empresa?")) return;

  fetch(`/cadastroEmpresa/excluir/${idEmpresa}`, {
    method: 'DELETE'
  })
    .then(res => {
      if (res.ok) {
        alert("Empresa excluída com sucesso!");
        listarEmpresas(); // recarrega a tabela
      } else {
        return res.json().then(err => { throw new Error(err.erro); });
      }
    })
    .catch(err => {
      console.error("Erro ao excluir empresa:", err);
      alert("Erro ao excluir empresa.");
    });
}
