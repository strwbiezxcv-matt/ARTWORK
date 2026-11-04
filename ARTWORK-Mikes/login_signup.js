// ================= DOM REFS =================
const loginPasswordInput  = document.getElementById("loginPasswordInput");
const loginPasswordButton = document.getElementById("loginPasswordButton");
const signupPasswordInput = document.getElementById("signupPasswordInput");
const signupPasswordButton = document.getElementById("signupPasswordButton");
const signupConfirmInput  = document.getElementById("signupConfirmInput");
const signupConfirmButton = document.getElementById("signupConfirmButton");
const forgotNewPasswordInput     = document.getElementById("forgotNewPassword");
const forgotNewPasswordButton    = document.getElementById("forgotNewPasswordButton");
const forgotConfirmPasswordInput = document.getElementById("forgotConfirmPassword");
const forgotConfirmPasswordButton = document.getElementById("forgotConfirmPasswordButton");

const loginContent          = document.getElementById("loginContent");
const signupContent         = document.getElementById("signupContent");
const forgotPasswordContent = document.getElementById("forgotPasswordContent");

const loginForm          = document.getElementById("loginForm");
const signupForm         = document.getElementById("signupForm");
const forgotPasswordForm = document.getElementById("forgotPasswordForm");

// ================= STORAGE KEYS =================
const USERS_KEY    = "pmc_users";
const REMEMBER_KEY = "pmc_remembered_email";
const SESSION_KEY  = "pmc_auth_session_v1";
const PENDING_ACTION_KEY = "pmc-commerce-pending-action";
// ================= HELPERS =================
function getUsers() {
    try {
        return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
    } catch {
        return [];
    }
}

function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function findUser(email) {
    return getUsers().find(
        (u) => u.email.toLowerCase() === email.toLowerCase()
    );
}

