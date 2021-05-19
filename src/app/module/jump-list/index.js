/*
    Electronize

    Copyright (c) 2021, Bill Rocha
    Developer: Bill Rocha <prbr@ymail.com> | billrocha.netlify.com
    Git: https://github.com/pedra/electronize

 */

const fs = require('fs')
const path = require('path')
const { app } = require('electron')

module.exports = function (template) {

    template = template || 'default'
    const file = path.resolve(__dirname, `template/${template}.js`),
        jumpList = fs.existsSync(file) ? require(file) : []

    return app.setJumpList(jumpList)
}

