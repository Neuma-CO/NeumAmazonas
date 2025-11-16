document.addEventListener('DOMContentLoaded', () => {
  const mapElement = document.getElementById('map');
  if (mapElement && typeof L !== 'undefined') {
    const map = L.map("map");

    // --- Map background ---
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    // --- Colored icons (from the Leaflet-color-markers set) ---
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

    // --- Markers with their respective icons ---
    const marker1 = L.marker([-3.78, -70.365555], { icon: greenIcon })
      .addTo(map)
      .bindPopup("<b><i>Puerto Nariño</i></b>", { autoClose: false, closeOnClick: false });

    const marker2 = L.marker([-3.813, -70.324], { icon: redIcon })
      .addTo(map)
      .bindPopup("<b><i>Cacao Island</i></b>", { autoClose: false, closeOnClick: false })
      .bindTooltip(
        "Charming Peruvian island facing Puerto Nariño.<br> A hidden treasure for bird and sloth watching<br> in their natural habitat.",
        { direction: "bottom" }
      );

    const marker3 = L.marker([-3.85, -70.25], { icon: blueIcon })
      .addTo(map)
      .bindPopup("<b><i>Mocagua</i></b>", { autoClose: false, closeOnClick: false })
      .bindTooltip(
        "A riverside community, pioneer in the protection and conservation<br>of the incredible Amazonian wildlife and its lush forest.",
        { direction: "left" }
      );

    const marker4 = L.marker([-3.777, -70.303], { icon: violetIcon })
      .addTo(map)
      .bindPopup("<b><i>San Martin de Amacayacu</i></b>", { autoClose: false, closeOnClick: false })
      .bindTooltip(
        "Located in the heart of Amacayacu National Park,<br>a vibrant meeting between ancestral tradition and living culture.<br> One of the main destinations for birdwatching.",
        { direction: "right" }
      );

    const marker5 = L.marker([-3.8, -70.42], { icon: goldIcon })
      .addTo(map)
      .bindPopup("<b><i>Lake Tarapoto</i></b>", { autoClose: false, closeOnClick: false })
      .bindTooltip(
        "A birdwatching sanctuary.<br> Also, frequent encounters with sloths and pink dolphins.",
        { direction: "bottom" }
      );

    // --- Automatic view adjustment ---
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
