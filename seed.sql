DROP DATABASE IF EXISTS bamazon_db;
CREATE DATABASE bamazon_db;
USE bamazon_db;

create table products(
	product_id int not null,
    product_name varchar(100) not null,
    department_name varchar(50),
	price decimal (8,2) default 0,
    stock_quantity int default 10,
    primary key(product_id)
);

insert into products values (124,"6 Qt Instant Pot", "Kitchen", 59.99), (365,"Fire HD8", "Electronics", 159.99),(258,"iRobot", "Electronics", 259.99),(457, "Ring Video Doorbell", "Electronics", 159.99),
(2543, "Roku Express", "Electronics", 29.99), (6598, "MacBook Air", "Electronic", 959.99), (6325, "Peloton", "Exercise", 1959.99), (9865, "Chromebook", "Electronics", 159.99), (6532, "Bowflex Treadmill", "Exercise", 1659.99);

select * from products;