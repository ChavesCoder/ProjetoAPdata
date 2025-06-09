window.onload = () => {
    carregarPerfil();

    if (sessionStorage.getItem("TIPO_USUARIO") == "Comum") {
        document.getElementById("cadastroMenu").style.display = "none";
    }
};


function carregarPerfil() {
    const nome = sessionStorage.NOME_USUARIO;
    const email = sessionStorage.EMAIL_USUARIO;
    const telefone = sessionStorage.TELEFONE_USUARIO;
    const senha = sessionStorage.SENHA_USUARIO;

    document.getElementById("nome").value = nome;
    document.getElementById("email").value = email;
    document.getElementById("telefone").value = telefone || "";
    document.getElementById("senha").value = senha;
}

function habilitarEdicao() {
    document.getElementById("nome").disabled = false;
    document.getElementById("email").disabled = false;
    document.getElementById("telefone").disabled = false;
    document.getElementById("senha").disabled = false;
}

function desabilitarCampos() {
    document.getElementById("nome").disabled = true;
    document.getElementById("email").disabled = true;
    document.getElementById("telefone").disabled = true;
    document.getElementById("senha").disabled = true;
}

function redirecionarCadastro() {
    const fkEmpresa = sessionStorage.getItem("FK_EMPRESA");

    if (!fkEmpresa) {
        alert("Você precisa estar logado para continuar.");
        window.location.href = "login.html";
        return;
    }

    if (fkEmpresa == "1") {
        window.location.href = "cadastrarEmpresa.html";
    } else {
        window.location.href = "cadastrarUsuario.html";
    }
};

function atualizarPerfil() {
    const idUsuario = sessionStorage.ID_USUARIO;
    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const telefone = document.getElementById("telefone").value;
    const senha = document.getElementById("senha").value;

    fetch("/usuarios/atualizar", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idUsuario, nome, email, telefone, senha })
    })
        .then(res => {
            if (res.ok) {
                alert("Perfil atualizado com sucesso!");
                sessionStorage.NOME_USUARIO = nome;
                sessionStorage.EMAIL_USUARIO = email;
                sessionStorage.TELEFONE_USUARIO = telefone;
                sessionStorage.SENHA_USUARIO = senha;
            } else {
                return res.text().then(texto => { throw new Error(texto) });
            }
            desabilitarCampos();
        })
        .catch(err => alert("Erro ao atualizar perfil: " + err.message));

}

function deletarPerfil() {
    const idUsuario = sessionStorage.ID_USUARIO;

    if (confirm("Tem certeza que deseja deletar seu perfil? Essa ação é irreversível!")) {
        fetch(`/usuarios/deletar/${idUsuario}`, {
            method: "DELETE"
        })
            .then(res => {
                if (res.ok) {
                    alert("Perfil deletado com sucesso.");
                    sessionStorage.clear();
                    window.location.href = "entrar.html";
                } else {
                    return res.text().then(texto => { throw new Error(texto) });
                }
            })
            .catch(err => alert("Erro ao deletar perfil: " + err.message));
    }
}
