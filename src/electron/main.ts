import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'path'

const createMainWindow = () => {
    const mainWindow = new BrowserWindow({
        width: 1280,
        height: 720,
        titleBarStyle: 'hidden',
        webPreferences: {
            preload: path.join(app.getAppPath(), "/dist-electron/preload.cjs"),
        }
    })
    ipcMain.on('close-main', () => mainWindow.close())
    ipcMain.on('minimize-main', () => mainWindow.minimize())
    ipcMain.on('maximize-main', () => {
        if (mainWindow.isMaximized()) {
            mainWindow.unmaximize()
            return
        }
        mainWindow.maximize()
        //mainWindow.setSize(1280, 720)
    })
    mainWindow.loadURL(`file://${app.getAppPath()}/dist-react/index.html#/home`)
}

const createLoginWindow = () => {
    const loginWindow = new BrowserWindow({
        width: 400,
        height: 500,
        titleBarStyle: 'hidden',
        autoHideMenuBar: true,
        resizable: false,
        maximizable: false,
        minimizable: false,
        webPreferences: {
            preload: path.join(app.getAppPath(), "/dist-electron/preload.cjs"),
        }
    })

    ipcMain.on('close-login', () => loginWindow.close())
    ipcMain.on('open-main', () => {
        createMainWindow()
        loginWindow.close()
    })
    loginWindow.loadURL(`file://${app.getAppPath()}/dist-react/index.html#/login`)
}

app.whenReady().then(() => {
    let authToken: string | undefined
    createLoginWindow()
    ipcMain.handle('get-token', () => authToken)
    ipcMain.on('set-token', (_, token) => authToken = token)
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})
