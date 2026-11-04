(function () {
  const setViewportMetrics = () => {
    const width = document.documentElement.clientWidth;
    document.documentElement.style.setProperty("--site-viewport-width", `${width}px`);
    document.documentElement.style.setProperty("--site-viewport-half-width", `${width / 2}px`);
  };
  setViewportMetrics();
  window.addEventListener("resize", setViewportMetrics, { passive: true });
  window.addEventListener("load", setViewportMetrics, { once: true });

  const scriptUrl = document.currentScript?.src || window.location.href;
  const artworkInfoUrl = new URL("nav-tab/artwork tab/artinfo.html", scriptUrl);

  function openArtwork(image) {
    const artworkId = image.dataset.artworkId;
    if (!artworkId) return;

    try {
      window.sessionStorage.setItem("pmc-selected-artwork", artworkId);
    } catch (error) {
      console.error("Unable to save the selected artwork for this navigation.", error);
    }

    const target = new URL(artworkInfoUrl);
    target.searchParams.set("artwork", artworkId);
    window.location.assign(target.href);
  }

  document.addEventListener("click", (event) => {
    const image = event.target.closest?.("img[data-artwork-id]");
    if (image) openArtwork(image);
  });

  document.addEventListener("keydown", (event) => {
    const image = event.target.closest?.('img[data-artwork-id][role="link"]');
    if (!image || (event.key !== "Enter" && event.key !== " ")) return;
    event.preventDefault();
    openArtwork(image);
  });

  const header = document.querySelector(".site-header");
  if (!header) return;

  const updateProgress = () => {
    const artistSelected = header.classList.contains("site-header--artist-aware") &&
      document.body.classList.contains("artist-selected-state");
    const atTop = window.scrollY <= 0;
    if (header.classList.contains("site-header--artist-aware")) {
      header.classList.toggle("site-header--overlay", artistSelected);
    }
    header.classList.toggle("site-header--artist-transparent", artistSelected && atTop);
    const progress = artistSelected
      ? Math.min(Math.max(window.scrollY / 80, 0), 1)
      : header.classList.contains("site-header--solid")
        ? 1
        : Math.min(Math.max(window.scrollY / 300, 0), 1);
    header.style.setProperty("--nav-progress", progress.toFixed(3));
    window.dispatchEvent(new Event("pmc:header-background-change"));
  };

  let ticking = false;
  window.addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        updateProgress();
        ticking = false;
      });
    },
    { passive: true }
  );
  window.addEventListener("resize", updateProgress);
  window.addEventListener("pmc:artist-selection-change", updateProgress);
  updateProgress();

  const currentPath = window.location.pathname.replace(/\/+$/, "");
  header.querySelectorAll(".navbar a").forEach((link) => {
    const linkPath = new URL(link.href, window.location.href).pathname.replace(/\/+$/, "");
    if (linkPath === currentPath) link.setAttribute("aria-current", "page");
  });

  document.querySelectorAll(".tags, .artist-row, .art-row, .pill-row").forEach((scroller) => {
    let dragStart = null;
    let suppressClick = false;

    const startDrag = (event) => {
      if ((event.pointerType && event.pointerType !== "mouse") ||
        event.button !== 0 ||
        scroller.scrollWidth <= scroller.clientWidth ||
        dragStart) return;
      suppressClick = false;
      dragStart = { x: event.clientX, scrollLeft: scroller.scrollLeft, moved: false };
      scroller.classList.add("dragging");
    };

    scroller.addEventListener("pointerdown", startDrag);
    scroller.addEventListener("mousedown", startDrag);

    window.addEventListener("pointermove", (event) => {
      if (!dragStart) return;
      const distance = event.clientX - dragStart.x;
      if (Math.abs(distance) > 5) dragStart.moved = true;
      if (dragStart.moved) {
        event.preventDefault();
        scroller.scrollLeft = dragStart.scrollLeft - distance;
      }
    }, { passive: false });

    const finishDrag = () => {
      if (!dragStart) return;
      suppressClick = dragStart.moved;
      dragStart = null;
      scroller.classList.remove("dragging");
    };

    window.addEventListener("pointerup", finishDrag);
    window.addEventListener("mouseup", finishDrag);
    window.addEventListener("pointercancel", finishDrag);
    scroller.addEventListener("click", (event) => {
      if (!suppressClick) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      suppressClick = false;
    }, true);
  });

  function renderIcons(attempt = 0) {
    if (window.lucide && typeof window.lucide.createIcons === "function") {
      window.lucide.createIcons();
      return;
    }

    if (attempt < 40) window.setTimeout(() => renderIcons(attempt + 1), 50);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => renderIcons(), { once: true });
  } else {
    renderIcons();
  }
})();
