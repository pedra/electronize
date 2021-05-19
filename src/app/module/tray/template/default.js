/*
    Electronize

    Copyright (c) 2021, Bill Rocha
    Developer: Bill Rocha <prbr@ymail.com> | billrocha.netlify.com
    Git: https://github.com/pedra/electronize

 */

const path = require('path')
const { app, shell } = require('electron')
const { Notify } = require(path.join(app.Config.app.module, 'notify'))
const Window = app.Window.getInstance('main')

module.exports = [
    {
        label: 'Abrir Electronize',
        icon: app.Config.desktop.tray + '/icon16.png',
        click: () => Window.show()
    }, {
        label: 'Site da Aplicação',
        icon: app.Config.desktop.tray + '/h.png',
        click: () => shell.openExternal(app.Config.site)
    }, {
        label: 'Chat (status)',
        icon: app.Config.desktop.tray + '/a.png',
        title: 'Status de visualização do usuário',
        type: 'submenu',
        submenu: [
            {
                label: 'Ativo',
                icon: app.Config.desktop.tray + '/on.png',
                enabled: true,
                click: () => Notify('Status do Chat', "O chat está desativado nessa versão!")
            }, {
                label: 'Ocupado',
                icon: app.Config.desktop.tray + '/no.png',
                enabled: true,
                click: () => Notify('Status do Chat', 'O chat está desativado nessa versão!')
            }, {
                type: 'separator'
            }, {
                label: 'Desativado',
                icon: app.Config.desktop.tray + '/off.png',
                enabled: true,
                click: () => Notify('Status do Chat', 'O chat está desativado nessa versão!')
            }
        ]
    }, {
        type: 'separator'
    }, {
        label: 'Desconectar (logout)',
        icon: app.Config.desktop.tray + '/l.png',
        click: () => {
            Window.webContents.send('logout', true)
            Window.show()
        }
    }, {
        type: 'separator'
    }, {
        label: 'Sair e fechar',
        icon: app.Config.desktop.tray + '/x.png',
        click: () => app.exit()
    }
]