let compteur = 0;
let timer, elements, slides, slideWidth;
let isMouseOver = false;
let isWindowVisible = true;

// Données textes (ajoute tes entrées ici pour chaque diapo)
const captionsData = {
  oiseaux: [
  {
    title: "Watch them all in Puerto Nariño",
    details: ["5 days/ 4 nights", "Intermediate tour"],
    zones: [ "Puerto Nariño Center","Loretoyacú River", "Cacao Island (Peru)", "RAMSAR Reserve", "Flooded forest", "Tarapoto Lake and flooded areas"],
    communities: ["San Martín de Amacayacú", "Mocagua"]
  },
  {
    title: "MasterBirding - Primates & Sloths",
    details: ["7 days/ 6 nights", "Intensive tour"],
    zones: ["Leticia Center", "Kilometer Two ('Los Lagos')", "Puerto Nariño (urban area)", "Cacao Islands (Peru)", "Tarapoto Lake and flooded areas", "Loretoyacú River"],
    communities: ["Mocagua","San Martín de Amacayacú", "Valencia", "San Antonio"]
  }
],

  amazonie: [  
  {
    title: "Discovering Puerto Nariño",
    details: ["3 days / 2 nights"],
    nuit: ["2 nights in a specially selected hotel","for you"],
    lieux: ["Amazon River", "Cacao Islands (Peru)", "Tarapoto Lake"],
    programme: ["Guided city tour", "Observation of pink and gray dolphins", "Observation of sloths and monkeys", "Traditional fishing", "Jungle hike", "Local gastronomy tasting"],
    option : [""]
  },
  {
    title: "Puerto Nariño with family",
    details: ["4 days / 3 nights"],
    nuit: ["3 nights in a Puerto Nariño hotel"],
    lieux: ["Puerto Nariño", "Tarapoto Lake","Cacao Islands", "Mocagua"],
    programme: ["Observation of pink and gray dolphins, monkeys","Traditional fishing", "Jungle hike", "Local gastronomy tasting", "Tikuna cultural games"],
    option : ["Option 'Little Explorers' → Specialized birdwatching guide"]
  },
  {
    title: "Jungle Experience",
    details: ["4 days / 3 nights"],
    nuit: ["1 night in Puerto Nariño","1 night in a maloka in the heart of the jungle","1 night in a community"],
    lieux: ["Amazon River", "Peru", "Tarapoto Lake"],
    programme: ["Trekking","Jungle camping", "Observation of pink dolphins and fishing", "Discovery of Tikuna culture"],
    option : [""]
  },
  {
    title: "From the river to the jungle",
    details: ["4 days / 3 nights"],
    nuit: ["1 night in Puerto Nariño","1 night in a maloka","1 night on the riverbank"],
    lieux: ["Puerto Nariño", "Peru", "Tarapoto Lake"],
    programme: ["Trekking", "Observation of pink and gray dolphins", "Fishing", "Observation of sloths"],
    option : [""]
  },
  {
    title: "Tour of the communities",
    details: ["4 days / 3 nights"],
    nuit: ["1 night in Puerto Nariño","2 nights in communities"],
    lieux: ["Puerto Nariño", "Cacao Islands (Peru)", "Tarapoto Lake","San Martín de Amacayacú","Mocagua"],
    programme: ["Jungle hike", "Observation of pink and gray dolphins", "Observation of Churuco monkeys", "Traditional fishing", "Discovery of Tikuna culture and gastronomy"],
    option : [""]    
  },
  {
    title: "Immersion (7 de Agosto community)",
    details: ["5 days / 4 nights"],
    nuit: ["2 nights in Puerto Nariño","2 nights in a community"],
    lieux: ["Puerto Nariño", "Tarapoto Lake", "7 de Agosto Community", "Peru-Colombia border"],
    programme: ["Observation of dolphins, caimans, birds, monkeys, etc.", "Traditional fishing", "Bathing in the river", "Local gastronomy tasting", "Jungle trekking", "Camping near the Niwa River"],
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
          ${data.zones ? `<h3>Observation areas :</h3>${data.zones.map(z => `<p>${z}</p>`).join("")}` : ""}
          ${data.communities ? `<h4>Communities</h4>${data.communities.map(c => `<p>${c}</p>`).join("")}` : ""}
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
            <h3>Lieux</h3>
            <div class="caption-block right">
              <div class="caption-text">
                ${data.lieux.map(l => `<p>${l}</p>`).join("")}
              </div>
              <img src="https://img.icons8.com/arcade/100/compass.png" width="100" height="100" loading="lazy" decoding="async" />
            </div>
          ` : ""}

          ${data.programme?.length ? `
            <h3>Programme</h3>
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
