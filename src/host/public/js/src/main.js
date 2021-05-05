

/// DEBUG ONLY - delete next line in production mode.
let TMPX, TMPY

// Global Namespace "App"
const App = {}


window.onload = () => {
    // Iniciando os objetos do sistema...
    App.Event = new _Event()
    App.Storage = new _Storage()
    App.Page = new _Page(Config.pages)
    App.Bmenu = new _Bmenu(Config)

    // Controllers...
    App.Home = new _Home(Config.home)
    App.Auth = new _Auth(Config.auth)
    App.File = new _File(Config.file)
    App.User = new _User(Config)
    App.Chat = new _Chat(Config.chat)

    //Installing Service Worker...
    if ('serviceWorker' in navigator) {
        navigator
            .serviceWorker
            .register(location.origin + '/sw.js', { scope: '/' })
            .then(sw => {
                console.log("[SW: Instalado]")

                // Carregando as configurações e a página correspondente...
                App.Storage.init().then(data =>
                    App.Page.show(data.user && data.user.id > 0 ? 'profile' : 'auth')
                )
            })
    } else {
        console.log("[SW: Não instalado]")
        return alert('Não consegui instalar o Serviço!')
    }
}