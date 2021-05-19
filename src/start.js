/*
    Electronize

    Copyright (c) 2021, Bill Rocha
    Developer: Bill Rocha <prbr@ymail.com> | billrocha.netlify.com
    Git: https://github.com/pedra/electronize

 */
const path = require('path')
const { app } = require('electron')

// Injetando objetos no "electron.app"
app.Host = null
app.Server = null
app.Socket = null
app.UpTimer = null
app.Tray = null
app.Menu = null
app.Config = require(path.join(__dirname, 'app', 'config'))
app.Window = require(path.join(app.Config.desktop.module, 'window'))()

// Load modules...
const Boot = require(path.join(app.Config.app.path, 'boot'))
const Application = require(path.join(app.Config.desktop.path, 'app'))


// Running application root!
Boot().then(() => {

    console.log('Started on success!')
    Desktop = new Application()

}).catch(e => {
    let l = '\n-------------------\n',
        m = l + '     Aborted!!' + l
    console.error(m, e, '\n\n')
    app.exit()
})