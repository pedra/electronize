/*
    Electronizer

    Copyright (c) 2021, Bill Rocha
    Developer: Bill Rocha <prbr@ymail.com> | billrocha.netlify.com
    Git: https://github.com/pedra/electronizer

 */

const path = require('path')
const fs = require('fs')
const { Menu } = require('electron')

module.exports = {

    set: (template) => {
        template = template || 'default'

        const file = path.resolve(__dirname, `template/${template}.js`),
            menu = fs.existsSync(file) ? require(file) : [] // carrega o template menu

        const winMenu = Menu.buildFromTemplate(menu)
        Menu.setApplicationMenu(winMenu)
    }

}