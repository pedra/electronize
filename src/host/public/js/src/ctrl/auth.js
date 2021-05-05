

const _Auth = function (config) {

    let userName = 'Convidado'

    const show = (name) => {
        //if (!name) return (_(config.html.logo).innerHTML = __avt('👽', 150, 'transparent'))

        name = name || userName
        var names = name.split(' ')
        var alias = ''
        if (names.length <= 1) {
            alias = name[0] + name[name.length - 1].toLowerCase()
            console.log('Menor', name, names.length)
        } else {
            console.log('Maior', names)
            alias = names[0].substr(0, 1) + names[names.length - 1].substr(0, 1).toLowerCase()
        }
        //_(config.html.logo).innerHTML = __avt(alias, 80)
    }

    const login = async (login, password) => {
        login = (login || '').trim()
        password = (password || '').trim()

        App.Storage.set('user', { id: 0, name: '' })

        if (login == '' || password == '')
            return __report('Você precisa digitar o LOGIN e a SENHA!')

        // enviando ao servidor...
        var p = await __post(config.login, { login, password })

        if (!p || p.error) return __report('Não consegui autenticar seu usuário!<br>Verifique seus dados ou entre em contato com o administrador.')

        App.Storage.set('user', p)
        App.Page.show('profile')
        __report(`Bem vindo!`, 'info', 2000)
    }

    const logout = async () => {
        var data = await App.Storage.set('user', { id: 0, name: '' })
        __post(config.logout, { id: data.user.id })

        App.Page.show('auth')
        __report('Você está anônimo.')
    }

    const isLogged = () => App.Storage.get('user').id > 0 && App.Storage.get('user').token ? true : false

    const getMe = () => App.Storage.get('user')

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