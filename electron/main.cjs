const { app, BrowserWindow } = require("electron");
const path = require("path");

function createWindow() {
  const win = new BrowserWindow({
    width: 1440,
    height: 950,

    minWidth: 1000,
    minHeight: 700,

    backgroundColor: "#f8fafc",

    autoHideMenuBar: true,

    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  // Load the React/Vite production build
  const indexPath = path.join(
    __dirname,
    "..",
    "dist",
    "index.html"
  );

  win.loadFile(indexPath);

  // Open DevTools automatically while we are testing.
  // Remove these two lines after everything works.
  win.webContents.openDevTools();
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});