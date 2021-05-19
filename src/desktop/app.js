/*
    Electronize

    Copyright (c) 2021, Bill Rocha
    Developer: Bill Rocha <prbr@ymail.com> | billrocha.netlify.com
    Git: https://github.com/pedra/electronize

 */

const path = require('path')
const { app } = require('electron')
const Menu = require(path.join(app.Config.desktop.module, 'menu', 'index'))

module.exports = function () {

    // Add a menu to Window
    app.Menu = new Menu(process.platform == 'darwin' ? 'mac' : 'default')

}