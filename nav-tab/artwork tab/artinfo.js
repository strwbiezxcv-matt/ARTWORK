(() => {
  const database = window.PMCArtDatabase;
  if (!database) throw new Error("PMC Art database did not load.");

  const productImage = document.getElementById("productImage");
  const productZoomLens = document.getElementById("productZoomLens");
  const productZoomPreview = document.getElementById("productZoomPreview");
  const productZoomImage = document.getElementById("productZoomImage");
  const productTitle = document.getElementById("productTitle");
  const productArtist = document.getElementById("productArtist");
  const artistName = document.getElementById("artistName");
  const productCategory = document.getElementById("productCategory");
  const productStatus = document.getElementById("productStatus");
  const description = document.getElementById("productDescription");
  const artistProfile = document.getElementById("artistProfile");
  const artistCover = document.getElementById("artistCover");
  const profileName = document.getElementById("artistName");
  const profileSpecialization = document.getElementById("artistSpecialization");
  const profileBio = document.getElementById("artistBio");
  const sameArtistRow = document.getElementById("artRow");
  const sameArtistProgress = document.getElementById("artProgress");
  const sameArtistThumb = document.getElementById("artThumb");
  const sameArtistTemplate = sameArtistRow.querySelector(".art-card");
  const relatedGrid = document.getElementById("artGrid");
  const relatedTemplate = document.getElementById("artTemplate");
  const backButton = document.querySelector(".back-btn");
  const categoryChoices = document.getElementById("artworkCategories");
  let selectedCategory = "all";

  function markArtworkImage(image, artwork) {
    image.dataset.artworkId = artwork.id;
    image.setAttribute("role", "link");
    image.setAttribute("aria-label", `View ${artwork.title} details`);
    image.tabIndex = 0;
    image.style.cursor = "pointer";
  }

  function hideProductZoom() {
    productZoomLens.hidden = true;
    productZoomPreview.hidden = true;
  }

  function updateProductZoom(event) {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches || !productImage.complete) {
      hideProductZoom();
      return;
    }

    const bounds = productImage.getBoundingClientRect();
    const styles = window.getComputedStyle(productImage);
    const borderLeft = parseFloat(styles.borderLeftWidth) || 0;
    const borderRight = parseFloat(styles.borderRightWidth) || 0;
    const borderTop = parseFloat(styles.borderTopWidth) || 0;
    const borderBottom = parseFloat(styles.borderBottomWidth) || 0;
    const paddingLeft = parseFloat(styles.paddingLeft) || 0;
    const paddingRight = parseFloat(styles.paddingRight) || 0;
    const paddingTop = parseFloat(styles.paddingTop) || 0;
    const paddingBottom = parseFloat(styles.paddingBottom) || 0;
    const imageLeft = bounds.left + borderLeft + paddingLeft;
    const imageTop = bounds.top + borderTop + paddingTop;
    const imageWidth = bounds.width - borderLeft - borderRight - paddingLeft - paddingRight;
    const imageHeight = bounds.height - borderTop - borderBottom - paddingTop - paddingBottom;
    if (imageWidth <= 0 || imageHeight <= 0) {
      hideProductZoom();
      return;
    }

    const pointerX = event.clientX - imageLeft;
    const pointerY = event.clientY - imageTop;
    if (pointerX < 0 || pointerX > imageWidth || pointerY < 0 || pointerY > imageHeight) {
      hideProductZoom();
      return;
    }

    productZoomPreview.hidden = false;
    const lensSize = Math.min(100, imageWidth, imageHeight, productZoomPreview.clientWidth / 2);
    const halfLens = lensSize / 2;
    const x = Math.min(Math.max(pointerX, halfLens), imageWidth - halfLens);
    const y = Math.min(Math.max(pointerY, halfLens), imageHeight - halfLens);
    const placeholderBounds = productImage.parentElement.getBoundingClientRect();
    productZoomLens.style.width = `${lensSize}px`;
    productZoomLens.style.height = `${lensSize}px`;
    productZoomLens.style.left = `${imageLeft - placeholderBounds.left + x - halfLens}px`;
    productZoomLens.style.top = `${imageTop - placeholderBounds.top + y - halfLens}px`;
    productZoomLens.hidden = false;

    const scale = productZoomPreview.clientWidth / lensSize;
    productZoomImage.style.width = `${imageWidth * scale}px`;
    productZoomImage.style.height = `${imageHeight * scale}px`;
    productZoomImage.style.left = `${-((x - halfLens) * scale)}px`;
    productZoomImage.style.top = `${-((y - halfLens) * scale)}px`;
  }

  sameArtistTemplate.remove();
  relatedTemplate.remove();

  function makeCarouselCard(artwork) {
    const card = sameArtistTemplate.cloneNode(true);
    card.dataset.artworkId = artwork.id;
    const image = card.querySelector(".art-img");
    image.src = `../../${artwork.image}`;
    image.alt = artwork.title;
    markArtworkImage(image, artwork);
    card.querySelector(".art-name").textContent = artwork.title;
    card.querySelector(".art-artist span").textContent = artwork.artist;
    card.querySelector(".art-desc").textContent = artwork.description;
    return card;
  }

  function makeRelatedCard(artwork) {
    const card = relatedTemplate.cloneNode(true);
    card.removeAttribute("id");
    card.style.display = "flex";
    card.dataset.artworkId = artwork.id;
    const image = card.querySelector(".art-img");
    image.src = `../../${artwork.image}`;
    image.alt = artwork.title;
    markArtworkImage(image, artwork);
    card.querySelector(".art-name").textContent = artwork.title;
    card.querySelector(".product-artist").textContent = artwork.artist;
    card.querySelector(".art-desc").textContent = artwork.description;
    return card;
  }

  function updateSameArtistProgress() {
    if (!sameArtistProgress || !sameArtistThumb) return;
    const trackWidth = sameArtistProgress.clientWidth;
    const thumbWidth = sameArtistRow.scrollWidth
      ? Math.max(trackWidth * (sameArtistRow.clientWidth / sameArtistRow.scrollWidth), 40)
      : trackWidth;
    const maxScroll = Math.max(0, sameArtistRow.scrollWidth - sameArtistRow.clientWidth);
    const thumbPosition = maxScroll
      ? (sameArtistRow.scrollLeft / maxScroll) * (trackWidth - thumbWidth)
      : 0;
    sameArtistThumb.style.width = `${thumbWidth}px`;
    sameArtistThumb.style.left = `${thumbPosition}px`;
    sameArtistProgress.setAttribute("aria-valuenow", String(Math.round(maxScroll
      ? (sameArtistRow.scrollLeft / maxScroll) * 100
      : 0)));
  }

  if (sameArtistProgress && sameArtistThumb) {
    sameArtistProgress.setAttribute("role", "slider");
    sameArtistProgress.setAttribute("tabindex", "0");
    sameArtistProgress.setAttribute("aria-label", "Scroll artworks from the same artist");
    sameArtistProgress.setAttribute("aria-controls", sameArtistRow.id);
    sameArtistProgress.setAttribute("aria-valuemin", "0");
    sameArtistProgress.setAttribute("aria-valuemax", "100");

    let progressDrag = null;
    function moveSameArtistProgress(event) {
      if (!progressDrag || event.pointerId !== progressDrag.pointerId) return;
      const maxThumbPosition = Math.max(0, sameArtistProgress.clientWidth - sameArtistThumb.clientWidth);
      const maxScroll = Math.max(0, sameArtistRow.scrollWidth - sameArtistRow.clientWidth);
      const bounds = sameArtistProgress.getBoundingClientRect();
      const thumbPosition = Math.min(
        Math.max(event.clientX - bounds.left - progressDrag.offset, 0),
        maxThumbPosition
      );
      sameArtistRow.scrollLeft = maxThumbPosition
        ? (thumbPosition / maxThumbPosition) * maxScroll
        : 0;
      updateSameArtistProgress();
    }

    sameArtistProgress.addEventListener("pointerdown", (event) => {
      if (!event.isPrimary || sameArtistRow.scrollWidth <= sameArtistRow.clientWidth) return;
      event.preventDefault();
      const thumbBounds = sameArtistThumb.getBoundingClientRect();
      progressDrag = {
        pointerId: event.pointerId,
        offset: event.target === sameArtistThumb ? event.clientX - thumbBounds.left : sameArtistThumb.clientWidth / 2
      };
      sameArtistProgress.classList.add("dragging");
      sameArtistProgress.setPointerCapture(event.pointerId);
      moveSameArtistProgress(event);
    });
    sameArtistProgress.addEventListener("pointermove", moveSameArtistProgress);
    const finishSameArtistProgress = (event) => {
      if (!progressDrag || event.pointerId !== progressDrag.pointerId) return;
      progressDrag = null;
      sameArtistProgress.classList.remove("dragging");
    };
    sameArtistProgress.addEventListener("pointerup", finishSameArtistProgress);
    sameArtistProgress.addEventListener("pointercancel", finishSameArtistProgress);
    sameArtistProgress.addEventListener("keydown", (event) => {
      const maxScroll = Math.max(0, sameArtistRow.scrollWidth - sameArtistRow.clientWidth);
      if (event.key === "ArrowLeft") sameArtistRow.scrollBy({ left: -sameArtistRow.clientWidth * 0.1, behavior: "smooth" });
      else if (event.key === "ArrowRight") sameArtistRow.scrollBy({ left: sameArtistRow.clientWidth * 0.1, behavior: "smooth" });
      else if (event.key === "Home") sameArtistRow.scrollTo({ left: 0, behavior: "smooth" });
      else if (event.key === "End") sameArtistRow.scrollTo({ left: maxScroll, behavior: "smooth" });
      else return;
      event.preventDefault();
    });
    sameArtistRow.addEventListener("scroll", updateSameArtistProgress, { passive: true });
    window.addEventListener("resize", updateSameArtistProgress);
  }

  function renderArtwork(artwork) {
    function renderList(container, value, listType, fallback) {
      const items = String(value || "")
        .split(/\r?\n|•/)
        .map((item) => item.trim())
        .filter(Boolean);

      if (items.length === 0) {
        container.textContent = fallback;
        return;
      }

      const list = document.createElement(listType);
      items.forEach((text) => {
        const item = document.createElement("li");
        item.textContent = text;
        list.append(item);
      });
      container.replaceChildren(list);
    }

    if (!artwork) return;
    const artist = database.getArtistById(artwork.artistId);
    if (!artist) throw new Error(`Missing artist record for artwork ${artwork.title}.`);

    selectedCategory = "all";
    sessionStorage.setItem("pmc-selected-artwork", artwork.id);
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set("artwork", artwork.id);
    window.history.replaceState(null, "", currentUrl);
    productImage.src = `../../${artwork.image}`;
    productZoomImage.src = `../../${artwork.image}`;
    hideProductZoom();
    productImage.alt = artwork.title;
    markArtworkImage(productImage, artwork);
    productTitle.textContent = artwork.title;
    productArtist.textContent = artist.name;
    artistName.textContent = artist.name;
    productCategory.textContent = artwork.category;
    description.replaceChildren();
    const storyHeading = document.createElement("p");
    storyHeading.textContent = "Story behind the artwork";
    const shortDescription = document.createElement("p");
    shortDescription.textContent = artwork.description || "Description not provided yet.";
    const story = document.createElement("p");
    story.textContent = artwork.story || "Story not provided yet.";
    description.append(storyHeading, shortDescription, story);
    renderList(
      document.getElementById("productInfo"),
      artwork.productInfo, "ul"
    );
    renderList(
      document.getElementById("productMaterials"),
      artwork.materials, "ul"
    );
    const price = typeof artwork.price === "number" && Number.isFinite(artwork.price)
      ? new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(artwork.price)
      : typeof artwork.price === "string" && artwork.price.trim()
        ? artwork.price.trim()
        : "Price not provided yet.";
    const availability = typeof artwork.availability === "string" && artwork.availability.trim()
      ? artwork.availability.trim()
      : "Availability not provided yet.";
    productStatus.textContent = availability;
    document.getElementById("productPrice").textContent = `${price} · ${availability}`;
    artistProfile.hidden = !artist.profilePicture;
    if (artist.profilePicture) artistProfile.src = `../../${artist.profilePicture}`;
    else artistProfile.removeAttribute("src");
    artistProfile.alt = artist.profilePicture
      ? `${artist.name} profile picture`
      : `${artist.name} profile picture unavailable`;
    artistCover.src = `../../${artist.coverPhoto}`;
    artistCover.alt = `${artist.name} cover photo`;
    profileSpecialization.textContent = artist.specialization;
    profileBio.textContent = artist.description;
    const commissionLink = document.getElementById("artistCommissionLink");
    commissionLink.onclick = () => sessionStorage.setItem("pmc-selected-artist", artist.id);

    const categories = database.getArtworkCategoriesByArtist(artist.id);
    const categoryButtons = ["all", ...categories].map((category) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "tag";
      button.dataset.category = category;
      button.setAttribute("aria-pressed", String(category === "all"));
      button.textContent = category === "all" ? "All Artworks" : category;
      if (category === "all") button.classList.add("active");
      return button;
    });
    categoryChoices.replaceChildren(...categoryButtons);
    renderSameArtistArtworks(artist.id, artwork.id);

    const recommendations = database.getAllArtworks().filter((item) => item.id !== artwork.id);
    relatedGrid.replaceChildren(...recommendations.map(makeRelatedCard));
    if (window.lucide) window.lucide.createIcons({ attrs: { "stroke-width": 1.8 } });
  }

  function renderSameArtistArtworks(artistId, currentArtworkId) {
    let artworks = selectedCategory === "all"
      ? database.getArtworksByArtist(artistId)
      : database.getArtworksByArtistAndCategory(artistId, selectedCategory);
    artworks = artworks.filter((item) => item.id !== currentArtworkId);
    sameArtistRow.replaceChildren(...artworks.map(makeCarouselCard));
    updateSameArtistProgress();
  }

  categoryChoices.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-category]");
    if (!button) return;
    selectedCategory = button.dataset.category;
    categoryChoices.querySelectorAll("button[data-category]").forEach((choice) => {
      const active = choice === button;
      choice.classList.toggle("active", active);
      choice.setAttribute("aria-pressed", String(active));
    });
    const currentArtwork = database.getArtworkById(sessionStorage.getItem("pmc-selected-artwork"));
    if (currentArtwork) renderSameArtistArtworks(currentArtwork.artistId, currentArtwork.id);
  });

  function chooseArtworkFromEvent(event) {
    const button = event.target.closest(".art-buy");
    const card = button?.closest("[data-artwork-id]");
    if (!card) return;
    const artwork = database.getArtworkById(card.dataset.artworkId);
    if (artwork) {
      renderArtwork(artwork);
      if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        document.querySelector(".main-product-section").animate(
          [{ opacity: 0.75, transform: "translateY(6px)" }, { opacity: 1, transform: "translateY(0)" }],
          { duration: 220, easing: "ease-out" }
        );
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  sameArtistRow.addEventListener("click", chooseArtworkFromEvent);
  relatedGrid.addEventListener("click", chooseArtworkFromEvent);
  productImage.addEventListener("mouseenter", updateProductZoom);
  productImage.addEventListener("mousemove", updateProductZoom);
  productImage.addEventListener("mouseleave", hideProductZoom);
  window.addEventListener("resize", hideProductZoom);
  document.getElementById("addToCart").addEventListener("click", () => {
    const artwork = database.getArtworkById(sessionStorage.getItem("pmc-selected-artwork"));
    if (artwork) window.alert(`${artwork.title}: ${artwork.availability}`);
  });
  document.getElementById("buyArtwork").addEventListener("click", () => {
    window.alert("Checkout is not configured. Please inquire with the artist for current availability.");
  });
  backButton.addEventListener("click", () => {
    window.location.href = "artwork.html";
  });

  const requestedId = new URLSearchParams(window.location.search).get("artwork");
  const savedId = sessionStorage.getItem("pmc-selected-artwork");
  const requestedArtwork = requestedId ? database.getArtworkById(requestedId) : null;
  if (requestedId && !requestedArtwork) {
    console.error(`Cannot display unknown artwork ID: ${requestedId}`);
    productTitle.textContent = "Artwork unavailable";
  } else {
    renderArtwork(requestedArtwork || database.getArtworkById(savedId) || database.getAllArtworks()[0]);
  }

  const previous = document.getElementById("artPrev");
  const next = document.getElementById("artNext");
  previous?.addEventListener("click", () => sameArtistRow.scrollBy({ left: -sameArtistRow.clientWidth * 0.8, behavior: "smooth" }));
  next?.addEventListener("click", () => sameArtistRow.scrollBy({ left: sameArtistRow.clientWidth * 0.8, behavior: "smooth" }));
})();
