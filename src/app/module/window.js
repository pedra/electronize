/*
    Electronizer

    Copyright (c) 2021, Bill Rocha
    Developer: Bill Rocha <prbr@ymail.com> | billrocha.netlify.com
    Git: https://github.com/pedra/electronizer

 */

const { app, BrowserWindow } = require('electron')

module.exports = function () {

    let Janelas = [],   // Window array 
        Main = null     // Them application main window

    /**
     * Create a window or return your previously created instance
     * @param {String} name Name of the window
     * @param {Object} option Options
     * @returns Object Returns the window
     */
    const create = (name, option) => !Janelas[name] || Janelas[name].isDestroyed() ?
        (Janelas[name] = new janela(name, option)) :
        Janelas[name]

    /**
     * Returns a window 
     * @param {String} name Name of the window to
     * @returns Object Returns the window
     */
    const get = name => {
        if (name == 'main') return Main
        return !Janelas[name] || Janelas[name].isDestroyed() ? false : Janelas[name]
    }

    /**
     * Creates a window
     * @param {String} name Name of the window
     * @param {Object} option Options
     * @returns Object Returns the window
     */
    const janela = function (name, option = {}) {

        const opt = (key, def) => null == option[key] || undefined == typeof option[key] ? def : option[key]

        // novo Browser...
        const win = new BrowserWindow({
            width: opt('width', 480),
            minWidth: opt('minWidth', 370),
            maxWidth: opt('maxWidth', 800),

            height: opt('height', 720),
            minHeight: opt('minHeight', 640),

            //x: 10,
            //y: 150,
            center: opt('center', true),
            fullscreenable: opt('fullscreenable', false),
            maximizable: opt('maximizable', false),

            show: opt('show', false),
            paintWhenInitiallyHidden: false,
            icon: opt('icon', `${app.Config.app.assets.img}/icon.png`),

            backgroundColor: opt('backgroundColor', '#000000'),
            frame: opt('frame', true),
            darkTheme: opt('darkTheme', true),

            webPreferences: {
                nativeWindowOpen: true,
                nodeIntegration: true,
                contextIsolation: false
            }
        })

        // Abre o DevTools - debug only
        //win.webContents.openDevTools()

        // Carrega o arquivo HTML da janela.
        win.loadFile(`${app.Config.app.assets.path}/html/${name}.html`)

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

            console.log(`\nminimize | (${name}) trabalhando em background! | Visible: `, app.Config.visible)
        })

        // Ao fechar a janela ...
        win.on('close', e => {
            e.preventDefault()
            win.hide()
            app.Config.visible = false

            console.log(`\nclose | (${name}) trabalhando em background! | Visible:`, app.Config.visible)
        })

        // Emitido quando a janela é destruída.
        win.on('closed', e => {
            console.log(`\nclosed | A Janela (${name}) foi destruída!`)
        })

        // Quando mostrar a janela
        win.on('show', e => {
            console.log(`\nshow | (${name}) trabalhando com janela! | Visible: `, app.Config.visible)
        })

        // Janela obteve foco
        win.on('focus', () => {
            console.log(`\nfocus | A Janela (${name}) obteve foco.`)
            setTimeout(() => win.flashFrame(false), 1500)
        })

        // Janela perdeu foco
        win.on('blur', () => {
            console.log(`\nblur | A Janela (${name}) perdeu foco.`)
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
