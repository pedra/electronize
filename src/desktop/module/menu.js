/*
    Electronize

    Copyright (c) 2021, Bill Rocha
    Developer: Bill Rocha <prbr@ymail.com> | billrocha.netlify.com

 */


const { app, Menu } = require('electron')

module.exports = function () {

    const template = [{
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
            }
        ]
    }, {
        label: 'Usuário',
        submenu: [
            { label: 'Criar usuário' },
            { label: 'Resetar senha' },
            { label: 'Bloquear usuário' },
            { type: 'separator' },
            { label: 'Zerar contadores', enabled: false },
            { label: 'Visualizar usuários do sistema' }
        ]
    }, {
        label: 'Mensagens',
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
    },
    // }, {
    //     label: 'Edição',
    //     submenu: [
    //         { role: 'undo' },
    //         { role: 'redo' },
    //         { type: 'separator' },
    //         { role: 'cut' },
    //         { role: 'copy' },
    //         { role: 'paste' },
    //         { role: 'pasteandmatchstyle' },
    //         { role: 'delete' },
    //         { role: 'selectall' }
    //     ]
    // }, 
    {
        label: 'Relatório',
        submenu: [
            { label: 'Mensagens por usuário' },
            { type: 'separator' },
            { label: 'Downloads por usuário' },
            { label: 'Uploads por usuário' },
            { label: 'Login/acessos por usuário' }
        ]
    }, {
        label: 'Electronize',
        submenu: [
            {
                label: 'Github do projeto',
                icon: app.Config.desktop.tray + '/icon16.png',
                click: () => require('electron').shell.openExternal('http://github.com/pedra/electronize')
            }, { label: 'Verificar atualização' },
            { label: 'Ajuda (manual online)' },
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
                click: () => require('electron').shell.openExternal('https://github.com/pedra/electronize#readme')

            }
        ]
    }]

    if (process.platform === 'darwin') {
        template.unshift({
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
        })

        // Edit menu
        template[1].submenu.push({ type: 'separator' },
            {
                label: 'Speech',
                submenu: [{ role: 'startspeaking' },
                { role: 'stopspeaking' }]
            })

        // Window menu
        template[3].submenu = [
            { role: 'close' },
            { role: 'minimize' },
            { role: 'zoom' },
            { type: 'separator' },
            { role: 'front' }
        ]
    }

    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
}