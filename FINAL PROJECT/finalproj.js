document.addEventListener('DOMContentLoaded', () => {

    /* ===== 1. LUCIDE ICONS =====
       Kailangan itong tawagin — dati ay WALANG tumatawag ng createIcons()
       kaya hindi talaga lumalabas ang kahit isang <i data-lucide> sa page. */
    (function renderIcons(attempt) {
        if (window.lucide && typeof window.lucide.createIcons === "function") {
            window.lucide.createIcons();
        } else if (attempt < 40) {          /* ~2s na hintay kung mabagal mag-load */
            setTimeout(() => renderIcons(attempt + 1), 50);
        }
    })(0);

    /* ===== 2. FOCUS EFFECT: blur, zoom, fade ===== */
    const focusSection = document.getElementById('content2');
    const galleryWindow = document.getElementById('gallview');

    const MAX_BLUR = 12;
    const MIN_SCALE = 0.8;
    const MAX_SCALE = 1.06;

    if (focusSection && galleryWindow) {
        let visible = false;
        new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0 })
            .observe(focusSection);

        function updateFocus() {
            if (visible) {
                const area = galleryWindow.getBoundingClientRect();
                const centerY = area.top + area.height / 2;
                const reach = area.height / 2;

                document.querySelectorAll('.gallery').forEach(img => {
                    const r = img.getBoundingClientRect();
                    const imgCenter = r.top + r.height / 2;
                    const dist = Math.min(Math.abs(imgCenter - centerY) / reach, 1);

                    const t = Math.pow(dist, 1.6);
                    const opacity = Math.max(1 - Math.pow(dist, 2.2) * 1.15, 0);

                    img.style.filter = `blur(${(t * MAX_BLUR).toFixed(2)}px)`;
                    img.style.transform = `scale(${(MAX_SCALE - t * (MAX_SCALE - MIN_SCALE)).toFixed(3)})`;
                    img.style.opacity = opacity.toFixed(2);
                });
            }
            requestAnimationFrame(updateFocus);
        }
        requestAnimationFrame(updateFocus);
    } else {
        console.warn('Hindi nahanap: #content2 o #gallview');
    }

    /* ===== 3. HERO SHRINK ===== */
    const heroWrap = document.getElementById('content1animate');
    const heroFrame = document.getElementById('insidecontent1animate');

    const HERO_MIN_SCALE = 0.95;
    const HERO_MAX_RADIUS = 32;

    if (heroWrap && heroFrame) {
        function updateHero() {
            const distance = heroWrap.offsetHeight - window.innerHeight;
            const raw = (window.scrollY - heroWrap.offsetTop) / distance;
            const progress = Math.min(Math.max(raw, 0), 1);
            const eased = 1 - Math.pow(1 - progress, 3);

            const scale = 1 - eased * (1 - HERO_MIN_SCALE);
            heroFrame.style.transform = `scale(${scale.toFixed(4)})`;
            heroFrame.style.borderRadius = `${(eased * HERO_MAX_RADIUS / scale).toFixed(1)}px`;
        }

        window.addEventListener('scroll', updateHero, { passive: true });
        window.addEventListener('resize', updateHero);
        updateHero();
    } else {
        console.warn('Hindi nahanap: #content1animate o #insidecontent1animate');
    }

    /* ===== 4. SCROLL REVEAL (engaging, pero hindi nag-aapekto sa reduced-motion) ===== */
    try {
        const revealTargets = document.querySelectorAll(
            "#aboutustext .about-row, .about-stats, .content3tab, .why-wrap .why-col, " +
            ".center-title, .center-sub, .dots, .left-title, .tags, .art-controls, .c5-left, .feedbackstack"
        );
        if (revealTargets.length && "IntersectionObserver" in window) {
            const io = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        io.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

            revealTargets.forEach((el, i) => {
                el.classList.add("reveal");
                el.style.transitionDelay = (i % 3) * 90 + "ms";
                io.observe(el);
            });
        }
    } catch (err) {
        console.warn("Reveal hindi gumana:", err);
        document.querySelectorAll(".reveal").forEach((el) => el.classList.remove("reveal"));
    }
});




// CONTENT 5: FEEDBACK STACK
(function () {
    const stack = document.getElementById("feedbackstack");
    if (!stack) return;

    const order = Array.from(stack.querySelectorAll(".feedbacktab"));
    let busy = false;

    function render() {
        order.forEach((card, i) => card.style.setProperty("--pos", i));
    }

    function next() {
        if (busy || order.length < 2) return;
        busy = true;
        const front = order[0];
        front.classList.add("leaving");

        setTimeout(() => {
            order.push(order.shift());        // ang nasa harap ay pupunta sa likod
            front.classList.remove("leaving");
            render();
            busy = false;
        }, 280);
    }

    stack.addEventListener("click", next);
    stack.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            next();
        }
    });

    render();
})();


