let compteur = 0;
let timer, elements, slides, slideWidth;
let isMouseOver = false;
let isWindowVisible = true;

// Datos de texto (añade tus entradas aquí para cada diapositiva)
const captionsData = {
  oiseaux: [
  {
    title: "Obsérvalos todos en Puerto Nariño",
    details: ["5 días/ 4 noches", "Circuito intermedio"],
    zones: ["Centro de Puerto Nariño","Río Loretoyacú", "Isla de Cacao (Perú)", "Reserva RAMSAR", "Bosque inundado", "Lago Tarapoto y zonas inundadas"],
    communities: ["San Martín de Amacayacú", "Mocagua"]
  },
  {
    title: "MasterBirding - Primates y Perezosos",
    details: ["7 días/ 6 noches", "Circuito intensivo"],
    zones: ["Centro de Leticia", "Kilómetro dos ('Los Lagos')", "Puerto Nariño (zona urbana)", "Islas de Cacao (Perú)", "Lago Tarapoto y zonas inundadas", "Río Loretoyacú"],
    communities: ["Mocagua","San Martín de Amacayacú", "Valencia", "San Antonio"]
  }
],

  amazonie: [  
  {
    title: "Descubriendo Puerto Nariño",
    details: ["3 días/ 2 noches"],
    nuit: ["2 noches en un hotel","seleccionado especialmente","para usted"],
    lieux: ["Río Amazonas", "Islas de Cacao (Perú)", "Lago Tarapoto"],
    programme: ["Visita guiada por la ciudad", "Avistamiento de delfines rosados y grises", "Avistamiento de perezosos y monos", "Pesca artesanal", "Caminata por la selva", "Degustación de gastronomía local"],
    option : [""]
  },
  {
    title: "Puerto Nariño en familia",
    details: ["4 días/ 3 noches"],
    nuit: ["3 noches en un hotel de","Puerto Nariño"],
    lieux: ["Puerto Nariño", "Lago Tarapoto","Islas de Cacao", "Mocagua"],
    programme: ["Avistamiento de delfines rosados y grises, monos","Pesca artesanal", "Caminata por la selva", "Degustación de gastronomía local", "Juegos culturales Tikuna"],
    option : ["Opción 'Pequeños exploradores' → Guía especializado en observación de aves"]
  },
  {
    title: "Experiencia en la selva",
    details: ["4 días/ 3 noches"],
    nuit: ["1 noche en Puerto Nariño","1 noche en una maloka en el corazón de la selva","1 noche en una comunidad"],
    lieux: ["Río Amazonas", "Perú", "Lago Tarapoto"],
    programme: ["Trekking","Campamento en la selva", "Avistamiento de delfines rosados y pesca", "Descubrimiento de la cultura Tikuna"],
    option : [""]
  },
  {
    title: "Del río a la selva",
    details: ["4 días/ 3 noches"],
    nuit: ["1 noche en Puerto Nariño","1 noche en una maloka","1 noche a orillas del río"],
    lieux: ["Puerto Nariño", "Perú", "Lago Tarapoto"],
    programme: ["Trekking", "Avistamiento de delfines rosados y grises", "Pesca", "Avistamiento de perezosos"],
    option : [""]
  },
  {
    title: "El recorrido por las comunidades",
    details: ["4 días/ 3 noches"],
    nuit: ["1 noche en Puerto Nariño","2 noches en Comunidades"],
    lieux: ["Puerto Nariño", "Islas de Cacao (Perú)", "Lago Tarapoto","San Martín de Amacayacú","Mocagua"],
    programme: ["Caminata por la selva", "Avistamiento de delfines rosados y grises", "Avistamiento de monos Churuco", "Pesca artesanal", "Descubrimiento de la cultura Tikuna y gastronomía"],
    option : [""]    
  },
  {
    title: "Inmersión (comunidad del 7 de Agosto)",
    details: ["5 días/ 4 noches"],
    nuit: ["2 noches en Puerto Nariño","2 noches en comunidad"],
    lieux: ["Puerto Nariño", "Lago Tarapoto", "Comunidad del 7 de Agosto", "Frontera Perú-Colombia"],
    programme: ["Avistamiento de delfines, caimanes, aves, monos, etc. ", "Pesca artesanal", "Baño en el río", "Degustación de gastronomía local", "Trekking en la selva", "Campamento cerca del río Niwa"],
    option : [""]
  },
]
};

