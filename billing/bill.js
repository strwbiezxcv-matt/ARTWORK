(function () {
  "use strict";

  const commerce = window.PMCCommerce;
  const database = window.PMCArtDatabase;
  if (!commerce || !database) throw new Error("PMC Art commerce data did not load.");

  const query = new URLSearchParams(window.location.search);
  const mode = query.get("mode") === "direct" ? "direct" : "cart";
  let checkoutId = query.get("checkout");
  if (!checkoutId) {
    checkoutId = window.crypto?.randomUUID?.() ||
      `checkout-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    query.set("checkout", checkoutId);
    const url = new URL(window.location.href);
    url.search = query.toString();
    window.history.replaceState(null, "", url);
  }
  if (!commerce.getSession()) {
    if (mode === "direct" && query.get("art")) commerce.purchaseArtwork(query.get("art"));
    else commerce.checkoutCart();
    return;
  }

  const cartList = document.getElementById("cartList");
  const summaryItems = document.getElementById("summaryItems");
  const subtotalDisplay = document.getElementById("subtotalDisplay");
  const totalDisplay = document.getElementById("totalDisplay");
  const itemCount = document.getElementById("itemCount");
  const emptyMsg = document.getElementById("emptyMsg");
  const toast = document.getElementById("toast");
  const payButton = document.getElementById("payBtn");
  const downloadButton = document.getElementById("downloadBtn");
  const summaryNote = document.querySelector(".summary-note");
  const formFields = ["fullName", "email", "phone", "address", "city", "province", "postalCode"];
  let directItems = [];
  if (mode === "direct") {
    const artwork = database.getArtworkById(query.get("art"));
    directItems = artwork ? [{ artworkId: artwork.id, quantity: 1 }] : [];
  }
  let items = getSelectedItems();
  let toastTimer;

  function getSelectedItems() {
    return mode === "direct" ? directItems : commerce.getCart();
  }

  function parsePrice(price) {
    if (typeof price === "number" && Number.isFinite(price)) return price;
    if (typeof price !== "string" || !/^(?:₱|PHP\s*)?\s*[\d,]+(?:\.\d{1,2})?$/.test(price.trim())) {
      return null;
    }
    const value = Number(price.replace(/[₱,\s]|PHP/gi, ""));
    return Number.isFinite(value) ? value : null;
  }

  function peso(value) {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 2
    }).format(value);
  }

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove("show"), 4000);
  }

  function productRow(artwork, quantity) {
    const row = document.createElement("article");
    row.className = "cart-row";
    row.dataset.artworkId = artwork.id;

    const thumb = document.createElement("span");
    thumb.className = "cart-thumb";
    const image = document.createElement("img");
    image.src = `../${artwork.image}`;
    image.alt = artwork.title;
    thumb.append(image);

    const info = document.createElement("div");
    info.className = "cart-info";
    const title = document.createElement("strong");
    title.textContent = artwork.title;
    const artist = database.getArtistById(artwork.artistId);
    const byline = document.createElement("small");
    byline.textContent = artist?.name || "Artist to be confirmed";
    const price = parsePrice(artwork.price);
    const priceLabel = document.createElement("small");
    priceLabel.textContent = `Price: ${price === null ? commerce.formattedPrice(artwork) : peso(price)}`;
    info.append(title, byline, priceLabel);

    const side = document.createElement("div");
    side.className = "cart-side";
    const quantityControls = document.createElement("div");
    quantityControls.className = "qty";
    const decrease = document.createElement("button");
    decrease.type = "button";
    decrease.className = "qty-btn";
    decrease.dataset.quantityChange = "-1";
    decrease.setAttribute("aria-label", `Decrease quantity of ${artwork.title}`);
    decrease.textContent = "−";
    const quantityValue = document.createElement("span");
    quantityValue.className = "qty-value";
    quantityValue.textContent = String(quantity);
    quantityValue.setAttribute("aria-label", `Quantity: ${quantity}`);
    const increase = document.createElement("button");
    increase.type = "button";
    increase.className = "qty-btn";
    increase.dataset.quantityChange = "1";
    increase.setAttribute("aria-label", `Increase quantity of ${artwork.title}`);
    increase.textContent = "+";
    quantityControls.append(decrease, quantityValue, increase);
    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "remove-btn";
    remove.dataset.removeArtwork = "";
    remove.textContent = "Remove";
    side.append(quantityControls, remove);
    row.append(thumb, info, side);
    return row;
  }

  function render() {
    items = getSelectedItems().filter((item) =>
      item && database.getArtworkById(item.artworkId) &&
      Number.isInteger(item.quantity) && item.quantity > 0
    );
    cartList.replaceChildren();
    summaryItems.replaceChildren();
    let count = 0;
    let total = 0;
    let allPricesKnown = true;

    items.forEach((item) => {
      const artwork = database.getArtworkById(item.artworkId);
      if (!artwork) return;
      const artist = database.getArtistById(artwork.artistId);
      const price = parsePrice(artwork.price);
      count += item.quantity;
      if (price === null) allPricesKnown = false;
      else total += price * item.quantity;

      cartList.append(productRow(artwork, item.quantity));
      const summary = document.createElement("div");
      summary.className = "summary-item";
      const name = document.createElement("span");
      name.textContent = `${artwork.title} · ${artist?.name || "Artist to be confirmed"} × ${item.quantity}`;
      const value = document.createElement("strong");
      value.textContent = price === null ? commerce.formattedPrice(artwork) : peso(price * item.quantity);
      summary.append(name, value);
      summaryItems.append(summary);
    });

    itemCount.textContent = String(count);
    emptyMsg.hidden = items.length > 0;
    const amountText = allPricesKnown && items.length ? peso(total) : "To be confirmed";
    subtotalDisplay.textContent = amountText;
    totalDisplay.textContent = amountText;
    summaryNote.textContent = allPricesKnown
      ? "Estimate only. Final price will be confirmed by the artist."
      : "Price and total will be confirmed by the artist. No payment is processed on this demo page.";
    payButton.disabled = !items.length;
    downloadButton.disabled = !items.length;

    const existing = commerce.getOrders().find((order) => order.checkoutId === checkoutId);
    if (existing) {
      payButton.disabled = true;
      showToast("This order request has already been submitted.");
    }
  }

  function saveItems(nextItems) {
    if (mode === "direct") {
      directItems = nextItems;
      return true;
    }
    if (commerce.setCart(nextItems)) return true;
    showToast("The cart could not be updated in this browser. Please try again.");
    return false;
  }

  cartList.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    const row = button?.closest(".cart-row[data-artwork-id]");
    if (!button || !row) return;
    const artworkId = row.dataset.artworkId;
    const currentItems = getSelectedItems();
    const item = currentItems.find((current) => current.artworkId === artworkId);
    if (!item) return;

    if (button.hasAttribute("data-remove-artwork")) {
      const nextItems = currentItems.filter((current) => current.artworkId !== artworkId);
      if (saveItems(nextItems)) render();
      return;
    }

    const change = Number(button.dataset.quantityChange);
    if (!Number.isInteger(change)) return;
    const nextQuantity = Math.max(1, item.quantity + change);
    const nextItems = currentItems.map((current) =>
      current.artworkId === artworkId ? { ...current, quantity: nextQuantity } : current
    );
    if (saveItems(nextItems)) render();
  });

  function billingDetails() {
    const details = {};
    for (const id of formFields) {
      const value = document.getElementById(id).value.trim();
      if (!value) {
        document.getElementById(id).focus();
        showToast(`Please enter your ${document.querySelector(`label[for="${id}"]`).textContent.toLowerCase()}.`);
        return null;
      }
      details[id] = value;
    }
    if (!document.getElementById("agree").checked) {
      showToast("Please confirm that this is an order request, not a payment.");
      return null;
    }
    return { name: details.fullName, email: details.email };
  }

  const session = commerce.getSession();
  document.getElementById("fullName").value = session.name || "";
  document.getElementById("email").value = session.email || "";

  payButton.addEventListener("click", () => {
    if (payButton.disabled) return;
    const customer = billingDetails();
    if (!customer) return;
    const existing = commerce.getOrders().find((order) => order.checkoutId === checkoutId);
    if (existing) {
      if (mode === "cart") commerce.setCart([]);
      payButton.disabled = true;
      showToast("This order request has already been submitted.");
      return;
    }

    let order;
    try {
      order = commerce.createOrderRequest(items, customer, checkoutId);
    } catch (error) {
      console.error("Unable to submit the local order request.", error);
      showToast("The order request could not be saved. Please try again.");
      return;
    }
    if (!order) {
      showToast("The order request could not be saved. Please try again.");
      return;
    }
    if (mode === "cart" && !commerce.setCart([])) {
      showToast("The request was saved, but the cart could not be cleared in this browser.");
      return;
    }
    payButton.disabled = true;
    showToast("Order request submitted. The artist must confirm availability and price.");
  });

  document.getElementById("downloadBtn").addEventListener("click", () => {
    const lines = [
      "PMC ART - ORDER REQUEST SUMMARY",
      `Generated: ${new Date().toLocaleString("en-PH")}`,
      `Name: ${document.getElementById("fullName").value.trim() || "-"}`,
      `Email: ${document.getElementById("email").value.trim() || "-"}`,
      `Contact: ${document.getElementById("phone").value.trim() || "-"}`,
      `Payment preference: ${document.getElementById("payMethod").value}`,
      "",
      "ARTWORKS"
    ];
    let total = 0;
    let totalKnown = true;
    items.forEach((item) => {
      const artwork = database.getArtworkById(item.artworkId);
      if (!artwork) return;
      const price = parsePrice(artwork.price);
      const artist = database.getArtistById(artwork.artistId);
      lines.push(`- ${artwork.title} by ${artist?.name || "Artist to be confirmed"} × ${item.quantity}: ${price === null ? commerce.formattedPrice(artwork) : peso(price * item.quantity)}`);
      if (price === null) totalKnown = false;
      else total += price * item.quantity;
    });
    lines.push("", `Estimated total: ${totalKnown && items.length ? peso(total) : "To be confirmed"}`, "",
      "Order request only. No payment has been processed.");
    const url = URL.createObjectURL(new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "pmc-art-order-request.txt";
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  });

  render();
})();
