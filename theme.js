(function () {
  "use strict";

  const THEME_KEY = "pmc_appearance_v1";
  const LEGACY_DARK_MODE_KEY = "pmc_dark_mode_v1";
  const THEMES = new Set(["light", "dark"]);
  const scriptUrl = document.currentScript?.src || window.location.href;
  const siteRoot = new URL(".", scriptUrl);
  const colorCanvas = document.createElement("canvas");
  colorCanvas.width = 1;
  colorCanvas.height = 1;
  const colorContext = colorCanvas.getContext("2d", { willReadFrequently: true });

  function getColorLuminance(color, fallback) {
    if (!colorContext || !color) return fallback;

    colorContext.clearRect(0, 0, 1, 1);
    colorContext.fillStyle = color;
    colorContext.fillRect(0, 0, 1, 1);
    const [red, green, blue, alpha] = colorContext.getImageData(0, 0, 1, 1).data;
    if (!alpha) return fallback;

    return [red, green, blue].reduce((sum, component, index) => {
      const normalized = component / 255;
      const linear = normalized <= 0.04045
        ? normalized / 12.92
        : ((normalized + 0.055) / 1.055) ** 2.4;
      return sum + linear * [0.2126, 0.7152, 0.0722][index];
    }, 0);
  }

  function readTheme() {
    try {
      const savedTheme = window.localStorage.getItem(THEME_KEY);
      if (THEMES.has(savedTheme)) return savedTheme;
      return window.localStorage.getItem(LEGACY_DARK_MODE_KEY) === "true" ? "dark" : "light";
    } catch (error) {
      console.error("Unable to load the saved appearance preference.", error);
      return "light";
    }
  }

  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    window.dispatchEvent(new CustomEvent("pmc:theme-change", { detail: { theme } }));
    syncLogos();
  }

  function syncLogos() {
    const theme = document.documentElement.dataset.theme;
    document.querySelectorAll(".site-header #leftbar img").forEach((image) => {
      const header = image.closest(".site-header");
      const navText = header?.querySelector(".navbar .buttonbar")
        || header?.querySelector("#logo-text");
      const color = navText ? window.getComputedStyle(navText).color : "";
      const luminance = getColorLuminance(color, theme === "dark" ? 1 : 0);
      const source = new URL(
        `icons/pmcicon${luminance > 0.5 ? "white" : "black"}.png`,
        siteRoot
      ).href;
      if (image.src !== source) image.src = source;
    });
    document.querySelectorAll("footer .f-logo img").forEach((image) => {
      const source = new URL("icons/pmciconwhite.png", siteRoot).href;
      if (image.src !== source) image.src = source;
    });
  }

  function setTheme(theme) {
    if (!THEMES.has(theme)) {
      console.error(`Unsupported appearance theme: ${theme}`);
      return false;
    }

    try {
      window.localStorage.setItem(THEME_KEY, theme);
    } catch (error) {
      console.error("Unable to save the appearance preference.", error);
      return false;
    }

    applyTheme(theme);
    return true;
  }

  applyTheme(readTheme());

  window.PMCTheme = Object.freeze({
    key: THEME_KEY,
    getTheme: () => document.documentElement.dataset.theme,
    setTheme
  });

  window.addEventListener("storage", (event) => {
    if (event.key !== THEME_KEY) return;
    const theme = THEMES.has(event.newValue) ? event.newValue : "light";
    applyTheme(theme);
  });
  window.addEventListener("scroll", syncLogos, { passive: true });
  window.addEventListener("pmc:artist-selection-change", syncLogos);
  window.addEventListener("pmc:header-background-change", syncLogos);
  window.addEventListener("DOMContentLoaded", syncLogos, { once: true });

  document.addEventListener("dragstart", (event) => {
    if (event.target instanceof HTMLImageElement) event.preventDefault();
  });

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("img").forEach((image) => {
      image.draggable = false;
    });

    const imageObserver = new MutationObserver((records) => {
      records.forEach((record) => {
        record.addedNodes.forEach((node) => {
          if (!(node instanceof Element)) return;
          if (node instanceof HTMLImageElement) node.draggable = false;
          node.querySelectorAll?.("img").forEach((image) => {
            image.draggable = false;
          });
        });
      });
    });
    imageObserver.observe(document.body, { childList: true, subtree: true });
  }, { once: true });
})();
