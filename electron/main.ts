import path from 'path'
import { fileURLToPath } from 'node:url'
import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { electronApp } from '@electron-toolkit/utils'


// Fix for ESM
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function createMainWindow() {
    
    const mainWindow = new BrowserWindow({
        width: 1280,
        height: 720,
        show: false,
        titleBarStyle: 'hidden',
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
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
    })

    mainWindow.on('ready-to-show', () => {
        mainWindow.show()
    })

    if (process.env['VITE_DEV_SERVER_URL']) {
        mainWindow.loadURL(process.env['VITE_DEV_SERVER_URL'] + "#/home")
    } else {
        mainWindow.loadFile(
            path.join(app.getAppPath(), 'dist/index.html'),
            { hash: "home" }
        )
    }

    mainWindow.maximize()
}


const createLoginWindow = () => {
    const loginWindow = new BrowserWindow({
        width: 400,
        height: 500,
        titleBarStyle: 'hidden',
        show: false,
        resizable: false,
        maximizable: false,
        minimizable: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
        }
    })

    loginWindow.on('ready-to-show', () => {
        loginWindow.show()
    })

    loginWindow.webContents.setWindowOpenHandler((details) => {
        shell.openExternal(details.url)
        return { action: 'deny' }
    })

    ipcMain.on('close-login', () => loginWindow.close())
    ipcMain.on('open-main', () => {
        createMainWindow()
        loginWindow.close()
    })

    if (process.env['VITE_DEV_SERVER_URL']) {
        loginWindow.loadURL(process.env['VITE_DEV_SERVER_URL'] + "#/")
    } else {
        loginWindow.loadFile(path.join(app.getAppPath(), 'dist/index.html'))
    }

}


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {

    // Set app user model id for windows
    electronApp.setAppUserModelId('com.electron')

    const openLogin = () => {
        createLoginWindow()
        let authToken: string | undefined
        ipcMain.handle('get-token', () => authToken)
        ipcMain.on('set-token', (_, token) => authToken = token)
    }

    openLogin()

    app.on('activate', function() {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) openLogin()
    })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})
