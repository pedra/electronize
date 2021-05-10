

const _Me = function (config) {

    let url = {},
        prop = {}

    const login = async (login, password) => {

        if (login.trim() == '' || password.trim() == '') return false

        await App.Storage.clear() // clear all data
        prop = {} // Local properties

        // enviando ao servidor...
        var me = await __post(url.login, { login, password })

        if (!me || me.error) return false

        me.auth = true
        App.Storage.add(me) // add user "me" data
        prop = me // local properties

        App.Page.show('profile')
        return true
    }

    const logout = async () => {
        var uid = (await App.Storage.me()).id
        __post(config.logout, { id: uid })

        await App.Storage.clear()// clear all data
        prop = {} // Local properties

        App.Page.show('auth')
    }

    const isLogged = () => prop.auth || false
    const get = p => !p ? prop : (p && prop[p] ? prop[p] : false)

    const construct = () => {
        url = config.user.url
    }

    construct()

    return {
        login, logout, isLogged,
        get
    }
}