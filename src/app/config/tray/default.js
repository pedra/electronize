/*
    Electronizer

    Copyright (c) 2021, Bill Rocha
    Developer: Bill Rocha <prbr@ymail.com> | billrocha.netlify.com
    Git: https://github.com/pedra/electronizer

 */

const { app, shell, BrowserWindow } = require('electron')
const { Notify } = require(app.Config.app.module + '/notify')
const Menu = require(app.Config.app.module + '/menu')
let modal = ''

module.exports = [
    {
        label: 'Abrir Electronizer',
        icon: app.Config.app.assets.tray + '/icon16.png',
        click: () => app.Window.getOrCreate('main').show()
    }, {
        label: 'Site da Aplicação',
        icon: app.Config.app.assets.tray + '/h.png',
        click: () => shell.openExternal(app.Config.net.site + ':' + app.Config.net.port)
    }, {
        label: 'Chat (status)',
        icon: app.Config.app.assets.tray + '/a.png',
        title: 'Status de visualização do usuário',
        type: 'submenu',
        submenu: [
            {
                label: 'Ativo',
                icon: app.Config.app.assets.tray + '/on.png',
                enabled: true,
                click: () => Notify('Status do Chat', "O chat está desativado nessa versão!")
            }, {
                label: 'Ocupado',
                icon: app.Config.app.assets.tray + '/no.png',
                enabled: true,
                click: () => Notify('Status do Chat', 'O chat está desativado nessa versão!')
            }, {
                type: 'separator'
            }, {
                label: 'Desativado',
                icon: app.Config.app.assets.tray + '/off.png',
                enabled: true,
                click: () => Notify('Status do Chat', 'O chat está desativado nessa versão!')
            }
        ]
    }, {
        type: 'separator'
    }, {
        label: 'About',
        click: () => app.Window.getOrCreate('about', { frame: false, maxWidth: 1920, maxHeight: 1080 }).show()
    }, {
        label: 'Fechar a janela "About"',
        click: () => {
            var about = app.Window.get('about')
            about && about.destroy()
        }
    }, {
        label: 'TESTE',
        click: () => {
            let w = app.Window.get('main')
            if (w) {
                w.setOverlayIcon(app.Config.app.assets.tray + '/on.png', 'Description for overlay')
                Menu.setThumbar('main')
                modal = w.openModal('https://billrocha.netlify.com', { frame: false, width: 360 })
            }
        }
    }, {
        label: 'Fechar modal',
        click: () => {
            let w = app.Window.get('main')
            if (w) w.closeModal(modal)
        }
    }, {
        label: 'GetWindow',
        click: () => {

            let w = app.Window.get('main')

            console.log('Id do Main: ', w.id)
            let b = BrowserWindow.fromId(w.id)
            console.log('Browser formId ', b)
        }
    }, {
        label: 'Clear all windows',
        click: () => app.Window.clear()
    }, {
        label: 'Desconectar (logout)',
        icon: app.Config.app.assets.tray + '/l.png',
        click: () => {
            let win = app.Window.getOrCreate('main')
            win.webContents.send('logout', true)
            win.show()
        }
    }, {
        type: 'separator'
    }, {
        label: 'Sair e fechar',
        icon: app.Config.app.assets.tray + '/x.png',
        click: () => {
            app.Window.clear()
            app.quit()
        }
    }
]