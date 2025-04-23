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
const closeBtn = document.querySelector(".close");
const modalContent = document.querySelector(".content");
const form = document.querySelector("form[name='reserve']");
const firstName = document.getElementById("first");
const lastName = document.getElementById("last");
const email = document.getElementById("email");
const quantity = document.getElementById("quantity");
const thanks = document.getElementById("thanks");
const birthdate = document.getElementById("birthdate");

// Fonction d'ouverture de la modale
function launchModal() {
  // Affichage de la modale
  modalbg.style.display = "block";
  // Cache le message de remerciement
  thanks.style.display = "none";
  // Réaffiche le form
  form.style.display = "block";
}

// Event pour lancer la modale
modalBtn.forEach((btn) => btn.addEventListener("click", launchModal));

// Fonction de fermerture de la modale
function closeModal() {
  modalContent.style.animation = "modalclose var(--modal-duration) forwards";

  const handleClose = () => {
    modalbg.style.display = "none";
    modalContent.style.animation = "modalopen var(--modal-duration) forwards";
    modalContent.removeEventListener("animationend", handleClose);
    resetFormState();
    form.reset();
  };

  modalContent.addEventListener("animationend", handleClose);
}

// Event pour fermer via la croix
closeBtn.addEventListener("click", closeModal);

// Event pour fermer en dehors de la modale
modalbg.addEventListener("click", function (e) {
  if (!modalContent.contains(e.target)) {
    closeModal();
  }
});

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
    // Ajout du trim pour ne pas prendre en compte les espaces au debut et a la fin
    showError(input, `Le champ ${fieldName} est requis.`);
    return false;
  }
  // RegEx acceptant les noms et prenoms composés
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
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailPattern.test(input.value.trim())) {
    showError(input, "Veuillez entrer une adresse email valide.");
    return false;
  } else {
    clearError(input);
    return true;
  }
}

// Fonction pour valider la date de naissance
function validateBirthdate() {
  const birthdateInput = document.getElementById("birthdate");
  const birthdateValue = birthdateInput.value;

  if (!birthdateValue) {
    showError(birthdateInput, "Veuillez renseigner votre date de naissance.");
    return false;
  }

  const birthDate = new Date(birthdateValue); // Valeur du champ rentré dans la date
  const today = new Date(); // Date actuelle
  const age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  const dayDiff = today.getDate() - birthDate.getDate();

  // Vérifie si la personne a bien 18 ans
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

// Fonction pour valider le nombre de concours
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

// Fonction pour valider la selection d'une ville
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

// Fonction pour valider les conditions d'utilisation
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
birthdate.addEventListener("change", validateBirthdate);
quantity.addEventListener("input", () => validateQuantity(quantity));

// Validation complète avant soumission
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

// Empêcher l'envoi du formulaire si invalide
form.addEventListener("submit", function (event) {
  event.preventDefault();

  if (validateForm()) {
    // Affiche le message de remerciement
    thanks.style.display = "flex";
    // Si c'est valide, on cache le formulaire
    form.style.display = "none";
    const btnClose = document.querySelector(".btnclose");
    // Ajoute un listener pour fermer la modale si on clique sur Fermer
    btnClose.addEventListener("click", closeModal);
  }
});
