const {BrowserWindow} = require('electron');
const {ipcMain, dialog} = require('electron');

function createGameWindow() {
    // Create the browser window.
    let game_win = new BrowserWindow({
        width: 400,
        height: 518,
        resizable: false,
        frame: false,
        webPreferences: {
            nodeIntegration: true
        },
        show: false
    });

    // and load the index.html of the app.
    game_win.loadFile(`${__dirname + '/index.html'}`);
    // Open the DevTools.

    // Emitted when the window is closed.
    game_win.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        game_win = null
    });

    return game_win
}

module.exports = {createGameWindow};