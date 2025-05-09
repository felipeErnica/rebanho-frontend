import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'path'

const mainWindow = new BrowserWindow({
    fullscreen: true,
    webPreferences: {
        preload: path.join(app.getAppPath(), "/dist-electron/preload.cjs"),
    }
})

const createLoginWindow = () => {
    const loginWindow = new BrowserWindow({
        width: 400,
        height: 300,
        titleBarStyle: 'hidden',
        // titleBarOverlay: true,
        resizable: false,
        maximizable: false,
        minimizable: false,
        webPreferences: {
            preload: path.join(app.getAppPath(), "/dist-electron/preload.cjs"),
        }
    })

    ipcMain.on('close-login', () => loginWindow.close())
    ipcMain.on('open-main', () => mainWindow.loadURL(`file://${app.getAppPath()}/dist-react/index.html#/home`))
    //Menu.setApplicationMenu(null)
    loginWindow.loadURL(`file://${app.getAppPath()}/dist-react/index.html#/login`)
}

app.whenReady().then(() => {
    createLoginWindow()
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})
