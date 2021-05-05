
const _Home = function (config) {

    const init = () => {

        var user = App.Storage.get('user')

        if (user && user.id > 0) {
            _(config.title).innerHTML = `Olá <b>${user.name}</b>!`
        } else {
            _(config.title).innerHTML = 'Bem Vindo!'
        }

    }


    const construct = (config) => {

    }

    construct(config)


    return {
        init
    }
}