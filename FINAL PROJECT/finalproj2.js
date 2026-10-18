// CONTENT 3 ARTIST SEP
(function () {
    const cards = Array.from(document.querySelectorAll('#carousel .artisttab'));
    const n = cards.length;
    let current = 0;

    function render() {
        cards.forEach((card, i) => {
            // offset mula -2 hanggang 2 (paikot, kaya may loop)
            const offset = ((i - current + n + 2) % n) - 2;
            card.style.setProperty('--offset', offset);
            card.classList.toggle('active', offset === 0);
            card.classList.toggle('hidden', Math.abs(offset) > 1);
        });
    }

    function go(step) {
        current = (current + step + n) % n;
        render();
    }

    // pindutin ang gilid na card para ilipat ito sa gitna
    cards.forEach((card, i) => {
        card.addEventListener('click', () => {
            if (i !== current) { current = i; render(); }
        });
    });

    // keyboard
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') go(1);
        if (e.key === 'ArrowLeft') go(-1);
    });

    render();
})();

// coontent 4  product ta

// CONTENT 4
const products = [
    { name: "Shoes", artist: "Michael John Santos" , desc: "Comfortable running shoes.", img: "images/michaelart1.jpg" },
    { name: "Bag",   artist: "Michael John Santos",desc: "Leather shoulder bag.",      img: "images/michaelart2.jpg" },
    { name: "Watch", artist: "Michael John Santos",desc: "Classic wristwatch.",        img: "images/michaelart3.jpg" },
    { name: "Hat",   artist: "Michael John Santos",desc: "Soft cotton cap.",           img: "images/michaelart4.jpg" },
    { name: "Shirt", artist: "Michael John Santos",desc: "Plain everyday shirt.",      img: "images/michaelart5.jpg" },
    { name: "Shirt", artist: "Michael John Santos",desc: "Plain everyday shirt.",      img: "images/michaelart6.jpg" },
    { name: "Shirt", artist: "Michael John Santos",desc: "Plain everyday shirt.",      img: "images/mattbianzonart1.jpg" }

    // dagdag ka lang dito, kahit ilan
];

const grid = document.querySelector(".product-grid");
const template = grid.querySelector(".producttab");
template.remove();

// gumawa ng card para sa bawat produkto
const productCards = products.map((p) => {
    const card = template.cloneNode(true);
    const img = card.querySelector(".product-img");
    img.src = p.img;
    img.alt = p.name;
    card.querySelector(".product-name").textContent = p.name;
    card.querySelector(".product-artist").textContent = p.artist;
    card.querySelector(".product-desc").textContent = p.desc;
    return card;
});

grid.replaceChildren(...productCards);