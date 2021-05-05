/*
    Electronize

    Copyright (c) 2021, Bill Rocha
    Developer: Bill Rocha <prbr@ymail.com> | billrocha.netlify.com

 */

const path = require('path')
const { app } = require('electron')
const db = require(app.Config.app.db)() // teste


module.exports = function () {

    // Teste de SQLite ...


    db.teste(3, (r) => console.log("App - init: ", r))

}