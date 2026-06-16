const leftBtn = document.querySelector('.arrow.left');
const rightBtn = document.querySelector('.arrow.right');
const images = document.querySelectorAll('.slide-img');
let i = 0;

function show(n) {
    images[i].classList.remove('active');
    i = (n + images.length) % images.length;
    images[i].classList.add('active');
}

leftBtn.onclick = () => show(i - 1);
rightBtn.onclick = () => show(i + 1);