function editNav() {
  var x = document.getElementById("myTopnav");
  if (x.className === "topnav") {
    x.className += " responsive";
  } else {
    x.className = "topnav";
  }
}

// ===== Sélection des éléments du DOM =====
const modalbg = document.querySelector(".bground");
const modalBtn = document.querySelectorAll(".modal-btn");
const closeBtn = document.querySelector(".close");
const modalContent = document.querySelector(".content");
const form = document.querySelector("form[name='reserve']");
const firstName = document.getElementById("first");
const lastName = document.getElementById("last");
const email = document.getElementById("email");
const quantity = document.getElementById("quantity");
const thanks = document.getElementById("thanks");
const birthdate = document.getElementById("birthdate");

// ===== Fonction d'ouverture de la modale =====
function launchModal() {
  modalbg.style.display = "block"; // Affichage de la modale
  thanks.style.display = "none"; // Cache le message de remerciement au cas où
  form.style.display = "block"; // Réaffiche le formulaire
}

// Ajout des événements d’ouverture de la modale
modalBtn.forEach((btn) => btn.addEventListener("click", launchModal));

// ===== Fonction de fermeture de la modale =====
function closeModal() {
  modalContent.style.animation = "modalclose var(--modal-duration) forwards"; // Animation de fermeture

  const handleClose = () => {
    modalbg.style.display = "none"; // Cache la modale une fois l’animation terminée
    modalContent.style.animation = "modalopen var(--modal-duration) forwards"; // Réinitialise l'animation
    modalContent.removeEventListener("animationend", handleClose);
    resetFormState();
    form.reset(); // Réinitialise les champs du formulaire
  };

  modalContent.addEventListener("animationend", handleClose); // Attend la fin de l'animation pour fermer
}

// Fermeture via la croix
closeBtn.addEventListener("click", closeModal);

// Fermeture en cliquant en dehors du contenu de la modale
modalbg.addEventListener("click", function (e) {
  if (!modalContent.contains(e.target)) {
    closeModal();
  }
});

// ===== Gestion des erreurs =====

// Affiche un message d’erreur pour un champ donné
function showError(input, message) {
  const formData = input.parentElement;
  formData.setAttribute("data-error", message);
  formData.setAttribute("data-error-visible", "true");
}

// Supprime les messages d’erreur
function clearError(input) {
  const formData = input.parentElement;
  formData.removeAttribute("data-error");
  formData.setAttribute("data-error-visible", "false");
}

// Réinitialise toutes les erreurs visibles sur les champs
function resetFormState() {
  const allInputs = document.querySelectorAll(
    ".text-control, input[type='radio'], input[type='checkbox'], input[type='date'], input[type='number'], input[type='email']"
  );
  allInputs.forEach((input) => clearError(input));
}

// ===== Fonctions de validation individuelles =====

// Validation du prénom et du nom
function validateName(input, fieldName) {
  if (!input.value.trim()) {
    showError(input, `Le champ ${fieldName} est requis.`);
    return false;
  }
  // Expression régulière pour les noms composés (accents, tirets, etc.)
  const nameRegex =
    /^(?=(?:.*[A-Za-zÀ-ÖØ-öø-ÿ]){2,})[A-Za-zÀ-ÖØ-öø-ÿ]+(?:[-' ][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/;

  if (!nameRegex.test(input.value.trim())) {
    showError(input, `Le ${fieldName} doit contenir au moins 2 lettres (A-Z).`);
    return false;
  }
  clearError(input);
  return true;
}

// Validation de l'email
function validateEmail(input) {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailPattern.test(input.value.trim())) {
    showError(input, "Veuillez entrer une adresse email valide.");
    return false;
  } else {
    clearError(input);
    return true;
  }
}

// Validation de la date de naissance (18 ans minimum)
function validateBirthdate() {
  const birthdateInput = document.getElementById("birthdate");
  const birthdateValue = birthdateInput.value;

  if (!birthdateValue) {
    showError(birthdateInput, "Veuillez renseigner votre date de naissance.");
    return false;
  }

  const birthDate = new Date(birthdateValue);
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  const dayDiff = today.getDate() - birthDate.getDate();

  const is18 =
    age > 18 ||
    (age === 18 && (monthDiff > 0 || (monthDiff === 0 && dayDiff >= 0)));

  if (!is18) {
    showError(
      birthdateInput,
      "Vous devez avoir au moins 18 ans pour vous inscrire."
    );
    return false;
  }

  clearError(birthdateInput);
  return true;
}

// Validation du nombre de concours
function validateQuantity(input) {
  const value = input.value.trim();
  if (value === "" || isNaN(value) || value < 0) {
    showError(input, "Veuillez entrer un nombre valide.");
    return false;
  } else {
    clearError(input);
    return true;
  }
}

// Validation du choix de la ville
function validateLocation() {
  const locationRadios = document.querySelectorAll("input[name='location']");
  let isChecked = false;

  locationRadios.forEach((radio) => {
    if (radio.checked) {
      isChecked = true;
    }
  });

  const locationContainer = locationRadios[0].closest(".formData");

  if (!isChecked) {
    locationContainer.setAttribute(
      "data-error",
      "Veuillez sélectionner une ville."
    );
    locationContainer.setAttribute("data-error-visible", "true");
    return false;
  } else {
    locationContainer.removeAttribute("data-error");
    locationContainer.setAttribute("data-error-visible", "false");
    return true;
  }
}

// Validation des conditions générales
function validateConditions() {
  const checkbox1 = document.getElementById("checkbox1");
  if (!checkbox1.checked) {
    showError(checkbox1, "Vous devez accepter les conditions d'utilisation.");
    return false;
  } else {
    clearError(checkbox1);
    return true;
  }
}

// ===== Ajout des validations en temps réel sur les champs =====
firstName.addEventListener("input", () => validateName(firstName, "prénom"));
lastName.addEventListener("input", () => validateName(lastName, "nom"));
email.addEventListener("change", () => validateEmail(email));
birthdate.addEventListener("change", validateBirthdate);
quantity.addEventListener("input", () => validateQuantity(quantity));

// ===== Validation globale du formulaire =====
function validateForm() {
  let isValid = false;
  if (
    validateName(firstName, "prénom") &&
    validateName(lastName, "nom") &&
    validateEmail(email) &&
    validateBirthdate() &&
    validateQuantity(quantity) &&
    validateLocation() &&
    validateConditions()
  ) {
    isValid = true;
  }
  return isValid;
}

// ===== Gestion de la soumission du formulaire =====
form.addEventListener("submit", function (event) {
  event.preventDefault(); // Empêche l'envoi par défaut

  if (validateForm()) {
    thanks.style.display = "flex"; // Affiche le message de remerciement
    form.style.display = "none"; // Cache le formulaire

    const btnClose = document.querySelector(".btnclose");
    btnClose.addEventListener("click", closeModal); // Permet de fermer via le bouton "Fermer"
  }
});
