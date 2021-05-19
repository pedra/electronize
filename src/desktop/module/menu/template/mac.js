/*
    Electronize

    Copyright (c) 2021, Bill Rocha
    Developer: Bill Rocha <prbr@ymail.com> | billrocha.netlify.com
    Git: https://github.com/pedra/electronize

 */

const { app, shell } = require('electron')

module.exports = [
    {
        label: app.getName(),
        submenu: [
            { role: 'about' },
            { type: 'separator' },
            { role: 'services' },
            { type: 'separator' },
            { role: 'hide' },
            { role: 'hideothers' },
            { role: 'unhide' },
            { type: 'separator' },
            { role: 'quit' }
        ]
    },
    {
        label: 'Arquivo',
        submenu: [
            { label: 'Diretório base' },
            { type: 'separator' },
            { label: 'Salvar backup', enabled: false },
            { label: 'Carregar backup', enabled: false },
            { label: 'Explorador de arquivo' },
            { type: 'separator' },
            { label: 'Fechar janela', role: 'close' },
            {
                label: 'Desligar a Aplicação',
                icon: app.Config.desktop.tray + '/x.png',
                click: () => app.exit()
            },
            { type: 'separator' },
            {
                label: 'Speech',
                submenu: [{ role: 'startspeaking' },
                { role: 'stopspeaking' }]
            }
        ]
    }, {
        label: 'Edição',
        submenu: [
            { role: 'close' },
            { role: 'minimize' },
            { role: 'zoom' },
            { type: 'separator' },
            { role: 'front' }
        ]
    }, {
        label: 'Electronize',
        submenu: [
            {
                label: 'Github do projeto',
                icon: app.Config.desktop.tray + '/icon16.png',
                click: () => shell.openExternal('https://github.com/pedra/electronize')
            }, { label: 'Verificar atualização' },
            {
                label: 'Ajuda (online)',
                click: () => shell.openExternal('https://github.com/pedra/electronize#readme')
            },
            { type: 'separator' },
            { role: 'reload' },
            { role: 'forcereload' },
            { role: 'toggledevtools' },
            { type: 'separator' },
            { role: 'resetzoom', enabled: false },
            { role: 'zoomin', enabled: false },
            { role: 'zoomout', enabled: false },
            { type: 'separator' },
            { role: 'togglefullscreen', enabled: false },
            { role: 'minimize', enabled: false },
            { role: 'close' },
            { type: 'separator' },
            {
                label: 'Sobre o Electronize',
                click: () => shell.openExternal('https://github.com/pedra/electronize#readme')

            }
        ]
    }
]