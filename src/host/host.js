/*
    Electronizer

    Copyright (c) 2021, Bill Rocha
    Developer: Bill Rocha <prbr@ymail.com> | billrocha.netlify.com
    Git: https://github.com/pedra/electronizer

 */

const path = require('path')
const express = require('express')
const { createServer } = require('http')

const cors = require('cors')
//const MobileDetect = require('mobile-detect')
const { app } = require('electron')


module.exports = () => {

    let Http,
        Socket,
        CH = app.Config.host,
        CS = app.Config.socket

    const Host = express()
    const http = createServer(Host)

    Host.use(express.static(CH.static))
    Host.use(cors('*'))
    Host.set('views', CH.view)
    Host.set('view engine', 'ejs')

    // Requests from JSON...
    Host.use(express.json())

    // Routers
    Host.use('/file', require(`${CH.module}/file/route`))
    Host.use('/auth', require(`${CH.module}/user/route`))
    Host.use('/user', require(`${CH.module}/user/route`))
    Host.use('/msg', require(`${CH.module}/message/route`))

    // Creating server ...
    Http = http.listen(CH.port)

    if (null == Http.address()) {
        console.log(`Port ${CH.port} already in use!`)
        Http = false
    } else {
        console.log(`Host listening in ${CH.site +
            (CH.port == 80 ? '' : ':' + CH.port)}`
        )
    }

    // Inicia a central de mensagens (socket, etc) se estiver habilitado.
    if (Http && CS.enable) {
        Socket = require(`${CS.path}/socket`)()
        Socket.listen(http)
    }

    return { Host, Http, Socket }
}