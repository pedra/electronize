

const _Notify = function (config) {
    url = {}
    html = {}

    const show = (msg) => {
        console.log("msg".msg)
        TMP = msg
        var h = ''

        if (!msg || msg == []) {
            h = 'Nenhuma mensagem nova!'
        } else {
            msg.map(m => {
                var online = m.token && m.token != ''
                h += `<div class="ntf-card" id="ntf-card-${m.id}" onclick="App.Notify.on(${m.id})">
                    <div class="avatar">
                        <img src="${m.avatar}" alt="avatar">
                    </div>
                    <div class="data">
                        <h2>${m.name}</h2>
                        <div class="props">
                            <span class="status${online ? ' on' : ''}">${online ? 'online' : 'offline'}</span>
                            <span class="notify">${m.message} mensagem(s)</span>
                        </div>
                    </div>
                    <div class="icon${online ? ' on' : ''}">
                        <i class="material-icons">chevron_right</i>
                    </div>
                </div>`
            })
        }

        _(html.container).innerHTML = h
    }

    const on = id => {
        _(html.cardId + id).classList.add('on')
        App.Page.show('chat', id)
    }

    const getMessages = async () => {
        var id = App.Me.get('id')
        var msg = await __get({ url: url.list, param: id })
        show(msg)
    }

    const construct = () => {
        url = config.url
        html = config.html
        getMessages()
    }
    construct()

    return { on }
}