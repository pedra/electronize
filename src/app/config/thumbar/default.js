
const { app } = require('electron')

module.exports = [
    {
        label: 'Play',
        tooltip: 'button1',
        icon: app.Config.app.assets.tray + '/icon16.png',
        click() { console.log('button1 clicked') }
    }, {
        tooltip: 'button2',
        icon: app.Config.app.assets.tray + '/g_old.png',
        click() { console.log('button2 clicked.') }
    }
]