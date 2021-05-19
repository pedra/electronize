/*
    Electronize

    Copyright (c) 2021, Bill Rocha
    Developer: Bill Rocha <prbr@ymail.com> | billrocha.netlify.com
    Git: https://github.com/pedra/electronize

 */

var os = require('os').platform()
const path = require('path')
const { app } = require('electron')
const Ipc = require(path.join(app.Config.desktop.module, 'ipc'))
const Tray = require(path.join(app.Config.app.module, 'tray', 'index'))

// Modules by platforms...
const JumpList = os == "win32" ? require(path.join(app.Config.app.module, 'jump-list', 'index')) : false
const Update = os != "linux" ? require(path.join(app.Config.app.module, 'update')) : false

// Host and Message
const Host = require(path.join(app.Config.host.path, 'host'))
const { exit } = require('yargs')


module.exports = async function () {

    if (app.Config.host.enable) {
        // Servidor Host para acesso remoto
        let hst = Host()
        if (hst.Server === false) return exit() //Sai da aplicação

        // Adicionando o Host, Server e Message à aplicação
        //app.Server = hst.Server
        app.Host = hst.Host
        //app.Socket = hst.Socket
    }

    // Single instance
    if (!app.requestSingleInstanceLock()) app.quit()
    else app.on('second-instance', () => {
        console.log("second-instance!!!")

        var Window = app.Window.getInstance('main')
        if (Window.isMinimized()) Window.restore()
        Window.show()
        Window.focus()
    })

    // Finaliza quando todas as janelas estiverem fechadas.
    app.on('quit', () => {
        console.log("Quit!")
        if (app.Tray) app.Tray.destroy()
    })

    // Quando a aplicação é "ativada" (novamente?) - para MacOS
    app.on('activate', () => {
        console.log("Activate")
    })

    // Aplicação pronta: Monta sysTray, Updater, JumpList e IPC
    return new Promise(
        function (resolve, reject) {
            app.on('ready', () => {

                try {
                    // Monta o Tray Menu
                    app.Tray = new Tray()

                    // Aciana o monitor de UPDATE - Windows & Mac only
                    app.UpTimer = Update === false ? false : Update().UpTimer

                    // Montando o IPC Center
                    const { ipcMain, Notify } = Ipc()

                    // Montando a Jump List - Windows only
                    JumpList && new JumpList('default')

                } catch (e) {
                    return reject(e)
                }
                return resolve()
            })
        })
}