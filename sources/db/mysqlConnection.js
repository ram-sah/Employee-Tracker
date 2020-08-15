//Database connection 
const mysql = require("mysql");
// let start = require("../index");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: 'root',
  password: 'pass',
  database: 'employees_db'
});
//Database connection function 
// connection.connect(err => {
//   if (err) throw err;
//   console.log(`connected as id ${connection.threadId}`);
//   start();
// });
//query function 
// const selectAll = function () {
//   connection.query("SELECT * FROM employee", (err, res) => {
//     if (err) throw err;
//     //  console.table(res);
//     connection.end();
//   });
// }
module.exports = connection;
