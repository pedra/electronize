const path = require('path')
const fs = require('fs')
const { app } = require('electron')
var express = require('express')
var router = express.Router()

// Route to download a file -> http://localhost:5000/update/456
router.get('/update/:file', (req, res) => {
    res.download(path.join(app.Config.external.file, req.params.file))
})

router.get('/list', (req, res) => {
    if (!req.query.path) return res.json({ error: 1 })

    let basePath = path.resolve(__dirname, '..', '..', '..', '..', '..', '..')//app.Config.path // TODO: Vem do Banco de Dados 

    const pth = '/' + req.query.path.replace(/^(\/)|(\/)$/g, '')
    const bpth = basePath + pth

    if (!fs.existsSync(bpth)) return res.json({ error: 2 })

    let dt = [{ path: pth }]
    fs.readdirSync(bpth).forEach(i => {
        const st = fs.statSync(bpth + '/' + i)
        const ext = st.isDirectory() ? '_dir_' : path.extname(bpth + '/' + i)

        dt.push({ name: i, size: st.size, date: st.ctime, ext })
    })
    res.json(dt)
})

module.exports = router