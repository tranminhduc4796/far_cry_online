const {BrowserWindow} = require('electron');
const url = require('url');
const path = require('path');

let mainWindow;

function createSignInWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 300,
        height: 400,
        frame: false,
        resizable: false,
        webPreferences: {
            nodeIntegration: true
        },
        show: false
    });

    // and load the index.html of the app.
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }));

    // Emitted when the window is closed.
    mainWindow.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });

    return mainWindow;
}

module.exports = {createSignInWindow};