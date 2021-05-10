

/// DEBUG ONLY - delete next line in production mode.
let TMPX, TMPY

// Global Namespace "App"
const App = {}


window.onload = () => {
    // Iniciando as libs ...
    App.Event = new _Event()
    App.Storage = new _Storage('elize')
    App.Page = new _Page(Config.pages)
    App.Bmenu = new _Bmenu(Config)

    // Entities ...
    App.Me = new _Me(Config)
    App.Chat = new _Chat(Config.chat)

    //Installing Service Worker...
    if ('serviceWorker' in navigator) {
        navigator
            .serviceWorker
            .register(location.origin + '/sw.js', { scope: '/' })
            .then(sw => {
                console.log("[SW: Instalado]")
            })
    } else {
        console.log("[SW: Não instalado]")
        alert('Não consegui instalar o Serviço!<br>A aplicação rodará sem muitos problemas, porém, sem acesso ao cache de rede.')
    }

    // Carregando as configurações e a página correspondente...
    App.Storage.me().then(a => App.Page.show(a && a.id > 0 ? 'profile' : 'auth'))
}