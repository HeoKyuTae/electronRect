const { contextBridge, ipcRenderer } = require('electron');
const Tesseract = require('tesseract.js');

contextBridge.exposeInMainWorld('ocrAPI', {
  recognizeText: async (dataURL) => {
    const result = await Tesseract.recognize(dataURL, 'eng+kor');
    return result.data.text;
  }
});

contextBridge.exposeInMainWorld("electronAPI", {
  sendTagInfo: (data) => ipcRenderer.send("tag-info", data)
});
