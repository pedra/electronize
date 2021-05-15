/*
    Electronize

    Copyright (c) 2021, Bill Rocha
    Developer: Bill Rocha <prbr@ymail.com> | billrocha.netlify.com

 */

const { app } = require('electron')

module.exports = () => {

    const set = (config) => app.setJumpList(config)


    return { set }
}

