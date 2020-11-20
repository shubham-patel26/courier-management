CREATE DATABASE parcel_management;
USE parcel_management;

CREATE TABLE users(user_id INT AUTO_INCREMENT PRIMARY KEY,email_id VARCHAR(32) NOT NULL UNIQUE,password VARCHAR(128) ,name VARCHAR(20) ,address VARCHAR(128) ,pincode INT,contact_no VARCHAR(10) );

CREATE TABLE products(product_id INT PRIMARY KEY,stocks INT,MRP INT);

CREATE TABLE seller(seller_id INT PRIMARY KEY,seller_name VARCHAR(20) NOT NULL, seller_emailid VARCHAR(32) NOT NULL);

CREATE TABLE warehouse(warehouse_id INT PRIMARY KEY,pincode INT NOT NULL,warehouse_address VARCHAR(128) );

CREATE TABLE product_details(product_id INT ,seller_id INT ,current_warehouse_id INT ,selling_price INT ,stocks INT);

CREATE TABLE order_details(order_id INT PRIMARY KEY,user_id INT ,seller_id INT ,product_id INT, ordered_on DATETIME,from_warehouse_id INT ,destination_address VARCHAR(128),is_delivered BOOLEAN,delivered_on DATE);

CREATE TABLE track_shipment(order_id INT PRIMARY KEY,current_location_pincode INT ,expected_delivery_date DATE);