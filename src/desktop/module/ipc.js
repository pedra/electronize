const path = require('path')
const { app, ipcMain } = require('electron')
const { Notify } = require(path.join(app.Config.app.module, 'notify'))

module.exports = function () {

    let Window = app.Window.getInstance()

    // Carrega uma página na janela principal
    ipcMain.on('loadPage', (event, url) => Window.loadURL(url))

    // Carrega link em navegador externo
    ipcMain.on('openLink', (link) => Shell.openExternal(link))

    // Minimizar a tela
    ipcMain.on('fechar', () => {
        app.quit()
    })

    // Fechar aplicação - mesmo
    ipcMain.on('appquit', () => {
        if (app.appTray) app.appTray.destroy()
        app.quit()
    })

    // Para criar um canal entre janelas com a janela principal (usado em Frota >> relatórios)
    ipcMain.on('appCommandPage', (e, a, b, c) => Window.webContents.send('modalMsg', e, a, b, c))

    // Enviando mensagem para a área de notificação
    ipcMain.on('showNotification', (e, titulo, mensagem) => Notify(titulo, mensagem))

    /* Barra de progresso
      exemplo: ipcRenderer.send('progressBar', valor)  
      --> valor de 0 a 1
      --> -1 desabilita a barra
      --> 2 (maior que 1) coloca em modo "indefinido" (fica apulsando)
    */
    ipcMain.on('progressBar', (e, value) => Window.setProgressBar(value))

    // ---- TESTE ---- DELETAR

    ipcMain.on('teste', (e, a, b, c) => {
        Window.setOverlayIcon(path.join(app.Config.desktop.tray, 'on.png'), 'Description for overlay')

        Window.flashFrame(true)
        // Thumbnails
        Window.setThumbarButtons([
            {
                tooltip: 'button1',
                icon: path.join(app.Config.desktop.tray, 'l.png'),
                click() { console.log('button1 clicked') }
            }, {
                tooltip: 'button2',
                icon: path.join(app.Config.desktop.tray, 'l.png'),
                flags: ['enabled', 'dismissonclick'],
                click() { console.log('button2 clicked.') }
            }])

        e.returnValue = path.join(app.Config.desktop.tray, 'on.png')
    })

    return { Notify }
}