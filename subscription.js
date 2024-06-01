var form = document.querySelector(".subscription-form");
var mainTitle = document.querySelector("h1");
var inputs = document.querySelectorAll(".subscription-form > input");

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

    console.log(e.target.classList.contains("error"));
    console.log(e.target.name);

    if (target.classList.contains("error")) {
      target.classList.remove("error");
    }
  });
});

form.addEventListener("submit", function (e) {
  e.preventDefault();

  var validationErrors = [];

  inputs.forEach(function (input) {
    var validationMessage = validate[input.name](input.value);
    validationErrors.push(validationMessage);
  });

  if (validationErrors.length !== 0) {
  }

  alert("submitted");
});

// Se debe validar cada campo y mostrar un mensaje de error descriptivo abajo del campo que falló. Realizar las siguientes validaciones:

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
  var emailRegex =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (!value.match(emailRegex)) {
    return "Ingrese un email valido";
  }

  return null;
}
function validatePassword(value) {
  if (value.length < 8) {
    return "debe tener al menos 8 caracteres";
  }

  return null;
}

function validateRepeatedPassword(value) {
  var password = document.querySelector("input[name='password']").value;
  console.log(password);
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
function validatePhone(value) {}
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
  if (value.lenght < 3) {
    return "Debe tener al menos 3 caracteres";
  }
  return null;
}

function validateZipCode(value) {
  if (value.lenght < 3) {
    return "Debe tener al menos 3 caracteres";
  }

  return null;
}
function validateId(value) {}

// Nombre completo: Debe tener más de 6 letras y al menos un espacio entre medio.
// Email: debe tener un formato de email válido.
// Contraseña: Al menos 8 caracteres, formados por letras y números.
// Edad: Número entero mayor o igual a 18.
// Teléfono: Número de al menos 7 dígitos, no aceptar espacios, guiones ni paréntesis.
// Dirección: Al menos 5 caracteres, con letras, números y un espacio en el medio.
// Ciudad: Al menos 3 caracteres.
// Código Postal: Al menos 3 caracteres.
// DNI: Número de 7 u 8 dígitos.
