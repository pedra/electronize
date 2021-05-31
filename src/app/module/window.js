/*
    Electronizer

    Copyright (c) 2021, Bill Rocha
    Developer: Bill Rocha <prbr@ymail.com> | billrocha.netlify.com
    Git: https://github.com/pedra/electronizer

 */

const path = require('path')
const { app, BrowserWindow } = require('electron')

module.exports = (function () {

    let janelas = []   // Window array

    /**
     * Returns a window
     * @param {String} name 
     * @param {Number} id 
     * @returns Object Returns the window
     */
    const get = (name, id) => {
        let a,
            b = janelas.find(c => c.name == name || c.id == id)
        if (!b) return false

        a = BrowserWindow.fromId(b.id)
        if (!a || a.isDestroyed()) return false
        return a
    }

    /**
     * Create a window or return your previously created instance
     * @param {String} name Name of the window
     * @param {Object} option Options
     * @returns Object Returns the window
     */
    const create = (name, option) => {
        let a,
            b = get(name)
        if (b) return b

        a = new janela(name, option)
        janelas.push({ name, id: a.id })
        return a
    }

    /**
     * Destroy the window and remove from janelas list
     * @param {String} name
     * @param {Number} id
     * @returns Boolean
     */
    const destroy = (name, id) => {
        let a = get(name, id)
        janelas.splice(janelas.findIndex(b => b.name == name || b.name == id), 1)
        if (a) a.destroy()
    }

    /**
     * Clear and destroy all windows
     */
    const clear = () => {
        let a = []
        janelas.map(b => a.push(b.id))
        janelas = []
        a.map(b => BrowserWindow.fromId(b).destroy())
    }

    /**
     * Creates a window
     * @param {String} name Name of the window
     * @param {Object} option Options
     * @returns Object Returns the window
     */
    const janela = function (name, option = {}) {

        const opt = (key, def = null, origin = false) => {
            let o = origin || option
            return null == o[key] || undefined == typeof o[key] ? def : o[key]
        }

        const config = {
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

            //show: opt('show', false),
            paintWhenInitiallyHidden: false,
            icon: opt('icon', app.Config.app.assets.img + '/icon.png'),

            backgroundColor: opt('backgroundColor', '#000000'),
            frame: opt('frame', true),
            darkTheme: opt('darkTheme', true),
            opacity: opt('opacity', 1),

            parent: opt('parent'),

            webPreferences: {
                nativeWindowOpen: true,
                nodeIntegration: true,
                contextIsolation: false
            }
        }

        // novo Browser...
        const win = new BrowserWindow(config)

        // TrumbarButtons - Windows only 
        if (opt('tbutton', false)) win.setThumbarButtons(opt('tbutton'))

        // Abre o DevTools - debug only
        //win.webContents.openDevTools()

        // Carrega o arquivo HTML da janela.
        win.loadFile(app.Config.app.assets.path + `/html/${name}.html`)

        // Mostra a janela
        win.once('ready-to-show', () => win.show())

        // ao minimizar, vai para o TRAY
        win.on('minimize', e => {
            e.preventDefault()
            win.hide()

            console.log(`\nminimize | (${name}) trabalhando em background!`)
        })

        // Ao fechar a janela ...
        win.on('close', e => {
            e.preventDefault()
            win.hide()

            console.log(`\nclose | (${name}) trabalhando em background!`)
        })

        // Emitido quando a janela é destruída.
        win.on('closed', e => {
            console.log(`\nclosed | A Janela (${name}) foi destruída!`)
            app.Window.destroy(name)
        })

        // Quando mostrar a janela
        win.on('show', e => {
            console.log(`\nshow | (${name}) trabalhando com janela!`)
        })

        // Janela obteve foco
        win.on('focus', () => {
            console.log(`\nfocus | A Janela (${name}) obteve foco.`)
            setTimeout(() => !win.isDestroyed() ? win.flashFrame(false) : false, 1500)
        })

        // Janela perdeu foco
        win.on('blur', () => {
            console.log(`\nblur | A Janela (${name}) perdeu foco.`)
            if (!win.isDestroyed()) {
                win.flashFrame(true)
                setTimeout(() => !win.isDestroyed() ? win.flashFrame(false) : false, 1500)
            }
        })

        // Emitted when an App Command is invoked.
        win.on('app-command', (e, cmd) => console.log(name + ' - Command: ', cmd))


        // Public methods ------------------------------------------------- 

        /**
         * Open a window modal over this window
         * @param {String} url target
         * @param {Object} option BrowserWindow Options
         * @returns window
         */
        win.openModal = (url, option = {}) => {
            option.parent = win
            option.modal = true
            option.show = false

            const child = new BrowserWindow(option)
            child.loadURL(url || app.Config.download)
            child.once('ready-to-show', () => child.show())
            return child
        }

        /**
         * Close previous opened modal
         * @param {Object} modal the modal
         * @returns void
         */
        win.closeModal = modal => modal ? modal.destroy() : false

        return win
    }

    return {
        create, get,
        getOrCreate: create, //Semantic name option for "create" function
        destroy, clear
    }
})()
