const {ipcRenderer} = require('electron');
const {OPEN_SIGN_IN_WINDOW, CLOSE_CURRENT_WINDOW} = require('../../event_handler.js');

let signInButton = document.getElementById("window-main__sign-in-link");
signInButton.addEventListener('click', toSignInPage);

function toSignInPage() {
    // Show window after finish loading.
    ipcRenderer.send(OPEN_SIGN_IN_WINDOW, CLOSE_CURRENT_WINDOW);
}