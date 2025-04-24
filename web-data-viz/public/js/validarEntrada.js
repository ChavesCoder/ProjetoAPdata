// carregamento (loading)
//function aguardar() {
//    var divAguardar = document.getElementById("div_aguardar");
//    divAguardar.style.display = "flex";
//}
//
//function finalizarAguardar(texto) {
//    var divAguardar = document.getElementById("div_aguardar");
//    divAguardar.style.display = "none";
//
//    var divErrosLogin = document.getElementById("div_erros_login");
//    if (texto) {
//        divErrosLogin.style.display = "flex";
//        divErrosLogin.innerHTML = texto;
//    }
//}


   
  function validarEmail() {
    const email = document.getElementById('email_input');
    const erro = document.getElementById('erro');
    
    // Validação do e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailValido = emailRegex.test(email.value);
    
    if (email.value === "") {
        // Campo vazio - remove estilos de erro/validação
        email.classList.remove('error');
        email.classList.remove('valid');
        erro.style.display = 'none';
    } else if (!emailValido) {
        // E-mail inválido
        email.classList.add('error');
        email.classList.remove('valid');
        erro.style.display = 'block';
    } else {
        // E-mail válido
        email.classList.remove('error');
        email.classList.add('valid');
        erro.style.display = 'none';
    }
}

function entrar() {
    const email = document.getElementById('email_input');
    const senha = document.getElementById('senha_input');
    const erro = document.getElementById('erro');
    
    // Validação do e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailValido = emailRegex.test(email.value);
    
    if (!emailValido) {
        // E-mail inválido
        email.classList.add('error');
        erro.style.display = 'block';
        alert("E-mail inválido! Por favor, verifique o e-mail digitado.");
        return false;
    }
    
    if (senha.value === "") {
        // Senha vazia
        alert("Por favor, digite sua senha!");
        return false;
    }
    
    // Se passou nas validações, prossegue com a autenticação
    var emailVar = email.value;
    var senhaVar = senha.value;
    
    console.log("FORM LOGIN: ", emailVar);
    console.log("FORM SENHA: ", senhaVar);
    
    fetch("/usuarios/autenticar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            emailServer: emailVar,
            senhaServer: senhaVar
        })
    }).then(function (resposta) {
        console.log("ESTOU NO THEN DO entrar()!")
        
        if (resposta.ok) {
            console.log(resposta);
            
            resposta.json().then(json => {
                console.log(json);
                console.log(JSON.stringify(json));
                sessionStorage.EMAIL_USUARIO = json.email;
                sessionStorage.NOME_USUARIO = json.nome;
                sessionStorage.ID_USUARIO = json.idUsuario;
                
                setTimeout(function () {
                    window.location = "../cadastrarUsuario.html";
                }, 1000);
            });
            
        } else {
            console.log("Houve um erro ao tentar realizar o login!");
            
            resposta.text().then(texto => {
                console.error(texto);
                alert("Erro ao fazer login: " + texto);
            });
        }
        
    }).catch(function (erro) {
        console.log(erro);
        alert("Erro ao conectar com o servidor.");
    })
    
    return false;
}