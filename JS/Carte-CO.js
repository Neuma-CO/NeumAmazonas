document.addEventListener('DOMContentLoaded', () => {
  const mapElement = document.getElementById('map');
  if (mapElement && typeof L !== 'undefined') {
    const map = L.map("map");

    // --- Fondo del mapa ---
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    // --- Iconos de colores (del conjunto Leaflet-color-markers) ---
    const iconBase = "https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers@master/img/";

    const greenIcon = new L.Icon({
      iconUrl: iconBase + "marker-icon-green.png",
      shadowUrl: iconBase + "marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    const redIcon = new L.Icon({
      iconUrl: iconBase + "marker-icon-red.png",
      shadowUrl: iconBase + "marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    const blueIcon = new L.Icon({
      iconUrl: iconBase + "marker-icon-blue.png",
      shadowUrl: iconBase + "marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    const violetIcon = new L.Icon({
      iconUrl: iconBase + "marker-icon-violet.png",
      shadowUrl: iconBase + "marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    const goldIcon = new L.Icon({
      iconUrl: iconBase + "marker-icon-gold.png",
      shadowUrl: iconBase + "marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    // --- Marcadores con sus respectivos íconos ---
    const marker1 = L.marker([-3.78, -70.365555], { icon: greenIcon })
      .addTo(map)
      .bindPopup("<b><i>Puerto Nariño</i></b>", { autoClose: false, closeOnClick: false });

    const marker2 = L.marker([-3.813, -70.324], { icon: redIcon })
      .addTo(map)
      .bindPopup("<b><i>Isla del Cacao</i></b>", { autoClose: false, closeOnClick: false })
      .bindTooltip(
        "Encantadora isla peruana frente a Puerto Nariño.<br> Un tesoro escondido para la observación de aves y perezosos<br> en su hábitat natural.",
        { direction: "bottom" }
      );

    const marker3 = L.marker([-3.85, -70.25], { icon: blueIcon })
      .addTo(map)
      .bindPopup("<b><i>Mocagua</i></b>", { autoClose: false, closeOnClick: false })
      .bindTooltip(
        "Una comunidad ribereña, pionera en la protección y conservación<br>de la increíble fauna amazónica y su exuberante selva.",
        { direction: "left" }
      );

    const marker4 = L.marker([-3.777, -70.303], { icon: violetIcon })
      .addTo(map)
      .bindPopup("<b><i>San Martin de Amacayacu</i></b>", { autoClose: false, closeOnClick: false })
      .bindTooltip(
        "Ubicada en el corazón del Parque Nacional Amacayacu,<br>un encuentro vibrante entre la tradición ancestral y la cultura viva.<br> Uno de los principales destinos para la observación de aves.",
        { direction: "right" }
      );

    const marker5 = L.marker([-3.8, -70.42], { icon: goldIcon })
      .addTo(map)
      .bindPopup("<b><i>Lago Tarapoto</i></b>", { autoClose: false, closeOnClick: false })
      .bindTooltip(
        "Un santuario para la observación de aves.<br> También son frecuentes los encuentros con perezosos y delfines rosados.",
        { direction: "bottom" }
      );

    // --- Ajuste automático de la vista ---
    const group = L.featureGroup([marker1, marker2, marker3, marker4, marker5]);

    function adjustMapView() {
      if (window.innerWidth <= 768) {
        map.fitBounds(group.getBounds(), { padding: [20, 20], maxZoom: 11 });
      } else {
        map.fitBounds(group.getBounds(), { padding: [40, 40], maxZoom: 14 });
        marker1.openPopup();
        marker2.openPopup();
        marker3.openPopup();
        marker4.openPopup();
        marker5.openPopup();
      }
    }

    adjustMapView();
    window.addEventListener("resize", adjustMapView);
  }
});
