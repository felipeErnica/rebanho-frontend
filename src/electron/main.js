import {app, BrowserWindow} from 'electron';
import path from "path"

const createWindow = () => {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600
    })
    mainWindow.loadFile(path.join(app.getAppPath(), "/dist-react/index.html"))
}

app.whenReady().then(() => {
    createWindow()
})
