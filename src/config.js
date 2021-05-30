/*
    Electronizer

    Copyright (c) 2021, Bill Rocha
    Developer: Bill Rocha <prbr@ymail.com> | billrocha.netlify.com
    Git: https://github.com/pedra/electronizer

 */

const path = require('path')
const root = __dirname
const external = path.resolve(__dirname, process.env.ELECTRON_ENV ? '../' : '../../')

console.log('\n=================== CONFIG ====================\nroot:     ' + root, '\nexternal: ' + external, '\n===============================================\n')

module.exports = {
    mode: process.env.ELECTRON_ENV ? 'dev' : 'prod',
    path: root,
    visible: false,
    download: "https://billrocha.netlify.com/download",
    external: {
        file: external + '/assets/file',
        db: external + '/assets/db',
        bin: external + '/assets/bin'
    },
    app: {
        path: root + '/app',
        module: root + '/app/module',
        assets: {
            path: root + '/app/assets',
            img: root + '/app/assets/img',
            tray: root + '/app/assets/img/tray',
            ico: root + '/app/assets/img/ico'
        }
    },
    net: {
        enable: true,
        path: root + '/net',
        module: root + '/net/module',
        view: root + '/net/view',
        static: root + '/net/public',
        site: "http://localhost",
        port: 8080,
        socket: {
            enable: true,
            path: root + '/net/module/message',
            channel: 'qzc'
        }
    },
}