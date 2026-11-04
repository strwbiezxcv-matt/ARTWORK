document.addEventListener("DOMContentLoaded", () => {
  const database = window.PMCArtDatabase;
  if (!database) throw new Error("PMC Art database did not load.");
  const artists = database.getAllArtists();
  const artworks = database.getAllArtworks();

  function markArtworkImage(image, artwork) {
    image.dataset.artworkId = artwork.id;
    image.setAttribute("role", "link");
    image.setAttribute("aria-label", `View ${artwork.title} details`);
    image.tabIndex = 0;
    image.style.cursor = "pointer";
  }

  const heroWrap = document.getElementById("content1animate");
  const heroFrame = document.getElementById("insidecontent1animate");
  if (heroWrap && heroFrame) {
    const updateHero = () => {
      const distance = Math.max(1, heroWrap.offsetHeight - window.innerHeight);
      const raw = (window.scrollY - heroWrap.offsetTop) / distance;
      const progress = Math.min(Math.max(raw, 0), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const scale = 1 - eased * 0.05;
      heroFrame.style.transform = `scale(${scale.toFixed(4)})`;
      heroFrame.style.borderRadius = `${(eased * 32 / scale).toFixed(1)}px`;
    };
    window.addEventListener("scroll", updateHero, { passive: true });
    window.addEventListener("resize", updateHero);
    updateHero();
  }

  const revealTargets = document.querySelectorAll(
    "#aboutustext .about-row, .about-stats, .content3tab, .why-wrap .why-col, " +
    ".center-title, .center-sub, .dots, .left-title, .tags, .art-controls, .c5-left, .feedbackstack"
  );
  if ("IntersectionObserver" in window && revealTargets.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealTargets.forEach((element, index) => {
      element.classList.add("reveal");
      element.style.transitionDelay = `${(index % 3) * 90}ms`;
      observer.observe(element);
    });
  }

  const stack = document.getElementById("feedbackstack");
  const cards = stack ? [...stack.querySelectorAll(".feedbacktab")] : [];
  let busy = false;
  const renderStack = () => cards.forEach((card, index) => card.style.setProperty("--pos", index));
  const addTestimonialCard = ({ name, feedback }) => {
    if (!stack || !cards.length) return;
    const card = cards[0].cloneNode(true);
    card.classList.remove("leaving");
    card.style.removeProperty("--pos");
    card.querySelector(".fb-stars")?.remove();
    card.querySelector(".fb-msg").textContent = feedback;
    card.querySelector(".fb-name").textContent = name;
    card.querySelector(".fb-role").textContent = "Community feedback";
    stack.insertBefore(card, stack.querySelector(".fb-hint"));
    cards.unshift(card);
    renderStack();
  };

  if (stack) {
    const nextCard = () => {
      if (busy || cards.length < 2) return;
      busy = true;
      const first = cards[0];
      first.classList.add("leaving");
      window.setTimeout(() => {
        const firstIndex = cards.indexOf(first);
        if (firstIndex !== -1) {
          cards.splice(firstIndex, 1);
          cards.push(first);
        }
        first.classList.remove("leaving");
        renderStack();
        busy = false;
      }, 280);
    };
    stack.addEventListener("click", nextCard);
    stack.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        nextCard();
      }
    });
    renderStack();
  }

  const testimonialStorageKey = "pmcArtTestimonials";
  const testimonialRecords = [];
  let testimonialStorageError = null;
  try {
    const storedTestimonials = window.localStorage.getItem(testimonialStorageKey);
    if (storedTestimonials) {
      const parsedTestimonials = JSON.parse(storedTestimonials);
      if (!Array.isArray(parsedTestimonials)) {
        throw new TypeError("Saved testimonials must be an array.");
      }
      parsedTestimonials.forEach((record) => {
        if (
          record &&
          typeof record.name === "string" &&
          typeof record.feedback === "string" &&
          record.name.trim() &&
          record.feedback.trim()
        ) {
          testimonialRecords.push({
            name: record.name.trim(),
            feedback: record.feedback.trim()
          });
        }
      });
      if (testimonialRecords.length !== parsedTestimonials.length) {
        testimonialStorageError = new TypeError("Some saved testimonials had invalid data.");
      }
    }
  } catch (error) {
    testimonialStorageError = error;
    console.error("Unable to load saved testimonials from this browser.", error);
  }
  testimonialRecords.forEach(addTestimonialCard);

  const testimonialModal = document.getElementById("testimonialModal");
  const testimonialForm = document.getElementById("testimonialForm");
  const testimonialStatus = document.getElementById("testimonialStatus");
  const testimonialTrigger = document.getElementById("c5-button");
  if (testimonialModal && testimonialForm && testimonialStatus && testimonialTrigger && stack) {
    let previousBodyOverflow = "";
    const storageWarning = () => testimonialStorageError
      ? "Previously saved feedback could not be fully loaded. New entries will still be added to this page."
      : "";
    const closeTestimonialModal = () => {
      testimonialModal.hidden = true;
      document.body.style.overflow = previousBodyOverflow;
      testimonialTrigger.focus();
    };
    testimonialTrigger.addEventListener("click", () => {
      previousBodyOverflow = document.body.style.overflow;
      testimonialModal.hidden = false;
      document.body.style.overflow = "hidden";
      testimonialStatus.textContent = storageWarning();
      document.getElementById("testimonialName")?.focus();
    });
    testimonialModal.querySelectorAll("[data-modal-close]").forEach((button) => {
      button.addEventListener("click", closeTestimonialModal);
    });
    testimonialModal.addEventListener("click", (event) => {
      if (event.target === testimonialModal) closeTestimonialModal();
    });
    document.addEventListener("keydown", (event) => {
      if (!testimonialModal.hidden && event.key === "Escape") closeTestimonialModal();
    });
    testimonialForm.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!testimonialForm.reportValidity()) return;
      const submission = new FormData(testimonialForm);
      const name = submission.get("name")?.toString().trim();
      const feedback = submission.get("feedback")?.toString().trim();
      if (!name) {
        testimonialStatus.textContent = "Please enter your name.";
        document.getElementById("testimonialName")?.focus();
        return;
      }
      if (!feedback) {
        testimonialStatus.textContent = "Please enter your feedback.";
        document.getElementById("testimonialFeedback")?.focus();
        return;
      }
      const record = { name, feedback };
      testimonialRecords.push(record);
      addTestimonialCard(record);
      try {
        window.localStorage.setItem(testimonialStorageKey, JSON.stringify(testimonialRecords));
        testimonialStorageError = null;
        testimonialStatus.textContent = `Thank you, ${name}. Your testimonial is now in the rotating cards and saved in this browser only. It has not been sent to the PMC Art team.`;
      } catch (error) {
        testimonialStorageError = error;
        console.error("Unable to save testimonial to this browser.", error);
        testimonialStatus.textContent = `Your testimonial is in the rotating cards for this visit, but couldn't be saved in this browser. It won't remain after refreshing.`;
      }
    });
  }

  const featuredItems = [...document.querySelectorAll(".ct3imgtab")];
  const distinctArtistArtworks = [];
  const representedArtists = new Set();
  artworks.forEach((artwork) => {
    if (representedArtists.has(artwork.artistId)) return;
    representedArtists.add(artwork.artistId);
    distinctArtistArtworks.push(artwork);
  });
  featuredItems.forEach((item, index) => {
    const artwork = distinctArtistArtworks[index];
    if (!artwork) return;
    const image = item.querySelector("img");
    if (image) {
      image.src = artwork.image;
      image.alt = artwork.title;
      markArtworkImage(image, artwork);
    }
    const title = item.querySelector(".vertical-text");
    if (title) title.textContent = artwork.title;
    const owner = item.querySelector(".name-text");
    if (owner) owner.textContent = artwork.artist;
  });
  document.querySelectorAll(".why-img").forEach((image, index) => {
    const artwork = distinctArtistArtworks[index];
    if (!artwork) return;
    image.src = artwork.image;
    image.alt = artwork.title;
    markArtworkImage(image, artwork);
  });

  const meetArtist = document.getElementById("meetartist");
  if (meetArtist) {
    const nameElement = meetArtist.querySelector(".artist-info h2");
    const roleElement = meetArtist.querySelector(".artist-info h3 span");
    const descriptionElement = meetArtist.querySelector(".artist-info > p");
    const profileImage = meetArtist.querySelector(".artist-photo img");
    const posts = meetArtist.querySelector(".artistposts-inner");
    const dotContainer = meetArtist.querySelector(".dots");
    const previous = dotContainer?.querySelector('[aria-label="Previous artist"]');
    const next = dotContainer?.querySelector('[aria-label="Next artist"]');
    let activeArtistIndex = Math.max(0, artists.findIndex((artist) => artist.id === "artist-mjb-002"));

    if (dotContainer && nameElement && roleElement && descriptionElement && profileImage && posts) {
      dotContainer.querySelectorAll(".dot").forEach((dot) => dot.remove());
      const dots = artists.map((artist, index) => {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = "dot";
        dot.setAttribute("aria-label", `Show ${artist.name}`);
        dot.addEventListener("click", () => showArtist(index));
        dotContainer.insertBefore(dot, next);
        return dot;
      });

      function showArtist(index) {
        activeArtistIndex = (index + artists.length) % artists.length;
        const artist = artists[activeArtistIndex];
        nameElement.textContent = artist.name;
        roleElement.textContent = artist.specialization;
        descriptionElement.textContent = artist.description;
        profileImage.hidden = !artist.profilePicture;
        if (artist.profilePicture) profileImage.src = artist.profilePicture;
        else profileImage.removeAttribute("src");
        profileImage.alt = artist.profilePicture
          ? `${artist.name} profile picture`
          : `${artist.name} profile picture unavailable`;
        posts.replaceChildren(...database.getArtworksByArtist(artist.id).map((artwork) => {
          const image = document.createElement("img");
          image.src = artwork.image;
          image.alt = artwork.title;
          markArtworkImage(image, artwork);
          return image;
        }));
        dots.forEach((dot, dotIndex) => {
          dot.classList.toggle("active", dotIndex === activeArtistIndex);
          dot.setAttribute("aria-pressed", String(dotIndex === activeArtistIndex));
        });
        const socials = database.getArtistSocials(artist.id);
        meetArtist.querySelectorAll(".artist-socials a").forEach((link) => {
          const key = link.getAttribute("aria-label").toLowerCase();
          const href = socials[key];
          link.hidden = !href;
          link.style.display = href ? "" : "none";
          if (href) link.href = href;
          else link.removeAttribute("href");
        });
      }

      previous?.addEventListener("click", () => showArtist(activeArtistIndex - 1));
      next?.addEventListener("click", () => showArtist(activeArtistIndex + 1));
      document.getElementById("inquireBTN")?.addEventListener("click", () => {
        const artist = artists[activeArtistIndex];
        sessionStorage.setItem("pmc-selected-artist", artist.id);
        const target = new URL("nav-tab/commission tab/commission.html", window.location.href);
        target.searchParams.set("artist", artist.id);
        window.location.assign(target.href);
      });
      showArtist(activeArtistIndex);
    }
  }

  const row = document.getElementById("artRow");
  const progress = document.getElementById("artProgress");
  const thumb = document.getElementById("artThumb");
  const cardTemplate = row?.querySelector(".art-card");
  const categoryControls = [...document.querySelectorAll("#artworks .tags [data-category]")];
  if (row && cardTemplate && progress && thumb) {
    cardTemplate.remove();
    let selectedCategory = "all";

    function renderArtworks() {
      const records = selectedCategory === "all" ? artworks : database.filterArtworksByCategory(selectedCategory);
      row.replaceChildren(...records.map((artwork) => {
        const card = cardTemplate.cloneNode(true);
        card.dataset.artworkId = artwork.id;
        const image = card.querySelector(".art-img");
        image.src = artwork.image;
        image.alt = artwork.title;
        markArtworkImage(image, artwork);
        card.querySelector(".art-name").textContent = artwork.title;
        card.querySelector(".art-artist span").textContent = artwork.artist;
        card.querySelector(".art-desc").textContent = artwork.description;
        return card;
      }));
      updateProgress();
      if (window.lucide) window.lucide.createIcons({ attrs: { "stroke-width": 1.8 } });
    }

    function updateProgress() {
      const trackWidth = progress.clientWidth;
      const thumbWidth = row.scrollWidth
        ? Math.max(trackWidth * (row.clientWidth / row.scrollWidth), 40)
        : trackWidth;
      const maxScroll = Math.max(0, row.scrollWidth - row.clientWidth);
      const thumbPosition = maxScroll
        ? (row.scrollLeft / maxScroll) * (trackWidth - thumbWidth)
        : 0;
      thumb.style.width = `${thumbWidth}px`;
      thumb.style.left = `${thumbPosition}px`;
      progress.setAttribute("aria-valuenow", String(Math.round(maxScroll ? (row.scrollLeft / maxScroll) * 100 : 0)));
    }

    progress.setAttribute("role", "slider");
    progress.setAttribute("tabindex", "0");
    progress.setAttribute("aria-label", "Scroll artworks");
    progress.setAttribute("aria-controls", row.id);
    progress.setAttribute("aria-valuemin", "0");
    progress.setAttribute("aria-valuemax", "100");

    let progressDrag = null;
    function moveArtworkProgress(event) {
      if (!progressDrag || event.pointerId !== progressDrag.pointerId) return;
      const maxThumbPosition = Math.max(0, progress.clientWidth - thumb.clientWidth);
      const maxScroll = Math.max(0, row.scrollWidth - row.clientWidth);
      const bounds = progress.getBoundingClientRect();
      const thumbPosition = Math.min(
        Math.max(event.clientX - bounds.left - progressDrag.offset, 0),
        maxThumbPosition
      );
      row.scrollLeft = maxThumbPosition
        ? (thumbPosition / maxThumbPosition) * maxScroll
        : 0;
      updateProgress();
    }

    progress.addEventListener("pointerdown", (event) => {
      if (!event.isPrimary || row.scrollWidth <= row.clientWidth) return;
      event.preventDefault();
      const thumbBounds = thumb.getBoundingClientRect();
      progressDrag = {
        pointerId: event.pointerId,
        offset: event.target === thumb ? event.clientX - thumbBounds.left : thumb.clientWidth / 2
      };
      progress.classList.add("dragging");
      progress.setPointerCapture(event.pointerId);
      moveArtworkProgress(event);
    });
    progress.addEventListener("pointermove", moveArtworkProgress);
    const finishArtworkProgress = (event) => {
      if (!progressDrag || event.pointerId !== progressDrag.pointerId) return;
      progressDrag = null;
      progress.classList.remove("dragging");
    };
    progress.addEventListener("pointerup", finishArtworkProgress);
    progress.addEventListener("pointercancel", finishArtworkProgress);
    progress.addEventListener("keydown", (event) => {
      const maxScroll = Math.max(0, row.scrollWidth - row.clientWidth);
      if (event.key === "ArrowLeft") row.scrollBy({ left: -row.clientWidth * 0.1, behavior: "smooth" });
      else if (event.key === "ArrowRight") row.scrollBy({ left: row.clientWidth * 0.1, behavior: "smooth" });
      else if (event.key === "Home") row.scrollTo({ left: 0, behavior: "smooth" });
      else if (event.key === "End") row.scrollTo({ left: maxScroll, behavior: "smooth" });
      else return;
      event.preventDefault();
    });

    categoryControls.forEach((control) => {
      control.addEventListener("click", (event) => {
        event.preventDefault();
        selectedCategory = control.dataset.category;
        categoryControls.forEach((item) => item.classList.toggle("active", item === control));
        renderArtworks();
      });
    });

    row.addEventListener("click", (event) => {
      const buyButton = event.target.closest(".art-buy");
      const card = buyButton?.closest("[data-artwork-id]");
      if (!card) return;
      sessionStorage.setItem("pmc-selected-artwork", card.dataset.artworkId);
      window.location.href = "nav-tab/artwork tab/artinfo.html";
    });

    row.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    document.getElementById("artPrev")?.addEventListener("click", () => {
      row.scrollBy({ left: -row.clientWidth * 0.8, behavior: "smooth" });
    });
    document.getElementById("artNext")?.addEventListener("click", () => {
      row.scrollBy({ left: row.clientWidth * 0.8, behavior: "smooth" });
    });
    renderArtworks();
  }
});
