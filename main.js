const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 850,
    height: 1200,
    webPreferences: {
      // 두점을 찍어
      preload: path.join(__dirname, 'renderer.js'), // or use nodeIntegration: true for dev

      // 드래그로 사이즈
      // preload: path.join(__dirname, 'preload.js'),
      // contextIsolation: true,
      // nodeIntegration: false,

      // html
      // preload: path.join(__dirname, "preload.js"),

      // 웹사이트
      // contextIsolation: true,         // true여야 preload에서 contextBridge 사용 가능
      // nodeIntegration: false,         // webview 보안상 false 유지
      // webviewTag: true,               // ⚠️ 중요: webview 사용 가능하게 해줌

    }
  });

  win.loadFile('index.html');
  // win.loadFile('drag.html');
  // win.loadFile('tag.html');
  // win.loadFile('web.html');
}

// app.whenReady().then(createWindow);

app.whenReady().then(() => {
  createWindow();

  ipcMain.on("tag-info", (event, data) => {
    console.log("Received tag info from renderer:", data);
  });
});