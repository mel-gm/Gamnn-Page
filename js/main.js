/* Gmann Maison Versalles - main.js */

/* =========================================================
       ARQUITECTURA JS
       Cada funcion tiene una sola responsabilidad.
       - readPageConfig: lee datos editables del HTML.
       - buildWhatsAppLink: arma el link de reserva.
       - applyEditableConfig: actualiza cupos, ticker, video y links.
       - initIntroOverlay: oculta el isotipo inicial al tocar.
       - initRevealOnScroll: anima secciones al entrar en pantalla.
       - initFloatingReserve: muestra boton sticky despues del hero.
       - initGalleryTap: permite revelar galeria en celular.
       - initCustomCursor: activa cursor especial solo desktop.
       ========================================================= */

    function readPageConfig() {
      const configElement = document.querySelector("#page-config");

      return {
        whatsappNumber: configElement.dataset.whatsappNumber,
        whatsappMessage: configElement.dataset.whatsappMessage,
        places: configElement.dataset.places,
        heroVideo: configElement.dataset.heroVideo
      };
    }

    function buildWhatsAppLink(number, message) {
      return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
    }

    function applyEditableConfig() {
      const config = readPageConfig();
      const whatsappLink = buildWhatsAppLink(config.whatsappNumber, config.whatsappMessage);
      const tickerText = `✦ EDICIÓN LIMITADA ✦ SOLO ${config.places} LUGARES DISPONIBLES ✦ LANZAMIENTO EXCLUSIVO ✦ SOLO ${config.places} LUGARES DISPONIBLES ✦`;

      document.querySelectorAll(".js-whatsapp-link").forEach((link) => {
        link.href = whatsappLink;
      });

      document.querySelectorAll(".js-places").forEach((element) => {
        element.textContent = config.places;
      });

      document.querySelector(".scarcity-ticker").setAttribute("aria-label", `Edición limitada, solo ${config.places} lugares disponibles`);
      document.querySelector(".ticker-track").innerHTML = Array.from({ length: 3 }, () => `<span>${tickerText}</span>`).join("");

      const videoSource = document.querySelector("#hero-video-source");
      if (videoSource && config.heroVideo) {
        videoSource.src = config.heroVideo;
        videoSource.closest("video").load();
      }
    }

    function initIntroOverlay() {
      const introOverlay = document.querySelector(".intro-overlay");
      if (!introOverlay) return;

      const dismissIntro = () => {
        introOverlay.classList.add("is-dismissed");
        document.body.classList.remove("intro-active");
      };

      introOverlay.addEventListener("click", dismissIntro);
      introOverlay.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          dismissIntro();
        }
      });
    }

    function initRevealOnScroll() {
      const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.14 });

      document.querySelectorAll(".reveal").forEach((element) => {
        revealObserver.observe(element);
      });
    }

    function initFloatingReserve() {
      const floatingReserve = document.querySelector(".floating-reserve");
      const hero = document.querySelector(".hero");
      const finalCta = document.querySelector(".final-cta");
      let isHeroVisible = true;
      let isFinalCtaVisible = false;

      const updateFloatingReserve = () => {
        floatingReserve.classList.toggle("is-visible", !isHeroVisible && !isFinalCtaVisible);
      };

      const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          isHeroVisible = entry.isIntersecting;
          updateFloatingReserve();
        });
      }, { threshold: 0.08 });

      heroObserver.observe(hero);

      if (finalCta) {
        const finalCtaObserver = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            isFinalCtaVisible = entry.isIntersecting;
            updateFloatingReserve();
          });
        }, { threshold: 0.18 });

        finalCtaObserver.observe(finalCta);
      }
    }

    function initGalleryTap() {
      document.querySelectorAll(".gallery-item").forEach((item) => {
        item.addEventListener("click", () => {
          item.classList.toggle("is-revealed");
        });
      });
    }

    function initCustomCursor() {
      const cursor = document.querySelector(".custom-cursor");
      const canUseCursor = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

      if (!canUseCursor) return;

      document.body.classList.add("has-custom-cursor");

      window.addEventListener("mousemove", (event) => {
        cursor.classList.add("is-active");
        cursor.style.transform = `translate(${event.clientX}px, ${event.clientY}px) translate(-50%, -50%)`;
      });

      document.querySelectorAll("a, button").forEach((interactive) => {
        interactive.addEventListener("mouseenter", () => cursor.classList.add("is-hovering"));
        interactive.addEventListener("mouseleave", () => cursor.classList.remove("is-hovering"));
      });

      document.addEventListener("mouseleave", () => cursor.classList.remove("is-active"));
      document.addEventListener("mouseenter", () => cursor.classList.add("is-active"));
    }

    applyEditableConfig();
    initIntroOverlay();
    initRevealOnScroll();
    initFloatingReserve();
    initGalleryTap();
    initCustomCursor();
