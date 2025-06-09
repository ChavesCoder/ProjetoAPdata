
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
        alert("E-mail inválido! Por favor, verifique o e-mail digitado.");
        erro.style.display = 'block';
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
                sessionStorage.FK_EMPRESA = json.fkEmpresa;
                sessionStorage.TELEFONE_USUARIO = json.telefone;
                sessionStorage.SENHA_USUARIO = json.senha;
                sessionStorage.TIPO_USUARIO = json.tipoUsuario;

                if (json.fkEmpresa > 6) {
                    setTimeout(function () {
                        window.location = "../dashboardConstrutora.html";
                    }, 1000);
                } else {
                    setTimeout(function () {
                        window.location = "../dashboard.html";
                    }, 1000);
                }


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