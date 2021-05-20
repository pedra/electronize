/*
    Electronize

    Copyright (c) 2021, Bill Rocha
    Developer: Bill Rocha <prbr@ymail.com> | billrocha.netlify.com
    Git: https://github.com/pedra/electronize

 */

const path = require('path')
const { app } = require('electron')

// Injetando objetos no "electron.app"
app.Config = require(`${__dirname}/app/config`)
app.Window = require(`${app.Config.desktop.module}/window`)()

// Load modules...
const Boot = require(`${app.Config.app.path}/boot`)
const Application = require(`${app.Config.desktop.path}/app`)


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