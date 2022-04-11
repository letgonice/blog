const { createConnection } = require('mysql');
const sql = createConnection({
   host: 'localhost', //主机
   port: '3306', //端口
   user: 'root', //用户名
   password: 'root', //密码
   database: 'tech_blog' //数据库
});

sql.connect((err) => {
   if (err) throw err;
   console.log('Connect to the database successfully');
})

function query(DB) {
   return new Promise((resolve, reject) => {
      sql.query(DB, (err, rows) => {
         if (err) reject(err);
         resolve(rows);
      })
   })
}

module.exports = query;
