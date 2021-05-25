/*
    Electronizer

    Copyright (c) 2021, Bill Rocha
    Developer: Bill Rocha <prbr@ymail.com> | billrocha.netlify.com
    Git: https://github.com/pedra/electronizer

 */

const { app } = require('electron')
const path = require('path')

module.exports = {

    Notify: (titulo, mensagem) => {
        titulo = titulo || 'Electronizer'
        mensagem = mensagem || 'Hello Word!'

        if (app.Tray != null) {
            app.Tray.setImage(path.join(app.Config.app.assets.tray, 'icon32.png'))

            app.Tray.displayBalloon({
                icon: path.join(app.Config.app.assets.tray, 'icon32.png'),
                title: titulo,
                content: mensagem
            })
        }
    }
}