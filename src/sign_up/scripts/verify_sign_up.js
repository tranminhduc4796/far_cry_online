const {LOG_IN_SUCCEED} = require(`${__dirname}../../../event_handler.js`);
const {writeFile} = require('fs');


let signUpForm = document.getElementById('window-main__sign-up-button');
let username = document.getElementById('username');
let email = document.getElementById('email');
let password = document.getElementById('password');
let reconfirm_password = document.getElementById('reconfirm_password');

var validated_input = {
    username: false,
    email: false,
    password: false,
    reconfirm_password: false,
};

var validate_input_func = {
    username: () => {
        return validateUsername();
    },
    email: () => {
        return validateEmail();
    },
    password: () => {
        return validatePassword();
    },
    reconfirm_password: () => {
        return validateReconfirmPassword();
    }
};

document.addEventListener('DOMContentLoaded', () => {
    signUpForm.addEventListener('click', () => {
        verifySignUp();
    });
    username.addEventListener('focusout', () => {
        validated_input.username = validate_input_func.username();
    });
    email.addEventListener('focusout', () => {
        validated_input.email = validate_input_func.email();
    });
    password.addEventListener('focusout', () => {
        validated_input.password = validate_input_func.password();
    });
    reconfirm_password.addEventListener('focusout', () => {
        validated_input.reconfirm_password = validate_input_func.reconfirm_password();
    })
});


function validateUsername() {
    if (username.value.length < 6 || username.value.length > 20) {
        username.className = 'wrong-input';
        username.nextElementSibling.innerHTML = 'User name cannot be blank.';
        return false;
    } else {
        let re = RegExp(/\W+/);
         if (re.test(username.value)) {
             username.className = 'wrong-input';
             username.nextElementSibling.innerHTML = 'Not a valid user name.';
             return false;
         } else {
             username.className = 'validated-input';
             username.nextElementSibling.innerHTML = '';
             return true;
         }
    }
}

function validateEmail() {
    let re = RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    if (re.test(email.value.toLowerCase())) {
        email.className = 'validated-input';
        email.nextElementSibling.innerHTML = '';
        return true;
    } else {
        email.className = 'wrong-input';
        email.nextElementSibling.innerHTML = 'Please enter a valid email.';
        return false;
    }
}

function validatePassword() {
    let re = RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)[.*\S]{8,35}$/);
    if (re.test(password.value)) {
        password.className = 'validated-input';
        return true;
    } else {
        password.className = 'wrong-input';
        return false;
    }
}

function validateReconfirmPassword() {
    let error = document.getElementById('window-main__reconfirm-error');
    if (password.value === reconfirm_password.value && password.value.length > 0) {
        reconfirm_password.className = 'validated-input';
        error.innerHTML = "";
        return true;
    } else {
        reconfirm_password.className = 'wrong-input';
        error.innerHTML = "Password didn't match. Try again.";
        return false;
    }
}

function hashPassword(password) {
    let sha256 = require('js-sha256').sha256;
    return sha256(password)
}

function verifySignUp() {
    let valid = true;
    for (let key in validated_input) {
        if (validated_input[key] === false) {
            valid = validate_input_func[key]();
        }
    }
    if (valid) {
        signUpAndLogIn(username.value, hashPassword(password.value), email.value);
    }
}

async function signUpAndLogIn(userName, hashPassword, email) {
    let signUpSucceed = await signUp(userName, hashPassword, email);
    if (signUpSucceed.status) {
        writeFile(`${__dirname}/../../.client_token`, signUpSucceed.user.token, (error) => {
            if (error) throw error;
            ipcRenderer.send(LOG_IN_SUCCEED, username.value);
        })
    }
}
