let inquirer = require("inquirer");
let chalk = require("chalk");
let figlet = require("figlet");
let connection = require("./mysqlConnection");

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
      "9. Remove Department",
      "10. Remove Role",
      "11. View Employees By Manager",
      "12. Update Employee Manager",
      "13. View total Utilised Budgets",
      "14. Quit"
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
    if (answer.action === "5. View all department") {
      viewDepartments()
    }
    if (answer.action === "6. Add Department") {
      addDepartment()
    }
    if (answer.action === "7. Add Role") {
      addrole()
    }
    if (answer.action === "8. Remove Employee") {
      removeEmployee()
    }
    if (answer.action === "11. View Employees By Manager") {
      viewEmployeesByManager()
    }
    if (answer.action === "14. Quit") {
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
//View Department function
function viewDepartments() {
  connection.query(
    "SELECT id as Department_Id, name as Department_Name FROM department",
    function (err, res) {
      if (err) throw err;
      console.table(res);
      start();
    }
  );
}
// View Employees by Manager function
function viewEmployeesByManager() {
  connection.query("SELECT * FROM employee", function (err, emp) {
    if (err) throw err;
    inquirer.prompt([
      {
        name: "getManager",
        type: "rawlist",
        choices: function () {
          var empList = [];
          emp.forEach((employee) => {
            empList.push(employee.first_name + " " + employee.last_name);
          });
          return empList;
        },
        message: "Which manager's employees do you want to view?:",
      },
    ])
      .then((response) => {
        let managerId;
        emp.forEach((emp) =>
          emp.first_name + " " + emp.last_name === response.getManager
            ? (managerId = emp.id)
            : null
        );
        connection.query(
          `SELECT 
          E.manager_id as Manager_ID,
          concat(m.first_name," ",m.last_name) as Manager,
          E.first_name as First_Name,E.last_name as Last_Name,
          role.role_title as Role_Title,
          department.name as Department,
          role.salary as Salary
          FROM employees_db.employee E
          left join employees_db.employee m on m.id = E.manager_id
          join role on role.id=E.role_id
          join department on role.department_id=department.id
          where E.manager_id=?
          order by E.id asc`,
          [managerId],
          function (err, res) {
            if (err) throw err;
            if (res.length > 0) {
              console.table(res);
            } else {
              console.log(
                chalk.greenBright(
                  figlet.textSync("\n\nNO DATA....", {
                    horizontalLayout: "full",
                  })
                )
              );
            }
            start();
          }
        );
      });
  });
}

// Add a department function 
function addDepartment() {
  inquirer.prompt([
    {
      name: "NewDept",
      type: "input",
      message: "What is the new department's name",
    }
  ]).then(function (answer) {
    connection.query("INSERT INTO department SET ?",
      {
        name: answer.NewDept,
      },
      function (err, res) {
        if (err) throw err;
        start();
      })
  }
  )
}
//Add Role function 
function addrole() {
  inquirer.prompt([
    {
      name: "Title",
      type: "input",
      message: "What is the new Role's name ?",
    },
    {
      name: "Salary",
      type: "input",
      message: "What is new Role's annual salary? "
    },
    {
      name: "Id",
      type: "input",
      message: "What is new role's department ID?",
    }
  ]).then(function (answer) {
    connection.query("INSERT INTO role SET ?",
      {
        role_title: answer.Title,
        salary: answer.Salary,
        department_id: answer.Id,
      },
      function (err, res) {
        if (err) throw err;
        start();
      })
  }
  )

}
// Remove an employee function
function removeEmployee() {
  let employees = []
  // Pull employees from database and push to 'employees' array.
  connection.query(
    `SELECT DISTINCT first_name as "Name" FROM employee E 
    WHERE first_name IS NOT NULL;`, function (err, results) {
    if (err) throw err;
    console.table(results);
    for (let i = 0; i < results.length; i++) {
      let delEmp = results[i].name;
      employees.push(delEmp);
    }
    console.log(employees)
    inquirer.prompt([
      {
        name: "name",
        type: "list",
        message: "Please select employee to remove?",
        choices: employees
      }
    ]).then(function (answer) {
        connection.query("DELETE FROM employee WHERE ?",
          {
            first_name: answer.name,
          },
          function (err, results) {
            if (err) throw err;
            start();
          })
      })
  });
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