// récupération de la config d'icônes depuis le HTML
function getIconsConfig(diapoKey) {
  const script = document.getElementById("icons-" + diapoKey);
  if (!script) return null;
  try {
    return JSON.parse(script.textContent);
  } catch (e) {
    console.error("Erreur parsing JSON icônes pour", diapoKey, e);
    return null;
  }
}

// Injection des captions (un caption par .element)
function injectCaptions() {
  Object.entries(captionsData).forEach(([key, slidesData]) => {
    const diapo = document.getElementById("diapo-" + key);
    if (!diapo) {
      console.warn("diapo non trouvée pour :", key);
      return;
    }

    const slideElements = diapo.querySelectorAll(".element");

    slidesData.forEach((data, index) => {
      const captionDiv = slideElements[index]?.querySelector(".caption, .Caption");
      if (!captionDiv) {
        console.warn(`Pas de conteneur caption trouvé pour ${key} slide ${index}`);
        return;
      }

      // --------- OISEAUX ----------
      if (key === "oiseaux") {
        captionDiv.innerHTML = `
          <h2>${data.title || ""}</h2>
          ${data.details?.map(d => `<h3>${d}</h3>`).join("") || ""}
          ${data.zones ? `<h3>Area de observación :</h3>${data.zones.map(z => `<p>${z}</p>`).join("")}` : ""}
          ${data.communities ? `<h4>Communidades</h4>${data.communities.map(c => `<p>${c}</p>`).join("")}` : ""}
        `;
      }

      // --------- AMAZONIE ----------
      if (key === "amazonie") {
        captionDiv.innerHTML = `
          <h2>${data.title || ""}</h2>

          ${data.details?.length ? `
            ${data.details.map(d => `<h3>${d}</h3>`).join("")}
            <div class="caption-block left">
              <img width="100" height="100" src="https://img.icons8.com/external-stickers-smashing-stocks/100/external-Cottage-holidays-and-travel-stickers-smashing-stocks.png" 
              loading="lazy" decoding="async"/>
              <div class="caption-text">
                ${data.nuit.map(n => `<p>${n}</p>`).join("")}
              </div>
            </div>
          ` : ""}

          ${data.lieux?.length ? `
            <h3>Lugares</h3>
            <div class="caption-block right">
              <div class="caption-text">
                ${data.lieux.map(l => `<p>${l}</p>`).join("")}
              </div>
              <img src="https://img.icons8.com/arcade/100/compass.png" width="100" height="100" loading="lazy" decoding="async" />
            </div>
          ` : ""}

          ${data.programme?.length ? `
            <h3>Programma</h3>
            <div class="caption-block left">
              <img width="100" height="100" src="https://img.icons8.com/external-photo3ideastudio-flat-photo3ideastudio/100/external-trekking-holiday-photo3ideastudio-flat-photo3ideastudio.png" />
              <div class="caption-text">
                ${data.programme.map(p => `<p>${p}</p>`).join("")}
              </div>
            </div>
            ${data.option.map(o => `<h4>${o}</h4>`).join("")}
          ` : ""}
        `;
      }
    });
  });
}

