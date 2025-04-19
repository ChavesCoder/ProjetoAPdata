const myObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show')
        } else {
            entry.target.classList.remove('show')
        }
    })
})

const elements = document.querySelectorAll('.hidden')
const menuIcon = document.querySelector('.material-symbols-outlined');

elements.forEach((element) => myObserver.observe(element))

window.addEventListener('scroll', function () {
    const menu = document.getElementById('menu');
    const img = menu.querySelector('img');
    const links = menu.querySelectorAll('a'); 

    if (document.documentElement.scrollTop > 20) {
        menu.classList.add("menuBranco");
        menu.classList.remove("menuTransparente");
        links.forEach(link => {
            link.style.color = "#000";
        });
        img.src = "assets/imgs/logoPreta-semfundo.png";
        menuIcon.style.color = "#000";
    } else {
        menu.classList.add("menuTransparente");
        menu.classList.remove("menuBranco");
        links.forEach(link => {
            link.style.color = "#fff";
        });
        img.src = "assets/imgs/logoBranco-semfundo.png";
        menuIcon.style.color = "#fff";
    }
});

function toggleMenu() {
    const mobileMenu = document.getElementById("mobile-menu");
    mobileMenu.classList.toggle("menu-aberto");
    menuIcon.style.color = "#000";
} 


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


function entrar() {
 //   aguardar();

    var email = email_input.value;
    var senha = senha_input.value;

    if (email == "" || senha == "") {
        cardErro.style.display = "block"
        mensagem_erro.innerHTML = "(Mensagem de erro para todos os campos em branco)";
        //finalizarAguardar();
        return false;
    }
    else {
       // setInterval(sumirMensagem, 5000)
    }

    console.log("FORM LOGIN: ", email);
    console.log("FORM SENHA: ", senha);

    fetch("/usuarios/autenticar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            emailServer: email,
            senhaServer: senha
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
                // sessionStorage.ID_USUARIO = JSON.stringify(json.usuario)

                setTimeout(function () {
                    window.location = "../public/teste.html";
                }, 1000); // apenas para exibir o loading

            });

        } else {

            console.log("Houve um erro ao tentar realizar o login!");

            resposta.text().then(texto => {
                console.error(texto);
               // finalizarAguardar(texto);
            });
        }

    }).catch(function (erro) {
        console.log(erro);
    })

    return false;
}



