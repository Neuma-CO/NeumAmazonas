document.addEventListener('DOMContentLoaded', () => {
  // Carte interactive
  const mapElement = document.getElementById('map');
  if (mapElement && typeof L !== 'undefined') {
    const map = L.map("map");

    // Fond de carte  
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    // Fonction pour créer une icône SVG colorée
    const createIcon = (color) =>
      L.divIcon({
        className: "custom-marker",
        html: `
          <svg xmlns="http://www.w3.org/2000/svg" width="25" height="41" viewBox="0 0 25 41">
            <path d="M12.5 0C6 0 0 6 0 13c0 9.5 12.5 28 12.5 28S25 22.5 25 13c0-7-6-13-12.5-13z" 
              fill="${color}" stroke="black" stroke-width="2"/>
            <circle cx="12.5" cy="13" r="5" fill="white"/>
          </svg>`,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
      });

    // Marqueurs
    const marker1 = L.marker([-3.78, -70.365555], { icon: createIcon("green") })
      .addTo(map);

    const marker2 = L.marker([-3.813, -70.324], { icon: createIcon("red") })
      .addTo(map)
      .bindPopup("<b><i>Île de Cacao</i></b>", { autoClose: false, closeOnClick: false })
      .bindTooltip(
        "Charmante île péruvienne en face de Puerto Nariño.<br> Un trésor caché pour l'observation des oiseaux et des paresseux<br> dans leur habitat naturel.", 
        { direction: "bottom" });

    const marker3 = L.marker([-3.85, -70.25], { icon: createIcon("blue") })
      .addTo(map)
      .bindPopup("<b><i>Mocagua</i></b>", { autoClose: false, closeOnClick: false })
      .bindTooltip(
        "Une communauté riveraine, pionnière dans la protection et la conservation <br>de l'incroyable faune amazonienne et de sa forêt luxuriante.",
        { direction: "left" }
      );

    const marker4 = L.marker([-3.777, -70.303], { icon: createIcon("violet") })
      .addTo(map)
      .bindPopup("<b><i>San Martin de Amacayacu</i></b>", { autoClose: false, closeOnClick: false })
      .bindTooltip(
        "Située au cœur du Parc National Amacayacu, <br>une rencontre vibrante entre tradition ancestrale et culture vivante.<br> L'une des principales destinations pour l'observation des oiseaux.",
        { direction: "right" }
      );

    const marker5 = L.marker([-3.8, -70.42], { icon: createIcon("gold") })
      .addTo(map)
      .bindPopup("<b><i>Lac Tarapoto</i></b>", { autoClose: false, closeOnClick: false })
      .bindTooltip(
        "Un sanctuaire de l'observation des oiseaux.<br> Également, les rencontres sont fréquentes avec paresseux et dauphins roses.", 
        { direction: "bottom" });

    // Groupe de tous les marqueurs pour ajuster la vue
    const group = L.featureGroup([marker1, marker2, marker3, marker4, marker5]);

    // Fonction responsive
    function adjustMapView() {
      if (window.innerWidth <= 768) {
        // 📱 Mobile : zoom plus large, sans popup ouverte
        map.fitBounds(group.getBounds(), { padding: [20, 20], maxZoom: 11 });
      } else {
        // 💻 Bureau : zoom plus précis + popups ouvertes
        map.fitBounds(group.getBounds(), { padding: [40, 40], maxZoom: 14 });
        marker1.openPopup();
        marker2.openPopup();
        marker3.openPopup();
        marker4.openPopup();
        marker5.openPopup();
      }
    }

    // Initialisation
    adjustMapView();

    // Ajustement si la fenêtre est redimensionnée
    window.addEventListener("resize", adjustMapView);
  }
});
