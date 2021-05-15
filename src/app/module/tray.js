/*
    Electronize

    Copyright (c) 2021, Bill Rocha
    Developer: Bill Rocha <prbr@ymail.com> | billrocha.netlify.com

 */

const { app, Tray, Menu, shell } = require('electron')
const { Notify } = require('./notify')

//const Shell = require('electron').shell

module.exports = function () {

    let appTray = new Tray(app.Config.desktop.tray + '/icon32.png'),

        Window = app.Window.getInstance(),

        contextMenu = Menu.buildFromTemplate([{
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
        }])

    appTray.setToolTip('Electronize')
    appTray.setContextMenu(contextMenu)
    appTray.on('click', () => Window.show())
    appTray.on('balloon-click', () => Window.show())

    return appTray
}