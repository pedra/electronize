/*
    Electronize

    Copyright (c) 2021, Bill Rocha
    Developer: Bill Rocha <prbr@ymail.com> | billrocha.netlify.com

 */
const path = require('path')
const { app } = require('electron')

// Injetando objetos no "electron.app"
app.Host = null
app.Server = null
app.Socket = null
app.UpTimer = null
app.Tray = null
app.Config = require(path.join(__dirname, 'app', 'config'))()
app.Window = require(path.join(app.Config.desktop.module, 'window'))()

// Load modules...
const Boot = require(path.join(app.Config.app.path, 'boot'))
const Application = require(path.join(app.Config.desktop.path, 'app'))


// Running application root!
Boot().then(e => {
    console.log(!e ? 'Started on success!' : 'Error::', e || '')

    Desktop = new Application()
})