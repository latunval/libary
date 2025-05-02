let users = JSON.parse(localStorage.getItem("users")) || [];
let userIdCounter = JSON.parse(localStorage.getItem("userIdCounter")) || 0;

function saveToLocalStorage() {
  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("userIdCounter", JSON.stringify(userIdCounter));
}

const loginSection = document.getElementById("login-section");
const signUpSection = document.getElementById("signup-section");
const showSigupLink = document.getElementById("showSignup");
const showLoginLink = document.getElementById("showLogin");

showSigupLink.addEventListener("click", e => {
  e.preventDefault();
  loginSection.style.display = "none";
  signUpSection.style.display = "block";
});

showLoginLink.addEventListener("click", e => {
  e.preventDefault();
  signUpSection.style.display = "none";
  loginSection.style.display = "block";
});

function validatePassword(password) {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  return passwordRegex.test(password);
}

function validateEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

function validateName(name) {
  if (name.length < 2) {
    return { isValid: false, message: "Name must be at least 2 characters long" };
  }
  const nameRegex = /^[a-zA-Z\s]+$/;
  if (!nameRegex.test(name)) {
    return { isValid: false, message: "Name should only contain letters" };
  }
  if (name !== name.trim()) {
    return { isValid: false, message: "Name should not start or end with spaces" };
  }
  return { isValid: true, message: "" };
}

function showError(input, message) {
  input.classList.add("error");
  const errorElement = input.nextElementSibling;
  errorElement.textContent = message;
}

function clearError(input) {
  input.classList.remove("error");
  const errorElement = input.nextElementSibling;
  errorElement.textContent = "";
}

const loginEmail = document.getElementById("email");
const loginPassword = document.getElementById("password");
const loginErrorContainer = document.getElementById("loginErrorContainer");

loginEmail.addEventListener("input", e => {
  const emailInput = e.target;
  if (!validateEmail(emailInput.value)) {
    showError(emailInput, "Please enter a valid email address");
  } else {
    clearError(emailInput);
  }
});

loginPassword.addEventListener("input", e => {
  const passwordInput = e.target;
  if (!validatePassword(passwordInput.value)) {
    showError(passwordInput, "Password must be 8+ characters with 1 uppercase, 1 lowercase, and 1 number");
  } else {
    clearError(passwordInput);
  }
});

const fullName = document.getElementById("fullName");
const signUpEmail = document.getElementById("signupEmail");
const password1 = document.getElementById("signupPassword");
const password2 = document.getElementById("confirmPassword");

fullName.addEventListener("input", e => {
  const nameInput = e.target;
  const validation = validateName(nameInput.value);
  if (!validation.isValid) {
    showError(nameInput, validation.message);
  } else {
    clearError(nameInput);
  }
});

signUpEmail.addEventListener("input", e => {
  const emailInput = e.target;
  if (!validateEmail(emailInput.value)) {
    showError(emailInput, "Please enter a valid email address");
  } else {
    clearError(emailInput);
  }
});

password1.addEventListener("input", e => {
  const password = e.target;
  if (!validatePassword(password.value)) {
    showError(password, "Password must be 8+ characters with 1 uppercase, 1 lowercase, and 1 number");
  } else {
    clearError(password);
  }
});

password2.addEventListener("input", e => {
  const confirmPassword = e.target;
  if (confirmPassword.value !== password1.value) {
    showError(confirmPassword, "Passwords don't match");
  } else {
    clearError(confirmPassword);
  }
});

const logIn = document.getElementById("log");
logIn.addEventListener("click", e => {
  e.preventDefault();
  const email = loginEmail.value;
  const password = loginPassword.value;

  const foundUser = users.find(user => user.email === email && user.password1 === password);
  if (!foundUser) {
    loginErrorContainer.innerText = "Wrong details. Please check your input or create an account.";
    return;
  }

  alert("Login successful");
  let loginHistory = JSON.parse(localStorage.getItem("loginHistory")) || [];
  loginHistory.push(foundUser);
  localStorage.setItem("loginHistory", JSON.stringify(loginHistory));
  localStorage.setItem("loggedInUser", JSON.stringify(foundUser));

  if (foundUser.email === "valentino@gmail.com" && foundUser.password1 === "Valentino1") {
    window.location.href = "./admin.html";
  } else {
    window.location.href = "./index.html";
  }
});

const signUp = document.getElementById("sign");
signUp.addEventListener("click", e => {
  e.preventDefault();
  const name = fullName.value;
  const email = signUpEmail.value;
  const password1Val = password1.value;
  const password2Val = password2.value;

  if (!validateName(name).isValid || !validateEmail(email) || !validatePassword(password1Val) || password1Val !== password2Val) {
    alert("Please fill all inputs correctly");
    return;
  }

  const userExists = users.find(user => user.email === email);
  if (userExists) {
    alert("Email already registered");
    return;
  }

  const details = { name, email, password1: password1Val, password2: password2Val, id: userIdCounter++ };
  users.push(details);
  saveToLocalStorage();
  alert("Registration successful");
  signUpSection.style.display = "none";
  loginSection.style.display = "block";
});


const body = document.getElementById("body");
const light = document.getElementById('light');
const dark = document.getElementById('dark');

light.addEventListener('click', function(){
  // alert('hdhgdyu');
  dark.style.display =" block";
  light.style.display =" none"
  body.classList.remove('dark');
});

dark.addEventListener('click', function(){
  // alert('hdhgdyu');
  dark.style.display =" none";
  light.style.display =" block"
  body.classList.add('dark');
})

const dates = document.getElementById("date");
let date = new Date();
date = date.getFullYear();
dates.innerHTML = date;