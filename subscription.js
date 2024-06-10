var form = document.querySelector(".subscription-form");
var mainTitle = document.querySelector("h1");
var inputs = document.querySelectorAll(
  ".subscription-form > .input-group > input"
);
var dialog = document.querySelector(".submit-dialog");
var dialogCloseBtn = document.querySelector(".submit-dialog > button");

var SUBSCRIPTION_STORAGE_KEY = "SUBSCRIPTION";

var validate = {
  fullname: validateFullName,
  email: validateEmail,
  password: validatePassword,
  repeatedPassword: validateRepeatedPassword,
  age: validateAge,
  phone: validatePhone,
  address: validateAddress,
  city: validateCity,
  zipCode: validateZipCode,
  id: validateId,
};

var translations = {
  fullname: "Nombre completo",
  email: "Correo electrónico",
  password: "Contraseña",
  repeatedPassword: "Repetir contraseña",
  age: "Edad",
  phone: "Teléfono",
  address: "Dirección",
  city: "Ciudad",
  zipCode: "Código Postal",
  id: "DNI",
};

function checkForSubscription() {
  var subscription = readLocalStorage(SUBSCRIPTION_STORAGE_KEY);

  if (!subscription) return;

  var flatObject = {};
  for (var field of subscription) {
    flatObject[field.name] = field.value;
  }

  mainTitle.innerHTML = "Hola " + flatObject.fullname;
  inputs.forEach(function (input) {
    input.value = flatObject[input.name];
  });
}

function closeDialog() {
  dialog.querySelector(".header").innerHTML = "";
  dialog.querySelector(".content").innerHTML = "";
  dialog.close();
}

window.addEventListener("load", checkForSubscription);
dialogCloseBtn.addEventListener("click", closeDialog);

inputs.forEach(function (input) {
  if (input.name === "fullname") {
    input.addEventListener("keyup", function (e) {
      mainTitle.innerHTML = "Hola " + e.target.value;
    });
  }

  input.addEventListener("blur", function (e) {
    var target = e.target;
    var validationMessage = validate[target.name](target.value);
    var errorElement = input.nextElementSibling;

    if (validationMessage) {
      input.classList.add("error");
      errorElement.textContent = validationMessage;
    }
  });

  input.addEventListener("focus", function (e) {
    var target = e.target;
    var errorElement = input.nextElementSibling;

    if (target.classList.contains("error")) {
      errorElement.textContent = "";
      target.classList.remove("error");
    }
  });
});

form.addEventListener("submit", function (e) {
  e.preventDefault();

  var validationErrors = handleFieldsValidation();

  if (validationErrors.length) {
    displayDialogContent(validationErrors, "error");
  } else {
    var formValues = getFormValues(form);
    subscribe(formValues);
  }
});

function subscribe(data) {
  var url = new URL("https://jsonplaceholder.typicode.com/users");

  for (var field of data) {
    url.searchParams.append(field.name, field.value);
  }

  fetch(url)
    .then(function (response) {
      if (response.ok) {
        writeLocalStorage(SUBSCRIPTION_STORAGE_KEY, data);
        displayDialogContent(data);
      }
    })
    .catch(function (error) {
      displayDialogContent(data, "subscription_error");
    });
}

function writeLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function readLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}

function getFormValues(form) {
  var elements = form.elements;
  var formValues = [];

  for (var i = 0; i < elements.length; i++) {
    var element = elements[i];
    if (element.name) {
      formValues.push({ name: element.name, value: element.value });
    }
  }

  return formValues;
}

function handleFieldsValidation() {
  var errors = [];

  inputs.forEach(function (input) {
    var validationMessage = validate[input.name](input.value);
    var errorElement = input.nextElementSibling;

    if (validationMessage) {
      input.classList.add("error");
      errorElement.textContent = validationMessage;
      errors.push({ name: input.name, value: validationMessage });
    }
  });

  return errors;
}

function displayDialogContent(data, state = "success") {
  var dialogContentElem = dialog.querySelector(".content");
  var dialogHeader = dialog.querySelector(".header");
  var dialogContent = "";

  dialog.dataset.state = state;

  var stateIcon = document.createElement("img");
  var dialogTitle = document.createElement("h2");

  stateIcon.classList.add("state-icon");
  stateIcon.src =
    "/assets/" + (state === "success" ? "check" : "error") + ".svg";

  if (state !== "subscription_error") {
    for (var i = 0; i < data.length; i++) {
      var field = data[i];
      dialogContent += "<div>";
      dialogContent += "<h2>" + translations[field.name] + "</h2>";
      dialogContent += "<p>" + field.value + "</p>";
      dialogContent += "</div>";
    }

    dialogTitle.innerHTML +=
      state !== "success"
        ? "Corrija los siguientes campos:"
        : "Subscripcion exitosa:";
  } else {
    dialogTitle.innerHTML = "Algo salio mal durante el proceso de subscripcion";
    dialogContent =
      "<p>Intenta más tarde. Si el error persiste no dudes en contactarnos</p>";
  }

  dialogHeader.append(stateIcon, dialogTitle);
  dialogContentElem.innerHTML = dialogContent;
  dialog.showModal();
}

// Form validations
function validateFullName(value) {
  if (value.length < 6) {
    return "Debe tener al menos 6 letras";
  }

  if (!value.trim().includes(" ")) {
    return "Debe al menos un espacio";
  }

  return null;
}

function validateEmail(value) {
  var emailPattern =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  var isValid = emailPattern.test(value);

  if (!isValid) {
    return "Ingrese un email valido";
  }

  return null;
}

function validatePassword(value) {
  if (value.length < 8) {
    return "Debe tener al menos 8 caracteres";
  }

  return null;
}

function validateRepeatedPassword(value) {
  var password = document.querySelector("input[name='password']").value;

  if (password.length === 0) {
    return "Complete la contraseña";
  }

  if (value !== password) {
    return "Las contraseñas no coindicen";
  }

  return null;
}

function validateAge(value) {
  if (value < 18) {
    return "Debe tener 18 o mas";
  }

  if (isNaN(value)) {
    return "Debe ingresar un numero";
  }

  return null;
}

function validatePhone(value) {
  var phonePattern = /^\d{7}$/;
  var isValid = phonePattern.test(value);

  if (!isValid) {
    return "Debe ingresar un numero de 7 digitos";
  }

  return null;
}

function validateAddress(value) {
  if (value.lenght < 5) {
    return "Debe contener al menos 5 caracteres";
  }

  if (!value.includes(" ")) {
    return "Debe contener al menos un espacio";
  }

  return null;
}

function validateCity(value) {
  if (value.length < 3) {
    return "Debe tener al menos 3 caracteres";
  }
  return null;
}

function validateZipCode(value) {
  if (value.length < 3) {
    return "Debe tener al menos 3 caracteres";
  }

  return null;
}

function validateId(value) {
  var idPattern = /^(\d{7}|\d{8})$/;
  var isValid = idPattern.test(value);

  if (!isValid) {
    return "Debe ingresar un numero de 7 y 8 digitos";
  }

  return null;
}
