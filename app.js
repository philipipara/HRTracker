const inquirer = require("inquirer");
const mysql = require("mysql");


var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password:"$Eager15",
    database:"worker_db"
});

connection.connect(function (err){
    if (err) throw err;
    console.log("connected")
    start();
});

function start (){
    inquirer
        .prompt({
            type: "list",
            message: "What would you like to do?",
            choices: ["Add a new employee", "Add a new role", "Add a department","View all employees", "View all roles", "View all departments"],
            name: "decision"
        })
        .then(function(answer){
            if (answer.decision == "Add a new employee"){
                employeeQuestions();
            } else if (answer.decision === "Add a new role"){
                roleQuestions();
            } else if (answer.decision === "Add a new Department"){
                deptQuestions();
            } else if (answer.decision === "View all employees"){
                employeeList();
            } else if (answer.decision === "View all roles"){
                roleList();
            } else {
                deptList();
            }
        })
}

function employeeQuestions(){
    inquirer
        .prompt([{
            type: "input",
            message:"Enter employee's first name",
            name: "firstname"
        },
        {
            type: "input",
            message:"Enter employee's last name",
            name: "lastname"
        },
        {
            type: "list",
            message: "What is the name of the role?",
            choices:["reception", "call rep"],
            name: "rolename"
        },
        {
            type: "list",
            message: "What department does this employee work in?",
            choices: ["sales", "collections", "administrative"],
            name:"dept_ID"
        },
        {
            type: "number",
            message: "What is the salary for this position?",
            name: "rolesalary"
        }
    ])
        .then(function (response){
            connection.query("INSERT INTO employee SET ?",
            {
                first_name: response.firstname,
                last_name: response.lastname,
            },
            function (err,res){
                if (err) throw err;
                console.log("success")
            })

            connection.query("INSERT INTO role SET ?",
            {
                title: response.rolename,
                salary: response.rolesalary,
            },
            function (err,res){
                if (err) throw err;
               
            })

            connection.query("INSERT INTO department SET ?",
            {
                dept_name: response.dept_ID,
            },
            function (err,res){
                if (err) throw err;
                
            })

            connection.query("SELECT employee.first_name, employee.last_name, role.title, role.salary, department.dept_name FROM employee RIGHT JOIN role ON (employee.id = role.id) LEFT JOIN department ON (department.id = role.id);", function (err, res){
                if (err) throw err;
                console.table(res)
            });
            
        })
}

function roleQuestions(){
    inquirer
        .prompt([
            {
                type: "input",
                message: "What is the name of the role?",
                name: "rolename"
            },
            {
                type: "number",
                message: "What is the department ID for this role?",
                name:"dept_ID"
            }
        ])
        .then(function(answer){
            connection.query("INSERT INTO role SET ?",
                {
                    title: answer.rolename
                },
                function (err,res){
                    if (err) throw err;
                    console.log( "success")
                })
        })
}

function deptQuestions(){
    inquirer
        .prompt({
            type: "input",
            message: "What is the name of the department?",
            name: "deptID"
        })
        .then(function(answer){
            connection.query("INSERT INTO department SET ?",
                {
                    dept_name: answer.deptID
                },
                function (err,res){
                    if (err) throw err;
                    console.log(this)
                })
        })
}

function employeeList(){
    connection.query("SELECT first_name, last_name FROM employee;", function (err, res){
        if (err) throw err;
        console.table(res)
    });
}

function roleList(){
    connection.query("SELECT role.title, role.salary FROM role;", function (err, res){
        if (err) throw err;
        console.table(res)
    });
}

function deptList(){
    connection.query("SELECT department.dept_name FROM department;", function (err, res){
        if (err) throw err;
        console.table(res)
    });    
}

