const {ipcRenderer} = require('electron');
const {OPEN_SIGN_UP_WINDOW, CLOSE_CURRENT_WINDOW} = require('../../event_handler.js');

let signUpButton = document.getElementById("window-main__sign-up-link");
signUpButton.addEventListener('click', toSignUpPage)

function toSignUpPage() {
    // Show window after finish loading.
    ipcRenderer.send(OPEN_SIGN_UP_WINDOW, CLOSE_CURRENT_WINDOW);
}