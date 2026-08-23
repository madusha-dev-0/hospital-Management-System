const API_URL = "http://localhost:8080/api/auth";


const signupForm = document.getElementById("signup-form");

const userNameInput = document.getElementById("userName");

const passwordInput = document.getElementById("password");

const confirmPasswordInput =
    document.getElementById("confirmPassword");

const signupButton =
    document.getElementById("signup-button");


const usernameError =
    document.getElementById("username-error");

const passwordError =
    document.getElementById("password-error");

const confirmPasswordError =
    document.getElementById("confirm-password-error");


const popupMessage =
    document.getElementById("popup-message");


const togglePassword =
    document.getElementById("toggle-password");



/* =========================
   SHOW PASSWORD
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
   SIGNUP
========================= */

signupForm.addEventListener("submit", async function (event) {

    event.preventDefault();


    usernameError.textContent = "";

    passwordError.textContent = "";

    confirmPasswordError.textContent = "";

    popupMessage.className = "";

    popupMessage.textContent = "";


    const userName =
        userNameInput.value.trim();

    const password =
        passwordInput.value;

    const confirmPassword =
        confirmPasswordInput.value;


    let valid = true;



    /* =========================
       USERNAME VALIDATION
    ========================= */

    if (userName === "") {

        usernameError.textContent =
            "Username is required";

        valid = false;

    }


    if (userName.length < 3 && userName !== "") {

        usernameError.textContent =
            "Username must contain at least 3 characters";

        valid = false;

    }



    /* =========================
       PASSWORD VALIDATION
    ========================= */

    if (password === "") {

        passwordError.textContent =
            "Password is required";

        valid = false;

    }


    if (password.length < 6 && password !== "") {

        passwordError.textContent =
            "Password must contain at least 6 characters";

        valid = false;

    }



    /* =========================
       CONFIRM PASSWORD
    ========================= */

    if (confirmPassword === "") {

        confirmPasswordError.textContent =
            "Please confirm your password";

        valid = false;

    }


    if (
        password !== confirmPassword &&
        confirmPassword !== ""
    ) {

        confirmPasswordError.textContent =
            "Passwords do not match";

        valid = false;

    }


    if (!valid) {

        return;

    }



    /* =========================
       DISABLE BUTTON
    ========================= */

    signupButton.disabled = true;

    signupButton.textContent =
        "Creating account...";



    try {

        const response = await fetch(
            `${API_URL}/signup`,
            {

                method: "POST",

                headers: {

                    "Content-Type":
                        "application/json"

                },

                body: JSON.stringify({

                    userName: userName,

                    password: password

                })

            }
        );


        const data =
            await response.json();



        /* =========================
           SUCCESS
        ========================= */

        if (
            response.ok &&
            data.success === true
        ) {

            showMessage(
                "Account created successfully. Redirecting to login...",
                "success"
            );


            signupForm.reset();


            setTimeout(function () {

                window.location.href =
                    "login.html";

            }, 1500);


        } else {


            /* =========================
               ERROR
            ========================= */

            if (
                data.error ===
                "USERNAME_EXISTS"
            ) {

                usernameError.textContent =
                    "Username already exists";

            } else {

                showMessage(
                    data.message ||
                    "Signup failed",
                    "error-message"
                );

            }

        }


    } catch (error) {

        console.error(error);


        showMessage(
            "Cannot connect to the server",
            "error-message"
        );

    }


    signupButton.disabled = false;

    signupButton.textContent =
        "Sign Up";

});



/* =========================
   POPUP
========================= */

function showMessage(message, type) {

    popupMessage.textContent =
        message;

    popupMessage.className =
        "show " + type;

}