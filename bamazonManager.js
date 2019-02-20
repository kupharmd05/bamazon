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
    manager();
});

function manager() {
    inquirer.prompt({
        name: "action",
        type: "list",
        message: "What would you like to do?",
        choices: [
            "View Products for Sale",
            "View Low Inventory",
            "Add to Inventory",
            "Add New Product"
        ]
    }).then(function (answer) {
        switch (answer.action) {
            case "View Products for Sale":
                forSale();
                break;
            case "View Low Inventory":
                lowInventory();
                break;
            case "Add to Inventory":
                addInventory();
                break;
            case "Add New Product":
                addProduct();
                break;
            default:
            console.log("Please select View Products for Sale, View Low Inventory, Add to Inventory, or Add New Product")
        }
    })
};

function forSale() {
    var query = "select product_id, product_name, price, stock_quantity from products;"
    connection.query(query, function (error, results) {
        if (error) throw error;
        for (var i = 0; i < results.length; i++) {
            console.log(`
            Product Id: ${results[i].product_id}
            Product Name: ${results[i].product_name}
            Price: ${results[i].price}
            Quantity: ${results[i].stock_quantity}
            `)
        }connection.end();
    })
}

function lowInventory() {
    var query = "select * from products where stock_quantity < 5;"
    connection.query(query, function (error, results) {
        if (error) throw error;
        for (var i = 0; i < results.length; i++) {
            console.log(`
            Product Id: ${results[i].product_id}
            Product Name: ${results[i].product_name}
            Quantity: ${results[i].stock_quantity}
            `)
        }connection.end();
    })
}

function addInventory() {
    var query = "select * from products;"
    connection.query(query, function (error, results) {
        if (error) throw error;
        
        

        inquirer.prompt([
            {
                name: "choice",
                type: "list",
                choices: function () {
                    var choiceArray = [];
                    for (var i = 0; i < results.length; i++) {
                        
                        choiceArray.push(results[i].product_name);
                    }
                    return choiceArray;
                },
                message: "Which product would you like to add inventory to?"
            },
        {   
            name: "qty",
            type: "input",
            message: "How many would you like to add?"
        },
    ]).then(function (answer){
            var updateQty = parseFloat(answer.qty);
           
            var query = "select * from products where ?"
            connection.query(query,[{product_name:answer.choice}],function(error,results){
                if (error) throw error;
                else {
                    var selection = results[0];
                    var newQty = updateQty + selection.stock_quantity;
                    console.log
                    var newQuery = "update products set ? where ?"
                    connection.query(newQuery,[{stock_quantity:newQty},{product_name:selection.product_name}],function(error,results){
                        if (error) throw error;
                        console.log("QTY updated to: "+newQty)
                        connection.end();
                    })
                }

            })
        })
    })}

function addProduct(){
    inquirer.prompt([
        {
            name: "id",
            type: "input",
            message: "What's the product id?",
            validate: function(value){
                if(isNaN(value)==false){
                    return true;
                } else {
                    return false;
                }
            },
        },
        {
            name: "productName",
            type: "input",
            message: "Name of product to add?"
        },
        {
            name: "department",
            type: "input",
            message: "Depart to add to?"
        },
        {
            name: "price",
            type: "input",
            message: "What is the price of the item?",
            validate: function(value){
                if(isNaN(value)==false){
                    return true;
                } else {
                    return false;
                }
            }, 
        },
        {
            name: "qty",
            type: "input",
            message: "How many should be loaded in inventory?",
            validate: function(value){
                if(isNaN(value)==false){
                    return true;
                } else {
                    return false;
                }
            },
        },
      
    ]).then(function(answer){
        var query = "insert into products set ?";
        connection.query(query,{product_id:answer.id,product_name:answer.productName,department_name:answer.department,price:answer.price,stock_quantity:answer.qty},function(error,results){
            if (error) throw error;
            console.log("New item added");
            connection.end();
        })

    })

}
