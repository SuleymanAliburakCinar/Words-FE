const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process')

let mainWindow;
let springProcess;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.loadURL('http://localhost:8080');
  mainWindow.on('closed', () => {
    if (springProcess) {
      springProcess.kill();
    }
  });
}

app.whenReady().then(() => {
  springProcess = spawn("java", ["-jar", "C:\\Slo\\Projeler\\Intellij\\Words\\target\\demo-0.0.1-SNAPSHOT.jar"], {
    detached: false,
    stdio: "ignore",
  });

  createWindow();
});

app.on('window-all-closed', () => {
  if (springProcess) {
    springProcess.kill();
  }
  app.quit();
});
