const API_URL = "http://localhost:8080/api/auth";


const loginForm = document.getElementById("login-form");

const userNameInput = document.getElementById("userName");

const passwordInput = document.getElementById("password");

const loginButton = document.getElementById("login-button");

const usernameError = document.getElementById("username-error");

const passwordError = document.getElementById("password-error");

const popupMessage = document.getElementById("popup-message");

const togglePassword = document.getElementById("toggle-password");



/* =========================
   SHOW / HIDE PASSWORD
========================= */

togglePassword.addEventListener("click", function () {

    if (passwordInput.type === "password") {

        passwordInput.type = "text";

        togglePassword.textContent = "Hide";

    } else {

        passwordInput.type = "password";

        togglePassword.textContent = "Show";

    }

});



/* =========================
   LOGIN
========================= */

loginForm.addEventListener("submit", async function (event) {

    event.preventDefault();


    // Clear previous errors

    usernameError.textContent = "";

    passwordError.textContent = "";

    popupMessage.className = "";

    popupMessage.textContent = "";


    const userName = userNameInput.value.trim();

    const password = passwordInput.value;


    /* =========================
       FRONTEND VALIDATION
    ========================= */

    let valid = true;


    if (userName === "") {

        usernameError.textContent = "Username is required";

        valid = false;

    }


    if (password === "") {

        passwordError.textContent = "Password is required";

        valid = false;

    }


    if (!valid) {

        return;

    }


    loginButton.disabled = true;

    loginButton.textContent = "Logging in...";


    try {

        const response = await fetch(`${API_URL}/login`, {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify({

                userName: userName,

                password: password

            })

        });


        const data = await response.json();



        if (response.ok && data.success === true) {


            localStorage.setItem(
                "userId",
                data.userId
            );


            localStorage.setItem(
                "userName",
                data.userName
            );


            localStorage.setItem(
                "role",
                data.role
            );


            showMessage(
                "Login successful. Redirecting...",
                "success"
            );


            setTimeout(function () {

                window.location.href = "dassboard.html";

            }, 1000);


        } else {


            /* =========================
               LOGIN ERROR
            ========================= */

            showMessage(
                data.message || "Login failed",
                "error-message"
            );

        }


    } catch (error) {

        console.error(error);


        showMessage(
            "Cannot connect to the server",
            "error-message"
        );

    }


    loginButton.disabled = false;

    loginButton.textContent = "Login";

});



/* =========================
   POPUP FUNCTION
========================= */

function showMessage(message, type) {

    popupMessage.textContent = message;

    popupMessage.className = "show " + type;

}