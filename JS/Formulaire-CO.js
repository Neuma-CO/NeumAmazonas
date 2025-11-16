document.addEventListener('DOMContentLoaded', () => {
  // Formulaire de contact
  const contactForm = document.querySelector('.contact-form-container form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      const email = document.getElementById('email')?.value;
      const nom = document.getElementById('lastname')?.value;
      const prenom = document.getElementById('firstname')?.value;

      if (!email || !nom || !prenom) {
        alert("Por favor, complete los campos obligatorios.");
        e.preventDefault();
        return;
      }

      alert("Su solicitud fue enviada, gracias !");
    });
  }
  
  // 🔒 Bloquer les dates antérieures à aujourd'hui
  const today = new Date().toISOString().split("T")[0];
  const arrival = document.getElementById("arrival");
  const departure = document.getElementById("departure");

  arrival.setAttribute("min", today);
  departure.setAttribute("min", today);

  // 🔄 Adapter la date de départ en fonction de l'arrivée
  arrival.addEventListener("change", () => {
    departure.setAttribute("min", arrival.value);
    if (departure.value < arrival.value) {
      departure.value = arrival.value;
    }
  });
});

