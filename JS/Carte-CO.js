document.addEventListener('DOMContentLoaded', () => {
  // Mapa interactivo
  const mapElement = document.getElementById('map');
  if (mapElement && typeof L !== 'undefined') {
    const map = L.map("map");

    // Fondo de mapa  
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    // Función para crear un icono SVG de color
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

    // Marcadores
    const marker1 = L.marker([-3.78, -70.365555], { icon: createIcon("green") })
      .addTo(map);

    const marker2 = L.marker([-3.813, -70.324], { icon: createIcon("red") })
      .addTo(map)
      .bindPopup("<b><i>Isla Cacao</i></b>", { autoClose: false, closeOnClick: false })
      .bindTooltip(
        "Pintoresca isla peruana frente a Puerto Nariño.<br> Un tesoro escondido para la observación de aves y perezosos<br> en su hábitat natural.", 
        { direction: "bottom" });

    const marker3 = L.marker([-3.85, -70.25], { icon: createIcon("blue") })
      .addTo(map)
      .bindPopup("<b><i>Mocagua</i></b>", { autoClose: false, closeOnClick: false })
      .bindTooltip(
        "Una comunidad ribereña, pionera en la protección y conservación <br>de la increíble fauna amazónica y su exuberante selva.",
        { direction: "left" }
      );

    const marker4 = L.marker([-3.777, -70.303], { icon: createIcon("violet") })
      .addTo(map)
      .bindPopup("<b><i>San Martin de Amacayacu</i></b>", { autoClose: false, closeOnClick: false })
      .bindTooltip(
        "Ubicada en el corazón del Parque Nacional Amacayacu, <br>un vibrante encuentro entre tradición ancestral y cultura viva.<br> Uno de los principales destinos para la observación de aves.",
        { direction: "right" }
      );

    const marker5 = L.marker([-3.8, -70.42], { icon: createIcon("gold") })
      .addTo(map)
      .bindPopup("<b><i>Lago Tarapoto</i></b>", { autoClose: false, closeOnClick: false })
      .bindTooltip(
        "Un santuario impresionante para la observación de aves,<br> con frecuentes encuentros con perezosos y delfines rosados.", 
        { direction: "bottom" });

    // Grupo de todos los marcadores para ajustar la vista
    const group = L.featureGroup([marker1, marker2, marker3, marker4, marker5]);

    // Función responsive
    function adjustMapView() {
      if (window.innerWidth <= 768) {
        // 📱 Móvil : zoom más amplio, sin popup abierta
        map.fitBounds(group.getBounds(), { padding: [20, 20], maxZoom: 11 });
      } else {
        // 💻 Escritorio : zoom más preciso + popups abiertas
        map.fitBounds(group.getBounds(), { padding: [40, 40], maxZoom: 14 });
        marker1.openPopup();
        marker2.openPopup();
        marker3.openPopup();
        marker4.openPopup();
        marker5.openPopup();
      }
    }

    // Inicialización
    adjustMapView();

    // Ajuste si se redimensiona la pantalla
    window.addEventListener("resize", adjustMapView);
  }
});
