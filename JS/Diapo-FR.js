let compteur = 0;
let timer, elements, slides, slideWidth;
let isMouseOver = false;
let isWindowVisible = true;

// Données textes (ajoute tes entrées ici pour chaque diapo)
const captionsData = {
  oiseaux: [
  {
    title: "Birdwatching à Puerto Nariño",
    details: ["5 jours/ 4 nuits", "Circuit intermédiaire"],
    zones: ["Fleuve Loretoyacú", "Ile des Cacao, Pérou", "Réserve RAMSAR", "Forêt inondée", "Lac Tarapoto"],
    communities: ["Saint Martin de Amacayacú", "Mocagua"]
  },
  {
    title: "MasterBirding - Primates & Paresseux",
    details: ["7 jours/ 6 nuits", "Circuit intensif"],
    zones: ["Leticia", "Puerto Nariño (zone urbaine)", "Iles Cacao (Pérou)", "Lac Tarapoto", "Fleuve Loretoyacú"],
    communities: ["Mocagua","Saint Martin de Amacayacú", "Valencia", "San Antonio"]
  }
],

amazonie: [  
  {
    title: "Découverte de Puerto Nariño",
    details: ["3 jours / 2 nuits"],
    nuit: ["2 nuits dans un hôtel spécialement sélectionné","pour vous"],
    lieux: ["Fleuve Amazone", "Îles du Cacao (Pérou)", "Lac Tarapoto"],
    programme: ["Visite guidée de la ville", "Observation des dauphins roses et gris", "Observation des paresseux et des singes", "Pêche artisanale", "Randonnée dans la jungle", "Dégustation de la gastronomie locale"],
    option : [""]
  },
  {
    title: "Puerto Nariño en famille",
    details: ["4 jours / 3 nuits"],
    nuit: ["3 nuits dans un hôtel de Puerto Nariño"],
    lieux: ["Puerto Nariño", "Lac Tarapoto","Îles du Cacao", "Mocagua"],
    programme: ["Observation des dauphins roses et gris, singes","Pêche artisanale", "Randonnée dans la jungle", "Dégustation de la gastronomie locale", "Jeux culturels Tikuna"],
    option : ["Option 'Petits explorateurs' → Guide spécialisé en observation des oiseaux"]
  },
  {
    title: "Expérience dans la jungle",
    details: ["4 jours / 3 nuits"],
    nuit: ["1 nuit à Puerto Nariño","1 nuit dans une maloka au cœur de la jungle","1 nuit dans une communauté"],
    lieux: ["Fleuve Amazone", "Pérou", "Lac Tarapoto"],
    programme: ["Trekking","Camping dans la jungle", "Observation des dauphins roses et pêche", "Découverte de la culture Tikuna"],
    option : [""]
  },
  {
    title: "Du fleuve à la jungle",
    details: ["4 jours / 3 nuits"],
    nuit: ["1 nuit à Puerto Nariño","1 nuit dans une maloka","1 nuit au bord du fleuve"],
    lieux: ["Puerto Nariño", "Pérou", "Lac Tarapoto"],
    programme: ["Trekking", "Observation des dauphins roses et gris", "Pêche", "Observation des paresseux"],
    option : [""]
  },
  {
    title: "Le parcours des communautés",
    details: ["4 jours / 3 nuits"],
    nuit: ["1 nuit à Puerto Nariño","2 nuits dans les communautés"],
    lieux: ["Puerto Nariño", "Îles du Cacao (Pérou)", "Lac Tarapoto","San Martín de Amacayacú","Mocagua"],
    programme: ["Randonnée dans la jungle", "Observation des dauphins roses et gris", "Observation des singes Churuco", "Pêche artisanale", "Découverte de la culture Tikuna et gastronomie"],
    option : [""]    
  },
  {
    title: "Immersion (communauté du 7 août)",
    details: ["5 jours / 4 nuits"],
    nuit: ["2 nuits à Puerto Nariño","2 nuits dans une communauté"],
    lieux: ["Puerto Nariño", "Lac Tarapoto", "Communauté du 7 août", "Frontière Pérou-Colombie"],
    programme: ["Observation des dauphins, caïmans, oiseaux et singes", "Pêche artisanale", "Baignade dans le fleuve", "Dégustation de la gastronomie locale", "Trekking dans la jungle", "Camping près du fleuve Niwa"],
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
          ${data.zones ? `<h3>Zones d'observation :</h3>${data.zones.map(z => `<p>${z}</p>`).join("")}` : ""}
          ${data.communities ? `<h4>Communautés</h4>${data.communities.map(c => `<p>${c}</p>`).join("")}` : ""}
        `;
      }

      // --------- AMAZONIE ----------
      if (key === "amazonie") {
        captionDiv.innerHTML = `
          <h2>${data.title || ""}</h2>

          ${data.details?.length ? `
            ${data.details.map(d => `<h3>${d}</h3>`).join("")}
            <div class="caption-block left">
              <img src="https://img.icons8.com/external-stickers-smashing-stocks/100/external-Cottage-holidays-and-travel-stickers-smashing-stocks.png" 
              loading="lazy" decoding="async"/>
              <div class="caption-text">
                ${data.nuit.map(n => `<p>${n}</p>`).join("")}
              </div>
            </div>
          ` : ""}

          ${data.lieux?.length ? `
            <h3>Lieux</h3>
            <div class="caption-block right">
              <div class="caption-text">
                ${data.lieux.map(l => `<p>${l}</p>`).join("")}
              </div>
              <img src="https://img.icons8.com/arcade/100/compass.png" loading="lazy" decoding="async" />
            </div>
          ` : ""}

          ${data.programme?.length ? `
            <h3>Programme</h3>
            <div class="caption-block left">
              <img src="https://img.icons8.com/external-photo3ideastudio-flat-photo3ideastudio/100/external-trekking-holiday-photo3ideastudio-flat-photo3ideastudio.png" />
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
