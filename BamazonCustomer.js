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
  connection.query("SELECT ItemID, ProductName, Price FROM Products", function(err, res) {
    for (var i=0; i<res.length; i++) {
      console.log(res[i].ItemID + '.) ' + res[i].ProductName + ' ' + res[i].Price);
    }

    inquirer.prompt([{
      type: 'input',
      name: 'id',
      message: "Which item ID would you like to purchase?"
    },
    {
      type: 'input',
      name: 'quantity',
      message: "How many would you like to purchase?"
    }]).then(function(answers) {
      var id = answers.id;
      var requestedQuantity = answers.quantity;
      
      connection.query("SELECT * FROM Products WHERE ItemID = ?", [id], function(err, res) {
        if (err) throw err;

        var comparedQuantity = res[0].StockQuantity;
        
        if (comparedQuantity >= requestedQuantity) {
          var totalCost = requestedQuantity * res[0].Price;
          var newQuantity = comparedQuantity - requestedQuantity;
          connection.query("UPDATE Products SET ? WHERE ?", [{StockQuantity: newQuantity}, {ItemID: id}], function(err, res) {
            if (err) throw err;
            console.log("Total cost: " + totalCost);
            console.log("Purchase successful!");
          });
        }
        else {
          console.log("Insufficient quantity!");
        }
      });
    });
  });
}