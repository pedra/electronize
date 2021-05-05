
const path = require('path')
const { app } = require('electron')
var router = require('express').Router()
const MobileDetect = require('mobile-detect')
const Utils = require(path.resolve(app.Config.app.module, 'utils'))()
const db = new require('./db')()

/** ERROS
 *  u1: login ou password não informado
 *  u2: login ou password não correspondem
 * 
 */


// Login
router.post('/login', (req, res) => {
    const login = (req.body.login || '').trim()
    const password = (req.body.password || '').trim()

    // Não enviou login ou password
    if (login == '' || password == '') return res.json({ error: 'u1' })

    db.login(login, password, data => {
        if (data.length > 0) {
            data[0].token = Utils.tokey()
            db.set('token', data[0].id, data[0].token, () => res.json(data[0]))
        } else {
            res.json({ error: 'u2' })
        }
    })
})


router.get('/', (req, res) =>
    res.render(
        (new MobileDetect(req.headers['user-agent'])).mobile() ?
            'index-mobile' :
            'index'))



module.exports = router