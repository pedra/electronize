/*
    Electronizer

    Copyright (c) 2021, Bill Rocha
    Developer: Bill Rocha <prbr@ymail.com> | billrocha.netlify.com
    Git: https://github.com/pedra/electronizer

 */

var os = require('os').platform()
const path = require('path')
const { app } = require('electron')
const Tray = require(path.join(app.Config.app.module, 'tray', 'index'))

// Modules by platforms...
const JumpList = os == "win32" ? require(path.join(app.Config.app.module, 'jump-list', 'index')) : false
const Update = os != "linux" ? require(path.join(app.Config.app.module, 'update')) : false

// Net and Message
const Net = require(path.join(app.Config.net.path, 'net'))
const { exit } = require('yargs')


module.exports = async function () {

    if (app.Config.net.enable) {
        // Servidor para acesso remoto
        let hst = Net()
        if (hst.Server === false) return exit() //Sai da aplicação

        // Adicionando Server e Message à aplicação
        //app.Server = hst.Server
        app.Net = hst.Net
        //app.Socket = hst.Socket
    }

    // Single instance
    if (!app.requestSingleInstanceLock()) app.quit()
    else app.on('second-instance', () => {
        console.log("second-instance!!!")

        var Window = app.Window.get('main')
        if (Window.isMinimized()) Window.restore()
        Window.show()
        Window.focus()
    })

    // Previne o fechamento - destruição - de TODAS as janelas
    app.on('window-all-closed', e => {
        console.log('\nTodas as janelas foram fechadas - window-all-closed\n')
        e.preventDefault()
    })

    /** Antes de fechar a aplicação...
    *  Uma sequencia de ações podem ser empilhadas para executar tarefas antes de fechar totalmente a aplicação.
    */
    app.on('will-quit', e => {
        console.log('Antes de fechar tudo - will-quit')
        e.preventDefault()

        // TESTE .... 
        setTimeout(() => { app.exit() }, 3000)
    })

    // Finaliza quando todas as janelas estiverem fechadas.
    app.on('quit', e => {
        console.log("---> Quit!")
        if (app.Tray)
            app.Tray.destroy()
    })

    // Quando a aplicação é "ativada" (novamente?) - para MacOS
    app.on('activate', () => {
        console.log("Activate")
    })

    // Aplicação pronta: Monta sysTray, Updater, JumpList
    return new Promise(
        function (resolve, reject) {
            app.on('ready', () => {

                try {
                    // Monta o Tray Menu
                    app.Tray = new Tray()

                    // Aciana o monitor de UPDATE - Windows & Mac only
                    app.UpTimer = Update === false ? false : Update().UpTimer

                    // Montando a Jump List - Windows only
                    JumpList && new JumpList('default')

                } catch (e) {
                    return reject(e)
                }
                return resolve()
            })
        })
}