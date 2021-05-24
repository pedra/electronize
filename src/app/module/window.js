/*
    Electronizer

    Copyright (c) 2021, Bill Rocha
    Developer: Bill Rocha <prbr@ymail.com> | billrocha.netlify.com
    Git: https://github.com/pedra/electronizer

 */

const path = require('path')
const { app, BrowserWindow } = require('electron')

module.exports = function () {

    let Janelas = [],   // Window array 
        Main = null     // Them application main window

    /**
     * Create a window or return your previously created instance
     * @returns Object Returns the window
     */
    const create = window => !Janelas[window] || Janelas[window].isDestroyed() ?
        (Janelas[window] = new janela(window)) :
        Janelas[window]

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
     * Creates a window
     * @param {String} html Name of the window
     * @returns Object
     */
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
            icon: path.join(app.Config.app.assets.img, 'icon.png'),

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
        win.loadFile(`${app.Config.app.assets.path}/html/${html}.html`)

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

            console.log(`\nminimize | (${html}) trabalhando em background! | Visible: `, app.Config.visible)
        })

        // Ao fechar a janela ...
        win.on('close', e => {
            e.preventDefault()
            win.hide()
            app.Config.visible = false

            console.log(`\nclose | (${html}) trabalhando em background! | Visible:`, app.Config.visible)
        })

        // Emitido quando a janela é destruída.
        win.on('closed', e => {
            console.log(`\nclosed | A Janela (${html}) foi destruída!`)
        })

        // Quando mostrar a janela
        win.on('show', e => {
            console.log(`\nshow | (${html}) trabalhando com janela! | Visible: `, app.Config.visible)
        })

        // Janela obteve foco
        win.on('focus', () => {
            console.log(`\nfocus | A Janela (${html}) obteve foco.`)
            setTimeout(() => win.flashFrame(false), 1500)
        })

        // Janela perdeu foco
        win.on('blur', () => {
            console.log(`\nblur | A Janela (${html}) perdeu foco.`)
            if (!win.isDestroyed()) {
                win.flashFrame(true)
                setTimeout(() => !win.isDestroyed() ? win.flashFrame(false) : false, 1500)
            }
        })

        return win
    }

    // Creates a Main application window
    app.on('ready', () => {
        if (Main == null || Main.isDestroyed()) {
            Main = new janela('main')
        } else {
            throw new Error('Main window already exists!')
            process.exit(1)
        }
    })

    return {
        create, get
    }
}
