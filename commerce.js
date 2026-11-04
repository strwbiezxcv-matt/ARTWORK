(function () {
  "use strict";

  const SESSION_KEY = "pmc_auth_session_v1";
  const CART_KEY = "pmc_user_carts_v1";
  const ORDERS_KEY = "pmc_user_orders_v1";
  const database = window.PMCArtDatabase;
  const scriptUrl = document.currentScript?.src || window.location.href;
  const siteRoot = new URL(".", scriptUrl);
  const authUrl = new URL("ARTWORK-Mikes/login_signup.html", siteRoot);
  const billingUrl = new URL("billing/bill.html", siteRoot);
  const artworkInfoUrl = new URL("nav-tab/artwork tab/artinfo.html", siteRoot);
  const homeUrl = new URL("finalproj.html", siteRoot);
  let storage = null;
  try {
    storage = window.localStorage;
  } catch (error) {
    console.error("Browser local storage is unavailable.", error);
  }

  function readJson(key, fallback) {
    try {
      if (!storage) throw new Error("Browser local storage is unavailable.");
      const value = storage.getItem(key);
      return value ? JSON.parse(value) : fallback;
    } catch (error) {
      console.error(`Unable to read ${key} from local storage.`, error);
      return fallback;
    }
  }

  function writeJson(key, value) {
    try {
      if (!storage) throw new Error("Browser local storage is unavailable.");
      storage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Unable to save ${key} to local storage.`, error);
      return false;
    }
  }

  function getSession() {
    const session = readJson(SESSION_KEY, null);
    return session && typeof session.id === "string" && typeof session.email === "string"
      ? session
      : null;
  }

  function accountRecords(key) {
    const session = getSession();
    const records = readJson(key, {});
    return session && records && Array.isArray(records[session.id])
      ? records[session.id]
      : [];
  }

  function saveAccountRecords(key, items) {
    const session = getSession();
    if (!session) return false;
    const records = readJson(key, {});
    records[session.id] = items;
    return writeJson(key, records);
  }

  function getCart() {
    return accountRecords(CART_KEY).filter((item) =>
      item && typeof item.artworkId === "string" && Number.isInteger(item.quantity) && item.quantity > 0
    );
  }

  function setCart(items) {
    const cart = items.filter((item) =>
      item && typeof item.artworkId === "string" && Number.isInteger(item.quantity) && item.quantity > 0
    );
    if (!saveAccountRecords(CART_KEY, cart)) return false;
    window.dispatchEvent(new CustomEvent("pmc:cart-change"));
    return true;
  }

  function addToCart(artworkId) {
    if (!database || !database.getArtworkById(artworkId)) return false;
    const cart = getCart();
    const existing = cart.find((item) => item.artworkId === artworkId);
    if (existing) existing.quantity += 1;
    else cart.push({ artworkId, quantity: 1 });
    return setCart(cart);
  }

  function getOrders() {
    return accountRecords(ORDERS_KEY).filter((order) =>
      order && typeof order.id === "string" && Array.isArray(order.items)
    );
  }

  function createOrderRequest(items, customer, checkoutId) {
    const session = getSession();
    if (!session || !database || !items.length) return false;
    const orders = getOrders();
    const previous = orders.find((order) => order.checkoutId === checkoutId);
    if (previous) return previous;
    let total = 0;
    let totalIsKnown = true;
    const orderItems = items.map((item) => {
      const artwork = database.getArtworkById(item.artworkId);
      if (!artwork) throw new Error(`Unknown artwork ID: ${item.artworkId}`);
      const unitPrice = typeof artwork.price === "number" && Number.isFinite(artwork.price)
        ? artwork.price
        : null;
      if (unitPrice === null) totalIsKnown = false;
      else total += unitPrice * item.quantity;
      return {
        artworkId: artwork.id,
        artistId: artwork.artistId,
        quantity: item.quantity,
        unitPrice,
        priceLabel: formattedPrice(artwork)
      };
    });
    const request = {
      id: `request-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      checkoutId,
      status: "Awaiting artist confirmation",
      createdAt: new Date().toISOString(),
      total: totalIsKnown ? total : null,
      customer: {
        name: customer.name,
        email: session.email
      },
      items: orderItems
    };
    orders.unshift(request);
    if (!saveAccountRecords(ORDERS_KEY, orders)) return false;
    window.dispatchEvent(new CustomEvent("pmc:orders-change"));
    return true;
  }

  function formattedPrice(artwork) {
    const price = artwork?.price;
    if (typeof price === "number" && Number.isFinite(price)) {
      return new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(price);
    }
    return typeof price === "string" && price.trim() ? price : "Price to be confirmed";
  }

  function safeSessionStorageSet(key, value) {
    try {
      sessionStorage.setItem(key, value);
    } catch (error) {
      console.error(`Unable to save ${key} for this navigation.`, error);
    }
  }

  function beginAuthentication(action, details, mode = "login") {
    safeSessionStorageSet("pmc-commerce-pending-action", JSON.stringify({
      action,
      ...details,
      returnTo: window.location.href
    }));
    const target = new URL(authUrl);
    target.searchParams.set("view", mode);
    target.searchParams.set("returnTo", window.location.href);
    window.location.assign(target.href);
  }

  function beginPurchase(artworkId) {
    const artwork = database?.getArtworkById(artworkId);
    if (!artwork) {
      console.error(`Cannot purchase unknown artwork ID: ${artworkId}`);
      return;
    }
    safeSessionStorageSet("pmc-selected-artwork", artwork.id);
    if (!getSession()) {
      beginAuthentication("buy", { artworkId });
      return;
    }
    const target = new URL(artworkInfoUrl);
    target.searchParams.set("artwork", artwork.id);
    window.location.assign(target.href);
  }

  function continueArtworkPurchase(artworkId) {
    const artwork = database?.getArtworkById(artworkId);
    if (!artwork) {
      console.error(`Cannot purchase unknown artwork ID: ${artworkId}`);
      return;
    }
    safeSessionStorageSet("pmc-selected-artwork", artwork.id);
    if (!getSession()) {
      beginAuthentication("purchase", { artworkId });
      return;
    }
    const target = new URL(billingUrl);
    target.searchParams.set("mode", "direct");
    target.searchParams.set("art", artwork.id);
    target.searchParams.set("checkout", createCheckoutId());
    window.location.assign(target.href);
  }

  function beginCartCheckout() {
    if (!getSession()) {
      beginAuthentication("checkout-cart", {});
      return;
    }
    const target = new URL(billingUrl);
    target.searchParams.set("mode", "cart");
    target.searchParams.set("checkout", createCheckoutId());
    window.location.assign(target.href);
  }

  function createCheckoutId() {
    return window.crypto?.randomUUID?.() ||
      `checkout-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  }

  function beginInquiry(artistId) {
    const artist = database?.getArtistById(artistId);
    if (artistId !== "all" && !artist) {
      console.error(`Cannot inquire about unknown artist ID: ${artistId}`);
      return;
    }
    if (!getSession()) {
      beginAuthentication("inquire", { artistId });
      return;
    }
    const target = new URL("nav-tab/commission tab/commission.html", siteRoot);
    target.searchParams.set("artist", artist?.id || "all");
    target.searchParams.set("inquire", "1");
    window.location.assign(target.href);
  }

  function makeButton(label, icon, className) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = className;
    button.setAttribute("aria-label", label);
    button.title = label;
    button.innerHTML = `<i data-lucide="${icon}" aria-hidden="true"></i>`;
    return button;
  }

  function setPanelPosition(panel, button) {
    const rect = button.getBoundingClientRect();
    const width = Math.min(360, window.innerWidth - 24);
    panel.style.width = `${width}px`;
    panel.style.top = `${Math.min(rect.bottom + 10, window.innerHeight - 80)}px`;
    panel.style.right = `${Math.max(12, window.innerWidth - rect.right)}px`;
  }

  function initialize() {
    if (!database) {
      console.error("PMC Art database did not load before commerce.js.");
      return;
    }

    document.addEventListener("click", (event) => {
      const buyButton = event.target.closest(".art-buy, #buyArtwork");
      if (buyButton) {
        const isArtworkInfoCard = window.location.pathname.endsWith("/artinfo.html") &&
          buyButton.matches(".art-buy");
        if (isArtworkInfoCard) return;

        const card = buyButton.closest("[data-artwork-id]");
        const artworkId = card?.dataset.artworkId ||
          sessionStorage.getItem("pmc-selected-artwork");
        if (!artworkId) return;
        event.preventDefault();
        event.stopImmediatePropagation();
        if (buyButton.id === "buyArtwork") continueArtworkPurchase(artworkId);
        else beginPurchase(artworkId);
        return;
      }

      const addButton = event.target.closest("#addToCart");
      if (addButton) {
        const artworkId = sessionStorage.getItem("pmc-selected-artwork");
        if (!artworkId) return;
        event.preventDefault();
        event.stopImmediatePropagation();
        if (!getSession()) {
          beginAuthentication("add-to-cart", { artworkId });
          return;
        }
        if (addToCart(artworkId)) showNotice("Artwork added to your cart.");
        return;
      }

      const inquireButton = event.target.closest("[data-action='inquire']");
      if (inquireButton) {
        event.preventDefault();
        event.stopImmediatePropagation();
        const artistId = inquireButton.dataset.artistId ||
          sessionStorage.getItem("pmc-selected-artist") || "all";
        beginInquiry(artistId);
      }
    }, true);

    document.querySelectorAll(".rightbar").forEach((rightbar) => {
      rightbar.replaceChildren();
      const session = getSession();
      if (!session) {
        const login = document.createElement("a");
        login.className = "buttonbar";
        login.textContent = "Login";
        login.href = `${authUrl.href}?view=login&returnTo=${encodeURIComponent(homeUrl.href)}`;
        const signup = document.createElement("a");
        signup.className = "buttonbar";
        signup.textContent = "Sign Up";
        signup.href = `${authUrl.href}?view=signup&returnTo=${encodeURIComponent(homeUrl.href)}`;
        rightbar.append(login, signup);
        return;
      }

      const cartButton = makeButton("Shopping cart", "shopping-cart", "pmc-account-icon");
      const ordersButton = makeButton("Orders", "package-check", "pmc-account-icon");
      const settingsButton = makeButton("Account settings", "settings-2", "pmc-account-icon");
      rightbar.append(cartButton, ordersButton, settingsButton);

      const panel = document.createElement("section");
      panel.className = "pmc-popover";
      panel.hidden = true;
      panel.setAttribute("aria-live", "polite");
      document.body.append(panel);

      const renderPopover = (type) => {
        panel.replaceChildren();
        panel.classList.toggle("pmc-cart-popover", type === "cart");
        const heading = document.createElement("h2");
        heading.textContent = type === "cart" ? "Shopping Cart" : "Orders";
        const list = document.createElement("div");
        list.className = "pmc-popover-list";
        const records = type === "cart" ? getCart() : getOrders();
        if (!records.length) {
          const empty = document.createElement("p");
          empty.className = "pmc-empty-state";
          empty.textContent = type === "cart"
            ? "No artworks have been added to your cart."
            : "No order requests are available.";
          list.append(empty);
        } else if (type === "cart") {
          records.forEach((item) => {
            const artwork = database.getArtworkById(item.artworkId);
            if (artwork) list.append(makeProductRow(artwork, item.quantity, () => {
              setCart(getCart().filter((entry) => entry.artworkId !== item.artworkId));
              renderPopover("cart");
            }));
          });
        } else {
          records.forEach((order) => {
            const orderHeading = document.createElement("p");
            orderHeading.className = "pmc-order-status";
            const total = typeof order.total === "number" && Number.isFinite(order.total)
              ? new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(order.total)
              : "Total to be confirmed";
            orderHeading.textContent = `${order.status} · ${new Date(order.createdAt).toLocaleDateString()} · ${total}`;
            list.append(orderHeading);
            order.items.forEach((item) => {
              const artwork = database.getArtworkById(item.artworkId);
              if (artwork) list.append(makeProductRow(artwork, item.quantity, null, item.priceLabel));
            });
          });
        }
        panel.append(heading, list);

        if (type === "cart") {
          const checkout = document.createElement("button");
          checkout.type = "button";
          checkout.className = "pmc-panel-action";
          checkout.textContent = "Checkout";
          checkout.disabled = !records.length;
          checkout.addEventListener("click", beginCartCheckout);
          panel.append(checkout);
        }
      };

      const togglePopover = (type, button) => {
        const shouldOpen = panel.hidden || panel.dataset.type !== type;
        panel.dataset.type = type;
        if (!shouldOpen) {
          panel.hidden = true;
          return;
        }
        renderPopover(type);
        panel.hidden = false;
        setPanelPosition(panel, button);
      };
      cartButton.addEventListener("click", () => togglePopover("cart", cartButton));
      ordersButton.addEventListener("click", () => togglePopover("orders", ordersButton));
      window.addEventListener("resize", () => {
        if (!panel.hidden) setPanelPosition(panel, panel.dataset.type === "cart" ? cartButton : ordersButton);
      });

      const backdrop = document.createElement("div");
      backdrop.className = "pmc-sidebar-backdrop";
      backdrop.hidden = true;
      const sidebar = document.createElement("aside");
      sidebar.className = "pmc-settings-sidebar";
      sidebar.setAttribute("aria-label", "Account settings");
      sidebar.setAttribute("aria-hidden", "true");
      sidebar.innerHTML = `
        <div class="pmc-sidebar-header">
          <h2>Account Settings</h2>
          <button type="button" class="pmc-close-sidebar" aria-label="Close settings">×</button>
        </div>
        <section class="pmc-account-details">
          <h3>Account</h3>
          <p>${escapeHtml(session.name || "Account holder")}</p>
          <p>${escapeHtml(session.email)}</p>
        </section>
        <section class="pmc-appearance">
          <h3>Appearance</h3>
          <label><span>Light Mode</span><input type="radio" name="pmc-appearance" value="light"></label>
          <label><span>Dark Mode</span><input type="radio" name="pmc-appearance" value="dark"></label>
        </section>
        <button type="button" class="pmc-logout">Log out</button>
        <p class="pmc-local-notice">Account and order data are stored only in this browser demo.</p>`;
      document.body.append(backdrop, sidebar);
      const appearanceOptions = [...sidebar.querySelectorAll('input[name="pmc-appearance"]')];
      const selectedTheme = window.PMCTheme?.getTheme() || "light";
      appearanceOptions.forEach((option) => {
        option.checked = option.value === selectedTheme;
        option.addEventListener("change", () => {
          if (!option.checked) return;
          if (window.PMCTheme?.setTheme(option.value)) return;
          const currentTheme = window.PMCTheme?.getTheme() || "light";
          appearanceOptions.forEach((item) => {
            item.checked = item.value === currentTheme;
          });
          showNotice("Unable to save the appearance preference.");
        });
      });
      const closeSidebar = () => {
        backdrop.hidden = true;
        sidebar.classList.remove("is-open");
        sidebar.setAttribute("aria-hidden", "true");
      };
      settingsButton.addEventListener("click", () => {
        panel.hidden = true;
        backdrop.hidden = false;
        sidebar.classList.add("is-open");
        sidebar.setAttribute("aria-hidden", "false");
      });
      backdrop.addEventListener("click", closeSidebar);
      sidebar.querySelector(".pmc-close-sidebar").addEventListener("click", closeSidebar);
      sidebar.querySelector(".pmc-logout").addEventListener("click", () => {
        try {
          storage.removeItem(SESSION_KEY);
        } catch (error) {
          console.error("Unable to clear the local demo session.", error);
          return;
        }
        window.location.assign(homeUrl.href);
      });

      document.addEventListener("pointerdown", (event) => {
        if (!panel.hidden && !panel.contains(event.target) &&
          event.target !== cartButton && event.target !== ordersButton) panel.hidden = true;
      });
      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
          panel.hidden = true;
          closeSidebar();
        }
      });

      window.addEventListener("pmc:cart-change", () => {
        if (!panel.hidden && panel.dataset.type === "cart") renderPopover("cart");
      });
      window.addEventListener("pmc:orders-change", () => {
        if (!panel.hidden && panel.dataset.type === "orders") renderPopover("orders");
      });
      window.addEventListener("storage", (event) => {
        if (event.key === SESSION_KEY || event.key === CART_KEY || event.key === ORDERS_KEY) {
          window.location.reload();
        }
      });

      document.addEventListener("pmc:request-purchase", (event) => {
        if (event.detail?.artworkId) beginPurchase(event.detail.artworkId);
      });
      document.addEventListener("pmc:request-inquiry", (event) => {
        if (event.detail?.artistId) beginInquiry(event.detail.artistId);
      });
      if (window.lucide?.createIcons) window.lucide.createIcons();
    });

    const pending = readPendingAction();
    if (pending?.action === "add-to-cart" && getSession()) {
      if (addToCart(pending.artworkId)) showNotice("Artwork added to your cart.");
      clearPendingAction();
    }
  }

  function makeProductRow(artwork, quantity, onRemove, priceLabel = formattedPrice(artwork)) {
    const artist = database.getArtistById(artwork.artistId);
    const row = document.createElement("article");
    row.className = "pmc-product-row";
    const image = document.createElement("img");
    image.src = new URL(artwork.image, siteRoot).href;
    image.alt = artwork.title;
    const detail = document.createElement("div");
    detail.className = "pmc-product-detail";
    const title = document.createElement("strong");
    title.textContent = artwork.title;
    const artistName = document.createElement("span");
    artistName.textContent = artist?.name || "Artist to be confirmed";
    const price = document.createElement("span");
    price.textContent = `${priceLabel || formattedPrice(artwork)} · Qty ${quantity}`;
    detail.append(title, artistName, price);
    row.append(image, detail);
    if (onRemove) {
      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "pmc-remove-item";
      remove.textContent = "Remove";
      remove.addEventListener("click", onRemove);
      row.append(remove);
    }
    return row;
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (character) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[character]);
  }

  function showNotice(message) {
    let notice = document.querySelector(".pmc-notice");
    if (!notice) {
      notice = document.createElement("div");
      notice.className = "pmc-notice";
      notice.setAttribute("role", "status");
      document.body.append(notice);
    }
    notice.textContent = message;
    notice.classList.add("is-visible");
    window.setTimeout(() => notice.classList.remove("is-visible"), 2600);
  }

  function readPendingAction() {
    try {
      const value = sessionStorage.getItem("pmc-commerce-pending-action");
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error("Unable to read pending account action.", error);
      return null;
    }
  }

  function clearPendingAction() {
    try {
      sessionStorage.removeItem("pmc-commerce-pending-action");
    } catch (error) {
      console.error("Unable to clear pending account action.", error);
    }
  }

  window.PMCCommerce = Object.freeze({
    sessionKey: SESSION_KEY,
    getSession,
    getArtwork: (id) => database?.getArtworkById(id) || null,
    getArtist: (id) => database?.getArtistById(id) || null,
    getCart,
    setCart,
    addToCart,
    getOrders,
    createOrderRequest,
    formattedPrice,
    purchaseArtwork: beginPurchase,
    checkoutCart: beginCartCheckout,
    readJson,
    writeJson,
    showNotice,
    clearPendingAction,
    getPendingAction: readPendingAction,
    urls: Object.freeze({
      auth: authUrl.href,
      billing: billingUrl.href,
      artworkInfo: artworkInfoUrl.href,
      home: homeUrl.href
    })
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize, { once: true });
  } else {
    initialize();
  }
})();
