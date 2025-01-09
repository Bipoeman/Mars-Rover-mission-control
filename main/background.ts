import path from 'path'
import { app, ipcMain } from 'electron'
import serve from 'electron-serve'
import { createWindow } from './helpers'
import { restApp } from './image_upload_server'
import { mkdir, mkdirSync } from 'fs'
import { mqttClient } from './mqtt_client'
import mqtt from 'mqtt/*'


const isProd = process.env.NODE_ENV === 'production'
// restApp
mqttClient

export var globalMainWindow: Electron.CrossProcessExports.BrowserWindow

if (isProd) {
  serve({ directory: 'app' })
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`)
}

interface submitInterface {
  status: string;
  team: string;
}
interface uploadAllowed {
  enable: boolean;
}
; (async () => {
  await app.whenReady()

  const mainWindow = createWindow('main', {
    width: 1000,
    height: 600,
    autoHideMenuBar: true,
    icon: "./resources/icon.png",
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      devTools: false,
    },
  })

  globalMainWindow = mainWindow
  try {
    mkdirSync("uploads")

  }
  catch {

  }

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

ipcMain.on("imageAllow", (event, arg:uploadAllowed)=>{
  if (mqttClient && mqttClient.connected){
    mqttClient.publish("/app/enableUpload",JSON.stringify(arg))
  }
})

ipcMain.on("submit", (event, arg : submitInterface)=>{
  if (mqttClient && mqttClient.connected){
    mqttClient.publish("/app/command",JSON.stringify(arg))
  }
})
