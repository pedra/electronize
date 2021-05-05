/**
 * Sockets
 * @type {void}
 */

const { app } = require('electron')
const path = require('path')

const { Server } = require("socket.io")
const db = require('./db')()


module.exports = () => {
    let io

    this.listen = (server) => {

        io = new Server(server)

        // , {
        //     cors: {
        //         origin: "*",
        //         methods: ["GET", "POST"],
        //         allowedHeaders: ["content-type"]
        //     }
        // })

        io.on('connection', socket => {
            var userId = socket.id

            this.userOn(socket)
            socket.on('qzc', (m) => this.message(socket, m))
            socket.on('disconnect', (socket) => this.userOff(userId))
        })
    }

    this.userOn = (socket) => socket.emit('qzc', { type: 'init', id: socket.id })


    this.message = (socket, m) => {

        switch (m.type) {
            case 'initClient': // inicializando
                db.setSocket(m.id, m.to, socket.id, e => {
                    db.msgByUserAndId(m.id, m.to, null, null,
                        r => io.to(socket.id).emit('qzc', { type: 'list', data: r }))
                })

                console.log('initClient', m)
                break

            case 'viewed': // Confirmação de visuaiização
                console.log('viewed', m)
                m['date'] = new Date()
                db.setParam(m.id, 'viewed', m.date, () => null);
                db.popMsg(m.from, s => s !== false ? io.to(s).emit('qzc', m) : false)
                break

            default: // Registrando mensagem no DB e enviando
                console.log('default', m)
                db.pushMsg(m, id => {
                    if (id != 0) {
                        m.id = id
                        db.popMsg(m.to, s => {
                            io.to(socket.id).emit('qzc', m)
                            if (s !== false) io.to(s).emit('qzc', m)
                        })
                    }
                })
        }
    }

    this.userOff = (userId) => {
        console.log('userOff', userId)
        db.OffSocket(userId, () => null)
    }


    return this
}