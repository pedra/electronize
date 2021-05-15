/*
    Electronize

    Copyright (c) 2021, Bill Rocha
    Developer: Bill Rocha <prbr@ymail.com> | billrocha.netlify.com

 */

const { app, BrowserWindow } = require('electron')
const path = require('path')

module.exports = function () {

    /* Instancia da janela criada.

        TODO: transformar em um array de Windows no formato:
            Window = [{ 
                name: 'Main',
                instance: null // Objeto criado com -> new janela()
            }, ...]
     */
    let Window = null

    /* Cria e/ou retorna a instância do Window (janela principal)

        TODO: criar mais janelas e gravar em um "pool" (array) de Windows.
           As janelas seriam referenciadas pela chamada a getInstance('nome da janela')          
    */
    const getInstance = () =>
        Window == null || Window.isDestroyed() ?
            (Window = new janela()) :
            Window

    // Cria uma janela (Window)
    const janela = function () {

        // novo Browser...
        const win = new BrowserWindow({
            width: 480,
            minWidth: 370,
            maxWidth: 800,

            height: 720,
            minHeight: 640,

            //x: 10,
            //y: 150,
            center: true,
            fullscreenable: false,
            maximizable: false,

            show: false,
            paintWhenInitiallyHidden: false,
            icon: path.join(app.Config.desktop.img, 'icon.png'),

            backgroundColor: '#000000',
            frame: true,
            darkTheme: true,

            webPreferences: {
                nativeWindowOpen: true,
                nodeIntegration: true,
                contextIsolation: false
            }
        })

        // Abre o DevTools.
        //win.webContents.openDevTools()
        //require('devtron').install()

        // e carrega index.html do app.
        win.loadURL(path.join(app.Config.desktop.path, 'index.html'))

        // Mostra a janela
        win.once('ready-to-show', () => win.show())

        // Para abrir janelas como no Chrome
        win.webContents.setWindowOpenHandler(
            //win.webContents.on('new-window',
            (event, url, frameName, disposition, options, additionalFeatures) => {

                // Para abrir no centro da tela
                delete options.x;
                delete options.y;

                if (frameName !== '') {
                    // open window as modal
                    event.preventDefault()
                    Object.assign(options, {
                        parent: win,
                        modal: true,
                        frame: true,
                        backgroundColor: '#FFF',
                        minimizable: false,
                        title: frameName
                    })
                    event.newGuest = new BrowserWindow(options)
                    event.newGuest.setMenu(null)
                }
            })

        // ao minimizar, vai para o TRAY
        win.on('minimize', e => {
            e.preventDefault()
            win.hide()
            app.Config.visible = false

            console.log('\nminimize | trabalhando em background! | Visible: ', app.Config.visible)
        })

        // Ao fechar a janela ...
        win.on('close', e => {
            e.preventDefault()
            win.hide()
            app.Config.visible = false

            console.log('\nclose | trabalhando em background! | Visible: ', app.Config.visible)
        })

        // Emitido quando a janela é fechada.
        win.on('closed', e => {
            console.log('\nclosed | A aplicação foi desligada.')
        })

        // Quando mostrar a janela
        win.on('show', e => {
            console.log('\nshow | trabalhando com janela! | Visible: ', app.Config.visible)
        })

        // Janela obteve foco
        win.on('focus', () => {
            console.log('\nfocus | A janela obteve foco.')
            setTimeout(() => win.flashFrame(false), 1500)
        })

        // Janela perdeu foco
        win.on('blur', () => {
            console.log('\nblur | A janela perdeu foco.')
            if (!win.isDestroyed()) {
                win.flashFrame(true)
                setTimeout(() => win.flashFrame(false), 1500)
            }
        })

        return win
    }

    return {
        getInstance
    }

}
