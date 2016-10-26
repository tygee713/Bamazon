var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  // password: "",
  database: "Bamazon"
});

connection.connect();

menu();

function menu() {
  inquirer.prompt({
    type: 'list',
    name: 'option',
    message: 'What would you like to do?',
    choices: ['View Product Sales by Department', 'Create New Department']
  }).then(function(answer) {
    if (answer.option == 'View Product Sales by Department') {
      console.log('DepartmentID | DepartmentName | OverheadCosts | TotalSales | TotalProfit');
       connection.query("SELECT DepartmentID, DepartmentName, OverheadCosts, TotalSales, TotalSales-OverheadCosts AS TotalProfit FROM Departments", function(err, res) {
        if (err) throw err;

        for (var i=0; i<res.length; i++) {
          console.log(res[i].DepartmentID + ' | ' + res[i].DepartmentName + ' | ' + res[i].OverheadCosts + ' | ' + res[i].TotalSales + ' | ' + res[i].TotalProfit);
        }
        menu();
      });
    }
    else {
      inquirer.prompt([{
        name: 'name',
        message: 'What is the department name?'
      },
      {
        name: 'overhead',
        message: 'What are the overhead costs?'
      }]).then(function(answers) {
        var name = answers.name;
        var overhead = answers.overhead;
        connection.query("INSERT INTO Departments SET ?", {DepartmentName: name, OverHeadCosts: overhead, TotalSales: 0.00}, function(err, res) {
          if (err) throw err;
          console.log("Department added!");
          menu();
        });
      });
    }
  });
}