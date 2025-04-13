function editNav() {
  var x = document.getElementById("myTopnav");
  if (x.className === "topnav") {
    x.className += " responsive";
  } else {
    x.className = "topnav";
  }
}

// DOM Elements
const modalbg = document.querySelector(".bground");
const modalBtn = document.querySelectorAll(".modal-btn");
const formData = document.querySelectorAll(".formData");
const closeBtn = document.querySelector(".close");
const modalContent = document.querySelector(".content");
const form = document.querySelector("form[name='reserve']");
const firstName = document.getElementById("first");
const lastName = document.getElementById("last");

// launch modal event
modalBtn.forEach((btn) => btn.addEventListener("click", launchModal));

// launch modal form
function launchModal() {
  modalbg.style.display = "block";
}

// Ferme via la croix
closeBtn.addEventListener("click", closeModal);

// Ferme en cliquant en dehors de la modale
modalbg.addEventListener("click", function (e) {
  if (!modalContent.contains(e.target)) {
    closeModal();
  }
});

// close the modal
function closeModal() {
  const modalContent = document.querySelector(".content");

  // Appliquer l'animation de fermeture
  modalContent.style.animation = "modalclose var(--modal-duration) forwards";

  // Attendre la fin de l'animation avant de masquer la modale
  modalContent.addEventListener("animationend", function handleClose() {
    modalbg.style.display = "none";
    // Réinitialiser l’animation pour la prochaine ouverture
    modalContent.style.animation = "modalopen var(--modal-duration) forwards";
    modalContent.removeEventListener("animationend", handleClose);
    resetFormState();
    form.reset();
  });
}

// Fonction d'affichage des erreurs
function showError(input, message) {
  const formData = input.parentElement;
  formData.setAttribute("data-error", message);
  formData.setAttribute("data-error-visible", "true");
}

// Fonction de suppression des erreurs
function clearError(input) {
  const formData = input.parentElement;
  formData.removeAttribute("data-error");
  formData.setAttribute("data-error-visible", "false");
}

// Fonction de reset a la fermeture de la modale
function resetFormState() {
  const allInputs = document.querySelectorAll(
    ".text-control, input[type='radio'], input[type='checkbox'], input[type='date'], input[type='number'], input[type='email']"
  );
  allInputs.forEach((input) => clearError(input));
}

// Fonction de validation pour prénom et nom
function validateName(input, fieldName) {
  if (!input.value.trim()) {
    showError(input, `Le champ ${fieldName} est requis.`);
    return false;
  }
  const nameRegex =
    /^(?=(?:.*[A-Za-zÀ-ÖØ-öø-ÿ]){2,})[A-Za-zÀ-ÖØ-öø-ÿ]+(?:[-' ][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/;

  if (!nameRegex.test(input.value.trim())) {
    showError(input, `Le ${fieldName} doit contenir au moins 2 lettres (A-Z).`);
    return false;
  }
  clearError(input);
  return true;
}

// Fonction pour valider l'email avec une regex
function validateEmail(input) {
  const email = document.getElementById("email");
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailPattern.test(input.value.trim())) {
    showError(input, "Veuillez entrer une adresse email valide.");
    return false;
  } else {
    clearError(input);
    return true;
  }
}

// Fonction pour valider le nombre de concours
function validateQuantity(input) {
  const quantity = document.getElementById("quantity");
  const value = input.value.trim();
  if (value === "" || isNaN(value) || value < 0) {
    showError(input, "Veuillez entrer un nombre valide.");
    return false;
  } else {
    clearError(input);
    return true;
  }
}

//Fonction pour valider la selection d'une ville
function validateLocation() {
  const locationRadios = document.querySelectorAll("input[name='location']");
  let isChecked = false;

  locationRadios.forEach((radio) => {
    if (radio.checked) {
      isChecked = true;
    }
  });

  if (!isChecked) {
    const locationContainer = locationRadios[0].closest(".formData");
    locationContainer.setAttribute(
      "data-error",
      "Veuillez sélectionner une ville."
    );
    locationContainer.setAttribute("data-error-visible", "true");
    return false;
  } else {
    const locationContainer = locationRadios[0].closest(".formData");
    locationContainer.removeAttribute("data-error");
    locationContainer.setAttribute("data-error-visible", "false");
    return true;
  }
}

//Fonction pour valider les conditions d'utilisation
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

// Vérification
firstName.addEventListener("input", () => validateName(firstName, "prénom"));
lastName.addEventListener("input", () => validateName(lastName, "nom"));
email.addEventListener("change", () => validateEmail(email));
quantity.addEventListener("input", () => validateQuantity(quantity));

// Validation complète avant soumission
function validateForm() {
  let isValid = false;
  if (
    validateName(firstName, "prénom") &&
    validateName(lastName, "nom") &&
    validateEmail(email) &&
    validateQuantity(quantity) &&
    validateLocation() &&
    validateConditions()
  ) {
    isValid = true;
  }
  return isValid;
}

// Empêcher l'envoi du formulaire si invalide
form.addEventListener("submit", function (event) {
  if (!validateForm()) {
    event.preventDefault();
    //Afficher le message de succes
  }
});
