/*
    Electronize

    Copyright (c) 2021, Bill Rocha
    Developer: Bill Rocha <prbr@ymail.com> | billrocha.netlify.com

 */

const path = require('path')
const express = require('express')
const { createServer } = require('http')

const cors = require('cors')
//const MobileDetect = require('mobile-detect')
const { app } = require('electron')


module.exports = () => {

    let Http, Socket

    const Host = express()
    const http = createServer(Host)

    Host.use(express.static(app.Config.host.public))
    Host.use(cors('*'))
    Host.set('views', app.Config.host.view)
    Host.set('view engine', 'ejs')

    // Requests from JSON...
    Host.use(express.json())

    // Routers
    // Host.get('/', (req, res) =>
    //     res.render(
    //         (new MobileDetect(req.headers['user-agent'])).mobile() ?
    //             'index-mobile' :
    //             'index'))
    Host.use('/file', require(path.resolve(__dirname, 'module', 'file', 'route')))
    Host.use('/auth', require(path.resolve(__dirname, 'module', 'user', 'route')))
    Host.use('/user', require(path.resolve(__dirname, 'module', 'user', 'route')))
    Host.use('/msg', require(path.resolve(__dirname, 'module', 'message', 'route')))

    // Creating server ...
    const PORT = app.Config.host.port
    Http = http.listen(PORT)

    if (null == Http.address()) {
        console.log(`Port ${PORT} already in use!`)
        Http = false
    } else {
        console.log(`Host listening in ${app.Config.site + (PORT == 80 ? '' : ':' + PORT)}`)
    }

    // Inicia a central de mensagens (socket, etc) se estiver habilitado.
    if (Http && app.Config.socket.enable) {
        Socket = require(path.join(app.Config.socket.path, 'socket'))()
        Socket.listen(http)
    }

    return { Host, Http, Socket }
}