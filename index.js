const electron  = require('electron');
const memory    = require('node-free');
const path      = require('path');
const sudo      = require('sudo-prompt');

const { app, Tray, Menu } = electron;
let tray;

app.on('ready', () => {
  app.dock.hide();
  tray = new Tray(path.join(__dirname, './assets/icons/icon_16x16.png'));
  setTitle();
  buildMenu();
  setInterval(() => {
    setTitle();
    buildMenu();
  }, 10000);
});

const bytesToGb = (bytes) => `${(bytes / 1073741824).toFixed(2)} GB`;

const setTitle = () => tray.setTitle(bytesToGb(memory.free()));

const buildMenu = () => {
  const contextMenu = Menu.buildFromTemplate([
    {
      label: `Total ${bytesToGb(memory.total())}`,
      enabled: false,
    },
    {
      label: `Used ${bytesToGb(memory.used())}`,
      enabled: false,
    },
    {
      label: 'Clean Memory',
      click: () => {
        sudo.exec('purge', {
          name: 'Memory Status',
          icns: path.join(__dirname, './assets/icons/icon_512x512.png')
        },
        (error, stdout, stderr) => {
          setTitle();
        });
      }
    },
    {
      label: 'Quit',
      click: () => app.quit()
    },
  ]);

  tray.setContextMenu(contextMenu);
}
