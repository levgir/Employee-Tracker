var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Guster1467",
    database: "employeeTracker"
});

connection.connect(function (err) {
    if (err) throw err;

});

// function queryAllRoles() {
//     connection.query("SELECT * FROM role", function(err, res) {
//       if (err) throw err;
//       console.log(res);
//     });
//   }

function chooseAction() {
    inquirer
        .prompt([
            {
                type: "list",
                name: "chooseAction",
                message: "What would you like to do?",
                choices: ['Add a new department, role, or employee', 'View departments, roles, or employees', 'Update employee information']
            }
        ])
        .then(function (data) {
            if (data.chooseAction === "Add a new department, role, or employee") {
                newInput();
            } else if (data.chooseAction === "View departments, roles, or employees") {
                viewData();
            } else {
                updateEmployee();
            }
        });
}

function newInput() {
    inquirer
        .prompt([
            {
                type: "list",
                name: "chooseInput",
                message: "What would you like to add?",
                choices: ['Department', 'Role', 'Employee']
            }
        ])
        .then(function (data) {
            if (data.chooseInput === "Department") {
                newDepartment();
            } else if (data.chooseAction === "Role") {
                newRole();
            } else {
                newEmployee();
            }
        });
}

function newDepartment() {
    inquirer
        .prompt([
            {
                type: "input",
                name: "newDepartment",
                message: "Please enter the new department's name.",
            }
        ])
        .then(function (data) {
            connection.query(
                "INSERT INTO department SET ?",
                {
                    name: data.newDepartment,
                },
                function (err) {
                    if (err) throw err;
                    chooseAction();
                }
            );
        });
}

function newRole() {
    inquirer
        .prompt([
            {
                type: "input",
                name: "title",
                message: "Please enter the new roles's title.",
            },
            {
                type: "number",
                name: "salary",
                message: "Please enter the new roles's salary.",
            }
        ])
        .then(function (data) {
            connection.query(
                "INSERT INTO role SET ?",
                {
                    title: data.title,
                    salary: data.salary
                },
                function (err) {
                    if (err) throw err;
                    chooseAction();
                }
            );
        });
}

function newEmployee() {
    connection.query("SELECT * FROM role", function (err, results) {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    type: "input",
                    name: "firstName",
                    message: "Please enter the new employee's first name.",
                },
                {
                    type: "input",
                    name: "lastName",
                    message: "Please enter the new employee's last name.",
                },
                {
                    type: "rawlist",
                    name: "roleID",
                    message: "Please enter the new employee's role.",
                    choices: function () {
                        var choiceArray = [];
                        for (var i = 0; i < results.length; i++) {
                            choiceArray.push(results[i].title);
                        }
                        return choiceArray;
                    }
                }
            ])
            .then(function (data) {
                for (var i = 0; i < results.length; i++) {
                    if (data.roleID === results[i].title) {
                        data.roleID = results[i].id
                    }
                }
                return data;
            })
            .then(function (data) {
                console.log("This is the roleID " + data.roleID);
                connection.query(
                    "INSERT INTO employee SET ?",
                    {
                        first_name: data.firstName,
                        last_name: data.lastName,
                        role_id: data.roleID
                    },
                    function (err) {
                        if (err) throw err;
                        chooseAction();
                    }
                );
            });
    })
}

chooseAction();


