// Simple live search - shows close/relative matches on every letter.
// NEVER moves cards between grids - only hides/shows in place, so section headers stay put.
(function () {
  var box = document.getElementById("artSearch");
  if (!box) return;
  var grids = Array.prototype.slice.call(document.querySelectorAll(".product-grid"));
  var cards = Array.prototype.slice.call(document.querySelectorAll(".product-card"));
  // Each card belongs to its nearest grid
  var cardGrid = new Map();
  cards.forEach(function (c) {
    var g = c.parentElement;
    while (g && !g.classList.contains("product-grid")) g = g.parentElement;
    cardGrid.set(c, g);
  });
  if (!cards.length) {
    box.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && box.value.trim() !== "") {
        window.location.href = "index.html?q=" + encodeURIComponent(box.value.trim());
      }
    });
    return;
  }

  // One message per grid so empty sections collapse cleanly without breaking layout
  var msgs = [];
  grids.forEach(function (g) {
    var m = document.createElement("p");
    m.className = "noResults";
    m.textContent = "No artwork found in this section. Try another keyword.";
    m.style.display = "none";
    g.appendChild(m);
    msgs.push({ grid: g, el: m });
  });

  function clean(s) { return (s || "").toLowerCase().trim(); }

  function cardText(card) {
    var t = "";
    var h = card.querySelector("h2");
    var d1 = card.querySelector(".description");
    var d2 = card.querySelector(".details");
    var im = card.querySelector("img");
    if (h) t += " " + h.textContent;
    if (d1) t += " " + d1.textContent;
    if (d2) t += " " + d2.textContent;
    if (im && im.getAttribute("alt")) t += " " + im.getAttribute("alt");
    return clean(t);
  }
  function cardTitle(card) {
    var h = card.querySelector("h2");
    return clean(h ? h.textContent : "");
  }
  function fuzzyInOrder(text, q) {
    var ti = 0;
    for (var i = 0; i < q.length; i++) {
      ti = text.indexOf(q[i], ti);
      if (ti === -1) return false;
      ti++;
    }
    return true;
  }
  function scoreWord(title, text, w) {
    if (!w) return 0;
    if (title.indexOf(w) === 0) return 100;
    if (title.indexOf(w) !== -1) return 80;
    if (text.indexOf(w) !== -1) return 60;
    if (fuzzyInOrder(title, w)) return 40;
    if (fuzzyInOrder(text, w)) return 20;
    return 0;
  }

  function runSearch() {
    var q = clean(box.value);
    var words = q.split(/\s+/).filter(function (w) { return w !== ""; });
    var counts = new Map();
    grids.forEach(function (g) { counts.set(g, 0); });

    if (!words.length) {
      cards.forEach(function (c) { c.style.display = ""; });
      msgs.forEach(function (m) { m.el.style.display = "none"; });
      return;
    }

    cards.forEach(function (card) {
      var title = cardTitle(card);
      var text = cardText(card);
      var hits = 0;
      words.forEach(function (w) {
        if (scoreWord(title, text, w) > 0) hits++;
      });
      var show = hits > 0;
      card.style.display = show ? "" : "none";
      if (show) {
        var g = cardGrid.get(card);
        if (g) counts.set(g, (counts.get(g) || 0) + 1);
      }
    });

    msgs.forEach(function (m) {
      var n = counts.get(m.grid) || 0;
      m.el.style.display = (n === 0) ? "" : "none";
    });
  }

  try {
    var p = new URLSearchParams(window.location.search).get("q");
    if (p) box.value = p;
  } catch (e) {}
  box.addEventListener("input", runSearch);
  runSearch();
})();


