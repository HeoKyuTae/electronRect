const { ipcRenderer } = require("electron");

window.addEventListener("DOMContentLoaded", () => {
  document.addEventListener("click", (e) => {
    const el = e.target;
    const data = {
      tagName: el.tagName,
      id: el.id || "none",
      className: el.className || "none",
      text: el.innerText?.slice(0, 100) || "none",
      mouseX: e.pageX,
      mouseY: e.pageY,
    };

    ipcRenderer.sendToHost("tag-info", data);
  });
});
