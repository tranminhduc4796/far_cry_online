const {ipcRenderer} = require('electron');
const {
    OPEN_FILE_DIALOG,
    GAME_PATH,
    SELECTED_GAME_FILE,
    CLOSE_PATH_WIN
} = require(`${__dirname}../../../event_handler.js`);

const game_path_input = document.getElementById('game_path_input');
const error_mess = document.getElementById('error-mess');

ipcRenderer.on(SELECTED_GAME_FILE, (event, path) => {
    game_path_input.value = `${path}`;
});

// Open a dialog box to select a file
function openFileDialog() {
    ipcRenderer.send(OPEN_FILE_DIALOG)
}

function submitGamePath() {
//    In developing
    if (game_path_input.value) {
        ipcRenderer.send(GAME_PATH, game_path_input.value);
    } else {
        error_mess.removeAttribute('hidden')
    }
}

function hideWindow() {
    ipcRenderer.send(CLOSE_PATH_WIN)
}