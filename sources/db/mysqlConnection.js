
const mysql = require("mysql");
const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: 'root',
  password: 'pass',
  database: 'employees'
});
//connect to the database
connection.connect(err => {
  if (err) throw err;
  console.log(`connected as id ${connection.threadId}`);
  selectAll();
});
// query function 
const selectAll = function() {
  connection.query("SELECT * FROM employee", (err, res) => {
    if (err) throw err;
    console.log(res);
    connection.end();
  });
}

// const mysql = require("mysql");
// const cTable = require ('console.table');
// const db_config ={
//   host: "localhost",
//   port: 3306,
//   user: 'root',
//   password: 'pass',
//   database: 'employees_db'
// };
// module.exports= db_config;


