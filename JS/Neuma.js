/*--------------------------*/
/*MENU DEROULANT DE LANGUES*/
/*--------------------------*/

document.addEventListener('DOMContentLoaded', () => {

  const langToggle = document.getElementById('langToggle');
  const langMenu = document.getElementById('langMenu');

  if (langToggle && langMenu) {
    langToggle.addEventListener('click', function (e) {
      e.stopPropagation();
      langMenu.classList.toggle('show');
    });

    window.addEventListener('click', function () {
      langMenu.classList.remove('show');
    });
  }
})

/*--------------------------*/
/*BOUTON DE CONTACT FLOTTANT*/
/*--------------------------*/

document.addEventListener('DOMContentLoaded', () => {

  const contactBtn = document.getElementById('contactBtn');
  const splash = document.getElementById('splash-screen');
  const contactSection = document.getElementById('contactForm');

  if (contactBtn && splash && contactSection) {
    window.addEventListener('scroll', () => {
      const splashBottom = splash.offsetTop + splash.offsetHeight;
      const contactRect = contactSection.getBoundingClientRect();
      const contactVisible = contactRect.top < window.innerHeight && contactRect.bottom > 0;

      if (window.scrollY > splashBottom - 100 && !contactVisible) {
        // Affiche le bouton si on a dépassé le splash ET qu'on n'est pas sur la section contact
        contactBtn.classList.add('show');
      } else {
        // Cache le bouton sinon
        contactBtn.classList.remove('show');
      }
    });
  }
});

/*-----*/ 
/*DIAPO*/
/*-----*/

document.querySelectorAll('.image-texte').forEach(item => {
  item.addEventListener('click', () => {
    item.classList.toggle('open');
  });
});

/*----------------------------*/
/*Caroussel "QUI SOMMES-NOUS?"*/
/*----------------------------*/

document.addEventListener('DOMContentLoaded', () => {

  let aboutIndex = 0;
  const aboutTrack = document.querySelector('.about-track');
  const aboutSlides = document.querySelectorAll('.about-slide');
  const aboutLeft = document.querySelector('.about-nav.left');
  const aboutRight = document.querySelector('.about-nav.right');

  function updateAboutCarousel() {
    if (aboutTrack && aboutSlides.length > 0) {
      const slideWidth = aboutSlides[0].offsetWidth;
      aboutTrack.style.transform = `translateX(-${aboutIndex * slideWidth}px)`;
    }
  }

  if (aboutLeft && aboutRight && aboutSlides.length > 0 && aboutTrack) {
    aboutLeft.addEventListener('click', () => {
      aboutIndex = (aboutIndex - 1 + aboutSlides.length) % aboutSlides.length;
      updateAboutCarousel();
    });

    aboutRight.addEventListener('click', () => {
      aboutIndex = (aboutIndex + 1) % aboutSlides.length;
      updateAboutCarousel();
    });

    window.addEventListener('resize', updateAboutCarousel);
  }
});

/*---------*/
/*ReCAPTCHA*/
/*---------*/

document.addEventListener("DOMContentLoaded", function() {
    grecaptcha.ready(function() {
        grecaptcha.execute("VOTRE_SITE_KEY", {action: "homepage"}).then(function(token) {
            // On envoie le token au serveur pour vérification
            fetch("/PHP/recaptcha.php", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: "token=" + token
            })
            .then(response => response.json())
            .then(data => {
                // 🔍 Debug : affiche la réponse brute de Google dans la console
                console.log("Résultat reCAPTCHA :", data);

                if (!data.success || data.score < 0.5) {
                    // Si c’est un bot suspect → rediriger ou afficher un message
                    alert("Accès refusé : suspicion de robot.");
                    window.location.href = "access-denied.html";
                } else {
                    console.log("✅ reCAPTCHA validé : humain détecté (score = " + data.score + ")");
                }
            })
            .catch(error => console.error("Erreur lors de la vérification reCAPTCHA :", error));
        });
    });
});