(() => {
  const database = window.PMCArtDatabase;
  if (!database) throw new Error("PMC Art database did not load.");

  const gallery = document.getElementById("galleryGrid");
  const artistRow = document.querySelector(".artist-row");
  const artistProgress = document.getElementById("artistProgress");
  const artistProgressThumb = document.getElementById("artistProgressThumb");
  const layout = document.getElementById("Layout1");
  const cover = document.getElementById("artistCover");
  const featuredArtistName = document.querySelector(".footer-left");
  const grid = document.getElementById("artGrid");
  const template = document.getElementById("artTemplate");
  const search = document.querySelector(".search-box input");
  const searchButton = document.querySelector(".search-box .icon-btn");
  const categoryChoices = document.getElementById("artworkCategories");
  const artists = database.getAllArtists();
  let selectedArtistId = "all";
  let searchTerm = "";
  let selectedCategory = "all";

  function markArtworkImage(image, artwork) {
    image.dataset.artworkId = artwork.id;
    image.setAttribute("role", "link");
    image.setAttribute("aria-label", `View ${artwork.title} details`);
    image.tabIndex = 0;
    image.style.cursor = "pointer";
  }

  function renderCategoryChoices() {
    const categories = selectedArtistId === "all"
      ? [...new Set(database.getAllArtworks().map((artwork) => artwork.category))]
      : database.getArtworkCategoriesByArtist(selectedArtistId);
    if (selectedCategory !== "all" && !categories.includes(selectedCategory)) {
      selectedCategory = "all";
    }
    categoryChoices.replaceChildren(...["all", ...categories].map((category) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "tag";
      button.dataset.category = category;
      button.setAttribute("aria-pressed", String(category === selectedCategory));
      button.classList.toggle("active", category === selectedCategory);
      button.textContent = category === "all" ? "All Artworks" : category;
      return button;
    }));
  }

  renderCategoryChoices();

  function makeArtistCard(artist) {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "artist-card";
    card.dataset.artistId = artist.id;
    card.setAttribute("aria-pressed", "false");

    const photo = document.createElement("div");
    photo.className = "artist-photo";
    const image = document.createElement("img");
    if (artist.profilePicture) image.src = `../../${artist.profilePicture}`;
    else image.hidden = true;
    image.alt = artist.profilePicture
      ? `${artist.name} profile picture`
      : `${artist.name} profile picture unavailable`;
    photo.append(image);

    const text = document.createElement("div");
    text.className = "artist-text";
    const name = document.createElement("span");
    name.className = "artist-name";
    name.textContent = artist.name;
    const specialization = document.createElement("span");
    specialization.className = "artist-info";
    specialization.textContent = artist.specialization;
    text.append(name, specialization);
    card.append(photo, text);
    return card;
  }

  const allArtistsCard = document.createElement("button");
  allArtistsCard.type = "button";
  allArtistsCard.className = "artist-card all-artist selected";
  allArtistsCard.dataset.artistId = "all";
  allArtistsCard.setAttribute("aria-pressed", "true");
  const allIcon = document.createElement("img");
  allIcon.src = "../../images/Profile Icon/allartisticon.png";
  allIcon.className = "all-icon";
  allIcon.alt = "";
  const allLabel = document.createElement("span");
  allLabel.textContent = "All Artists";
  allArtistsCard.append(allIcon, allLabel);
  artistRow.replaceChildren(allArtistsCard, ...artists.map(makeArtistCard));

  function updateArtistProgress() {
    if (!artistProgress || !artistProgressThumb) return;
    const trackWidth = artistProgress.clientWidth;
    const maxScroll = Math.max(0, artistRow.scrollWidth - artistRow.clientWidth);
    artistProgress.hidden = maxScroll === 0;
    const thumbWidth = maxScroll
      ? Math.max(trackWidth * (artistRow.clientWidth / artistRow.scrollWidth), 32)
      : trackWidth;
    const thumbPosition = maxScroll
      ? (artistRow.scrollLeft / maxScroll) * (trackWidth - thumbWidth)
      : 0;
    artistProgressThumb.style.width = `${thumbWidth}px`;
    artistProgressThumb.style.left = `${thumbPosition}px`;
    artistProgress.setAttribute("aria-valuenow", String(Math.round(
      maxScroll ? (artistRow.scrollLeft / maxScroll) * 100 : 0
    )));
  }

  if (artistProgress && artistProgressThumb) {
    artistProgress.setAttribute("role", "slider");
    artistProgress.setAttribute("tabindex", "0");
    artistProgress.setAttribute("aria-orientation", "horizontal");
    artistProgress.setAttribute("aria-valuemin", "0");
    artistProgress.setAttribute("aria-valuemax", "100");
    artistProgress.setAttribute("aria-controls", artistRow.id || "artistSelections");
    artistRow.id ||= "artistSelections";

    let progressDrag = null;
    function moveArtistProgress(event) {
      if (!progressDrag || event.pointerId !== progressDrag.pointerId) return;
      const maxThumbPosition = Math.max(0, artistProgress.clientWidth - artistProgressThumb.clientWidth);
      const maxScroll = Math.max(0, artistRow.scrollWidth - artistRow.clientWidth);
      const bounds = artistProgress.getBoundingClientRect();
      const thumbPosition = Math.min(
        Math.max(event.clientX - bounds.left - progressDrag.offset, 0),
        maxThumbPosition
      );
      artistRow.scrollLeft = maxThumbPosition
        ? (thumbPosition / maxThumbPosition) * maxScroll
        : 0;
      updateArtistProgress();
    }

    artistProgress.addEventListener("pointerdown", (event) => {
      if (!event.isPrimary || artistRow.scrollWidth <= artistRow.clientWidth) return;
      event.preventDefault();
      const bounds = artistProgressThumb.getBoundingClientRect();
      progressDrag = {
        pointerId: event.pointerId,
        offset: event.target === artistProgressThumb ? event.clientX - bounds.left : artistProgressThumb.clientWidth / 2
      };
      artistProgress.classList.add("dragging");
      artistProgress.setPointerCapture(event.pointerId);
      moveArtistProgress(event);
    });
    artistProgress.addEventListener("pointermove", moveArtistProgress);
    const finishArtistProgress = (event) => {
      if (!progressDrag || event.pointerId !== progressDrag.pointerId) return;
      progressDrag = null;
      artistProgress.classList.remove("dragging");
    };
    artistProgress.addEventListener("pointerup", finishArtistProgress);
    artistProgress.addEventListener("pointercancel", finishArtistProgress);
    artistProgress.addEventListener("keydown", (event) => {
      const maxScroll = Math.max(0, artistRow.scrollWidth - artistRow.clientWidth);
      if (event.key === "ArrowLeft") artistRow.scrollLeft = Math.max(0, artistRow.scrollLeft - artistRow.clientWidth * 0.1);
      else if (event.key === "ArrowRight") artistRow.scrollLeft = Math.min(maxScroll, artistRow.scrollLeft + artistRow.clientWidth * 0.1);
      else if (event.key === "Home") artistRow.scrollLeft = 0;
      else if (event.key === "End") artistRow.scrollLeft = maxScroll;
      else return;
      event.preventDefault();
      updateArtistProgress();
    });
    artistRow.addEventListener("scroll", updateArtistProgress, { passive: true });
    window.addEventListener("resize", updateArtistProgress);
  }
  updateArtistProgress();

  function matchingArtworks() {
    let records = selectedArtistId === "all"
      ? database.getAllArtworks()
      : database.getArtworksByArtist(selectedArtistId);
    if (searchTerm) {
      records = records.filter((artwork) =>
        `${artwork.title} ${artwork.artist} ${artwork.description}`.toLowerCase().includes(searchTerm)
      );
    }
    if (selectedCategory !== "all") {
      records = records.filter((artwork) => artwork.category === selectedCategory);
    }
    return records;
  }

  function renderFeatured() {
    let records = matchingArtworks();
    if (selectedArtistId === "all") records = database.shuffleArtworks(records);
    records = records.slice(0, 8);
    gallery.replaceChildren();

    if (!records.length) {
      const empty = document.createElement("p");
      empty.className = "gallery-empty";
      empty.textContent = "No artworks match this selection yet.";
      gallery.append(empty);
      return;
    }

    records.forEach((artwork, index) => {
      const item = document.createElement("article");
      item.className = `gallery-item ${index % 8 === 3 || index % 8 === 4 ? "span-3" : "span-2"}`;
      const image = document.createElement("img");
      image.src = `../../${artwork.image}`;
      image.alt = artwork.title;
      markArtworkImage(image, artwork);
      const overlay = document.createElement("div");
      overlay.className = "item-overlay";
      const category = document.createElement("span");
      category.className = "item-tag";
      category.textContent = artwork.category;
      const title = document.createElement("h3");
      title.className = "item-title";
      title.textContent = artwork.title;
      const description = document.createElement("p");
      description.className = "item-desc";
      description.textContent = artwork.description;
      overlay.append(category, title, description);
      item.append(image, overlay);
      gallery.append(item);
    });
  }

  function renderCards() {
    const records = matchingArtworks();
    grid.replaceChildren();
    if (!records.length) {
      const empty = document.createElement("p");
      empty.className = "gallery-empty";
      empty.textContent = "No artworks match this selection yet.";
      grid.append(empty);
      return;
    }

    records.forEach((artwork) => {
      const card = template.cloneNode(true);
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
      card.querySelector(".art-buy").setAttribute("aria-label", `View ${artwork.title} details`);
      grid.append(card);
    });
    if (window.lucide) window.lucide.createIcons({ attrs: { "stroke-width": 1.8 } });
  }

  function selectArtist(artistId, shuffleAll = false) {
    selectedArtistId = artistId;
    artistRow.classList.toggle("has-active", artistId !== "all");
    document.body.classList.toggle("artist-selected-state", artistId !== "all");
    window.dispatchEvent(new Event("pmc:artist-selection-change"));
    artistRow.querySelectorAll(".artist-card").forEach((card) => {
      const selected = card.dataset.artistId === artistId;
      card.classList.toggle("selected", selected);
      card.setAttribute("aria-pressed", String(selected));
    });
    renderCategoryChoices();

    const artist = database.getArtistById(artistId);
    if (artist) {
      if (featuredArtistName) featuredArtistName.textContent = artist.name;
      cover.src = `../../${artist.coverPhoto}`;
      cover.alt = `${artist.name} cover photo`;
      cover.hidden = false;
      layout.classList.add("has-cover");
    } else {
      if (featuredArtistName) featuredArtistName.textContent = "ALL ARTISTS";
      cover.removeAttribute("src");
      cover.hidden = true;
      layout.classList.remove("has-cover");
    }
    renderFeatured(shuffleAll);
    renderCards();
  }

  artistRow.addEventListener("click", (event) => {
    const card = event.target.closest(".artist-card");
    if (card) selectArtist(card.dataset.artistId, card.dataset.artistId === "all");
  });

  search?.addEventListener("input", () => {
    searchTerm = search.value.trim().toLowerCase();
    renderFeatured();
    renderCards();
  });

  categoryChoices.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-category]");
    if (!button) return;
    selectedCategory = button.dataset.category;
    categoryChoices.querySelectorAll("button[data-category]").forEach((choice) => {
      const active = choice === button;
      choice.classList.toggle("active", active);
      choice.setAttribute("aria-pressed", String(active));
    });
    renderCards();
  });

  searchButton?.addEventListener("click", () => search?.focus());

  grid.addEventListener("click", (event) => {
    const button = event.target.closest(".art-buy");
    const card = button?.closest("[data-artwork-id]");
    if (!card) return;
    sessionStorage.setItem("pmc-selected-artwork", card.dataset.artworkId);
    window.location.href = `artinfo.html`;
  });

  selectArtist("all");
})();
