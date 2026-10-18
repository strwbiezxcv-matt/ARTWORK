const loginPasswordInput = document.getElementById("loginPasswordInput");
const loginPasswordButton = document.getElementById("loginPasswordButton");
const signupPasswordInput = document.getElementById("signupPasswordInput");
const signupPasswordButton = document.getElementById("signupPasswordButton");
const loginContent = document.getElementById("loginContent");
const signupContent = document.getElementById("signupContent");
const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");

function togglePassword(input, button) {
  const isPassword = input.type === "password";
  input.type = isPassword ? "text" : "password";
  button.textContent = isPassword ? "Hide" : "Show";
}

function setFormEnabled(form, enabled) {
  Array.from(form.elements).forEach(function (element) {
    element.disabled = !enabled;
  });
}

loginPasswordButton.addEventListener("click", function () {
  togglePassword(loginPasswordInput, loginPasswordButton);
});

signupPasswordButton.addEventListener("click", function () {
  togglePassword(signupPasswordInput, signupPasswordButton);
});

function showSignup() {
  loginContent.style.display = "none";
  signupContent.style.display = "block";
  setFormEnabled(loginForm, false);
  setFormEnabled(signupForm, true);
}

function showLogin() {
  signupContent.style.display = "none";
  loginContent.style.display = "block";
  setFormEnabled(signupForm, false);
  setFormEnabled(loginForm, true);
}

if (window.location.hash === "#signupContent") {
  showSignup();
} else {
  showLogin();
}

document.getElementById("showSignup").addEventListener("click", showSignup);
document.getElementById("showLogin").addEventListener("click", showLogin);

loginForm.addEventListener("submit", function (event) {
  event.preventDefault();
  window.location.assign("allArtwork.html");
});

signupForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const signupMessage = document.getElementById("signupMessage");
  document.getElementById("loginEmail").value = document
    .getElementById("signupEmail")
    .value.trim();
  document.getElementById("loginMessage").textContent =
    "Your details meet the form requirements. No account was created or saved.";
  showLogin();
});

document.querySelectorAll("[data-policy-dialog]").forEach(function (link) {
  link.addEventListener("click", function (event) {
    event.preventDefault();
    document.getElementById(link.dataset.policyDialog).showModal();
  });
});

document.querySelectorAll(".policy-close").forEach(function (button) {
  button.addEventListener("click", function () {
    button.closest("dialog").close();
  });
});
