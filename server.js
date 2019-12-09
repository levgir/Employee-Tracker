var mysql = require("mysql");
var inquirer = require("inquirer");
var cTable = require('console.table');

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

function updateEmployee() {
    connection.query("SELECT * FROM employee", function (err, results) {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    type: "list",
                    name: "employeeName",
                    message: "Please select the employee you want to edit.",
                    choices: function () {
                        var choiceArray = [];
                        for (var i = 0; i < results.length; i++) {
                            choiceArray.push(results[i].id + " " + results[i].first_name + " " + results[i].last_name);
                        }
                        return choiceArray;
                    }
                }
            ])
            .then(function (data) {
                for (var i = 0; i < results.length; i++) {
                    if (data.employeeName === results[i].id + " " + results[i].first_name + " " + results[i].last_name) {
                        var employeeID = results[i].id;
                    }
                }
                return (employeeID);
            })
            .then(function (employeeID) {
                inquirer
                    .prompt([
                        {
                            type: "list",
                            name: "chooseEdit",
                            message: "What would you like to edit for this employee?",
                            choices: ['First name', 'Last name', 'Role']
                        }
                    ])
                    .then(function (data) {
                        if (data.chooseEdit === "First name") {
                            newFirstName(employeeID);
                        } else if (data.chooseEdit === "Last name") {
                            newLastName(employeeID);
                        } else {
                            newEmpRole(employeeID);
                        }
                    });
            });
    })
}

function newEmpRole(employeeID) {
    connection.query("SELECT * FROM role", function (err, results) {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    type: "rawlist",
                    name: "roleID",
                    message: "What is their new role.",
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
                connection.query(
                    "UPDATE employee SET ? WHERE ?",
                [
                  {
                    role_id: data.roleID
                  },
                  {
                    id: employeeID
                  }
                ],
                function(error) {
                  if (error) throw err;
                  chooseAction();
                }
              );
            });
    })
}

function newLastName(employeeID) {
    inquirer
        .prompt([
            {
                type: "input",
                name: "newLast",
                message: "What is their new last name?"
            }
        ])
        .then(function (data) {
            connection.query(
                "UPDATE employee SET ? WHERE ?",
                [
                  {
                    last_name: data.newLast
                  },
                  {
                    id: employeeID
                  }
                ],
                function(error) {
                  if (error) throw err;
                  chooseAction();
                }
              );
        });
}

function newFirstName(employeeID) {
    inquirer
        .prompt([
            {
                type: "input",
                name: "newFirst",
                message: "What is their new first name?"
            }
        ])
        .then(function (data) {
            connection.query(
                "UPDATE employee SET ? WHERE ?",
                [
                  {
                    first_name: data.newFirst
                  },
                  {
                    id: employeeID
                  }
                ],
                function(error) {
                  if (error) throw err;
                  chooseAction();
                }
              );
        });
}

function viewData() {
    inquirer
        .prompt([
            {
                type: "list",
                name: "chooseTable",
                message: "What would you like to see?",
                choices: ['Departments', 'Roles', 'Employees']
            }
        ])
        .then(function (data) {
            if (data.chooseTable === "Departments") {
                connection.query("SELECT * FROM department", function (err, results) {
                    if (err) throw err;
                    console.table(results);
                    chooseAction();
                });
            } else if (data.chooseTable === "Roles") {
                connection.query("SELECT * FROM role", function (err, results) {
                    if (err) throw err;
                    console.table(results);
                    chooseAction();
                });
            } else {
                connection.query("SELECT * FROM employee", function (err, results) {
                    if (err) throw err;
                    console.table(results);
                    chooseAction();
                });
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
            } else if (data.chooseInput === "Role") {
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
    connection.query("SELECT * FROM department", function (err, results) {
        if (err) throw err;
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
                },
                {
                    type: "rawlist",
                    name: "departmentID",
                    message: "Please enter the new role's department.",
                    choices: function () {
                        var choiceArray = [];
                        for (var i = 0; i < results.length; i++) {
                            choiceArray.push(results[i].name);
                        }
                        return choiceArray;
                    }
                }
            ])
            .then(function (data) {
                for (var i = 0; i < results.length; i++) {
                    if (data.departmentID === results[i].name) {
                        data.departmentID = results[i].id
                    }
                }
                return data;
            })
            .then(function (data) {
                connection.query(
                    "INSERT INTO role SET ?",
                    {
                        title: data.title,
                        salary: data.salary,
                        department_id: data.departmentID
                    },
                    function (err) {
                        if (err) throw err;
                        chooseAction();
                    }
                );
            });
    })
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


