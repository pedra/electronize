/*
    Electronizer

    Copyright (c) 2021, Bill Rocha
    Developer: Bill Rocha <prbr@ymail.com> | billrocha.netlify.com
    Git: https://github.com/pedra/electronizer

 */

const { app } = require('electron')

// Injetando objetos no "electron.app"
app.Config = require(`${__dirname}/config`)
app.Window = require(`${app.Config.app.module}/window`)()

// Load modules...
const Boot = require(`${app.Config.app.module}/boot`)
const Application = require(`${app.Config.app.path}/app`)


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