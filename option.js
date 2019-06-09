const {remote} = require('electron')

let minimizeButton = document.getElementById('window-header__minimize')
let closeButton = document.getElementById('window-header__close')

minimizeButton.addEventListener('click', minimizeWindow)
closeButton.addEventListener('click', closeWindow)

function closeWindow() {
    remote.app.quit();
}

function minimizeWindow() {
    let window = remote.getCurrentWindow();
    window.minimize()
}