/*
    Electronize

    Copyright (c) 2021, Bill Rocha
    Developer: Bill Rocha <prbr@ymail.com> | billrocha.netlify.com
    Git: https://github.com/pedra/electronize

 */

const path = require('path')
const fs = require('fs')
const { app, BrowserWindow } = require('electron')

module.exports = function () {

    /* Instancia da janela criada.

        TODO: transformar em um array de Windows no formato:
            Window = [{ 
                name: 'Main',
                instance: null // Objeto criado com -> new janela()
            }, ...]
     */
    let Janelas = [],
        Main = null


    /**
     * Create a window or return your previously created instance
     * @returns Object Returns the window
     */
    const create = window => {
        if (window == 'main') {
            if (Main == null || Main.isDestroyed()) {
                Main = new janela('main')
                return Main
            } else {
                throw new Error('Main window already exists!')
                process.exit(1)
            }
        }

        // Create a window
        return !Janelas[window] || Janelas[window].isDestroyed() ?
            (Janelas[window] = new janela(window)) :
            Janelas[window]
    }

    /**
     * Returns a window 
     * @param {String} window Name of the window to
     * @returns Object
     */
    const get = window => {
        if (window == 'main') return Main
        return !Janelas[window] || Janelas[window].isDestroyed() ? false : Janelas[window]
    }

    /**
     * Returns an instance of the main application window
     * @returns Object  The application Main window or null
     */
    // const getMainInstance = () => Main


    // /**
    //  * Return a previously created instance or create a new window
    //  * @param {String} html Name of window to
    //  * @returns Object Return a new window or a instance of previously created window with same name
    //  */
    // const getInstanceOrCreate = (html) => {
    //     if (html == 'main') return false
    //     return !Janelas[html] || Janelas[html].isDestroyed() ?
    //         (Janelas[html] = new janela(html)) :
    //         Janelas[html]
    // }


    /* Cria e/ou retorna a instância do Window (janela principal)

        TODO: criar mais janelas e gravar em um "pool" (array) de Windows.
           As janelas seriam referenciadas pela chamada a getInstance('nome da janela')          
    */
    // const getInstanceOrCreate = (html) =>
    //     Window == null || Window.isDestroyed() ?
    //         (Window = new janela(html)) :
    //         Window

    // Cria uma janela (Window)
    const janela = function (html) {

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

        // Abre o DevTools - debug only
        //win.webContents.openDevTools()

        // Carrega o arquivo HTML da janela.
        var lf = win.loadFile(path.join(app.Config.desktop.assets, 'html', html + '.html'))

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
                setTimeout(() => !win.isDestroyed() ? win.flashFrame(false) : false, 1500)
            }
        })

        return win
    }

    // Creates a Main application window
    app.on('ready', () => create('main'))

    return {
        create, get
    }

}
