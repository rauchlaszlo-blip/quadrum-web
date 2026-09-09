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
      images: ["images/deg-natur.png","images/gallery/tablaparketta-01.webp","images/gallery/tablaparketta-02.webp","images/gallery/tablaparketta-03.webp","images/gallery/tablaparketta-04.webp","images/gallery/tablaparketta-05.webp","images/gallery/tablaparketta-06.webp","images/gallery/tablaparketta-07.webp","images/gallery/tablaparketta-08.webp","images/gallery/tablaparketta-09.webp","images/gallery/tablaparketta-10.webp","images/gallery/tablaparketta-11.webp","images/gallery/tablaparketta-12.webp","images/gallery/tablaparketta-13.webp","images/gallery/tablaparketta-14.webp","images/gallery/tablaparketta-15.webp"]
    }
  };
  const modal = document.getElementById("product-gallery");
  if (!modal) return;
  const image = modal.querySelector(".gallery-image");
  const title = modal.querySelector("#gallery-title");
  const counter = modal.querySelector(".gallery-counter");
  const closeButton = modal.querySelector(".gallery-close");
  let active = null, index = 0, lastFocus = null, touchX = null;

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
  modal.addEventListener("touchstart", event => { touchX = event.changedTouches[0].clientX; }, {passive:true});
  modal.addEventListener("touchend", event => {
    if (touchX === null) return;
    const delta = event.changedTouches[0].clientX - touchX;
    if (Math.abs(delta) > 45) show(index + (delta < 0 ? 1 : -1));
    touchX = null;
  }, {passive:true});
  document.addEventListener("keydown", event => {
    if (modal.hidden) return;
    if (event.key === "Escape") closeGallery();
    if (event.key === "ArrowLeft") show(index - 1);
    if (event.key === "ArrowRight") show(index + 1);
  });
})();