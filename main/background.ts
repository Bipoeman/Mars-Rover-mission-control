import path from 'path'
import { app, ipcMain } from 'electron'
import serve from 'electron-serve'
import { createWindow } from './helpers'
import { restApp } from './image_upload_server'


const isProd = process.env.NODE_ENV === 'production'
restApp

export var globalMainWindow : Electron.CrossProcessExports.BrowserWindow

if (isProd) {
  serve({ directory: 'app' })
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`)
}

;(async () => {
  await app.whenReady()

  const mainWindow = createWindow('main', {
    width: 1000,
    height: 600,
    autoHideMenuBar : true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      // devTools : false,
    },
  })

  globalMainWindow = mainWindow

  if (isProd) {
    await mainWindow.loadURL('app://./home')
  } else {
    const port = process.argv[2]
    await mainWindow.loadURL(`http://localhost:${port}/home`)
    mainWindow.webContents.openDevTools()
  }
})()

app.on('window-all-closed', () => {
  app.quit()
})

ipcMain.on('message', async (event, arg) => {
  event.reply('message', `${arg} World!`)
})
