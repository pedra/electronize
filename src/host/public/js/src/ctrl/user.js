

const _User = function (config) {



    const show = () => {
        App.Storage.me().then(user => {
            if (!user) return false
            _(config.app.html.theme).href = `css/src/theme-${user.theme}.css`
            _(config.user.html.theme).innerHTML = user.theme
            _(config.user.html.access).innerHTML = user.access
            _(config.user.html.download).innerHTML = user.download
            _(config.user.html.upload).innerHTML = user.upload
            _(config.user.html.name).innerHTML = user.name
            _(config.user.html.avatar).innerHTML = user.avatar
                ? `<img src="${user.avatar}" alt="avatar">`
                : __avt(__nm(user.name), 150, '#F00')
        })
    }

    const index = () => {

    }


    const theme = async () => {
        var me = await (App.Storage.me())
        me.theme = me.theme == 'dark' ? 'light' : 'dark'
        _(config.app.html.theme).href = `css/src/theme-${me.theme}.css`
        _(config.user.html.theme).innerHTML = me.theme

        await App.Storage.upd(me)
        await __post(config.user.setTheme, { id: me.id, theme: me.theme })
    }


    const construct = (config) => {

    }

    construct(config)

    return {
        show, index,
        theme,
    }
}