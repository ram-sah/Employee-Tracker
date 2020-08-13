let inquirer = require("inquirer");
// let mysql = require("mysql");
let connection = require("./db/mysqlConnection");

connection.connect(err => {
  if (err) {
    console.log("error connection " + err.stack);
    return;
  }
  console.log(`connected as id ${connection.threadId}`);
  start();
});

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
      // ();
    }

    if (answer.action === "Quit") {
      console.log("BYE BYE");

    }
  });
}
function viewAllEmployee() {
  connection.query(
    `SELECT E.id as Employee_ID,E.first_name as First_Name,E.last_name as Last_Name,
    role.role_title as Role_Title, department.name as Department,
    role.salary as Salary, CONCAT(m.first_name," ",m.last_name) as Manager
    FROM employees_db.employee E left join employees_db.employee m on m.id = 
    E.manager_id join role on role.id=E.role_id join department on 
    role.department_id=department.id order by E.id asc`,
    function (err, res) {
      if (err) throw err;
      console.table(res);
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

    inquirer.prompt([
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
        {
          name: "role",
          type: "rawlist",
          choices: function () {
            var roleList = [];
            addEmp.forEach((role) => roleList.push(role.role_title));
            return roleList;
          },
          message: "Please select role of the employee:",
        },
        {
          name: "manager",
          type: "rawlist",
          choices: managerList,
          message: "Please select manager of the employee:",
        },
      ])
      .then((response) => {
        var roleId;
        addEmp.forEach((role) =>
          role.role_title === response.role ? (roleId = role.id) : null
        );

        connection.query("SELECT * FROM employee", function (err, emp) {
          let managerId;
          if (err) throw err;
          emp.forEach((emp) =>
            emp.first_name + " " + emp.last_name === response.manager
              ? (managerId = emp.id) : null
          );
          connection.query("INSERT INTO employee SET ?",
            {
              first_name: response.firstName,
              last_name: response.lastName,
              role_id: roleId,
              manager_id: managerId,
            },
            function (err) {
              if (err) throw err;
            }
          );
          console.log(`${response.firstName} is added successfully!`);
          start();
        });
      });
  });
}
