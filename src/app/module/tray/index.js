/*
    Electronizer

    Copyright (c) 2021, Bill Rocha
    Developer: Bill Rocha <prbr@ymail.com> | billrocha.netlify.com
    Git: https://github.com/pedra/electronizer

 */

const path = require('path')
const fs = require('fs')
const { app, Tray, Menu } = require('electron')

module.exports = function (template) {

    template = template || 'default'

    const file = path.resolve(__dirname, `template/${template}.js`),
        menu = fs.existsSync(file) ? require(file) : [] // carrega o template menu

    let tray = new Tray(app.Config.app.assets.tray + '/icon32.png'), //application icon
        Window = app.Window.get('main'),
        contextMenu = Menu.buildFromTemplate(menu)

    tray.setToolTip('Electronizer')
    tray.setContextMenu(contextMenu)
    tray.on('click', () => app.Window.getOrCreate('main').show())
    tray.on('balloon-click', () => app.Window.getOrCreate('main').show())

    return tray
}