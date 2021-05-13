/*
    Electronize

    Copyright (c) 2021, Bill Rocha
    Developer: Bill Rocha <prbr@ymail.com> | billrocha.netlify.com

 */

const path = require('path')

module.exports = () => {

    const jump = process.env.ELECTRON_ENV ? '../' : '../../'
    const root = path.resolve(__dirname, '../')

    let Config = {
        visible: false,
        site: "http://localhost",
        download: "https://billrocha.netlify.com/download",
        external: {
            file: path.join(root, jump, 'assets', 'file'),
            db: path.join(root, jump, 'assets', 'db'),
            bin: path.join(root, jump, 'assets', 'bin')
        },
        path: root,
        app: {
            path: path.join(root, 'app'),
            db: path.join(root, 'app', 'db.js'),
            module: path.join(root, 'app', 'module')
        },
        desktop: {
            path: path.join(root, 'desktop'),
            assets: path.join(root, 'desktop', 'assets'),
            module: path.join(root, 'desktop', 'module'),
            img: path.join(root, 'desktop', 'assets', 'img'),
            tray: path.join(root, 'desktop', 'assets', 'img', 'tray'),
            ico: path.join(root, 'desktop', 'assets', 'img', 'ico'),
        },
        host: {
            path: path.join(root, 'host'),
            enable: true,
            view: path.join(root, 'host', 'view'),
            public: path.join(root, 'host', 'public'),
            port: 80
        },
        socket: {
            path: path.join(root, 'host', 'module', 'message'),
            channel: 'qzc',
            enable: true
        }
    }

    // JumpList ...
    Config.jumplist = [
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
                    program: Config.site,
                    args: '',
                    iconPath: path.join(Config.desktop.ico, 'burn.ico'),
                    iconIndex: 0,
                    description: 'Abrir o site'
                },
                {
                    type: 'task',
                    title: 'Downloads',
                    program: Config.download,
                    args: '',
                    iconPath: path.join(Config.desktop.ico, 'icon.ico'),
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

    return Config
}

