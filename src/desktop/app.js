/*
    Electronizer

    Copyright (c) 2021, Bill Rocha
    Developer: Bill Rocha <prbr@ymail.com> | billrocha.netlify.com
    Git: https://github.com/pedra/electronizer

 */

const os = require('os-utils');
const path = require('path')
const { app } = require('electron')
const Menu = require(path.join(app.Config.desktop.module, 'menu', 'index'))

module.exports = function () {

    // Add a menu to Window
    Menu.set(process.platform == 'darwin' ? 'mac' : 'default')
    let Main = app.Window.get('main')

    setInterval(() => {
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




}