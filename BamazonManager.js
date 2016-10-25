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
    choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product']
  }).then(function(answer) {
    switch(answer.option) {
      case 'View Products for Sale':
        viewProductsForSale();
        break;
      case 'View Low Inventory':
        viewLowInventory();
        break;
      case 'Add to Inventory':
        addToInventory();
        break;
      case 'Add New Product':
        addNewProduct();
        break;
    }
  });
}

function viewProductsForSale() {
  connection.query("SELECT ItemID, ProductName, Price, StockQuantity FROM Products", function(err, res) {
    for (var i=0; i<res.length; i++) {
      console.log(res[i].ItemID + '.) ' + res[i].ProductName + ' ' + res[i].Price + ' ' + res[i].StockQuantity);
    }
    menu();
  });
}

function viewLowInventory() {
  connection.query("SELECT ItemID, ProductName, StockQuantity FROM Products WHERE StockQuantity < 5", function(err, res) {
    for (var i=0; i<res.length; i++) {
      console.log(res[i].ItemID + '.) ' + res[i].ProductName + ' ' + res[i].StockQuantity);
    }
    menu();
  });
}

function addToInventory() {
  var questions = [
  {
    name: 'id', 
    message: 'What item id number would you like to add more of?'
  },
  {
    name: 'quantity',
    message: 'How many of that item would you like to add?'
  }];
  inquirer.prompt(questions).then(function(answers) {
    connection.query("SELECT * FROM Products WHERE ItemID = ?", [answers.id], function(err, res) {
        if (err) throw err;

        var currentQuantity = res[0].StockQuantity;
        var newQuantity = currentQuantity + parseInt(answers.quantity);
        var productName = res[0].ProductName;

        connection.query("UPDATE Products SET ? WHERE ?", [{StockQuantity: newQuantity}, {ItemID: answers.id}], function(err, res) {
          if (err) throw err;

          console.log("Update successful!");
          menu();
        });
    });
  });
}

function addNewProduct() {
  var questions = [
  {
    name: 'name',
    message: 'What is the product you would like to add?'
  },
  {
    name: 'department',
    message: 'What department does it belong to?'
  },
  {
    name: 'price',
    message: 'What is the price of the item?'
  },
  {
    name: 'quantity',
    message: 'How many of this item would you like to add?'
  }];
  inquirer.prompt(questions).then(function(answers) {
    var name = answers.name;
    var department = answers.department;
    var price = answers.price;
    var quantity = answers.quantity;
    connection.query("INSERT INTO Products SET ?", {ProductName: name, DepartmentName: department, Price: price, StockQuantity: quantity}, function(err, res) {
      if (err) throw err;

      console.log("Item added!");
      menu();
    });
  })
}