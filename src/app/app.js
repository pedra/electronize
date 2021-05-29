/*
    Electronizer

    Copyright (c) 2021, Bill Rocha
    Developer: Bill Rocha <prbr@ymail.com> | billrocha.netlify.com
    Git: https://github.com/pedra/electronizer

 */

const os = require('os-utils');
const path = require('path')
const { app, ipcMain: ipc } = require('electron')
const Menu = require(path.join(app.Config.app.module, 'menu', 'index'))
//const Ipc = require(path.join(app.Config.app.path, 'ipc-handler'))

module.exports = function () {

    // Add a menu to Window
    Menu.set(process.platform == 'darwin' ? 'mac' : 'default')

    setInterval(() => {
        let Main = app.Window.get('main')
        if (!Main || Main.isDestroyed()) return false // Prevent destroyed

        os.cpuUsage(v => {
            let data = {
                cpu: (v * 100).toFixed(2),
                mem: (os.freememPercentage() * 100).toFixed(2),
                tmem: (os.totalmem() / 1024).toFixed(2)
            }

            Main.webContents.send('cpu', JSON.stringify(data))

            let About = app.Window.get('about')
            if (About) About.webContents.send('cpu', JSON.stringify(data))
        })
    }, 1000)

    ipc.handle('menu', (e, menu) => {

        console.log('Menu: ', menu)

        let win = app.Window.get(menu.window)
        if (!win || win.isDestroyed()) return false



        console.log('Menu: ', true, win.frame)

        win.destroy()
        win = app.Window.create(menu.window, { frame: menu.show })
        win.show()
        win.webContents.send('menu', menu.show)

        return menu
    })

    ipc.handle('close', (e, w) => {
        let win = app.Window.get(w)
        if (win) return win.destroy()
    })
}