(function () {
    const artworks = [
        { name: "Artname", artist: "Artist name", desc: "Short description", img: "images/michaelart1.jpg" },
        { name: "Artname", artist: "Artist name", desc: "Short description", img: "images/michaelart2.jpg" },
        { name: "Artname", artist: "Artist name", desc: "Short description", img: "images/michaelart3.jpg" },
        { name: "Artname", artist: "Artist name", desc: "Short description", img: "images/michaelart4.jpg" },
        { name: "Artname", artist: "Artist name", desc: "Short description", img: "images/michaelart5.jpg" },
        { name: "Artname", artist: "Artist name", desc: "Short description", img: "images/michaelart6.jpg" },
        { name: "Artname", artist: "Artist name", desc: "Short description", img: "images/mattbianzonart1.jpg" }
    ];

    const row = document.getElementById("artRow");
    const track = document.getElementById("artProgress");
    const thumb = document.getElementById("artThumb");
    const prev = document.getElementById("artPrev");
    const next = document.getElementById("artNext");
    if (!row || !track || !thumb) return;

    const template = row.querySelector(".art-card");
    template.remove();

    row.replaceChildren(...artworks.map((a) => {
        const card = template.cloneNode(true);
        const img = card.querySelector(".art-img");
        img.src = a.img;
        img.alt = a.name;
        card.querySelector(".art-name").textContent = a.name;
        const artistEl = card.querySelector(".art-artist");
        const artistSpan = artistEl && artistEl.querySelector("span");
        if (artistSpan) {
            artistSpan.textContent = a.artist;    /* span lang ang pinalitan — hindi nawawala ang icon */
        } else if (artistEl) {
            artistEl.textContent = a.artist;
        }
        card.querySelector(".art-desc").textContent = a.desc;
        return card;
    }));

    function maxScroll() {
        return row.scrollWidth - row.clientWidth;
    }

    function update() {
        const trackW = track.clientWidth;
        const thumbW = Math.max(trackW * (row.clientWidth / row.scrollWidth), 40);
        const max = maxScroll();
        const pos = max > 0 ? (row.scrollLeft / max) * (trackW - thumbW) : 0;
        thumb.style.width = thumbW + "px";
        thumb.style.left = pos + "px";
    }

    row.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    window.addEventListener("load", update);

    let thumbDrag = false;
    let thumbStartX = 0;
    let thumbStartScroll = 0;

    thumb.addEventListener("pointerdown", (e) => {
        thumbDrag = true;
        thumbStartX = e.clientX;
        thumbStartScroll = row.scrollLeft;
        row.style.scrollSnapType = "none";
        thumb.setPointerCapture(e.pointerId);
        e.stopPropagation();
    });

    thumb.addEventListener("pointermove", (e) => {
        if (!thumbDrag) return;
        const room = track.clientWidth - thumb.clientWidth;
        if (room <= 0) return;
        row.scrollLeft = thumbStartScroll + ((e.clientX - thumbStartX) / room) * maxScroll();
    });

    function endThumb() {
        if (!thumbDrag) return;
        thumbDrag = false;
        row.style.scrollSnapType = "";
    }

    thumb.addEventListener("pointerup", endThumb);
    thumb.addEventListener("pointercancel", endThumb);

    track.addEventListener("click", (e) => {
        if (e.target === thumb) return;
        const rect = track.getBoundingClientRect();
        const room = track.clientWidth - thumb.clientWidth;
        const x = e.clientX - rect.left - thumb.clientWidth / 2;
        row.scrollTo({ left: (x / room) * maxScroll(), behavior: "smooth" });
    });

    let rowDrag = false;
    let rowStartX = 0;
    let rowStartScroll = 0;
    let moved = false;

    row.addEventListener("pointerdown", (e) => {
        if (e.pointerType !== "mouse" || e.target.closest("button")) return;
        rowDrag = true;
        moved = false;
        rowStartX = e.clientX;
        rowStartScroll = row.scrollLeft;
    });

    window.addEventListener("pointermove", (e) => {
        if (!rowDrag) return;
        const dx = e.clientX - rowStartX;
        if (Math.abs(dx) > 4) {
            moved = true;
            row.classList.add("dragging");
        }
        row.scrollLeft = rowStartScroll - dx;
    });

    window.addEventListener("pointerup", () => {
        if (!rowDrag) return;
        rowDrag = false;
        row.classList.remove("dragging");
    });

    function step(dir) {
        const card = row.querySelector(".art-card");
        row.scrollBy({ left: dir * card.offsetWidth, behavior: "smooth" });
    }

    prev.addEventListener("click", () => step(-1));
    next.addEventListener("click", () => step(1));

    row.addEventListener("click", (e) => {
        const buyBtn = e.target.closest(".art-buy");
        if (!buyBtn) return;
        const name = buyBtn.closest(".art-card").querySelector(".art-name").textContent;
        alert("Added to cart: " + name);
    });

    update();
})()


