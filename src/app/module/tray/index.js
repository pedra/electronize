/*
    Electronize

    Copyright (c) 2021, Bill Rocha
    Developer: Bill Rocha <prbr@ymail.com> | billrocha.netlify.com
    Git: https://github.com/pedra/electronize

 */

const path = require('path')
const fs = require('fs')
const { app, Tray, Menu } = require('electron')

module.exports = function (template) {

    template = template || 'default'

    const file = path.resolve(__dirname, `template/${template}.js`),
        menu = fs.existsSync(file) ? require(file) : [] // carrega o template menu

    let tray = new Tray(app.Config.desktop.tray + '/icon32.png'), //application icon
        Window = app.Window.getInstance('main'),
        contextMenu = Menu.buildFromTemplate(menu)

    tray.setToolTip('Electronize')
    tray.setContextMenu(contextMenu)
    tray.on('click', () => Window.show())
    tray.on('balloon-click', () => Window.show())

    return tray
}