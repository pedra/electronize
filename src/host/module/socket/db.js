const path = require('path')
const { app } = require('electron')
const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database(path.join(app.Config.external.db, 'magic.db'))
const USER_TABLE = 'user'
const MESSAGE_TABLE = 'message'

module.exports = function () {

    this.setSocket = (user, to, socket, cb) => {
        let stm = db.prepare(`update ${USER_TABLE} set socket=$socket where id=$user`)
        stm.run({ $socket: socket, $user: user }, e => cb(e ? 0 : stm.lastID))
    }

    this.OffSocket = (socket, cb) => {
        let stm = db.prepare(`UPDATE ${USER_TABLE} SET socket=NULL WHERE socket=$socket`)
        stm.run({ $socket: socket }, e => cb(e ? 0 : stm.lastID))
    }

    this.pushMsg = (m, cb) => {
        var stm = db.prepare(`INSERT INTO ${MESSAGE_TABLE} 
			(user_to, user_from, created, type, content) 
			VALUES ($user_to, $user_from, $created, $type, $content)`)
        stm.run(
            {
                $user_to: m.to,
                $user_from: m.from,
                $created: new Date(),
                $type: 'chat',
                $content: JSON.stringify(m.content)
            },
            e => cb(e ? 0 : stm.lastID)
        )
    }

    this.popMsg = (user, cb) =>
        db.all('SELECT socket FROM ' + USER_TABLE + ' WHERE id=$user',
            { $user: user },
            (e, r) => cb(!e && r && r[0] ? r[0].socket : false))

    this.setParam = (id, param, value, cb) => {
        let stm = db.prepare('UPDATE ' + MESSAGE_TABLE + ' SET ' + param + '=$value WHERE id=$id')
        stm.run(
            { $value: value, $id: id },
            e => cb(e ? 0 : stm.lastID)
        )
    }

    this.getParam = (id, param, cb) =>
        db.all('SELECT id, $param FROM ' + MESSAGE_TABLE + ' WHERE id=$id',
            { $id: id, $param: param },
            (e, r) => cb(e || (r && r.length == 0) ? false : r[0]))


    this.msgByUserAndId = (user, another, reg, amount, cb) => {
        reg = reg || 0 // se não for declarado, pega os últimos registros
        amount = amount || 20 // se não for declado, retorna 20 registros
        another = another || 1

        db.all(`SELECT id, user_from, user_to, created, viewed, deleted, content
			FROM ${MESSAGE_TABLE}
			WHERE type="chat"
			AND (id <= $reg OR 0 = $reg)
			AND ((user_to=$user AND user_from=$another) OR (user_to=$another AND user_from=$user))	
			AND deleted IS NULL
			ORDER BY id DESC
			LIMIT $amount`,
            { $user: user, $another: another, $reg: reg, $amount: amount },
            (e, r) => cb({ msg: e || (r && r.length == 0) ? [] : r })
        )
    }

    return this
}