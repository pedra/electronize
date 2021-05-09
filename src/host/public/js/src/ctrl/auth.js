

const _Auth = function (config) {

    const show = (name) => {

    }

    const login = async (login, password) => {
        login = (login || '').trim()
        password = (password || '').trim()

        //App.Storage.set('user', { id: 0, name: '' })
        App.Storage.clear() // clear all packet

        if (login == '' || password == '')
            return __report('Você precisa digitar o LOGIN e a SENHA!')

        // enviando ao servidor...
        var p = await __post(config.login, { login, password })

        if (!p || p.error) return __report('Não consegui autenticar seu usuário!<br>Verifique seus dados ou entre em contato com o administrador.')

        p.auth = true
        App.Storage.add(p) // add user "me" data

        App.Page.show('profile')
        __report(`Bem vindo!`, 'info', 2000)
    }

    const logout = async () => {
        var uid = (await App.Storage.me()).id
        __post(config.logout, { id: uid })

        App.Storage.clear()

        App.Page.show('auth')
        __report('Você está anônimo.')
    }

    const isLogged = async () => (await App.Storage.me()) ? true : false

    const getMe = async () => await App.Storage.me()

    const construct = (config) => {

        _(config.html.form).onsubmit = e => {
            e.preventDefault()
            return login(
                _(config.html.login).value,
                _(config.html.password).value
            )
        }
    }

    construct(config)

    return {
        show,
        login, logout, isLogged,
        getMe
    }
}