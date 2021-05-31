/*
    Electronizer

    Copyright (c) 2021, Bill Rocha
    Developer: Bill Rocha <prbr@ymail.com> | billrocha.netlify.com
    Git: https://github.com/pedra/electronizer

 */

const fs = require('fs')
const { app, Menu, Tray } = require('electron')

const loadTemplate = (type, template = 'default') => {
    const file = app.Config.app.config + `/${type}/${template}.js`
    return fs.existsSync(file) ? require(file) : []
}

let menus = {}

module.exports = {

    setMenu: template =>
        menus.menu = Menu.setApplicationMenu(
            Menu.buildFromTemplate(
                loadTemplate('menu', template)
            )
        ),

    setJumplist: template => {
        if (process.platform != "win32") return false
        return menus.jumplist = app.setJumpList(
            loadTemplate('jumplist', template)
        )
    },

    setThumbar: (window, template) => {
        if (process.platform != "win32") return false
        let a = app.Window.get(window)
        return menus.thumbar = !a ? false : a.setThumbarButtons(loadTemplate('thumbar', template))
    },

    setTray: (template, icon, tooltip, onClick, onBalloon) => {
        let a = new Tray(icon || app.Config.app.tray)

        a.setContextMenu(Menu.buildFromTemplate(loadTemplate('tray', template)))
        a.setToolTip(tooltip || app.Config.title)
        a.on('click', onClick || function () { app.Window.getOrCreate('main').show() })
        a.on('balloon-click', onBalloon || function () { app.Window.getOrCreate('main').show() })

        return menus.tray = a
    },

    get: id => menus[id]
}