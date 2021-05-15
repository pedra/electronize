/*
    Electronize

    Copyright (c) 2021, Bill Rocha
    Developer: Bill Rocha <prbr@ymail.com> | billrocha.netlify.com

 */

const path = require('path')
const { app } = require('electron')
var sqlite3 = require('sqlite3').verbose()
var db = new sqlite3.Database(path.join(app.Config.external.db, 'magic.db'))

module.exports = function () {

    this.teste = (userId, cb) => {
        let where = ''
        let param = {}
        if (parseInt(userId) >= 1) {
            where = ' where id=$userId'
            param = { $userId: userId }
        }

        db.all('select * from user' + where, param, (e, r) => cb(!e ? r : []))
    }
    return this

}


// var dados = [{
//     "$name": "Bill Rocha",
//     "$login": "prbr@ymail.com",
//     "$password": "Ab123456",
//     "$token": "",
//     "$key": "",
//     "$level": "1",
// },
// {
//     "$name": "Rosangela Silva",
//     "$login": "rosangela@email.com",
//     "$password": "Ab123456",
//     "$token": "",
//     "$key": "",
//     "$level": "10"
// }]


// db.serialize(function () {

//     /*dados.map(row => db.run(`insert into user 
//                                (name, login, password, token, key, level) 
//                         values ($name, $login, $password, $token, $key, $level)`, row))
//     */


//     db.each(`SELECT
//     name
// FROM
//     sqlite_master
// WHERE
//     type ='table' AND
//     name NOT LIKE 'sqlite_%'`, (e, r) => {
//         fs.writeFileSync('TESTE.txt', JSON.stringify(r))
//         console.log(e, r)
//     })

//     // var stmt = db.prepare("INSERT INTO lorem VALUES (?)");
//     // for (var i = 0; i < 10; i++) {
//     //     stmt.run("Ipsum " + i);
//     // }
//     // stmt.finalize();

//     // db.each("SELECT rowid AS id, info FROM lorem", function (err, row) {
//     //     console.log(row.id + ": " + row.info);
//     // });
// })

// db.close()

// module.exports = () => null