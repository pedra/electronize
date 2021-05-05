/*
    Electronize

    Copyright (c) 2021, Bill Rocha
    Developer: Bill Rocha <prbr@ymail.com> | billrocha.netlify.com

 */


const { app, Menu } = require('electron')

module.exports = function () {

    const template = [{
        label: 'Cadastro',
        submenu: [{
            label: 'Empresa'
        }, {
            label: 'Setor'
        }, {
            label: 'Usuário'
        }, {
            type: 'separator'
        }, {
            label: 'Menu'
        }, {
            label: 'Produto'
        }, {
            label: 'Posto de Atendimento (station)'
        }]
    }, {
        label: 'Edição',
        submenu: [{
            role: 'undo'
        }, {
            role: 'redo'
        }, {
            type: 'separator'
        }, {
            role: 'cut'
        }, {
            role: 'copy'
        }, {
            role: 'paste'
        }, {
            role: 'pasteandmatchstyle'
        }, {
            role: 'delete'
        }, {
            role: 'selectall'
        }]
    }, {
        label: 'Relatório',
        submenu: [{
            label: 'Ocupação de Station'
        }, {
            label: 'Uso x Valor consumo'
        }, {
            label: 'Tempo de atendimento'
        }, {
            type: 'separator'
        }, {
            role: 'resetzoom'
        }, {
            role: 'zoomin'
        }, {
            role: 'zoomout'
        }, {
            type: 'separator'
        }, {
            role: 'togglefullscreen'
        }]
    }, {
        label: 'Janelas',
        submenu: [{
            role: 'reload'
        }, {
            role: 'forcereload'
        }, {
            role: 'toggledevtools'
        }, {
            type: 'separator'
        }, {
            role: 'resetzoom'
        }, {
            role: 'zoomin'
        }, {
            role: 'zoomout'
        }, {
            type: 'separator'
        }, {
            role: 'togglefullscreen'
        }, {
            role: 'minimize'
        }, {
            role: 'close'
        }]
    }, {
        label: 'Komanda',
        submenu: [{
            label: 'Komanda',
            icon: app.Config.desktop.tray + '/icon16.png',
            click() {
                require('electron').shell.openExternal('http://ikomanda.tk')
            }
        }, {
            label: 'Verificar atualização'
        }, {
            label: 'Ajuda (manual online)'
        }, {
            type: 'separator'
        }, {
            label: 'Sobre o Electron',
            click() {
                require('electron').shell.openExternal('https://electronjs.org')
            }
        }]
    }]

    if (process.platform === 'darwin') {
        template.unshift({
            label: app.getName(),
            submenu: [{
                role: 'about'
            }, {
                type: 'separator'
            }, {
                role: 'services'
            }, {
                type: 'separator'
            }, {
                role: 'hide'
            }, {
                role: 'hideothers'
            }, {
                role: 'unhide'
            }, {
                type: 'separator'
            }, {
                role: 'quit'
            }]
        })

        // Edit menu
        template[1].submenu.push({
            type: 'separator'
        }, {
            label: 'Speech',
            submenu: [{
                role: 'startspeaking'
            }, {
                role: 'stopspeaking'
            }]
        })

        // Window menu
        template[3].submenu = [{
            role: 'close'
        }, {
            role: 'minimize'
        }, {
            role: 'zoom'
        }, {
            type: 'separator'
        }, {
            role: 'front'
        }]
    }

    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)

}