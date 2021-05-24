/*
    Electronizer

    Copyright (c) 2021, Bill Rocha
    Developer: Bill Rocha <prbr@ymail.com> | billrocha.netlify.com
    Git: https://github.com/pedra/electronizer

 */

const path = require('path')
const jump = process.env.ELECTRON_ENV ? '' : '../'
const root = __dirname
const external = path.resolve(__dirname, process.env.ELECTRON_ENV ? '../' : '../../')

console.log('root: ' + root, '\nexternal: ' + external, '\n')

module.exports = {
    mode: process.env.ELECTRON_ENV ? 'dev' : 'prod',
    visible: false,
    download: "https://billrocha.netlify.com/download",
    external: {
        file: `${external}/assets/file`,
        db: `${external}/assets/db`,
        bin: `${external}/assets/bin`
    },
    path: root,
    app: {
        path: `${root}/app`,
        module: `${root}/app/module`,
        assets: {
            path: `${root}/app/assets`,
            img: `${root}/app/assets/img`,
            tray: `${root}/app/assets/img/tray`,
            ico: `${root}/app/assets/img/ico`
        }
    },
    host: {
        enable: true,
        path: `${root}/host`,
        module: `${root}/host/module`,
        view: `${root}/host/view`,
        static: `${root}/host/public`,
        site: "http://localhost",
        port: 8080
    },
    socket: {
        enable: true,
        path: `${root}/host/module/message`,
        channel: 'qzc'
    }
}