// ================= MEET THE ARTIST CAROUSEL =================
window.addEventListener("load", function () {
    console.log("MTA: nag-start");

    const section = document.getElementById("meetartist");
    if (!section) {
        console.error("MTA: Hindi mahanap ang #meetartist");
        return;
    }

    const nameEl = section.querySelector(".artist-info h2");
    const roleEl = section.querySelector(".artist-info h3");
    const descEl = section.querySelector(".artist-info p");
    const photoEl = section.querySelector(".artist-photo img");
    const postsInner = section.querySelector(".artistposts-inner");
    const dots = section.querySelectorAll(".dot");
    const arrows = section.querySelectorAll(".dot-arrow");

    console.log("MTA elements:", {
        nameEl: !!nameEl,
        roleEl: !!roleEl,
        descEl: !!descEl,
        photoEl: !!photoEl,
        postsInner: !!postsInner,
        dots: dots.length,
        arrows: arrows.length
    });

    if (!nameEl || !roleEl || !descEl || !photoEl || !postsInner || arrows.length < 2) {
        console.error("MTA: May kulang na HTML element");
        return;
    }

    const artists = [
        {
            name: "MATT JULIUS BIANZON",
            role: "Computer Engineer",
            desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.",
            photo: "images/mattbianzonart1.jpg",
            posts: [
                "images/michaelart1.jpg",
                "images/michaelart2.jpg",
                "images/michaelart3.jpg",
                "images/michaelart4.jpg",
                "images/michaelart5.jpg",
                "images/michaelart6.jpg"
            ]
        },
        {
            name: "MICHAEL JOHN SANTOS",
            role: "UI/UX Designer",
            desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
            photo: "images/michaelart1.jpg",
            posts: [
                "images/michaelart2.jpg",
                "images/michaelart3.jpg",
                "images/michaelart4.jpg",
                "images/michaelart5.jpg"
            ]
        },
        {
            name: "ARTIST THREE",
            role: "Illustrator",
            desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            photo: "images/michaelart3.jpg",
            posts: [
                "images/michaelart1.jpg",
                "images/michaelart4.jpg",
                "images/michaelart5.jpg",
                "images/michaelart6.jpg"
            ]
        },
        {
            name: "ARTIST FOUR",
            role: "Painter",
            desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            photo: "images/michaelart4.jpg",
            posts: [
                "images/michaelart1.jpg",
                "images/michaelart2.jpg",
                "images/michaelart5.jpg"
            ]
        },
        {
            name: "ARTIST FIVE",
            role: "Sculptor",
            desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            photo: "images/michaelart5.jpg",
            posts: [
                "images/michaelart1.jpg",
                "images/michaelart2.jpg",
                "images/michaelart6.jpg"
            ]
        },
         {
            name: "ARTIST SIX",
            role: "Sculptor",
            desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            photo: "images/michaelart5.jpg",
            posts: [
                "images/michaelart1.jpg",
                "images/michaelart2.jpg",
                "images/michaelart6.jpg"
            ]
        }
    ];

    let current = 0;

    function showArtist(index) {
        const total = artists.length;
        current = ((index % total) + total) % total;
        const artist = artists[current];

        nameEl.textContent = artist.name;
        const roleSpan = roleEl.querySelector("span");
        if (roleSpan) {
            roleSpan.textContent = artist.role;   /* span lang ang pinalitan — hindi nawawala ang icon */
        } else {
            roleEl.textContent = artist.role;
        }
        descEl.textContent = artist.desc;
        photoEl.src = artist.photo;
        photoEl.alt = artist.name;

        postsInner.innerHTML = "";
        artist.posts.forEach(function (src, i) {
            const img = document.createElement("img");
            img.src = src;
            img.alt = artist.name + " artwork " + (i + 1);
            postsInner.appendChild(img);
        });

        dots.forEach(function (d, i) {
            d.classList.toggle("active", i === current);
        });

        const posts = section.querySelector(".artistposts");
        if (posts) posts.scrollTop = 0;

        console.log("MTA: naka-display na ->", artist.name, "(index " + current + ")");
    }

    section.addEventListener("click", function (e) {
        const arrow = e.target.closest(".dot-arrow");
        const dot = e.target.closest(".dot");

        if (arrow) {
            const label = arrow.getAttribute("aria-label");
            console.log("MTA: arrow click -", label);

            if (label === "Previous artist") {
                showArtist(current - 1);
            } else {
                showArtist(current + 1);
            }
            return;
        }

        if (dot) {
            const allDots = Array.from(section.querySelectorAll(".dot"));
            const idx = allDots.indexOf(dot);
            console.log("MTA: dot click -", idx);
            showArtist(idx);
        }
    });

    showArtist(0);
    console.log("MTA: tapos na mag-initialize");
});