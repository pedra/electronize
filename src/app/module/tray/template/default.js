/*
    Electronizer

    Copyright (c) 2021, Bill Rocha
    Developer: Bill Rocha <prbr@ymail.com> | billrocha.netlify.com
    Git: https://github.com/pedra/electronizer

 */

const { app, shell } = require('electron')
const { Notify } = require(app.Config.app.module + '/notify')

module.exports = [
    {
        label: 'Abrir Electronizer',
        icon: app.Config.app.assets.tray + '/icon32.png',
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
        click: () => app.Window.getOrCreate('about', { frame: false }).show()
    }, {
        label: 'Fechar a janela "About"',
        click: () => {
            var about = app.Window.get('about')
            about && about.destroy()
        }
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
        click: () => app.quit()
    }
]