function addUser(name, email, password) {
    const users = getUsers().filter(
        (u) => u.email.toLowerCase() !== email.toLowerCase()
    );
    const user = {
        id: window.crypto?.randomUUID?.() || `user-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        name,
        email,
        password
    };
    users.push(user);
    saveUsers(users);
    return user;
}

function getPostAuthDestination() {
    let pending = null;
    try {
        const saved = sessionStorage.getItem(PENDING_ACTION_KEY);
        pending = saved ? JSON.parse(saved) : null;
    } catch (error) {
        console.error("Unable to read the pending account action.", error);
    }

    const siteRoot = new URL("../", window.location.href);
    const home = new URL("finalproj.html", siteRoot);
    let target = home;

    if (pending?.action === "buy" && typeof pending.artworkId === "string") {
        target = new URL("nav-tab/artwork tab/artinfo.html", siteRoot);
        target.searchParams.set("artwork", pending.artworkId);
        try {
            sessionStorage.setItem("pmc-selected-artwork", pending.artworkId);
        } catch (error) {
            console.error("Unable to restore the selected artwork.", error);
        }
    } else if (pending?.action === "purchase" && typeof pending.artworkId === "string") {
        target = new URL("billing/bill.html", siteRoot);
        target.searchParams.set("mode", "direct");
        target.searchParams.set("art", pending.artworkId);
        target.searchParams.set("checkout", createCheckoutId());
    } else if (pending?.action === "checkout-cart") {
        target = new URL("billing/bill.html", siteRoot);
        target.searchParams.set("mode", "cart");
        target.searchParams.set("checkout", createCheckoutId());
    } else if (pending?.action === "inquire" && typeof pending.artistId === "string") {
        target = new URL("nav-tab/commission tab/commission.html", siteRoot);
        target.searchParams.set("artist", pending.artistId);
        target.searchParams.set("inquire", "1");
    } else if (pending?.action === "add-to-cart" && typeof pending.artworkId === "string") {
        target = safeReturnTarget(pending.returnTo) || safeReturnTarget(
            new URL(window.location.href).searchParams.get("returnTo")
        ) || home;
    } else {
        target = safeReturnTarget(new URL(window.location.href).searchParams.get("returnTo")) || home;
    }

    if (pending?.action !== "add-to-cart") {
        try {
            sessionStorage.removeItem(PENDING_ACTION_KEY);
        } catch (error) {
            console.error("Unable to clear the pending account action.", error);
        }
    }
    return target;
}

function createCheckoutId() {
    return window.crypto?.randomUUID?.() ||
        `checkout-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function safeReturnTarget(value) {
    if (!value) return null;
    const siteRoot = new URL("../", window.location.href);
    const target = new URL(value, siteRoot);
    if (target.protocol !== siteRoot.protocol ||
        (target.origin !== siteRoot.origin && target.protocol !== "file:") ||
        !target.pathname.startsWith(siteRoot.pathname)) return null;
    return target;
}

function completeAuthentication(user) {
    const session = {
        id: user.id || `legacy-${user.email.toLowerCase()}`,
        name: user.name || "",
        email: user.email
    };
    try {
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } catch (error) {
        console.error("Unable to save the local demo session.", error);
        return false;
    }
    window.location.assign(getPostAuthDestination().href);
    return true;
}

function updatePassword(email, newPassword) {
    const users = getUsers().map((u) =>
        u.email.toLowerCase() === email.toLowerCase()
            ? { ...u, password: newPassword }
            : u
    );
    saveUsers(users);
}

/**
 * STRICT: email must be a valid format AND end with @gmail.com
 */
function isValidGmail(email) {
    if (!email) return false;
    const gmailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;
    if (!gmailPattern.test(email)) return false;
    const localPart = email.split("@")[0];
    if (!localPart || localPart.length === 0) return false;
    return true;
}

function setFieldError(input, errorEl, message) {
    if (errorEl) errorEl.textContent = message || "";
    if (input) {
        if (message) input.classList.add("has-error");
        else input.classList.remove("has-error");
    }
}

function clearFieldError(input, errorEl) {
    setFieldError(input, errorEl, "");
}

function togglePassword(input, button) {
    const isPassword = input.type === "password";
    input.type = isPassword ? "text" : "password";
    button.textContent = isPassword ? "Hide" : "Show";
}

function setFormEnabled(form, enabled) {
    Array.from(form.elements).forEach(function (el) {
        el.disabled = !enabled;
    });
}

// ================= VIEW SWITCHING =================
function hideAll() {
    loginContent.style.display = "none";
    signupContent.style.display = "none";
    forgotPasswordContent.style.display = "none";
}

function showLogin() {
    hideAll();
    loginContent.style.display = "block";
    setFormEnabled(loginForm, true);
    setFormEnabled(signupForm, false);
    setFormEnabled(forgotPasswordForm, false);
}

function showSignup() {
    hideAll();
    signupContent.style.display = "block";
    setFormEnabled(loginForm, false);
    setFormEnabled(signupForm, true);
    setFormEnabled(forgotPasswordForm, false);
}

function showForgot() {
    hideAll();
    forgotPasswordContent.style.display = "block";
    setFormEnabled(loginForm, false);
    setFormEnabled(signupForm, false);
    setFormEnabled(forgotPasswordForm, true);
}

// ================= PASSWORD TOGGLES =================
loginPasswordButton.addEventListener("click", function () {
    togglePassword(loginPasswordInput, loginPasswordButton);
});
signupPasswordButton.addEventListener("click", function () {
    togglePassword(signupPasswordInput, signupPasswordButton);
});
signupConfirmButton.addEventListener("click", function () {
    togglePassword(signupConfirmInput, signupConfirmButton);
});
forgotNewPasswordButton.addEventListener("click", function () {
    togglePassword(forgotNewPasswordInput, forgotNewPasswordButton);
});
forgotConfirmPasswordButton.addEventListener("click", function () {
    togglePassword(forgotConfirmPasswordInput, forgotConfirmPasswordButton);
});

// ================= NAVIGATION =================
document.getElementById("showSignup").addEventListener("click", showSignup);
document.getElementById("showLogin").addEventListener("click", showLogin);
document.getElementById("showForgot").addEventListener("click", showForgot);
document.getElementById("backToLogin").addEventListener("click", showLogin);

// ================= INITIAL VIEW =================
if (new URLSearchParams(window.location.search).get("view") === "signup" ||
    window.location.hash === "#signupContent") {
    showSignup();
} else {
    showLogin();
}

// Prefill remembered email
const rememberedEmail = localStorage.getItem(REMEMBER_KEY);
if (rememberedEmail) {
    const emailField = document.getElementById("loginEmail");
    emailField.value = rememberedEmail;
    document.getElementById("rememberMe").checked = true;

    const welcome = document.getElementById("loginMessage");
    welcome.style.color = "var(--green-600)";
    welcome.textContent =
        "Welcome back, " + rememberedEmail + ". Enter your password to continue.";
}

// Clear errors as the user types
function bindClearOnInput(inputId, errorId) {
    const input = document.getElementById(inputId);
    const errorEl = document.getElementById(errorId);
    if (!input || !errorEl) return;
    input.addEventListener("input", function () {
        if (errorEl.textContent) {
            errorEl.textContent = "";
            input.classList.remove("has-error");
        }
    });
}

bindClearOnInput("loginEmail",             "loginEmailError");
bindClearOnInput("loginPasswordInput",     "loginPasswordError");
bindClearOnInput("signupName",             "signupNameError");
bindClearOnInput("signupEmail",            "signupEmailError");
bindClearOnInput("signupPasswordInput",    "signupPasswordError");
bindClearOnInput("signupConfirmInput",     "signupConfirmError");
bindClearOnInput("forgotEmail",            "forgotEmailError");
bindClearOnInput("forgotNewPassword",      "forgotNewPasswordError");
bindClearOnInput("forgotConfirmPassword",  "forgotConfirmPasswordError");

document.getElementById("signupTerms").addEventListener("change", function () {
    const err = document.getElementById("signupTermsError");
    if (err.textContent) err.textContent = "";
});

// ================= LOGIN SUBMIT =================
loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const emailInput    = document.getElementById("loginEmail");
    const passwordInput = document.getElementById("loginPasswordInput");
    const emailError    = document.getElementById("loginEmailError");
    const passwordError = document.getElementById("loginPasswordError");
    const loginMessage  = document.getElementById("loginMessage");

    clearFieldError(emailInput, emailError);
    clearFieldError(passwordInput, passwordError);
    loginMessage.textContent = "";

    const email    = emailInput.value.trim();
    const password = passwordInput.value;
    let hasError   = false;

    if (!email) {
        setFieldError(emailInput, emailError, "Email is required");
        hasError = true;
    } else if (!isValidGmail(email)) {
        setFieldError(emailInput, emailError, "Email must end with @gmail.com");
        hasError = true;
    }

    if (!password) {
        setFieldError(passwordInput, passwordError, "Password is required");
        hasError = true;
    } else if (password.length < 8) {
        setFieldError(passwordInput, passwordError, "Password must be at least 8 characters");
        hasError = true;
    }

    if (hasError) return;

    const user = findUser(email);

    if (!user) {
        setFieldError(emailInput, emailError, "Wrong email");
        return;
    }

    if (user.password !== password) {
        setFieldError(passwordInput, passwordError, "Wrong password");
        return;
    }

    if (document.getElementById("rememberMe").checked) {
        localStorage.setItem(REMEMBER_KEY, email);
    } else {
        localStorage.removeItem(REMEMBER_KEY);
    }

    loginMessage.style.color = "var(--green-600)";
    loginMessage.textContent = "Signing you in…";
    if (!completeAuthentication(user)) {
        loginMessage.textContent = "Unable to keep this demo session in this browser.";
    }
});

