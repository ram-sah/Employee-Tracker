let inquirer = require("inquirer");
let chalk = require("chalk");
let figlet = require("figlet");
let connection = require("./db/mysqlConnection");


connection.connect(err => {
  if (err) {
    console.log("error connection " + err.stack);
    return;
  }
  console.log(`connected as id ${connection.threadId}`);
  clearScreen();
  start();
});
// Clear Screen and start function 
function clearScreen() {
  // clear();
  console.log(
    chalk.bgMagenta(
      figlet.textSync("WELCOME", { horizontalLayout: "full" })
    )
  );
}
//Start function 
function start() {
  inquirer.prompt({
    name: "action",
    type: "list",
    message: "What would you like to do?",
    choices: [
      "1. View All Employees By Department",
      "2. Add Employee",
      "3. Update Employee Role",
      "4. View All Roles",
      "5. View all department",
      "6. Add Department",
      "7. Add Role",
      "8. Remove Employee",
      "9. View All Employees By Manager",
      "10. Update Employee Manager",
      "11. View total Utilised Budgets",
      "12. Quit"
    ]
  }).then(function (answer) {
    // based on user's answer, either call or the post functions
    if (answer.action === "1. View All Employees By Department") {
      viewAllEmployee();
    }
    if (answer.action === "2. Add Employee") {
      addEmployee();
    }
    if (answer.action === "3. Update Employee Role") {
      updateEmployeeRole();
    }
    if (answer.action === "4. View All Roles") {
      viewRoles();
    }
    if (answer.action === "12. Quit") {
      stop();
      console.log("FOR VIEWING MY APPLICATION !  BYE BYE.....");
      connection.end();
    }
  });
}
// View all employees function
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
//  Update Employee Role function
function updateEmployeeRole() {
  connection.query("Select * from employee", function (err, res) {
    if (err) throw err;
    //New list of first and last name
    const names = res.map(element => {
      return `${element.id}: ${element.first_name} ${element.last_name}`
    })
    connection.query("SELECT role_title, id from role", function (err, success) {
      if (err) throw err;
      const role = success.map(element => {
        return `${element.id}: ${element.role_title}`
      });
      inquirer.prompt([
        {
          name: "who",
          type: "list",
          choices: names,
          message: "Whom would you like to update?"
        },
        {
          name: "role",
          type: "list",
          choices: role,
          message: "What is the title of their new role?"
        }
      ]).then(answers => {
        // console.log(answers);
        const empIdToUpdate = answers.who.split(":")[0];
        // console.log(empIdToUpdate)
        const chosenRole = success.find(element => {
          return element.role_title === answers.role.split(": ")[1];
        })
        // console.log(chosenRole.id);
        connection.query("UPDATE employee SET role_id=? where id=?", [chosenRole.id, empIdToUpdate], function (err, ress) {
          if (err) throw err;
          console.log(`\nEmployee's role updated successfully!\n`);
          start();
        })
      })
    })
  })
}
// View all role function
function viewRoles() {
  connection.query(
    "SELECT id as Role_Id,role_title as Role_Title,salary as Salary,department_id as Department_ID FROM role",
    function (err, res) {
      if (err) throw err;
      console.table(res);
      start();
    }
  );
}




// stop function 
function stop() {
  console.log(
    chalk.redBright(
      figlet.textSync("Thanks!", {
        horizontalLayout: "full",
      })
    )
  );
  // process.exit(0);
}