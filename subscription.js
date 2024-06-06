var form = document.querySelector(".subscription-form");
var mainTitle = document.querySelector("h1");
var inputs = document.querySelectorAll(
  ".subscription-form > .input-group > input"
);
var dialog = document.querySelector(".submit-dialog");
var dialogCloseBtn = document.querySelector(".submit-dialog > button");

dialogCloseBtn.addEventListener("click", function () {
  dialog.close();
});

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

    if (errorElement.textContent !== "") {
      errorElement.textContent = "";
      input.classList.remove("error");
    }

    if (target.classList.contains("error")) {
      target.classList.remove("error");
    }
  });
});

form.addEventListener("submit", function (e) {
  e.preventDefault();
  var dialogContentElem = dialog.querySelector(".content");
  var validationErrors = [];

  inputs.forEach(function (input) {
    var validationMessage = validate[input.name](input.value);
    var errorElement = input.nextElementSibling;

    if (validationMessage) {
      input.classList.add("error");
      errorElement.textContent = validationMessage;
      validationErrors.push({ field: input.name, message: validationMessage });
    }
  });

  var dialogContent = "";

  for (var i = 0; i < validationErrors.length; i++) {
    var error = validationErrors[i];

    console.log(error);
    dialogContent += "<h2>" + translations[error.field] + "</h2>";
    dialogContent += "<p>" + error.message + "</p>";
  }
  dialogContentElem.innerHTML = dialogContent;

  if (!validationErrors.length) {
    form.reset();
  }

  dialog.showModal();
});

function validateFullName(value) {
  if (value.length < 6) {
    return "Debe tener al menos 6 letras";
  }

  if (!value.includes(" ")) {
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

// Nombre completo: Debe tener más de 6 letras y al menos un espacio entre medio.
// Email: debe tener un formato de email válido.
// Contraseña: Al menos 8 caracteres, formados por letras y números.
// Edad: Número entero mayor o igual a 18.
// Teléfono: Número de al menos 7 dígitos, no aceptar espacios, guiones ni paréntesis.
// Dirección: Al menos 5 caracteres, con letras, números y un espacio en el medio.
// Ciudad: Al menos 3 caracteres.
// Código Postal: Al menos 3 caracteres.
// DNI: Número de 7 u 8 dígitos.
