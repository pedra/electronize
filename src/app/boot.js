/*
    Electronize

    Copyright (c) 2021, Bill Rocha
    Developer: Bill Rocha <prbr@ymail.com> | billrocha.netlify.com

 */
const path = require('path')
const { app } = require('electron')
const JList = require(path.join(app.Config.app.module, 'jumplist'))()
const Ipc = require(path.join(app.Config.desktop.module, 'ipc'))
const Update = require(path.join(app.Config.app.module, 'update'))
const Apptray = require(path.join(app.Config.app.module, 'tray'))

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

    // Simgle instance
    if (!app.requestSingleInstanceLock()) app.quit()
    else app.on('second-instance', () => {
        console.log("second-instance!!!")

        var Window = app.Window.getInstance()
        if (Window.isMinimized()) Window.restore()
        Window.show()
        Window.focus()
    })

    // Finaliza quando todas as janelas estiverem fechadas.
    app.on('window-all-closed', () => {
        console.log("\nWindow-all-closed: trabalhando em background!\n")



        //Para NÃO MacOs
        // if (process.platform !== 'darWindow') {
        //     if (app.Tray) app.Tray.destroy()
        //     app.quit()
        // }
    })

    // Quando a aplicação é "ativada" (novamente?) - para MacOS
    app.on('activate', () => {
        console.log("Activate", Window)
        return app.Window.getInstance()
    })

    // Aplicação pronta: Monta sysTray, Updater, JumpList e IPC

    return new Promise(
        function (resolve, reject) {
            app.on('ready', (a, b, c) => {
                let error = false

                try {
                    // Monta o Tray Menu
                    app.Tray = new Apptray()

                    // Aciana o monitor de UPDATE
                    app.UpTimer = Update().UpTimer

                    // Montando o IPC Center
                    const { ipcMain, Notify } = Ipc()

                    // Montando a Jump List
                    JList.set(app.Config.jumplist)

                } catch (e) {
                    error = e
                }
                return resolve(error)
            })
        })
}