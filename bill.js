/* Billing & Payment - simple cart + checkout. Solid colors, no gradients. */
(function () {
  "use strict";
  var KEY = "matts_artwork_cart_v1";
  var peso = function (n) {
    return new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP", minimumFractionDigits: 2 }).format(n);
  };
  var ART_IMAGES = {
    "Pisa Cathedral Pointilism": "pisa.jpg", "Colosseum Pointilism": "col.jpg",
    "Architectural Two-Storey House": "arch.png", "Animal Portraying": "DOG.png",
    "Leaf Carving": "LEAF.png", "Art Portraying": "lola.jpg", "Anime Art": "anime.jpg",
    "Engr. Ryan Nolasco": "4.png", "Happy Father's Day": "father.jpg",
    "Men's Mental Health": "men.jpg", "Lace Design": "lace.jpg",
    "Midterm Examination": "PUBMATS (19).png", "Mental Health Logo Creation": "Untitled design (2).png",
    "All Soul's Day": "medal (3).png", "Angara Cup: Chess Tournament": "athletes (3).png",
    "All Saint's Day": "medal.png", "Constellation Painting": "CONST.png",
    "Media Literacy Oil Paint": "OIL.png", "Wavy Painting": "PAINT.png", "Scenery Paint": "peynt.jpg"
  };
  var PRICES = {
    "Pisa Cathedral Pointilism": 3500, "Colosseum Pointilism": 3000, "Scenery Paint": 2500,
    "Anime Art": 2500, "Art Portraying": 2500, "Constellation Painting": 3000,
    "Media Literacy Oil Paint": 3500, "Wavy Painting": 2800
  };
  function defaultPrice() { return 2500; }
  function load() { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; } }
  function save(c) { try { localStorage.setItem(KEY, JSON.stringify(c)); } catch (e) {} }
  var cart = load();
  if (!cart.length) {
    cart = [
      { title: "Pisa Cathedral Pointilism", price: 3500, qty: 1 },
      { title: "Colosseum Pointilism", price: 3000, qty: 1 },
      { title: "Scenery Paint", price: 2500, qty: 1 }
    ];
  }
  try {
    var q = new URLSearchParams(window.location.search).get("art");
    if (q) {
      var t = q.trim();
      var found = null;
      for (var i = 0; i < cart.length; i++) { if (cart[i].title.toLowerCase() === t.toLowerCase()) found = cart[i]; }
      if (found) { found.qty += 1; }
      else { cart.push({ title: t, price: PRICES[t] || defaultPrice(), qty: 1 }); }
    }
  } catch (e) {}
  save(cart);

  var cartList = document.getElementById("cartList");
  var summaryItems = document.getElementById("summaryItems");
  var subtotalDisplay = document.getElementById("subtotalDisplay");
  var totalDisplay = document.getElementById("totalDisplay");
  var itemCount = document.getElementById("itemCount");
  var emptyMsg = document.getElementById("emptyMsg");
  var toast = document.getElementById("toast");
  var timer;
  function showToast(m) {
    if (!toast) return;
    toast.textContent = m; toast.classList.add("show");
    clearTimeout(timer); timer = setTimeout(function () { toast.classList.remove("show"); }, 3500);
  }
  function imgFor(t) { return ART_IMAGES[t] || "peynt.jpg"; }
  function totals() {
    var s = 0, c = 0;
    cart.forEach(function (it) { s += it.price * it.qty; c += it.qty; });
    return { subtotal: s, count: c, total: s };
  }
  function render() {
    cartList.innerHTML = "";
    summaryItems.innerHTML = "";
    cart.forEach(function (it, idx) {
      var row = document.createElement("div");
      row.className = "cart-row";
      row.innerHTML = "thumb";
      var thumb = document.createElement("span");
      thumb.className = "cart-thumb";
      var im = document.createElement("img");
      im.src = imgFor(it.title); im.alt = it.title;
      thumb.appendChild(im);
      var info = document.createElement("div");
      info.className = "cart-info";
      var st = document.createElement("strong"); st.textContent = it.title;
      var sm = document.createElement("small"); sm.textContent = "Starting price " + peso(it.price);
      info.appendChild(st); info.appendChild(sm);
      var side = document.createElement("div");
      side.className = "cart-side";
      var pr = document.createElement("span"); pr.className = "cart-price";
      pr.textContent = peso(it.price * it.qty);
      var q = document.createElement("span"); q.className = "qty";
      var minus = document.createElement("button"); minus.type = "button"; minus.className = "qty-btn"; minus.textContent = "-";
      var val = document.createElement("span"); val.className = "qty-value"; val.textContent = it.qty;
      var plus = document.createElement("button"); plus.type = "button"; plus.className = "qty-btn"; plus.textContent = "+";
      minus.addEventListener("click", function () { it.qty = Math.max(1, it.qty - 1); save(cart); render(); });
      plus.addEventListener("click", function () { it.qty = Math.min(99, it.qty + 1); save(cart); render(); });
      q.appendChild(minus); q.appendChild(val); q.appendChild(plus);
      var rm = document.createElement("button"); rm.type = "button"; rm.className = "remove-btn"; rm.textContent = "Remove";
      rm.addEventListener("click", function () { cart.splice(idx, 1); save(cart); render(); });
      side.appendChild(pr); side.appendChild(q); side.appendChild(rm);
      row.textContent = "";
      row.appendChild(thumb); row.appendChild(info); row.appendChild(side);
      cartList.appendChild(row);
      var s = document.createElement("div");
      s.className = "summary-item";
      var a = document.createElement("span"); a.textContent = it.title + " x" + it.qty;
      var b = document.createElement("strong"); b.textContent = peso(it.price * it.qty);
      s.appendChild(a); s.appendChild(b); summaryItems.appendChild(s);
    });
    var t = totals();
    subtotalDisplay.textContent = peso(t.subtotal);
    totalDisplay.textContent = peso(t.total);
    itemCount.textContent = t.count;
    emptyMsg.hidden = cart.length > 0;
  }
  document.getElementById("payBtn").addEventListener("click", function () {
    var name = document.getElementById("fullName").value.trim();
    var email = document.getElementById("email").value.trim();
    var desc = document.getElementById("artCommission").value.trim();
    var date = document.getElementById("deadline").value;
    var agreed = document.getElementById("agree").checked;
    if (!cart.length) return showToast("Your cart is empty. Please add a commission first.");
    if (!name) return showToast("Please enter your name.");
    if (!email || email.indexOf("@") < 0) return showToast("Please enter a valid email.");
    if (!desc) return showToast("Please describe your commission.");
    if (!date) return showToast("Please choose a preferred deadline.");
    if (!agreed) return showToast("Please confirm that prices are estimates.");
    showToast("Commission request submitted. The artist will confirm the final quotation.");
  });
  document.getElementById("downloadBtn").addEventListener("click", function () {
    var t = totals();
    var lines = ["MATT'S ARTWORK - COMMISSION ORDER SUMMARY", "Generated: " + new Date().toLocaleString("en-PH"), "",
      "Name: " + (document.getElementById("fullName").value.trim() || "-"),
      "Email: " + (document.getElementById("email").value.trim() || "-"),
      "Description: " + (document.getElementById("artCommission").value.trim() || "-"),
      "Deadline: " + (document.getElementById("deadline").value || "-"),
      "Payment: " + document.getElementById("payMethod").value, "", "ITEMS"];
    cart.forEach(function (it) { lines.push("- " + it.title + " x" + it.qty + " = " + peso(it.price * it.qty)); });
    lines.push("", "Subtotal: " + peso(t.subtotal), "Delivery: Free", "ESTIMATED TOTAL: " + peso(t.total), "",
      "Estimate only - final quotation to be confirmed by the artist.");
    var blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url; a.download = "commission-order-summary.txt";
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
  });
  render();
})();