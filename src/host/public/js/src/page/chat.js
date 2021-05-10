/**
 * Interface de controle da página de CHAT com socket
 * @param {Array} config Configuração da aplicação
 * @returns {void} 
 */
const _Chat = function (config) {

    let socket = null,
        mem_msg = '***',
        qzc = {
            type: 'msg',
            error: false,
            id: '0',
            from: '0',
            to: '0',
            created: '',
            content: {
                text: '',
                attached: 0,
                cite: 0
            }
        },
        to = {},
        loading = true,
        scrollH = 0,
        lowerMsgId = -1,
        firstMsgId = 0,
        me = { id: 0, name: '', avatar: '' }

    const close = () => {
        socket.close()
    }

    const open = () => {
        socket.connect()
        _(config.text).focus() // Foco na barra de texto
    }

    const view = (id, name, avatar) => {
        if (!id || !name || !avatar) return __report('Ocorreu um erro na busca de mensagens no servidor!')
        //Menu('chat', false, {id, name, avatar})
    }

    const show = async (id, name) => {
        me = App.Auth.getMe()
        //_('#pg-chat').classList.add('on')
        _(config.content).innerHTML = ''
        _(config.content).scrollTop = 0
        _(config.text).focus()

        init()

        //if ('undefined' != typeof to) {
        to.id = me.id
        to.name = me.name
        to.avatar = Config.app.assets + me.avatar
        //pagemode = 'chat'
        // } else {
        // 	//Menu('message')
        // }


        _('#chat-userdata').innerHTML =
            '<img src="' +
            to.avatar +
            '"><span>' +
            to.name + //.substr(0, 30) +
            '</span><button onclick="Chat.hide()"><i class="material-icons">close</i></button>'
        _('#pg-chat').classList.add('on')
    }

    const hide = () => {
        console.log('CHAT - hide!!')
        socket.close()
        _(config.content).innerHTML = ''
    }

    // -------------------------------------- CHAT

    const init = () => {
        lowerMsgId = -1

        if (socket != null) close()
        socket = io() // Criando a conexão MSG

        _(config.send).onclick = send
        _(config.text).onkeypress = function (e) {
            if (e.shiftKey && e.charCode == 13) return true
            if (e.charCode == 13) {
                send()
                return false
            }
        }
        _(config.text).onkeyup = e => {
            if (e.shiftKey && (e.keyCode == 40 || e.keyCode == 38)) {
                _(config.text).innerHTML = mem_msg
            }
        }

        // Emojis Panel
        _(config.emojiBtn).onclick = () => _(config.emoji).classList.add('on')


        _(config.emoji).onclick = e => {
            if (e.target.nodeName == 'SPAN') {
                _(config.text).innerHTML += e.target.innerHTML
            }
            e.currentTarget.classList.remove('on')
        }

        _(config.content).onscroll = onScroll

        socket.on(config.chanel, on)
    }

    const on = msg => {
        TMPX = socket
        console.log('[SOCKET]', msg, socket)
        if (msg.type == 'init') return socket.emit(config.chanel, { type: 'initClient', id: 1, to: to.id })
        if (msg.type == 'list') return msgList(msg.data, true)
        if (msg.type == 'viewed') return msgSetViewed(msg)

        //if(msg.to != me.id || msg.from != to.id) return false

        stamp(msg, 'click')
        // if(msg.to == me.id) {
        //     socket.emit(config.chanel, {type: 'viewed', id: msg.id, from: msg.from})
        // }
    }

    const msgSetViewed = msg => {
        var i = _(config.msgId + msg.id + ' .chat-msg-header i')
        if (i === false) {
            i.classList.add('on')
            i.innerHTML = 'visibility'
        }
    }

    const stamp = (msg, sound, before) => {
        if (msg.to == me.id
            && msg.viewed == null) {
            socket.emit(config.chanel, { type: 'viewed', id: msg.id, from: msg.from })
        }

        var sound = sound || false
        var e = msg.to == me.id ? '' : ' you'
        var i = msg.to == me.id ? to.avatar : '/img/user.jpg'
        e += msg.content.text.indexOf('<span class="emojis-one"') != -1 ? ' emojis-tr' : ''
        var d =
            msg.to == me.id
                ? ''
                : '<i class="material-icons' +
                (msg.viewed == null ? '' : ' on') +
                '">' +
                (msg.viewed == null ? 'done' : 'visibility') +
                '</i>'

        var m =
            '<div class="chat-emsg' +
            e +
            '" id="chat-msgid' +
            msg.id +
            '"><div class="chat-msg-header">' +
            d +
            '<date>' +
            new Date(msg.created).toLocaleString() +
            '</date></div><div class="chat-text">' +
            msg.content.text +
            '</div></div>'

        //formatdate(msg.created)

        if (before === true) {
            _(config.content).innerHTML = m + _(config.content).innerHTML
        } else {
            _(config.content).innerHTML += m
            scroll(sound)
        }

        setTimeout(() => {
            _(config.msgId + msg.id).classList.add('on')
        }, 10)
    }

    const send = () => {
        var txt = _(config.text).innerHTML.trim().toString()
        if (txt.length == 2 && txt.charCodeAt(0) > 55356) {
            txt = '<span class="emojis-one">' + txt + '</span>'
        }

        mem_msg = txt

        if (txt == '') return false
        _(config.text).innerHTML = ''

        var msg = { ...qzc } // clonando o padrão
        msg.from = me.id
        msg.to = 2 //to.id
        msg.content.text = __ttoh(txt)
        var d = new Date()
        msg.created = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.toLocaleTimeString()

        //console.log('SEND', msg)
        //stamp(msg, 'glass')
        socket.emit(config.chanel, msg)
    }

    const msgList = (data, init) => {
        if (undefined == typeof data['msg'] || data.msg.length == 0) return false

        for (var i in data.msg) {
            stamp(data.msg[i], false, true)
            if (data.msg[i].to == me.id) {
                socket.emit(config.chanel, { type: 'viewed', id: data.msg[i].id })
            }
        }

        firstMsgId = data.msg[data.msg.length - 1].id

        setTimeout(() => {
            loading = false
        }, 400)

        if (init === true) {
            scrollH = _(config.msg).scrollHeight
            scroll()
        } else {
            _(config.content).scrollTop = parseInt(_(config.content).scrollHeight - scrollH - 100)
            scrollH = _(config.content).scrollHeight
        }
    }

    const scroll = sound => {
        _(config.content).scrollTop = _(config.content).scrollHeight
        //if("undefined" != typeof SOUND[sound]) SOUND[sound].play()
        // $(config.msg).animate({scrollTop: _('chat-msg').scrollHeight - 100}, 100, 'swing', function () {
        // 	//_('chat-text').focus()
        // 	if ('undefined' != typeof SOUND[sound]) SOUND[sound].play()
        // })
    }

    const onScroll = a => {
        if (loading || firstMsgId - lowerMsgId <= 0) return false

        if (_(config.content).scrollTop == 0) {
            _(config.content).innerHTML = '<div class="separator"></div>' + _(config.content).innerHTML
            _(config.loader).classList.remove('hide')

            loading = true

            __get(`${config.url}/${me.id}/${to.id}/${(firstMsgId - 1)}/20`,
                (e, d) => {
                    var data
                    try {
                        data = JSON.parse(d).data
                    } catch (e) {
                        data = { msg: [] }
                    }

                    if (data.msg.length == 0) {
                        lowerMsgId = firstMsgId
                        _(config.content).innerHTML =
                            '<div class="chat-final">That\'s all folks!</div>' + _(config.content).innerHTML
                    } else {
                        msgList(data)
                    }

                    _(config.loader).classList.add('hide')
                })
        }
    }

    const construct = (config) => {

    }

    construct(config)

    return { open, view, show, hide }
}