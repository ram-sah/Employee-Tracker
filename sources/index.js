let inquirer = require("inquirer");
let mysql = require("mysql");

connection.connect(function(err) {
    if (err) throw err;
    console.log (err); 
    start ()
});
//Start function 
function start() {
    inquirer.prompt({
        name: "action",
        type: "list",
        message: "What do you want ?",
        Choices: [
            "view all employee",
            "Add Employee",
            "Remove Employee",
            "Department",
            "Update Manager"
        ]

    }).then (function(answer){
        if (answer.action ==="view all employee") {
            viewAllEmployee();
            
        }
        if (answer.action === "Add Employee") {
            addEmployee();

        }
    });
}
function viewAllEmployee() {
    connection.query("select E1.first_name, E1.last_name, role.title, role.salary, department.name, E2.first_name as manager from employee E1 left join role on E1.role_id = role.id left join department on role.department_id = department.id left JOIN employee E2 on E2.id = e1.manager_id", function (err, res) {
        if (err) throw err;
        
        console.table(res);
        start();
    });
}