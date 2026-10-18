/* Billing & Payment - simple cart + checkout. Solid colors, no gradients. */
(function () {
  "use strict";
  var KEY = "matts_artwork_cart_v1";
  var BILLING_INFO_KEY = "michael_faustino_billing_info_v1";
  var billingFieldIds = [
    "fullName",
    "email",
    "phone",
    "address",
    "city",
    "province",
    "postalCode",
    "payMethod",
  ];
  var peso = function (n) {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 2,
    }).format(n);
  };
  var ART_IMAGES = {
    "Portrait Study of Two Men": "drawing/hatching.jpg",
    "Jaguar Portrait": "drawing/jaguar.jpg",
    "Mountain River Landscape": "drawing/scenary.jpg",
    "Shih Tzu Portrait": "drawing/dog.jpg",
    "Horse Study": "drawing/horse.jpg",
    "Watercolor Portrait of a Man": "drawing/paint.jpg",
    "Graphite Portrait of a Woman": "drawing/women.jpg",
    "Slam Dunk Duo": "drawing/slam dunk.jpg",
    "Frontline Healthcare Workers": "drawing/covid.jpg",
    "Dragon Ball Forms": "drawing/goku 4.jpg",
    "Baki Character Portrait": "drawing/baki 2.jpg",
    "Graphite Portrait": "drawing/portrait 3.jpg",
    "Family Portrait": "drawing/portrait 1.jpg",
    "Portrait of a Man": "drawing/men.jpg",
    "Character Illustration": "drawing/big 4.jpg",
    "Superhero Tribute": "drawing/stan lee 1.jpg",
    "Stan Lee Tribute": "drawing/stan lee 2.jpg",
  };
  var PRICES = {
    "Portrait Study of Two Men": 3500,
    "Jaguar Portrait": 3000,
    "Mountain River Landscape": 2500,
    "Slam Dunk Duo": 2500,
    "Graphite Portrait of a Woman": 2500,
    "Dragon Ball Forms": 3000,
    "Watercolor Portrait of a Man": 3500,
    "Baki Character Portrait": 2800,
  };
  var LEGACY_TITLES = {
    "Pisa Cathedral Pointilism": "Portrait Study of Two Men",
    "Colosseum Pointilism": "Jaguar Portrait",
    "Architectural Two-Storey House": "Mountain River Landscape",
    "Animal Portraying": "Shih Tzu Portrait",
    "Leaf Carving": "Mountain River Landscape",
    "Art Portraying": "Graphite Portrait of a Woman",
    "Anime Art": "Slam Dunk Duo",
    "Engr. Ryan Nolasco": "Graphite Portrait",
    "Happy Father's Day": "Family Portrait",
    "Men's Mental Health": "Portrait of a Man",
    "Lace Design": "Graphite Portrait of a Woman",
    "Midterm Examination": "Frontline Healthcare Workers",
    "Mental Health Logo Creation": "Character Illustration",
    "All Soul's Day": "Superhero Tribute",
    "Angara Cup: Chess Tournament": "Slam Dunk Duo",
    "All Saint's Day": "Stan Lee Tribute",
    "Constellation Painting": "Dragon Ball Forms",
    "Media Literacy Oil Paint": "Watercolor Portrait of a Man",
    "Wavy Painting": "Baki Character Portrait",
    "Scenery Paint": "Mountain River Landscape",
  };
  function defaultPrice() {
    return 2500;
  }
  function load() {
    try {
      return JSON.parse(localStorage.getItem(KEY)) || [];
    } catch (e) {
      return [];
    }
  }
  function save(c) {
    try {
      localStorage.setItem(KEY, JSON.stringify(c));
    } catch (e) {}
  }
  var cart = load();
  cart.forEach(function (item) {
    if (LEGACY_TITLES[item.title]) {
      item.title = LEGACY_TITLES[item.title];
    }
  });
  if (!cart.length) {
    cart = [
      { title: "Portrait Study of Two Men", price: 3500, qty: 1 },
      { title: "Jaguar Portrait", price: 3000, qty: 1 },
      { title: "Mountain River Landscape", price: 2500, qty: 1 },
    ];
  }
  try {
    var q = new URLSearchParams(window.location.search).get("art");
    if (q) {
      var t = q.trim();
      var found = null;
      for (var i = 0; i < cart.length; i++) {
        if (cart[i].title.toLowerCase() === t.toLowerCase()) found = cart[i];
      }
      if (found) {
        found.qty += 1;
      } else {
        cart.push({ title: t, price: PRICES[t] || defaultPrice(), qty: 1 });
      }
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
    toast.textContent = m;
    toast.classList.add("show");
    clearTimeout(timer);
    timer = setTimeout(function () {
      toast.classList.remove("show");
    }, 3500);
  }
  function getBillingInfo() {
    try {
      var saved = localStorage.getItem(BILLING_INFO_KEY);
      if (!saved) return null;
      var info = JSON.parse(saved);
      if (
        !info ||
        typeof info !== "object" ||
        Array.isArray(info) ||
        !billingFieldIds.every(function (id) {
          return typeof info[id] === "string";
        })
      ) {
        showToast(
          "Saved billing details could not be read. Please enter them again.",
        );
        return null;
      }
      return info;
    } catch (e) {
      showToast(
        "Saved billing details could not be read. Please enter them again.",
      );
      return null;
    }
  }
  function saveBillingInfo() {
    var info = {};
    billingFieldIds.forEach(function (id) {
      info[id] = document.getElementById(id).value.trim();
    });
    try {
      localStorage.setItem(BILLING_INFO_KEY, JSON.stringify(info));
      return true;
    } catch (e) {
      return false;
    }
  }
  function removeBillingInfo() {
    try {
      localStorage.removeItem(BILLING_INFO_KEY);
      return true;
    } catch (e) {
      return false;
    }
  }
  function imgFor(t) {
    return ART_IMAGES[t] || "drawing/scenary.jpg";
  }
  function totals() {
    var s = 0,
      c = 0;
    cart.forEach(function (it) {
      s += it.price * it.qty;
      c += it.qty;
    });
    return { subtotal: s, count: c, total: s };
  }
  var saveInfoCheckbox = document.getElementById("saveInfo");
  var savedBillingInfo = getBillingInfo();
  if (savedBillingInfo) {
    billingFieldIds.forEach(function (id) {
      document.getElementById(id).value = savedBillingInfo[id];
    });
    saveInfoCheckbox.checked = true;
  }
  saveInfoCheckbox.addEventListener("change", function () {
    if (!saveInfoCheckbox.checked && !removeBillingInfo()) {
      showToast("Could not remove saved billing details from this browser.");
    }
  });
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
      im.src = imgFor(it.title);
      im.alt = it.title;
      thumb.appendChild(im);
      var info = document.createElement("div");
      info.className = "cart-info";
      var st = document.createElement("strong");
      st.textContent = it.title;
      var sm = document.createElement("small");
      sm.textContent = "Starting price " + peso(it.price);
      info.appendChild(st);
      info.appendChild(sm);
      var side = document.createElement("div");
      side.className = "cart-side";
      var pr = document.createElement("span");
      pr.className = "cart-price";
      pr.textContent = peso(it.price * it.qty);
      var q = document.createElement("span");
      q.className = "qty";
      var minus = document.createElement("button");
      minus.type = "button";
      minus.className = "qty-btn";
      minus.textContent = "-";
      var val = document.createElement("span");
      val.className = "qty-value";
      val.textContent = it.qty;
      var plus = document.createElement("button");
      plus.type = "button";
      plus.className = "qty-btn";
      plus.textContent = "+";
      minus.addEventListener("click", function () {
        it.qty = Math.max(1, it.qty - 1);
        save(cart);
        render();
      });
      plus.addEventListener("click", function () {
        it.qty = Math.min(99, it.qty + 1);
        save(cart);
        render();
      });
      q.appendChild(minus);
      q.appendChild(val);
      q.appendChild(plus);
      var rm = document.createElement("button");
      rm.type = "button";
      rm.className = "remove-btn";
      rm.textContent = "Remove";
      rm.addEventListener("click", function () {
        cart.splice(idx, 1);
        save(cart);
        render();
      });
      side.appendChild(pr);
      side.appendChild(q);
      side.appendChild(rm);
      row.textContent = "";
      row.appendChild(thumb);
      row.appendChild(info);
      row.appendChild(side);
      cartList.appendChild(row);
      var s = document.createElement("div");
      s.className = "summary-item";
      var a = document.createElement("span");
      a.textContent = it.title + " x" + it.qty;
      var b = document.createElement("strong");
      b.textContent = peso(it.price * it.qty);
      s.appendChild(a);
      s.appendChild(b);
      summaryItems.appendChild(s);
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
    var phone = document.getElementById("phone").value.trim();
    var address = document.getElementById("address").value.trim();
    var city = document.getElementById("city").value.trim();
    var province = document.getElementById("province").value.trim();
    var postalCode = document.getElementById("postalCode").value.trim();
    var agreed = document.getElementById("agree").checked;
    if (!cart.length)
      return showToast("Your cart is empty. Please add artwork first.");
    if (!name) return showToast("Please enter your full name.");
    if (!email || email.indexOf("@") < 0)
      return showToast("Please enter a valid email.");
    if (!phone) return showToast("Please enter your phone number.");
    if (!address) return showToast("Please enter your street address.");
    if (!city) return showToast("Please enter your city or municipality.");
    if (!province) return showToast("Please enter your province or region.");
    if (!postalCode) return showToast("Please enter your postal code.");
    if (!agreed) return showToast("Please confirm that prices are estimates.");
    if (saveInfoCheckbox.checked && !saveBillingInfo()) {
      return showToast(
        "Billing details confirmed, but could not save them in this browser.",
      );
    }
    showToast(
      "Billing details confirmed. The artist will contact you to confirm the final quotation and delivery.",
    );
  });
  document.getElementById("downloadBtn").addEventListener("click", function () {
    var t = totals();
    var lines = [
      "MICHAEL FAUSTINO - ORDER BILLING SUMMARY",
      "Generated: " + new Date().toLocaleString("en-PH"),
      "",
      "Name: " + (document.getElementById("fullName").value.trim() || "-"),
      "Email: " + (document.getElementById("email").value.trim() || "-"),
      "Phone: " + (document.getElementById("phone").value.trim() || "-"),
      "Street address: " +
        (document.getElementById("address").value.trim() || "-"),
      "City / municipality: " +
        (document.getElementById("city").value.trim() || "-"),
      "Province / region: " +
        (document.getElementById("province").value.trim() || "-"),
      "Postal code: " +
        (document.getElementById("postalCode").value.trim() || "-"),
      "Payment: " + document.getElementById("payMethod").value,
      "",
      "ITEMS",
    ];
    cart.forEach(function (it) {
      lines.push(
        "- " + it.title + " x" + it.qty + " = " + peso(it.price * it.qty),
      );
    });
    lines.push(
      "",
      "Subtotal: " + peso(t.subtotal),
      "Delivery: Free",
      "ESTIMATED TOTAL: " + peso(t.total),
      "",
      "Estimate only - final quotation and delivery details to be confirmed by the artist.",
    );
    var blob = new Blob([lines.join("\n")], {
      type: "text/plain;charset=utf-8",
    });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = "artwork-billing-summary.txt";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function () {
      URL.revokeObjectURL(url);
    }, 1000);
  });
  render();
})();
