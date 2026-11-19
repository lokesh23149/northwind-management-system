-- Northwind Business Management System Schema
-- Compatible with MySQL 8.0+
-- Database: Northwind

CREATE DATABASE IF NOT EXISTS Northwind CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE Northwind;

-- Drop dependent tables first to allow clean recreation if needed
DROP TABLE IF EXISTS OrderDetail;
DROP TABLE IF EXISTS SalesOrder;
DROP TABLE IF EXISTS Product;
DROP TABLE IF EXISTS Shipper;
DROP TABLE IF EXISTS Supplier;
DROP TABLE IF EXISTS Category;
DROP TABLE IF EXISTS Customer;
DROP TABLE IF EXISTS Employee;

-- 1. Employee Table
CREATE TABLE Employee (
  employeeId INT AUTO_INCREMENT NOT NULL,
  lastname VARCHAR(20) NOT NULL,
  firstname VARCHAR(10) NOT NULL,
  title VARCHAR(30) NULL,
  titleOfCourtesy VARCHAR(25) NULL,
  birthDate DATETIME NULL,
  hireDate DATETIME NULL,
  address VARCHAR(60) NULL,
  city VARCHAR(15) NULL,
  region VARCHAR(15) NULL,
  postalCode VARCHAR(10) NULL,
  country VARCHAR(15) NULL,
  phone VARCHAR(24) NULL,
  extension VARCHAR(4) NULL,
  mobile VARCHAR(24) NULL,
  email VARCHAR(225) NULL,
  photoPath VARCHAR(255) NULL,
  notes TEXT NULL,
  mgrId INT NULL,
  PRIMARY KEY (employeeId),
  FOREIGN KEY (mgrId) REFERENCES Employee(employeeId) ON DELETE SET NULL
) ENGINE=INNODB;

-- 2. Customer Table
CREATE TABLE Customer (
  custId INT AUTO_INCREMENT NOT NULL,
  companyName VARCHAR(40) NOT NULL,
  contactName VARCHAR(30) NULL,
  contactTitle VARCHAR(30) NULL,
  address VARCHAR(60) NULL,
  city VARCHAR(15) NULL,
  region VARCHAR(15) NULL,
  postalCode VARCHAR(10) NULL,
  country VARCHAR(15) NULL,
  phone VARCHAR(24) NULL,
  mobile VARCHAR(24) NULL,
  email VARCHAR(225) NULL,
  fax VARCHAR(24) NULL,
  PRIMARY KEY (custId)
) ENGINE=INNODB;

-- 3. Category Table
CREATE TABLE Category (
  categoryId INT AUTO_INCREMENT NOT NULL,
  categoryName VARCHAR(15) NOT NULL,
  description TEXT NULL,
  PRIMARY KEY (categoryId)
) ENGINE=INNODB;

-- 4. Supplier Table
CREATE TABLE Supplier (
  supplierId INT AUTO_INCREMENT NOT NULL,
  companyName VARCHAR(40) NOT NULL,
  contactName VARCHAR(30) NULL,
  contactTitle VARCHAR(30) NULL,
  address VARCHAR(60) NULL,
  city VARCHAR(15) NULL,
  region VARCHAR(15) NULL,
  postalCode VARCHAR(10) NULL,
  country VARCHAR(15) NULL,
  phone VARCHAR(24) NULL,
  email VARCHAR(225) NULL,
  fax VARCHAR(24) NULL,
  homePage TEXT NULL,
  PRIMARY KEY (supplierId)
) ENGINE=INNODB;

-- 5. Product Table
CREATE TABLE Product (
  productId INT AUTO_INCREMENT NOT NULL,
  productName VARCHAR(40) NOT NULL,
  supplierId INT NULL,
  categoryId INT NULL,
  quantityPerUnit VARCHAR(20) NULL,
  unitPrice DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  unitsInStock SMALLINT NOT NULL DEFAULT 0,
  unitsOnOrder SMALLINT NOT NULL DEFAULT 0,
  reorderLevel SMALLINT NOT NULL DEFAULT 0,
  discontinued CHAR(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (productId),
  FOREIGN KEY (supplierId) REFERENCES Supplier(supplierId) ON DELETE SET NULL,
  FOREIGN KEY (categoryId) REFERENCES Category(categoryId) ON DELETE SET NULL
) ENGINE=INNODB;

-- 6. Shipper Table
CREATE TABLE Shipper (
  shipperId INT AUTO_INCREMENT NOT NULL,
  companyName VARCHAR(40) NOT NULL,
  phone VARCHAR(44) NULL,
  PRIMARY KEY (shipperId)
) ENGINE=INNODB;

-- 7. SalesOrder Table (Delivery & Orders)
CREATE TABLE SalesOrder (
  orderId INT AUTO_INCREMENT NOT NULL,
  custId INT NOT NULL,
  employeeId INT NULL,
  orderDate DATETIME NULL,
  requiredDate DATETIME NULL,
  shippedDate DATETIME NULL,
  shipperId INT NOT NULL,
  freight DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  shipName VARCHAR(40) NULL,
  shipAddress VARCHAR(60) NULL,
  shipCity VARCHAR(15) NULL,
  shipRegion VARCHAR(15) NULL,
  shipPostalCode VARCHAR(10) NULL,
  shipCountry VARCHAR(15) NULL,
  deliveryStatus VARCHAR(20) NOT NULL DEFAULT 'PENDING',
  PRIMARY KEY (orderId),
  FOREIGN KEY (custId) REFERENCES Customer(custId) ON DELETE RESTRICT,
  FOREIGN KEY (employeeId) REFERENCES Employee(employeeId) ON DELETE SET NULL,
  FOREIGN KEY (shipperId) REFERENCES Shipper(shipperId) ON DELETE RESTRICT
) ENGINE=INNODB;

-- 8. OrderDetail Table
CREATE TABLE OrderDetail (
  orderDetailId INT AUTO_INCREMENT NOT NULL,
  orderId INT NOT NULL,
  productId INT NOT NULL,
  unitPrice DECIMAL(10, 2) NOT NULL,
  quantity SMALLINT NOT NULL,
  discount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  PRIMARY KEY (orderDetailId),
  FOREIGN KEY (orderId) REFERENCES SalesOrder(orderId) ON DELETE CASCADE,
  FOREIGN KEY (productId) REFERENCES Product(productId) ON DELETE RESTRICT
) ENGINE=INNODB;

-- Create Performance Indexes
CREATE INDEX idx_product_category ON Product(categoryId);
CREATE INDEX idx_salesorder_customer ON SalesOrder(custId);
CREATE INDEX idx_salesorder_employee ON SalesOrder(employeeId);
CREATE INDEX idx_salesorder_status ON SalesOrder(deliveryStatus);
CREATE INDEX idx_orderdetail_order ON OrderDetail(orderId);
CREATE INDEX idx_orderdetail_product ON OrderDetail(productId);