// ================= SIGNUP SUBMIT =================
signupForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const nameInput     = document.getElementById("signupName");
    const emailInput    = document.getElementById("signupEmail");
    const passwordInput = document.getElementById("signupPasswordInput");
    const confirmInput  = document.getElementById("signupConfirmInput");
    const termsInput    = document.getElementById("signupTerms");

    const nameError     = document.getElementById("signupNameError");
    const emailError    = document.getElementById("signupEmailError");
    const passwordError = document.getElementById("signupPasswordError");
    const confirmError  = document.getElementById("signupConfirmError");
    const termsError    = document.getElementById("signupTermsError");
    const signupMessage = document.getElementById("signupMessage");

    clearFieldError(nameInput, nameError);
    clearFieldError(emailInput, emailError);
    clearFieldError(passwordInput, passwordError);
    clearFieldError(confirmInput, confirmError);
    if (termsError) termsError.textContent = "";
    signupMessage.textContent = "";

    const name     = nameInput.value.trim();
    const email    = emailInput.value.trim();
    const password = passwordInput.value;
    const confirm  = confirmInput.value;
    let hasError   = false;

    if (!name) {
        setFieldError(nameInput, nameError, "Name is required");
        hasError = true;
    }

    if (!email) {
        setFieldError(emailInput, emailError, "Email is required");
        hasError = true;
    } else if (!isValidGmail(email)) {
        setFieldError(emailInput, emailError, "Email must end with @gmail.com");
        hasError = true;
    }

    if (!password) {
        setFieldError(passwordInput, passwordError, "Password is required");
        hasError = true;
    } else if (password.length < 8) {
        setFieldError(passwordInput, passwordError, "Password must be at least 8 characters");
        hasError = true;
    }

    if (!confirm) {
        setFieldError(confirmInput, confirmError, "Please confirm your password");
        hasError = true;
    } else if (password !== confirm) {
        setFieldError(confirmInput, confirmError, "Passwords do not match");
        hasError = true;
    }

    if (!termsInput.checked) {
        if (termsError) termsError.textContent = "Please accept the terms to continue";
        hasError = true;
    }

    if (hasError) return;

    if (findUser(email)) {
        setFieldError(emailInput, emailError, "Email already registered. Please sign in.");
        return;
    }

    let user;
    try {
        user = addUser(name, email, password);
    } catch (error) {
        console.error("Unable to save the local demo account.", error);
        signupMessage.textContent = "Unable to save this demo account in this browser.";
        return;
    }

    signupForm.reset();
    if (!completeAuthentication(user)) {
        signupMessage.textContent = "Account created, but the local demo session could not be saved.";
    }
});

