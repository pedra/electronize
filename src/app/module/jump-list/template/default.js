/*
    Electronizer

    Copyright (c) 2021, Bill Rocha
    Developer: Bill Rocha <prbr@ymail.com> | billrocha.netlify.com
    Git: https://github.com/pedra/electronizer

 */

const path = require('path')
const { app } = require('electron')

module.exports = [
    {
        type: 'custom',
        name: 'Recent Projects',
        items: [
            { type: 'file', path: 'C:\\Projects\\project1.proj' },
            { type: 'file', path: 'C:\\Projects\\project2.proj' }
        ]
    },
    { // has a name so `type` is assumed to be "custom"
        name: 'Sites',
        items: [
            {
                type: 'task',
                title: 'Site',
                program: app.Config.host.site,
                args: '',
                iconPath: path.join(app.Config.app.assets.ico, 'burn.ico'),
                iconIndex: 0,
                description: 'Abrir o site'
            },
            {
                type: 'task',
                title: 'Downloads',
                program: app.Config.download,
                args: '',
                iconPath: path.join(app.Config.app.assets.ico, 'icon.ico'),
                iconIndex: 0,
                description: 'Abrir navegador na página de Downloads'
            },
            { type: 'separator' },
            {
                type: 'task',
                title: 'Tool A',
                program: process.execPath,
                args: '--run-tool-a',
                icon: process.execPath,
                iconIndex: 0,
                description: 'Runs Tool A'
            },
            {
                type: 'task',
                title: 'Tool B',
                program: process.execPath,
                args: '--run-tool-b',
                icon: process.execPath,
                iconIndex: 0,
                description: 'Runs Tool B'
            }
        ]
    },
    { type: 'frequent' },
    { // has no name and no type so `type` is assumed to be "tasks"
        items: [
            {
                type: 'task',
                title: 'New Project',
                program: process.execPath,
                args: '--new-project',
                description: 'Create a new project.'
            },
            { type: 'separator' },
            {
                type: 'task',
                title: 'Recover Project',
                program: process.execPath,
                args: '--recover-project',
                description: 'Recover Project'
            }
        ]
    }
]

