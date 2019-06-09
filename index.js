const {app} = require('electron');
const {eventHandler} = require('./event_handler.js');
const {createSignInWindow} = require('./src/sign_in/index.js');
const {createSignUpWindow} = require('./src/sign_up/index.js');
const {createBinaryBrowserWindow} = require('./src/binary_browser/index.js');
const {createGameWindow} = require('./src/game_screen/index.js');

let windows;


function createWindow() {
    windows = {
        signInWindow: createSignInWindow(),
        signUpWindow: createSignUpWindow(),
        gameWin: createGameWindow(),
        pathWin: createBinaryBrowserWindow()
    };
    
    windows.signUpWindow.setParentWindow(windows.signInWindow);
    windows.pathWin.setParentWindow(windows.gameWin);
    
    // Create the browser window.
    windows.signInWindow.webContents.on('did-finish-load', () => {
        windows.signInWindow.show();
        eventHandler(windows);
    });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (windows === null) {
        createWindow()
    }
});
