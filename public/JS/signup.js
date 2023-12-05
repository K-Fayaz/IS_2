let usernameField = document.getElementById('username'),
	emailField = document.getElementById('email'),
	passwordField = document.getElementById('password'),
	submitButton = document.getElementById('submit');

let validUser = false;
let ValidEmail = false;
let validPassword = false;

let regx = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

function isUsernameValid(username) {
	return username.length >= 5;
}

function isEmailValid(email) {
	return regx.test(email);
}

function isPasswordValid(password) {
	/*
	Must contain at least one number and one uppercase and lowercase letter, and
	at least 8 or more characters.
	 */
	return /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/.test(password);
}

function validateUsernameField(event) {
	let value = usernameField.value;

	if (isUsernameValid(value)) {
		usernameField.classList.add('valid');
        document.getElementById("username-field").innerText = "";
        validUser = true;
	} else {
		usernameField.classList.remove('valid');
        document.getElementById("username-field").innerText = "Username is Invalid!";
        validUser = false;
	}
}

function validateEmailField(event) {
	let value = emailField.value;

	if (isEmailValid(value)) {
		emailField.classList.add('valid');
        document.getElementById("email-field").innerText = "";
        ValidEmail = true;
	} else {
		emailField.classList.remove('valid');
        document.getElementById("email-field").innerText = "Email is Invalid!";
        ValidEmail = false;
	}
}

function validatePasswordField(event) {
	let password = passwordField.value;

	if (isPasswordValid(password)) {
		passwordField.classList.add('valid');
        validPassword = true;
        document.getElementById("password-field").innerText = "";
	} else {
		passwordField.classList.remove('valid');
        document.getElementById("password-field").innerText = "Password is Invalid!";
        validPassword = false;
	}
}

emailField.addEventListener('keyup', validateEmailField);
usernameField.addEventListener('keyup', validateUsernameField);
passwordField.addEventListener('keyup', validatePasswordField);

submitButton.addEventListener('click', function(event) {
    if(validUser && ValidEmail && validPassword)
    {
        return;
    }else{
        event.preventDefault();
        if(!validUser)
        {
            document.getElementById("username-field").innerText = "Username is Invalid!";
        }else{
            document.getElementById("username-field").innerText = "";
        }

        if(!ValidEmail)
        {
            document.getElementById("email-field").innerText = "Email is Invalid!";
        }else{
            document.getElementById("emails-field").innerText = "";
        }

        if(!validPassword)
        {
            document.getElementById("password-field").innerText = "Password is Invalid!";
        }else{
            document.getElementById("password-field").innerText = "";
        }
    }
});

/* Self invoking function */
(function() {
	validateUsernameField();
	validateEmailField();
	validatePasswordField();
})();