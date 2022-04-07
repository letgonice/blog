let mysql = require('mysql')
let dbConfig = require('../config/dbconfig.JS')
//配置数据库参数
let connection = mysql.createConnection(dbConfig)
//连接mysql
connection.connect(function (err) {
    if (err) {
        throw err;
    }
    console.log('connect mysql success');
});
function query() {
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, result) => {
            if (err) { reject(err) }
            resolve(result)
            })
        })
}
    
module.exports = query;
