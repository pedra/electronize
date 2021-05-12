/**
 * Interface de controle da página de CHAT com socket
 * @param {Array} config Configuração da aplicação
 * @returns {void} 
 */
const _Chat = function (config) {

    let msg = [
        { id: 1, uid: 0, msg: 'Olá!<br>Tudo bem com você?' },
        { id: 2, uid: 1, msg: 'Sim, tudo bem por aqui' },
        { id: 3, uid: 0, msg: 'Então...<br>Precisamos falar sobre o Tony!' },
        { id: 4, uid: 1, msg: 'Mussum Ipsum, cacilds vidis litro abertis. Quem manda na minha terra sou euzis! Quem num gosta di mim que vai caçá sua turmis! Interagi no mé, cursus quis, vehicula ac nisi.Posuere libero varius.Nullam a nisl ut ante blandit hendrerit.Aenean sit amet nisi.' },
        { id: 5, uid: 0, msg: 'Vamos marcar para amanhã na parte da manhã?' },
        { id: 1, uid: 0, msg: 'Olá!<br>Tudo bem com você?' },
        { id: 2, uid: 1, msg: 'Sim, tudo bem por aqui' },
        { id: 3, uid: 0, msg: 'Então...<br>Precisamos falar sobre o Tony!' },
        { id: 4, uid: 1, msg: 'Mussum Ipsum, cacilds vidis litro abertis. Quem manda na minha terra sou euzis! Quem num gosta di mim que vai caçá sua turmis! Interagi no mé, cursus quis, vehicula ac nisi.Posuere libero varius.Nullam a nisl ut ante blandit hendrerit.Aenean sit amet nisi.' },
        { id: 5, uid: 0, msg: 'Vamos marcar para amanhã na parte da manhã?' },
        { id: 5, uid: 0, msg: 'Vamos marcar para amanhã na parte da manhã?' },
        { id: 1, uid: 0, msg: 'Olá!<br>Tudo bem com você?' },
        { id: 2, uid: 1, msg: 'Sim, tudo bem por aqui' },
        { id: 3, uid: 0, msg: 'Então...<br>Precisamos falar sobre o Tony!' },
        { id: 4, uid: 1, msg: 'Mussum Ipsum, cacilds vidis litro abertis. Quem manda na minha terra sou euzis! Quem num gosta di mim que vai caçá sua turmis! Interagi no mé, cursus quis, vehicula ac nisi.Posuere libero varius.Nullam a nisl ut ante blandit hendrerit.Aenean sit amet nisi.' },
        { id: 5, uid: 0, msg: 'Vamos marcar para amanhã na parte da manhã?' },
        { id: 5, uid: 0, msg: 'Vamos marcar para amanhã na parte da manhã?' },
        { id: 1, uid: 0, msg: 'Olá!<br>Tudo bem com você?' },
        { id: 2, uid: 1, msg: 'Sim, tudo bem por aqui' },
        { id: 3, uid: 0, msg: 'Então...<br>Precisamos falar sobre o Tony!' },
        { id: 4, uid: 1, msg: 'Mussum Ipsum, cacilds vidis litro abertis. Quem manda na minha terra sou euzis! Quem num gosta di mim que vai caçá sua turmis! Interagi no mé, cursus quis, vehicula ac nisi.Posuere libero varius.Nullam a nisl ut ante blandit hendrerit.Aenean sit amet nisi.' },
        { id: 5, uid: 0, msg: 'Vamos marcar para amanhã na parte da manhã?' }
    ],
        url = {},
        html = {},
        channel = ''

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
        _(html.text).focus() // Foco na barra de texto
    }

    const view = (id, name, avatar) => {
        if (!id || !name || !avatar) return __report('Ocorreu um erro na busca de mensagens no servidor!')
        //Menu('chat', false, {id, name, avatar})
    }

    const closeEmoji = e => _(html.emojis).classList.remove('on')

    const show = async (data) => {
        console.log('Chat', data.id, data.name)

        _(html.name).innerHTML = data.name
        _(html.avatar).src = data.avatar

        let h = ''
        msg.map(m => {
            h += `<div class="cht-msg${m.uid == 1 ? ' me' : ''}" id="cht-msg-${m.id}">
                        <div class="cht-msg-text">${m.msg}</div>
                        <div class="cht-msg-data">
                            <span class="cht-date">${(new Date).toLocaleString()}</span>
                            <span class="cht-status">
                                <i class="material-icons">check_circle_outline</i>
                            </span>
                        </div>
                    </div>`
        })

        let c = _(html.content)
        c.innerHTML = h
        c.scrollTop = 0

        // Gravando o usuário da conversa 
        to.id = msg[0].id
        to.name = msg[0].name
        to.avatar = msg[0].avatar

        // Efeito "scroll"
        scroll()

        // Limpando o campo de digitação de mensagem.
        _(html.text).innerHTML = ''
        _(html.text).focus()

        // Ligando o socket
        return init()
    }

    const hide = () => {
        console.log('CHAT - hide!!')
        //socket.close()
        _(html.content).innerHTML = ''
    }

    // -------------------------------------- CHAT

    const init = () => {
        lowerMsgId = -1

        if (socket != null) close()
        socket = io() // Criando a conexão MSG

        _(html.send).onclick = send
        _(html.text).onkeypress = function (e) {
            if (e.shiftKey && e.charCode == 13) return true
            if (e.charCode == 13) {
                send()
                return false
            }
        }
        _(html.text).onkeyup = e => {
            if (e.shiftKey && (e.keyCode == 40 || e.keyCode == 38)) {
                _(html.text).innerHTML = mem_msg
            }
        }

        // Emojis Panel
        _(html.emoji).onclick = () => {
            console.log('Emoji')
            _(html.emojis).classList.add('on')
        }
        _(html.emojis).onclick = e => {
            console.log('Emojis', e.target.nodeName)
            if (e.target.nodeName == 'SPAN') {
                _(html.text).innerHTML += e.target.innerHTML
            }
            e.currentTarget.classList.remove('on')
        }

        _(html.content).onscroll = onScroll

        socket.on(channel, on)
    }

    const on = msg => {
        TMPX = socket
        console.log('[SOCKET]', msg, socket)
        if (msg.type == 'init') return socket.emit(channel, { type: 'initClient', id: 1, to: to.id })
        if (msg.type == 'list') return msgList(msg.data, true)
        if (msg.type == 'viewed') return msgSetViewed(msg)

        //if(msg.to != me.id || msg.from != to.id) return false

        stamp(msg, 'click')
        // if(msg.to == me.id) {
        //     socket.emit(html.chanel, {type: 'viewed', id: msg.id, from: msg.from})
        // }
    }

    const msgSetViewed = msg => {
        var i = _(html.msg + '-' + msg.id + ' .cht-status')
        if (i === false) {
            i.classList.add('on')
            i.innerHTML = 'visibility'
        }
    }

    const stamp = (msg, sound, before) => {
        if (msg.to == me.id
            && msg.viewed == null) {
            socket.emit(channel, { type: 'viewed', id: msg.id, from: msg.from })
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
            _(html.content).innerHTML = m + _(html.content).innerHTML
        } else {
            _(html.content).innerHTML += m
            scroll(sound)
        }

        setTimeout(() => {
            _(html.msg + '-' + msg.id).classList.add('on')
        }, 10)
    }

    const send = () => {
        var txt = _(html.text).innerHTML.trim().toString()
        if (txt.length == 2 && txt.charCodeAt(0) > 55356) {
            txt = '<span class="emojis-one">' + txt + '</span>'
        }

        mem_msg = txt

        if (txt == '') return false
        _(html.text).innerHTML = ''

        var msg = { ...qzc } // clonando o padrão
        msg.from = me.id
        msg.to = 2 //to.id
        msg.content.text = __ttoh(txt)
        var d = new Date()
        msg.created = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.toLocaleTimeString()

        //console.log('SEND', msg)
        //stamp(msg, 'glass')
        socket.emit(channel, msg)
    }

    const msgList = (data, init) => {
        if (undefined == typeof data['msg'] || data.msg.length == 0) return false

        for (var i in data.msg) {
            stamp(data.msg[i], false, true)
            if (data.msg[i].to == me.id) {
                socket.emit(channel, { type: 'viewed', id: data.msg[i].id })
            }
        }

        firstMsgId = data.msg[data.msg.length - 1].id

        setTimeout(() => {
            loading = false
        }, 400)

        if (init === true) {
            scrollH = _(html.msg).scrollHeight
            scroll()
        } else {
            _(html.content).scrollTop = parseInt(_(html.content).scrollHeight - scrollH - 100)
            scrollH = _(html.content).scrollHeight
        }
    }

    /**
     * Efeito de scroll
     * @param {Number} tm Fator de aceleração do scroll a
     */
    const scroll = (tm) => {
        tm = tm || 0.2
        let c = _(html.content),
            f = c.scrollHeight - c.offsetHeight,
            t = setTimeout(() => {
                if (c.scrollTop < f) {
                    c.scrollTop += 10
                    scroll(tm / (3000 / f))
                } else {
                    clearTimeout(t)
                }
            }, tm)
    }

    const onScroll = a => {
        if (loading || firstMsgId - lowerMsgId <= 0) return false

        if (_(html.content).scrollTop == 0) {
            _(html.content).innerHTML = '<div class="separator"></div>' + _(html.content).innerHTML
            _(html.loader).classList.remove('hide')

            loading = true

            __get(`${url.get}/${me.id}/${to.id}/${(firstMsgId - 1)}/20`,
                (e, d) => {
                    var data
                    try {
                        data = JSON.parse(d).data
                    } catch (e) {
                        data = { msg: [] }
                    }

                    if (data.msg.length == 0) {
                        lowerMsgId = firstMsgId
                        _(html.content).innerHTML =
                            '<div class="chat-final">That\'s all folks!</div>' + _(html.content).innerHTML
                    } else {
                        msgList(data)
                    }

                    _(html.loader).classList.add('hide')
                })
        }
    }

    const construct = () => {
        channel = config.channel
        url = config.url
        html = config.html
    }

    construct()

    return { open, view, show, hide, closeEmoji }
}