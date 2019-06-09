const {ipcRenderer} = require('electron');
const {writeFile} = require('fs');
const findProcess = require('find-process');
const {
    GAME_NAME,
    OPEN_PATH_BROWSER,
    PLAY_GAME,
    GAME_IS_RUNNING,
    GAME_CAN_RUN,
    LOAD_USER,
    LOG_OUT,
    LOAD_CONFIG,
    LOAD_CONFIG_SUCCEED
} = require(`${__dirname}../../../event_handler.js`);

const error_mess = document.getElementById('error-mess');
const userName = document.getElementById('user_name');
const killText = document.getElementById('kill_text');
const deathText = document.getElementById('death_text');
const suicideText = document.getElementById('suicide_text');

let checkGameProcess;

ipcRenderer.on(GAME_IS_RUNNING, () => {
    error_mess.style.display = "block";
});

ipcRenderer.on(GAME_CAN_RUN, () => {
    error_mess.style.display = "none"
});

ipcRenderer.on(LOAD_USER, (event, userData) => {
    userName.innerHTML = userData.user_name;
    killText.innerHTML = userData.kills.toString();
    deathText.innerHTML = userData.deaths.toString();
    suicideText.innerHTML = userData.suicides.toString();
});

ipcRenderer.on(LOAD_CONFIG_SUCCEED, () => {
    ipcRenderer.send(PLAY_GAME, userName.innerHTML);
});

function openPathBrowser() {
    ipcRenderer.send(OPEN_PATH_BROWSER);
}

function loadConfig() {
    ipcRenderer.send(LOAD_CONFIG, userName.innerHTML);
}

function logOut() {
    writeFile(`${__dirname}/../../.client_token`, '', (err) => {
        if (err) throw err;
    });
    ipcRenderer.send(LOG_OUT);
}