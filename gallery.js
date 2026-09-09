(() => {
  const galleries = {
    svedpadlo: {
      title: "Svédpadló",
      images: ["images/svedpadlo.jpg","images/gallery/svedpadlo-01.webp","images/gallery/svedpadlo-02.webp","images/gallery/svedpadlo-03.webp","images/gallery/svedpadlo-04.webp","images/gallery/svedpadlo-05.webp","images/gallery/svedpadlo-06.webp","images/gallery/svedpadlo-07.webp"]
    },
    chevron: {
      title: "Chevron",
      images: ["images/chevron-selected.webp","images/gallery/chevron-01.webp","images/gallery/chevron-02.webp","images/gallery/chevron-03.webp","images/gallery/chevron-04.webp","images/gallery/chevron-05.webp","images/gallery/chevron-06.webp"]
    },
    tablaparketta: {
      title: "Táblaparketta",
      images: ["images/deg-natur.png","images/gallery/tablaparketta-01.webp","images/gallery/tablaparketta-02.webp","images/gallery/tablaparketta-03.webp","images/gallery/tablaparketta-04.webp","images/gallery/tablaparketta-05.webp","images/gallery/tablaparketta-06.webp","images/gallery/tablaparketta-07.webp","images/gallery/tablaparketta-08.webp","images/gallery/tablaparketta-09.webp","images/gallery/tablaparketta-10.webp","images/gallery/tablaparketta-11.webp","images/gallery/tablaparketta-12.webp","images/gallery/tablaparketta-13.webp","images/gallery/tablaparketta-14.webp","images/gallery/tablaparketta-15.webp","images/gallery/tablaparketta-03.webp"]
    },
    geometrikus: {
      title: "Geometrikus táblaparketta",
      images: ["images/geometrikus-selected.webp","images/gallery/tablaparketta-09.webp","images/gallery/tablaparketta-10.webp","images/gallery/tablaparketta-11.webp","images/gallery/tablaparketta-12.webp","images/gallery/tablaparketta-13.webp","images/gallery/tablaparketta-14.webp","images/gallery/tablaparketta-15.webp","images/gallery/tablaparketta-03.webp"]
    },
    alakos: {
      title: "Alakos táblaparketta",
      images: ["images/figura-selected.webp","images/gallery/tablaparketta-04.webp","images/gallery/tablaparketta-05.webp","images/gallery/tablaparketta-06.webp","images/gallery/tablaparketta-07.webp","images/gallery/tablaparketta-08.webp"]
    },
    moire: {
      title: "Moiré táblaparketta",
      images: ["images/moire-selected.webp","images/gallery/tablaparketta-01.webp","images/gallery/tablaparketta-02.webp"]
    }
  };
  const modal = document.getElementById("product-gallery");
  if (!modal) return;
  const image = modal.querySelector(".gallery-image");
  const title = modal.querySelector("#gallery-title");
  const counter = modal.querySelector(".gallery-counter");
  const closeButton = modal.querySelector(".gallery-close");
  let active = null, index = 0, lastFocus = null, touchX = null, touchCurrentX = null, animating = false;

  function show(nextIndex) {
    if (!active) return;
    index = (nextIndex + active.images.length) % active.images.length;
    image.src = active.images[index];
    image.alt = active.title + " – " + (index + 1) + ". fotó";
    title.textContent = active.title;
    counter.textContent = (index + 1) + " / " + active.images.length;
    [-1, 1].forEach(step => {
      const preload = new Image();
      preload.src = active.images[(index + step + active.images.length) % active.images.length];
    });
  }
  function openGallery(key, trigger) {
    active = galleries[key];
    if (!active) return;
    lastFocus = trigger;
    modal.hidden = false;
    document.body.classList.add("gallery-open");
    show(0);
    closeButton.focus();
    if (typeof window.clarity === "function") window.clarity("event", "galeria_megnyitva_" + key);
  }
  function closeGallery() {
    modal.hidden = true;
    document.body.classList.remove("gallery-open");
    image.removeAttribute("src");
    active = null;
    if (lastFocus) lastFocus.focus();
  }
  document.querySelectorAll(".gallery-trigger").forEach(button => button.addEventListener("click", () => openGallery(button.dataset.gallery, button)));
  modal.querySelector(".gallery-prev").addEventListener("click", () => show(index - 1));
  modal.querySelector(".gallery-next").addEventListener("click", () => show(index + 1));
  closeButton.addEventListener("click", closeGallery);
  modal.addEventListener("click", event => { if (event.target === modal) closeGallery(); });
  function resetImagePosition() {
    image.style.transition = "transform .22s ease, opacity .22s ease";
    image.style.transform = "translateX(0)";
    image.style.opacity = "1";
  }
  function animateSwipe(direction) {
    if (animating || !active) return;
    animating = true;
    image.style.transition = "transform .18s ease, opacity .18s ease";
    image.style.transform = "translateX(" + (direction > 0 ? "-110vw" : "110vw") + ")";
    image.style.opacity = ".15";
    window.setTimeout(() => {
      show(index + direction);
      image.style.transition = "none";
      image.style.transform = "translateX(" + (direction > 0 ? "55px" : "-55px") + ")";
      image.style.opacity = "0";
      requestAnimationFrame(() => requestAnimationFrame(() => {
        resetImagePosition();
        window.setTimeout(() => { animating = false; }, 230);
      }));
    }, 180);
  }
  modal.addEventListener("touchstart", event => {
    if (animating) return;
    touchX = touchCurrentX = event.changedTouches[0].clientX;
    image.style.transition = "none";
  }, {passive:true});
  modal.addEventListener("touchmove", event => {
    if (touchX === null || animating) return;
    touchCurrentX = event.changedTouches[0].clientX;
    const delta = touchCurrentX - touchX;
    image.style.transform = "translateX(" + delta + "px)";
    image.style.opacity = String(Math.max(.55, 1 - Math.abs(delta) / 500));
    event.preventDefault();
  }, {passive:false});
  modal.addEventListener("touchend", () => {
    if (touchX === null || animating) return;
    const delta = (touchCurrentX ?? touchX) - touchX;
    touchX = touchCurrentX = null;
    if (Math.abs(delta) > 45) animateSwipe(delta < 0 ? 1 : -1);
    else resetImagePosition();
  }, {passive:true});
  modal.addEventListener("touchcancel", () => {
    touchX = touchCurrentX = null;
    resetImagePosition();
  }, {passive:true});
  document.addEventListener("keydown", event => {
    if (modal.hidden) return;
    if (event.key === "Escape") closeGallery();
    if (event.key === "ArrowLeft") show(index - 1);
    if (event.key === "ArrowRight") show(index + 1);
  });
})();