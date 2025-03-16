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