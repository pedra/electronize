/*
    Electronizer

    Copyright (c) 2021, Bill Rocha
    Developer: Bill Rocha <prbr@ymail.com> | billrocha.netlify.com
    Git: https://github.com/pedra/electronizer

 */

const express = require('express')
const { createServer } = require('http')
const cors = require('cors')
const { app } = require('electron')

module.exports = () => {

    let Http,
        Socket,
        CH = app.Config.net,
        CS = app.Config.net.socket

    const Net = express()
    const http = createServer(Net)

    Net.use(express.static(CH.static))
    Net.use(cors('*'))
    Net.set('views', CH.view)
    Net.set('view engine', 'ejs')

    // Requests from JSON...
    Net.use(express.json())

    // Routers
    Net.use('/file', require(CH.module + '/file/route'))
    Net.use('/auth', require(CH.module + '/user/route'))
    Net.use('/user', require(CH.module + '/user/route'))
    Net.use('/msg', require(CH.module + '/message/route'))

    // Creating server ...
    Http = http.listen(CH.port)

    if (null == Http.address()) {
        console.log(`Port ${CH.port} already in use!`)
        Http = false
    } else {
        console.log('Host listening in ' + CH.site + (CH.port == 80 ? '' : ':' + CH.port))
    }

    // Inicia a central de mensagens (socket, etc) se estiver habilitado.
    if (Http && CS.enable) {
        Socket = require(CS.path + '/socket')()
        Socket.listen(http)
    }

    return { Net, Http, Socket }
}