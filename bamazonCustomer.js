var mysql = require("mysql");
var inquirer = require("inquirer");
require("dotenv").config();

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    port: 3306,
    password: process.env.DEFAULT_MYSQL_ADMIN_PASSWORD,
    database: 'bamazon_db'
});

connection.connect(function (error) {
    if (error) throw error;
    console.log("connected as id " + connection.threadId + "\n");
    inventory();
});

function inventory() {
    connection.query("select * from products", function (error, results) {
        if (error) throw error;
        console.log("Welcome to BAMAZON")
        for (var i = 0; i < results.length; i++) {
            console.log("Product Id: " + results[i].product_id +" "+ "Product Name: " + results[i].product_name+" "+ "Price: " + results[i].price)
           
        }
        start();
    });

    function start() {
        connection.query("select * from products", function (error, results) {
            if (error) throw error;



            inquirer.prompt([
                {
                    name: "choice",
                    type: "list",
                    choices: function () {
                        var choiceArray = [];
                        for (var i = 0; i < results.length; i++) {
                            // console.log(typeof results[i].product_id)
                            choiceArray.push(results[i].product_id.toString());
                        }
                        // console.log(choiceArray);
                        return choiceArray;
                    },
                    message: "Which product number would you like to buy?"
                },
                {
                    name: "quantity",
                    type: "input",
                    message: "How many would you like?",
                    
                },
            ])
                .then(function (answer) {
                    var chosenItem;
                    for (var i = 0; i < results.length; i++) {
                    var itemNum = parseFloat(answer.choice);
                    {
                        if (results[i].product_id === itemNum) {
                            chosenItem = results[i];
                            
                        }
                    }
                }
                    if (parseFloat(answer.quantity) < chosenItem.stock_quantity) {
                        connection.query(
                            "update products set ? where ?",
                            [
                                {
                                    stock_quantity: chosenItem.stock_quantity - answer.quantity,
                                },
                                {
                                    product_id: answer.choice,
                                },
                            ],
                            function (error) {
                                if (error) throw error;
                                console.log("Order successful. Purchase Price is $" + (chosenItem.price * answer.quantity))
                                connection.end();
                            }
                        );
                    } else {
                        console.log("Unfortunately, we are out of stock.  Please try again later.")
                        connection.end();
                    }
                });
                
        }
        
        )
    }
}
