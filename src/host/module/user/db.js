const path = require('path')
const { app } = require('electron')
const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database(path.resolve(app.Config.external.db, 'magic.db'))
const USER_TABLE = 'user'

module.exports = function () {

    // Verifica login + password
    const login = ($login, $password, cb) =>
        db.all(`select id, name, level, key, token, avatar from ${USER_TABLE} where login=$login and password=$password`,
            { $login, $password },
            (e, r) => cb(e ? [] : r)
        )

    // Set colum/param
    const set = (param, $id, $value, cb) =>
        db.run(`update ${USER_TABLE} set ${param}=$value where id=$id`,
            { $value, $id },
            e => cb(e ? true : false)
        )

    // Get colum/param
    const get = (param, $id, cb) =>
        db.all(`select ${param} from ${USER_TABLE} where id=$id`,
            { $id },
            (e, r) => cb(e ? [] : r)
        )

    return {
        set, get,
        login
    }
}