const {BrowserWindow} = require('electron');

function createBinaryBrowserWindow() {
    // Create the browser window.
    let path_win = new BrowserWindow({
        width: 1094,
        height: 205,
        resizable: false,
        frame: false,
        webPreferences: {
            nodeIntegration: true
        },
        show: false,
        modal: true
    });

    // and load the index.html of the app.
    path_win.loadFile(`${__dirname + '/index.html'}`);

    // Emitted when the window is closed.
    path_win.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        path_win = null
    });
    return path_win;
}

module.exports = {createBinaryBrowserWindow};