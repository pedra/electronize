const path = require('path')
const { app } = require('electron')
const { route } = require('../file/route')
var router = require('express').Router()
const Utils = require(path.resolve(app.Config.app.module, 'utils'))()
const db = new require('./db')()



router.get('/list/:id', (req, res) => {
    const id = req.params.id || false
    if (!id) return res.json({ error: 'u5' })

    db.getMessageById(id, msg => res.json(msg))
})



module.exports = router