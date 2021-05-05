

const _User = function (config) {



    const show = () => {
        var user = App.Storage.get('user')

        _(config.user.html.name).innerHTML = user.name
        _(config.user.html.avatar).innerHTML = user.avatar
            ? `<img src="${user.avatar}" alt="avatar">`
            : __avt(__nm(user.name), 150, '#F00')
    }

    const index = () => {

    }


    const mode = () => {
        var mode = App.Storage.get('mode')
        mode = mode == 'dark' ? 'light' : 'dark'
        _(config.app.html.theme).href = `css/src/theme-${mode}.css`
        App.Storage.set('mode', mode)
    }


    const construct = (config) => {

    }

    construct(config)

    return {
        show, index,
        mode,
    }
}