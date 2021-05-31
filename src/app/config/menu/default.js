/*
    Electronizer

    Copyright (c) 2021, Bill Rocha
    Developer: Bill Rocha <prbr@ymail.com> | billrocha.netlify.com
    Git: https://github.com/pedra/electronizer

 */

const { app, shell } = require('electron')

module.exports = [
    {
        label: '&Arquivo',
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
                icon: app.Config.app.assets.tray + '/x.png',
                click: () => app.exit()
            }
        ]
    }, {
        label: '&Usuário',
        submenu: [
            { label: 'Criar usuário' },
            { label: 'Resetar senha' },
            { label: 'Bloquear usuário' },
            { type: 'separator' },
            { label: 'Zerar contadores', enabled: false },
            { label: 'Visualizar usuários do sistema' }
        ]
    }, {
        label: '&Mensagens',
        submenu: [
            { label: 'Criar mensagem para todos' },
            { label: 'Ver mensagens por usuário' },
            { type: 'separator' },
            { label: 'Enviar mensagem PUSH', enabled: false },
            { label: 'Abrir notificações' },
            { type: 'separator' },
            { label: 'Visualizar chat em tempo real', enabled: false },
            { label: 'Chat em modo espião', enabled: false }
        ]
    }, {
        label: '&Relatório',
        submenu: [
            { label: 'Mensagens por usuário' },
            { type: 'separator' },
            { label: 'Downloads por usuário' },
            { label: 'Uploads por usuário' },
            { label: 'Login/acessos por usuário' }
        ]
    }, {
        label: '&Electronizer',
        submenu: [
            {
                label: 'Github do projeto',
                icon: app.Config.app.assets.tray + '/icon16.png',
                click: async () => await shell.openExternal('https://github.com/pedra/electronizer')
            }, { label: 'Verificar atualização' },
            {
                label: 'Ajuda (online)',
                click: async () => await shell.openExternal('https://github.com/pedra/electronizer#readme')
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
                label: 'Sobre o Electronizer',
                click: async () => await shell.openExternal('https://github.com/pedra/electronizer#readmer')
            }
        ]
    }
]