let inquirer = require("inquirer");
let mysql = require("mysql");

let connection = require("./db/mysqlConnection");

//Start function 
function start() {
    inquirer.prompt({
        name: "action",
        type: "list",
        message: "What would you like to do?",
        choices: [
            "View All Employees By Department",
            "Add Employee",
            "Update Employee Role",
            "Remove Employee",
            "View All Employees By Manager",
            "Update Employee Manager",
            "View All Roles",
            "View total Utilised Budgets",
            "Quit"
        ]

    }).then(function (answer) {
        // based on user's answer, either call or the post functions
        if (answer.action === "View All Employees By Department") {
            viewAllEmployee();
        }
        if (answer.action === "Add Employee") {
            addEmployee();
        }
        if (answer.action === "Update Employee Role") {
            ();
        }
       
        if (answer.action === "Quit") {
            console.log("BYE BYE");

        }
    });
}
function viewAllEmployee() {
    connection.query(`select E1.first_name, E1.last_name, role.title, role.salary, 
    department.name, E2.first_name as manager from employee E1 left join role on 
    E1.role_id = role.id left join department on role.department_id = department.id 
    left JOIN employee E2 on E2.id = e1.manager_id`,
        function (err, res) {
            if (err) throw err;
            console.table(`\n\n`, res);
            start();
        }
    );
}
// Add Employee function start
function addEmployee() {
    connection.query("SELECT * FROM role", function (err, addEmp) {
      if (err) throw err;
  
      let managerList = ["None"];
      connection.query("SELECT * FROM employee", function (err, emp) {
        if (err) throw err;
        emp.forEach((emp) =>
          managerList.push(emp.first_name + " " + emp.last_name)
        );
      });
  
      inquirer
        .prompt([
          {
            name: "firstName",
            type: "input",
            message: "Enter First Name:",
          },
          {
            name: "lastName",
            type: "input",
            message: "Enter Last Name:",
          },
         

        ])
        .then((response) => {
          var roleId;
          addEmp.forEach((role) =>
            role.role_title === response.role ? (roleId = role.id) : null
          );
  
        });
    });
  }
start();