window.onload = () => {
  injectCaptions();

  const diapo = document.querySelector(".diapo");
  const next = document.querySelector("#nav-droite");
  const prev = document.querySelector("#nav-gauche");
  const diapoOiseaux = document.getElementById("diapo-oiseaux");
  const diapoAmazonie = document.getElementById("diapo-amazonie");

  function initSlider(newElements) {
    stopTimer();
    compteur = 0;
    elements = newElements;

    // --- restore original HTML if present, sinon cache-le ---
    if (!elements.dataset.origHtml) {
      elements.dataset.origHtml = elements.innerHTML;
    } else {
      // restaure l'HTML original avant d'ajouter le clone
      elements.innerHTML = elements.dataset.origHtml;
    }

    // clone du premier slide (pour l'effet infini)
    const first = elements.querySelector(".element");
    if (first) {
      const clone = first.cloneNode(true);
      clone.dataset.clone = "true";
      elements.appendChild(clone);
    } else {
      console.warn("Aucun .element trouvé dans", elements);
    }

    slides = Array.from(elements.children);
    slideWidth = diapo.getBoundingClientRect().width;

    elements.style.transition = "none";
    elements.style.transform = `translateX(0px)`;

    startTimer();
  }

  function slideNext() {
    if (!elements) return;
    compteur++;
    elements.style.transition = "transform 1s linear";
    let decal = -slideWidth * compteur;
    elements.style.transform = `translateX(${decal}px)`;
    setTimeout(() => {
      if (compteur >= slides.length - 1) {
        compteur = 0;
        elements.style.transition = "none";
        elements.style.transform = "translateX(0)";
      }
    }, 1000);
  }

  function slidePrev() {
    if (!elements) return;
    compteur--;
    elements.style.transition = "transform 1s linear";
    if (compteur < 0) {
      // on saute directement à la dernière vraie slide (sans transition) puis on déclenche l'animation
      compteur = slides.length - 1;
      let decal = -slideWidth * compteur;
      elements.style.transition = "none";
      elements.style.transform = `translateX(${decal}px)`;
      // ensuite on décrémente pour jouer l'animation "prev"
      setTimeout(() => {
        compteur--;
        elements.style.transition = "transform 1s linear";
        elements.style.transform = `translateX(${-slideWidth * compteur}px)`;
      }, 20);
      return;
    }
    let decal = -slideWidth * compteur;
    elements.style.transform = `translateX(${decal}px)`;
  }

  function stopTimer() {
    clearInterval(timer);
    timer = null;
  }

  function startTimer() {
    if (!timer) {
      timer = setInterval(slideNext, 5000);
    }
  }

  function updateTimer() {
    if (isMouseOver || !isWindowVisible) {
      stopTimer();
    } else {
      startTimer();
    }
  }

  diapo.addEventListener("mouseover", () => { isMouseOver = true; updateTimer(); });
  diapo.addEventListener("mouseout", () => { isMouseOver = false; updateTimer(); });
  document.addEventListener("visibilitychange", () => {
    isWindowVisible = !document.hidden;
    updateTimer();
  });

  next.addEventListener("click", slideNext);
  prev.addEventListener("click", slidePrev);

  window.addEventListener("resize", () => {
    if (!diapo) return;
    slideWidth = diapo.getBoundingClientRect().width;
    if (elements) {
      elements.style.transition = "none";
      elements.style.transform = `translateX(${-slideWidth * compteur}px)`;
    }
  });

  // par défaut : affiche oiseaux
  if (diapoOiseaux) {
    diapoOiseaux.style.display = "flex";
  }
  if (diapoAmazonie) {
    diapoAmazonie.style.display = "none";
  }
  initSlider(diapoOiseaux);

  // boutons de switch (si tu as des .tour-switch)
  document.querySelectorAll(".tour-switch")?.forEach(btn => {
    btn.addEventListener("click", () => {
      const tour = btn.dataset.tour;
      if (tour === "oiseaux") {
        if (diapoOiseaux) { diapoOiseaux.style.display = "flex"; initSlider(diapoOiseaux); }
        if (diapoAmazonie) { diapoAmazonie.style.display = "none"; }
      } else if (tour === "amazonie" || tour === "amzonie") {
        // accepte amazonie (ton id)
        if (diapoAmazonie) { diapoAmazonie.style.display = "flex"; initSlider(diapoAmazonie); }
        if (diapoOiseaux) { diapoOiseaux.style.display = "none"; }
      }
    });
  });
};
