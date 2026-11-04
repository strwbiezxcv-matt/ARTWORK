(() => {
  const database = window.PMCArtDatabase;
  if (!database) throw new Error("PMC Art database did not load.");

  const artists = database.getAllArtists();
  const track = document.getElementById("track");
  const hero = document.getElementById("hero");
  const heroCover = document.getElementById("heroCover");
  const thumb = document.getElementById("thumb");
  const profile = document.getElementById("artistProfileView");
  const commissionGrid = document.querySelector(".commission-grid");
  const generalView = document.getElementById("generalCommissionView");
  const columns = [...commissionGrid.querySelectorAll(".ccol")];
  const modalOverlay = document.getElementById("modalOverlay");
  const commissionModal = document.getElementById("modalCommission");
  const inquireModal = document.getElementById("modalInquire");
  const commissionSlideshowImage = document.getElementById("commissionSlideshowImage");
  const inquireArtistProfile = document.getElementById("inquireArtistProfile");
  let selectedArtistId = "all";
  let activeIndex = 0;
  let selectedCommissionType = "";
  const slideshowPositions = new Map();
  let slideshowArtworks = [];
  let slideshowPositionKey = "";
  let slideshowTimer = null;
  let slideshowSwapTimer = null;
  let slideshowToken = 0;
  let slideshowPaused = false;
  let carouselDragStart = null;
  let suppressCarouselClick = false;
  let carouselClickResetTimer = null;

  function getCardLogoSource() {
    return document.documentElement.dataset.theme === "dark"
      ? "../../icons/pmciconwhite.png"
      : "../../icons/pmciconblack.png";
  }

  function makeCardLogo() {
    const image = document.createElement("img");
    image.className = "card-logo";
    image.src = getCardLogoSource();
    image.alt = "";
    return image;
  }

  function updateCardLogos() {
    const source = getCardLogoSource();
    track.querySelectorAll(".card-logo").forEach((image) => {
      image.src = source;
    });
  }

  function makeArtistCard(artist) {
    const card = document.createElement("article");
    card.className = "card";
    card.dataset.artistId = artist.id;
    const image = document.createElement("img");
    image.className = "card-img";
    if (artist.profilePicture) image.src = `../../${artist.profilePicture}`;
    else image.hidden = true;
    image.alt = artist.profilePicture
      ? `${artist.name} profile picture`
      : `${artist.name} profile picture unavailable`;
    const title = document.createElement("h3");
    title.textContent = artist.name;
    const label = document.createElement("span");
    label.className = "card-link";
    label.textContent = "View artist";
    const link = document.createElement("a");
    link.href = "#";
    link.className = "card-btn";
    link.setAttribute("aria-label", `Select ${artist.name}`);
    link.innerHTML = '<svg viewBox="0 0 32 32"><rect x="3" y="6" width="22" height="18" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="m5 21 6-7 4 5 3-3 6 6" fill="none" stroke="currentColor" stroke-width="2"/></svg>';
    card.append(image, title, makeCardLogo(), label, link);
    return card;
  }

  const allCard = document.createElement("article");
  allCard.className = "card card-all";
  allCard.dataset.artistId = "all";
  const allImage = document.createElement("img");
  allImage.className = "card-img";
  allImage.src = "../../images/Profile Icon/allartisticon.png";
  allImage.alt = "";
  const allTitle = document.createElement("h3");
  allTitle.textContent = "All Artists";
  const allLabel = document.createElement("span");
  allLabel.className = "card-link";
  allLabel.textContent = "General information";
  const allLink = document.createElement("a");
  allLink.href = "#";
  allLink.className = "card-btn";
  allLink.setAttribute("aria-label", "Select all artists");
  allLink.innerHTML = '<svg viewBox="0 0 32 32"><rect x="3" y="6" width="22" height="18" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="m5 21 6-7 4 5 3-3 6 6" fill="none" stroke="currentColor" stroke-width="2"/></svg>';
  allCard.append(allImage, allTitle, makeCardLogo(), allLabel, allLink);
  track.replaceChildren(allCard, ...artists.map(makeArtistCard));
  updateCardLogos();
  window.addEventListener("pmc:theme-change", updateCardLogos);
  const cards = [...track.querySelectorAll(".card")];
  const carouselProgress = thumb.parentElement;

  function updateCarousel() {
    const count = cards.length;
    cards.forEach((card, index) => {
      let distance = ((index - activeIndex) % count + count) % count;
      if (distance > count / 2) distance -= count;
      card.style.setProperty("--d", distance);
      card.dataset.dist = String(Math.min(Math.abs(distance), 3));
      card.classList.toggle("is-active", distance === 0);
    });
    const max = Math.max(0, carouselProgress.clientWidth - thumb.clientWidth);
    thumb.style.left = `${(count > 1 ? activeIndex / (count - 1) : 0) * max}px`;
    carouselProgress.setAttribute("aria-valuenow", String(activeIndex + 1));
  }

  carouselProgress.setAttribute("role", "slider");
  carouselProgress.setAttribute("tabindex", "0");
  carouselProgress.setAttribute("aria-label", "Select an artist");
  carouselProgress.setAttribute("aria-controls", track.id);
  carouselProgress.setAttribute("aria-valuemin", "1");
  carouselProgress.setAttribute("aria-valuemax", String(cards.length));

  let progressDrag = null;
  function selectFromProgress(event) {
    if (!progressDrag || event.pointerId !== progressDrag.pointerId) return;
    const maxThumbPosition = Math.max(0, carouselProgress.clientWidth - thumb.clientWidth);
    const bounds = carouselProgress.getBoundingClientRect();
    const thumbPosition = Math.min(
      Math.max(event.clientX - bounds.left - progressDrag.offset, 0),
      maxThumbPosition
    );
    activeIndex = maxThumbPosition
      ? Math.round((thumbPosition / maxThumbPosition) * (cards.length - 1))
      : 0;
    updateCarousel();
  }

  carouselProgress.addEventListener("pointerdown", (event) => {
    if (!event.isPrimary || cards.length < 2) return;
    event.preventDefault();
    const thumbBounds = thumb.getBoundingClientRect();
    progressDrag = {
      pointerId: event.pointerId,
      offset: event.target === thumb ? event.clientX - thumbBounds.left : thumb.clientWidth / 2
    };
    carouselProgress.classList.add("dragging");
    carouselProgress.setPointerCapture(event.pointerId);
    selectFromProgress(event);
  });
  carouselProgress.addEventListener("pointermove", selectFromProgress);
  carouselProgress.addEventListener("pointerup", (event) => {
    if (!progressDrag || event.pointerId !== progressDrag.pointerId) return;
    progressDrag = null;
    carouselProgress.classList.remove("dragging");
    setSelectedArtist(cards[activeIndex].dataset.artistId);
  });
  carouselProgress.addEventListener("pointercancel", (event) => {
    if (!progressDrag || event.pointerId !== progressDrag.pointerId) return;
    progressDrag = null;
    carouselProgress.classList.remove("dragging");
    activeIndex = Math.max(0, cards.findIndex((card) => card.dataset.artistId === selectedArtistId));
    updateCarousel();
  });
  carouselProgress.addEventListener("keydown", (event) => {
    let nextIndex = activeIndex;
    if (event.key === "ArrowLeft") nextIndex = Math.max(0, activeIndex - 1);
    else if (event.key === "ArrowRight") nextIndex = Math.min(cards.length - 1, activeIndex + 1);
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = cards.length - 1;
    else return;
    event.preventDefault();
    setSelectedArtist(cards[nextIndex].dataset.artistId);
  });

  function setText(selector, value) {
    const element = document.querySelector(selector);
    if (element) element.textContent = value;
  }

  function populateSocials(container, socials) {
  container.querySelectorAll(".social-extra").forEach((el) => el.remove());

  container.querySelectorAll("[data-social]").forEach((link) => {
    const key = link.dataset.social;
    const value = socials[key];
    const href = key === "email" && value ? `mailto:${value}` : value;
    link.hidden = !href;
    if (href) {
      link.href = href;
      if (key === "email") {
        link.removeAttribute("target");
        link.removeAttribute("rel");
      } else {
        link.target = "_blank";
        link.rel = "noopener noreferrer";
      }
    } else {
      link.removeAttribute("href");
    }
  });

  // dagdag na socials ng artist (socials.other) — text button lang
  (socials.other || []).forEach((social) => {
    if (!social.url) return;
    const link = document.createElement("a");
    link.className = "social social-extra";
    link.href = social.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = social.label;
    container.append(link);
  });
}

  function renderProfile(artist) {
    setText("#profileName", artist.name);
    setText("#profileRole", artist.specialization);
    setText("#profileBio", artist.description);
    populateSocials(document.getElementById("profileSocials"), database.getArtistSocials(artist.id));

    const thumbs = document.querySelector(".thumbs");
    const avatar = document.createElement("img");
    if (artist.profilePicture) avatar.src = `../../${artist.profilePicture}`;
    avatar.alt = artist.profilePicture
      ? `${artist.name} profile picture`
      : `${artist.name} profile picture unavailable`;
    avatar.className = "profile-avatar";
    const avatarFrame = document.createElement("div");
    avatarFrame.className = "ph profile-avatar-frame";
    avatarFrame.append(avatar);
    thumbs.replaceChildren(avatarFrame);

    const artworks = database.getArtworksByArtist(artist.id);
    const profileColumns = [...document.querySelectorAll(".profile-right .mcol")];
    profileColumns.forEach((column, columnIndex) => {
      column.replaceChildren();
      const columnArtworks = artworks.filter((_, index) => index % profileColumns.length === columnIndex);
      const repeated = columnArtworks.length ? [...columnArtworks, ...columnArtworks] : [];
      repeated.forEach((artwork) => {
        const frame = document.createElement("div");
        frame.className = "ph";
        const image = document.createElement("img");
        image.src = `../../${artwork.image}`;
        image.alt = artwork.title;
        frame.append(image);
        column.append(frame);
      });
      if (!artworks.length && columnIndex === 0) {
        const empty = document.createElement("p");
        empty.textContent = "No artworks listed yet.";
        column.append(empty);
      }
    });
  }

  function makeCommissionCard(type, artist, index) {
    const card = document.createElement("article");
    card.className = "ccard";
    const imageFrame = document.createElement("div");
    const imageShape = ["cimg--square", "cimg--portrait", "cimg--landscape"][index % 3];
    imageFrame.className = `ph cimg ${imageShape}`;
    const [matchingArt] = database.getArtworksByArtistAndCategory(artist.id, type);
    if (matchingArt) {
      const image = document.createElement("img");
      image.src = `../../${matchingArt.image}`;
      image.alt = `${type} example`;
      imageFrame.append(image);
    }
    const bar = document.createElement("div");
    bar.className = "cbar";
    const heading = document.createElement("h3");
    heading.textContent = type;
    const buttons = document.createElement("div");
    buttons.className = "cbtns";
    const info = document.createElement("button");
    info.type = "button";
    info.className = "pill pill-sm";
    info.dataset.action = "commission-info";
    info.dataset.commissionType = type;
    info.textContent = "Commission Info";
    const inquire = document.createElement("button");
    inquire.type = "button";
    inquire.className = "pill";
    inquire.dataset.action = "inquire";
    inquire.textContent = "Inquire";
    buttons.append(info, inquire);
    bar.append(heading, buttons);
    card.append(imageFrame, bar);
    return card;
  }

  function renderCommissionCards(artist) {
    columns.forEach((column) => column.replaceChildren());
    database.getArtworkCategoriesByArtist(artist.id).forEach((type, index) => {
      columns[index % columns.length].append(makeCommissionCard(type, artist, index));
    });
  }

  function renderGeneralCommission() {
    const general = database.getGeneralCommission();
    setText("#generalCommissionTitle", general.title);
    setText("#generalCommissionDescription", general.description);
    setText("#generalCommissionAvailability", general.availability);
    setText("#generalCommissionPricing", general.pricing);
    setText("#generalCommissionServices", general.services.join(", "));
    setText("#generalCommissionMaterials", general.materials);
    const guidelines = document.getElementById("generalCommissionGuidelines");
    guidelines.replaceChildren(...general.guidelines.map((text) => {
      const item = document.createElement("li");
      item.textContent = text;
      return item;
    }));
  }

  function setSelectedArtist(artistId) {
    selectedArtistId = artistId;
    activeIndex = Math.max(0, cards.findIndex((card) => card.dataset.artistId === artistId));
    const artist = database.getArtistById(artistId);
    const isAll = !artist;
    document.body.classList.toggle("artist-selected-state", !isAll);
    window.dispatchEvent(new Event("pmc:artist-selection-change"));
    document.title = artist ? `${artist.name} | Commissions` : "PMC Art | Commissions";
    profile.hidden = isAll;
    commissionGrid.hidden = isAll;
    generalView.hidden = !isAll;
    hero.classList.toggle("has-cover", !isAll);
    if (artist) {
      heroCover.src = `../../${artist.coverPhoto}`;
      heroCover.alt = `${artist.name} cover photo`;
      heroCover.hidden = false;
      renderProfile(artist);
      renderCommissionCards(artist);
      if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        [profile, commissionGrid].forEach((section) => {
          section.animate(
            [{ opacity: 0.78, transform: "translateY(6px)" }, { opacity: 1, transform: "translateY(0)" }],
            { duration: 220, easing: "ease-out" }
          );
        });
      }
      sessionStorage.setItem("pmc-selected-artist", artist.id);
    } else {
      heroCover.removeAttribute("src");
      heroCover.hidden = true;
      sessionStorage.removeItem("pmc-selected-artist");
      renderGeneralCommission();
    }
    updateCarousel();
  }

  function openCommissionInfo(type = "") {
    selectedCommissionType = type;
    const artist = database.getArtistById(selectedArtistId);
    const commission = artist ? database.getArtistCommission(artist.id) : database.getGeneralCommission();
    const services = artist
      ? database.getArtworkCategoriesByArtist(artist.id)
      : commission.types || commission.services;
    setText("#commissionModalTitle", type || commission.title || "Commission information");
    setText("#commissionModalArtist", artist ? artist.name : "All Artists");
    const lines = [
      commission.availability || commission.available,
      commission.rates || commission.pricing,
      `Available services: ${services.join(", ")}`,
      `Materials: ${(commission.materials instanceof Array ? commission.materials.join(", ") : commission.materials)}`,
      commission.description,
      ...(commission.guidelines || [])
    ];
    const list = document.getElementById("commissionModalList");
    list.replaceChildren(...lines.filter(Boolean).map((text) => {
      const item = document.createElement("li");
      item.textContent = text;
      return item;
    }));
    startCommissionSlideshow(artist, type);
    commissionModal.style.display = "flex";
    inquireModal.style.display = "none";
    modalOverlay.classList.add("active");
  }

  function openInquire() {
    stopCommissionSlideshow();
    const artist = database.getArtistById(selectedArtistId);
    const general = database.getGeneralCommission();
    inquireArtistProfile.hidden = !artist?.profilePicture;
    if (artist?.profilePicture) inquireArtistProfile.src = `../../${artist.profilePicture}`;
    else inquireArtistProfile.removeAttribute("src");
    inquireArtistProfile.alt = artist?.profilePicture
      ? `${artist.name} profile picture`
      : "Artist profile picture unavailable";
    setText("#inquireModalName", artist ? artist.name : "All Artists");
    setText("#inquireModalAvailability", artist
      ? artist.commission.available
      : general.availability);
    const socials = artist ? database.getArtistSocials(artist.id) : {};
    document.querySelectorAll("#modalInquire [data-social]").forEach((link) => {
      const network = link.dataset.social;
      const value = socials[network];
      link.hidden = !value;
      if (network === "email" && value) link.href = `mailto:${value}`;
      else if (value) link.href = value;
      else link.removeAttribute("href");
    });
    inquireModal.style.display = "flex";
    commissionModal.style.display = "none";
    modalOverlay.classList.add("active");
  }

  function stopCommissionSlideshow() {
    slideshowToken += 1;
    if (slideshowTimer !== null) window.clearInterval(slideshowTimer);
    if (slideshowSwapTimer !== null) window.clearTimeout(slideshowSwapTimer);
    slideshowTimer = null;
    slideshowSwapTimer = null;
    slideshowPaused = true;
    commissionSlideshowImage.classList.remove("is-fading");
  }

  function showCommissionArtwork(index) {
    if (!slideshowArtworks.length) return;
    const nextIndex = (index + slideshowArtworks.length) % slideshowArtworks.length;
    const artwork = slideshowArtworks[nextIndex];
    const token = slideshowToken;
    if (slideshowSwapTimer !== null) window.clearTimeout(slideshowSwapTimer);
    commissionSlideshowImage.classList.add("is-fading");
    slideshowSwapTimer = window.setTimeout(() => {
      if (token !== slideshowToken) return;
      commissionSlideshowImage.src = `../../${artwork.image}`;
      commissionSlideshowImage.alt = `${artwork.title} by ${artwork.artist}`;
      commissionSlideshowImage.setAttribute("aria-label", `Show next ${selectedCommissionType} artwork`);
      slideshowPositions.set(slideshowPositionKey, nextIndex);
      commissionSlideshowImage.classList.remove("is-fading");
      slideshowSwapTimer = null;
    }, 180);
  }

  function startCommissionSlideshow(artist, type) {
    stopCommissionSlideshow();
    slideshowPaused = false;
    slideshowArtworks = artist ? database.getArtworksByArtistAndCategory(artist.id, type) : [];
    slideshowPositionKey = `${artist?.id || "all"}:${type.toLowerCase()}`;
    commissionSlideshowImage.classList.remove("is-fading");
    if (!slideshowArtworks.length) {
      commissionSlideshowImage.hidden = true;
      commissionSlideshowImage.removeAttribute("src");
      commissionSlideshowImage.alt = `No ${type || "commission"} artwork available`;
      commissionSlideshowImage.setAttribute("aria-label", "No related artwork is available");
      return;
    }

    commissionSlideshowImage.hidden = false;
    const startIndex = slideshowPositions.get(slideshowPositionKey) || 0;
    slideshowPositions.set(slideshowPositionKey, startIndex);
    showCommissionArtwork(startIndex);
    scheduleSlideshowAdvance();
  }

  function scheduleSlideshowAdvance() {
    if (slideshowTimer !== null) window.clearTimeout(slideshowTimer);
    if (slideshowPaused || slideshowArtworks.length < 2) {
      slideshowTimer = null;
      return;
    }

    slideshowTimer = window.setTimeout(() => {
      slideshowTimer = null;
      showCommissionArtwork((slideshowPositions.get(slideshowPositionKey) || 0) + 1);
      scheduleSlideshowAdvance();
    }, 5000);
  }

  const commissionImageFrame = commissionModal.querySelector(".modal-left");
  commissionImageFrame.addEventListener("mouseenter", () => {
    if (slideshowTimer !== null) {
      window.clearTimeout(slideshowTimer);
      slideshowTimer = null;
    }
    slideshowPaused = true;
    if (slideshowSwapTimer !== null) {
      window.clearTimeout(slideshowSwapTimer);
      slideshowSwapTimer = null;
      commissionSlideshowImage.classList.remove("is-fading");
    }
  });
  commissionImageFrame.addEventListener("mouseleave", () => {
    if (slideshowArtworks.length > 1 &&
      commissionModal.style.display !== "none" &&
      modalOverlay.classList.contains("active")) {
      slideshowPaused = false;
      scheduleSlideshowAdvance();
    }
  });
  commissionSlideshowImage.addEventListener("click", () => {
    if (slideshowArtworks.length > 1) {
      showCommissionArtwork((slideshowPositions.get(slideshowPositionKey) || 0) + 1);
      scheduleSlideshowAdvance();
    }
  });
  commissionSlideshowImage.addEventListener("keydown", (event) => {
    if ((event.key === "Enter" || event.key === " ") && slideshowArtworks.length > 1) {
      event.preventDefault();
      showCommissionArtwork((slideshowPositions.get(slideshowPositionKey) || 0) + 1);
      scheduleSlideshowAdvance();
    }
  });

  track.addEventListener("click", (event) => {
    if (suppressCarouselClick) {
      event.preventDefault();
      event.stopImmediatePropagation();
      suppressCarouselClick = false;
      if (carouselClickResetTimer !== null) window.clearTimeout(carouselClickResetTimer);
      carouselClickResetTimer = null;
      return;
    }
    const card = event.target.closest(".card");
    if (!card || !track.contains(card)) return;
    event.preventDefault();
    setSelectedArtist(card.dataset.artistId);
  });

  function startCarouselDrag(clientX) {
    carouselDragStart = { x: clientX, moved: false };
    track.classList.add("is-dragging");
  }

  function moveCarouselDrag(event) {
    if (!carouselDragStart) return;
    if (Math.abs(event.clientX - carouselDragStart.x) > 8) carouselDragStart.moved = true;
    if (carouselDragStart.moved) event.preventDefault();
  }

  function finishCarouselDrag(clientX) {
    if (!carouselDragStart) return;
    const direction = carouselDragStart.x - clientX;
    const moved = carouselDragStart.moved;
    carouselDragStart = null;
    track.classList.remove("is-dragging");
    if (!moved) return;
    const nextIndex = direction > 0
      ? (activeIndex + 1) % cards.length
      : (activeIndex - 1 + cards.length) % cards.length;
    suppressCarouselClick = true;
    setSelectedArtist(cards[nextIndex].dataset.artistId);
    if (carouselClickResetTimer !== null) window.clearTimeout(carouselClickResetTimer);
    carouselClickResetTimer = window.setTimeout(() => {
      suppressCarouselClick = false;
      carouselClickResetTimer = null;
    }, 150);
  }

  track.addEventListener("mousedown", (event) => {
    if (event.button !== 0) return;
    startCarouselDrag(event.clientX);
  });
  window.addEventListener("mousemove", moveCarouselDrag);
  window.addEventListener("mouseup", (event) => finishCarouselDrag(event.clientX));

  track.addEventListener("pointerdown", (event) => {
    if (!event.isPrimary || event.pointerType === "mouse") return;
    startCarouselDrag(event.clientX);
  });
  window.addEventListener("pointermove", (event) => {
    if (event.pointerType !== "mouse") moveCarouselDrag(event);
  });
  window.addEventListener("pointerup", (event) => {
    if (event.pointerType !== "mouse") finishCarouselDrag(event.clientX);
  });
  window.addEventListener("pointercancel", () => {
    carouselDragStart = null;
    track.classList.remove("is-dragging");
  });

  document.getElementById("prev").addEventListener("click", () => {
    setSelectedArtist(cards[(activeIndex - 1 + cards.length) % cards.length].dataset.artistId);
  });
  document.getElementById("next").addEventListener("click", () => {
    setSelectedArtist(cards[(activeIndex + 1) % cards.length].dataset.artistId);
  });
  window.addEventListener("resize", updateCarousel);
  document.querySelector(".commission-grid").addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action]");
    if (!button) return;
    if (button.dataset.action === "commission-info") openCommissionInfo(button.dataset.commissionType);
    if (button.dataset.action === "inquire") openInquire();
  });
  document.getElementById("switchToInquire").addEventListener("click", openInquire);
  document.querySelectorAll(".close-modal-btn").forEach((button) => {
    button.addEventListener("click", () => {
      modalOverlay.classList.remove("active");
      stopCommissionSlideshow();
    });
  });
  modalOverlay.addEventListener("click", (event) => {
    if (event.target === modalOverlay) {
      modalOverlay.classList.remove("active");
      stopCommissionSlideshow();
    }
  });

  const query = new URLSearchParams(window.location.search);
  const requestedArtist = query.get("artist") || sessionStorage.getItem("pmc-selected-artist") || "all";
  const initialArtist = requestedArtist === "all" || database.getArtistById(requestedArtist)
    ? requestedArtist
    : "all";
  setSelectedArtist(initialArtist);
  if (query.get("inquire") === "1") {
    openInquire();
    window.history.replaceState({}, "", window.location.pathname);
  }
})();
