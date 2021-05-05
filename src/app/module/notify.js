/*
    Electronize

    Copyright (c) 2021, Bill Rocha
    Developer: Bill Rocha <prbr@ymail.com> | billrocha.netlify.com

 */

const { app } = require('electron')
const path = require('path')

module.exports = {

    Notify: (titulo, mensagem) => {
        titulo = titulo || 'Electronize'
        mensagem = mensagem || 'Hello Word!'

        if (app.Tray != null) {
            app.Tray.setImage(path.join(app.Config.desktop.tray, 'icon32.png'))

            app.Tray.displayBalloon({
                icon: path.join(app.Config.desktop.tray, 'icon32.png'),
                title: titulo,
                content: mensagem
            })
        }
    }
}