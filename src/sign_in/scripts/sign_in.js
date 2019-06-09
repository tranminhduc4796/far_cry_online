const {writeFile} = require('fs');
const {LOG_IN_SUCCEED} = require(`${__dirname}../../../event_handler.js`);

let signInButton = document.getElementById('window-main__login-button');
let errorLog = document.getElementById('error-mess');
let userNameTag = document.getElementById('user_name');
let passwordTag = document.getElementById('password');

signInButton.addEventListener('click', () => {
    signIn();
});

async function signIn() {
    // Send given user information through RESTful API
    // Show error to html if failed
    // Proceed to launcher page if succeed
    let authenticateSucceed = await authenticate();
    if (authenticateSucceed.status) {
        writeFile(`${__dirname}/../../.client_token`, authenticateSucceed.user.token, (error) => {
            if (error) throw error;
            ipcRenderer.send(LOG_IN_SUCCEED, authenticateSucceed.user.user_name);
            userNameTag.value = "";
            passwordTag.value = "";
        })
    }
}

function hashPassword(password) {
    let sha256 = require('js-sha256').sha256;
    return sha256(password)
}

async function authenticate() {
    let userName = await userNameTag.value;
    let password = await passwordTag.value;
    rawResponse = await fetch('http://localhost:8000/users', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            user: {user_name: userName, password: hashPassword(password), email: "", email_verified: false, token: ""},
            action: "log in"
        })
      });
    const content = await rawResponse.json();
    if (!content.status) {
        errorLog.innerHTML = content.message;
    }
    return content
}