// ================= FORGOT PASSWORD SUBMIT (FUNCTIONAL) =================
forgotPasswordForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const emailInput   = document.getElementById("forgotEmail");
    const newPwInput   = document.getElementById("forgotNewPassword");
    const confirmInput = document.getElementById("forgotConfirmPassword");

    const emailError   = document.getElementById("forgotEmailError");
    const newPwError   = document.getElementById("forgotNewPasswordError");
    const confirmError = document.getElementById("forgotConfirmPasswordError");
    const forgotMessage = document.getElementById("forgotMessage");

    clearFieldError(emailInput, emailError);
    clearFieldError(newPwInput, newPwError);
    clearFieldError(confirmInput, confirmError);
    forgotMessage.textContent = "";

    const email   = emailInput.value.trim();
    const newPw   = newPwInput.value;
    const confirm = confirmInput.value;
    let hasError  = false;

    // --- EMAIL: strict Gmail validation ---
    if (!email) {
        setFieldError(emailInput, emailError, "Email is required");
        hasError = true;
    } else if (!isValidGmail(email)) {
        setFieldError(emailInput, emailError, "Email must end with @gmail.com");
        hasError = true;
    }

    // --- NEW PASSWORD ---
    if (!newPw) {
        setFieldError(newPwInput, newPwError, "New password is required");
        hasError = true;
    } else if (newPw.length < 8) {
        setFieldError(newPwInput, newPwError, "Password must be at least 8 characters");
        hasError = true;
    }

    // --- CONFIRM PASSWORD ---
    if (!confirm) {
        setFieldError(confirmInput, confirmError, "Please re-enter your new password");
        hasError = true;
    } else if (newPw && newPw !== confirm) {
        setFieldError(confirmInput, confirmError, "Passwords do not match");
        hasError = true;
    }

    if (hasError) return;

    // --- Find user by email ---
    const user = findUser(email);
    if (!user) {
        setFieldError(emailInput, emailError, "Wrong email");
        return;
    }

    // --- Update password (no current-password check) ---
    updatePassword(email, newPw);

    forgotMessage.style.color = "var(--green-600)";
    forgotMessage.textContent = "Password updated! Redirecting to sign in…";

    forgotPasswordForm.reset();

    setTimeout(function () {
        document.getElementById("loginEmail").value = email;
        document.getElementById("loginPasswordInput").value = "";
        document.getElementById("loginMessage").textContent = "";
        showLogin();
    }, 900);
});

// ================= POLICY DIALOGS =================
document.querySelectorAll("[data-policy-dialog]").forEach(function (link) {
    link.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
        document.getElementById(link.dataset.policyDialog).showModal();
    });
});

document.querySelectorAll(".policy-close").forEach(function (button) {
    button.addEventListener("click", function () {
        button.closest("dialog").close();
    });
});