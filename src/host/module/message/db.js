const path = require('path')
const { app } = require('electron')
const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database(path.resolve(app.Config.external.db, 'magic.db'))
const USER_TABLE = 'user'
const MESSAGE_TABLE = 'message'

module.exports = function () {

    const getMessageById = ($id, cb) => {
        db.all(`
        select 
            m.user_from id, 
            u.name, 
            u.avatar,
            u.token,
            count(m.id) message

        from ${USER_TABLE} u
        inner join ${MESSAGE_TABLE} m
        on m.user_from = u.id

        where  m.user_to = $id

        group by m.user_from
        order by m.user_from`,
            { $id },
            (e, r) => cb(e ? [] : r)
        )
    }

    return {
        getMessageById
    }

}