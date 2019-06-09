const {ipcMain, dialog} = require('electron');
const {execFile} = require('child_process');
const {existsSync, readFile, writeFile} = require('fs');
const findProcess = require('find-process');
const fetch = require("node-fetch");

const OPEN_SIGN_IN_WINDOW = 'open-sign-in-window';
const OPEN_SIGN_UP_WINDOW = 'open-sign-up-window';
const CLOSE_CURRENT_WINDOW = 'close-current-window';

const OPEN_FILE_DIALOG = 'open-file-dialog';
const OPEN_PATH_BROWSER = 'open-path-browser';
const GAME_PATH = 'game-path';
const SELECTED_GAME_FILE = 'selected-game-file';
const CLOSE_PATH_WIN = 'close-path-win';
const PLAY_GAME = 'play-game';
const GAME_IS_RUNNING = 'game-is-running';
const GAME_CAN_RUN = 'game-run';
const LOG_IN_SUCCEED = 'log-in-succeed';
const LOAD_USER = 'load-user';
const LOG_OUT = 'log-out';
const LOAD_CONFIG = 'load-config';
const LOAD_CONFIG_SUCCEED = 'load-config-succeed';

const DELIMETER = "ThiE^nvO^dU.nGnhA^'tTeAmPr0vIpNo1";
const GAME_NAME = 'farcry.py';
const exeFile = 'farcry.py';
const sysConfig = 'system.cfg';
const gameConfig = 'game.cfg';
let gamePath;


function validateGamePath() {
    return (existsSync(gamePath) && existsSync(`${gamePath}/${exeFile}`)
        && existsSync(`${gamePath}/${sysConfig}`)
        && existsSync(`${gamePath}/${gameConfig}`))
}

function saveConfig(username) {
    readFile(`${gamePath}/${sysConfig}`, 'utf8', async (err, sysData) => {
        if (err) throw err;
        readFile(`${gamePath}/${gameConfig}`, 'utf8', async (err, gameData) => {
            if (err) throw err;
            readFile('./.client_token', 'utf8', async (err, token) => {
                if (err) throw err;
                let rawResponse = await fetch(`http://localhost:8000/users/${username}/configs`, {
                    method: 'PUT',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        user_name: username,
                        config: gameData + DELIMETER + sysData
                    })
                });
            });
        });
    });
};


function eventHandler(windows) {
    ipcMain.on(OPEN_SIGN_IN_WINDOW, () => {
        windows.signInWindow.show();
        windows.signUpWindow.hide();
    });

    ipcMain.on(OPEN_SIGN_UP_WINDOW, () => {
        windows.signUpWindow.show();
        windows.signInWindow.hide();
    });

    ipcMain.on(OPEN_FILE_DIALOG, (event) => {
        dialog.showOpenDialog({
            properties: ['openDirectory']
        }, (file_path) => {
            if (file_path) {
                event.sender.send(SELECTED_GAME_FILE, file_path)
            }
        })
    });

    ipcMain.on(OPEN_PATH_BROWSER, () => {
        windows.pathWin.show();
        windows.gameWin.setEnabled(false);
    });

    ipcMain.on(GAME_PATH, (event, path_name) => {
        windows.pathWin.hide();
        windows.gameWin.setEnabled(true);
        gamePath = path_name;
    });

    ipcMain.on(CLOSE_PATH_WIN, () => {
        windows.pathWin.hide();
        windows.gameWin.setEnabled(true);
    });

    ipcMain.on(PLAY_GAME, async (event, userName) => {
            let p_list = await findProcess('name', GAME_NAME);
            if (p_list.length === 0) {
                event.sender.send(GAME_CAN_RUN);
                execFile(`${gamePath}/${exeFile}`, async (error, stdout) => {
                    saveConfig(userName);
                    event.sender.send(GAME_CAN_RUN);
                });
            }
            event.sender.send(GAME_IS_RUNNING);
        }
    );

    ipcMain.on(LOG_IN_SUCCEED, (event, username) => {
        readFile('./.client_token', 'utf8', async (err, token) => {
            if (err) throw err;
            let rawResponse = await fetch(`http://localhost:8000/users/${username}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            let userData = await rawResponse.json();
            windows.gameWin.show();
            windows.gameWin.webContents.send(LOAD_USER, userData.data);
            windows.signInWindow.hide();
            windows.signUpWindow.hide();
        })
    });

    ipcMain.on(LOG_OUT, () => {
        windows.gameWin.hide();
        windows.signInWindow.show();
    });

    ipcMain.on(LOAD_CONFIG,  (event, username) => {
        readFile('./.client_token', 'utf8', async (err, token) => {
            if (err) throw err;
            let rawResponse = await fetch(`http://localhost:8000/users/${username}/configs`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            let userData = await rawResponse.json();
            if (validateGamePath()) {
                if (userData.data != null) {
                    let data = userData.data.config.split(DELIMETER);

                    writeFile(`${gamePath}/${gameConfig}`, data[0], (err) => {
                        if (err) throw err;
                    });
                    writeFile(`${gamePath}/${sysConfig}`, data[1], (err) => {
                        if (err) throw err;
                    });
                }
                event.sender.send(LOAD_CONFIG_SUCCEED);
            } else {
                windows.pathWin.show();
                windows.gameWin.setEnabled(false);
            }
        });
        });
}

module.exports = {
    eventHandler,
    GAME_NAME,
    OPEN_SIGN_IN_WINDOW,
    OPEN_SIGN_UP_WINDOW,
    CLOSE_CURRENT_WINDOW,
    OPEN_PATH_BROWSER,
    OPEN_FILE_DIALOG,
    GAME_PATH,
    SELECTED_GAME_FILE,
    CLOSE_PATH_WIN,
    PLAY_GAME,
    GAME_IS_RUNNING,
    GAME_CAN_RUN,
    LOG_IN_SUCCEED,
    LOAD_USER,
    LOG_OUT,
    LOAD_CONFIG,
    LOAD_CONFIG_SUCCEED
};
