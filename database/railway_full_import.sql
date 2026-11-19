-- =======================================================
-- Northwind Business Management System
-- Unified Schema + Seed Data for Railway MySQL
-- Can be run directly against Railway's default 'railway' database
-- =======================================================

SET FOREIGN_KEY_CHECKS = 0;

-- 1. Drop existing tables in reverse dependency order
DROP TABLE IF EXISTS OrderDetail;
DROP TABLE IF EXISTS SalesOrder;
DROP TABLE IF EXISTS Product;
DROP TABLE IF EXISTS Shipper;
DROP TABLE IF EXISTS Supplier;
DROP TABLE IF EXISTS Category;
DROP TABLE IF EXISTS Customer;
DROP TABLE IF EXISTS Employee;

-- 2. Create Schema with exact camelCase column names

-- Employee Table
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
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Customer Table
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
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Category Table
CREATE TABLE Category (
  categoryId INT AUTO_INCREMENT NOT NULL,
  categoryName VARCHAR(15) NOT NULL,
  description TEXT NULL,
  PRIMARY KEY (categoryId)
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Supplier Table
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
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Product Table
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
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Shipper Table
CREATE TABLE Shipper (
  shipperId INT AUTO_INCREMENT NOT NULL,
  companyName VARCHAR(40) NOT NULL,
  phone VARCHAR(44) NULL,
  PRIMARY KEY (shipperId)
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- SalesOrder Table
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
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- OrderDetail Table
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
) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Performance Indexes
CREATE INDEX idx_product_category ON Product(categoryId);
CREATE INDEX idx_salesorder_customer ON SalesOrder(custId);
CREATE INDEX idx_salesorder_employee ON SalesOrder(employeeId);
CREATE INDEX idx_salesorder_status ON SalesOrder(deliveryStatus);
CREATE INDEX idx_orderdetail_order ON OrderDetail(orderId);
CREATE INDEX idx_orderdetail_product ON OrderDetail(productId);

-- 3. Seed Data

-- Employees
INSERT INTO Employee (employeeId, lastname, firstname, title, titleOfCourtesy, birthDate, hireDate, address, city, region, postalCode, country, phone, mgrId)
VALUES
  (1, 'Davis',  'Sara', 'CEO',                   'Ms.', '1958-12-08', '2002-05-01', '7890 20th Ave E', 'Seattle',  'WA', '10003', 'USA', '(206) 555-0101', NULL),
  (2, 'Funk',   'Don',  'Vice President, Sales', 'Dr.', '1962-02-19', '2002-08-14', '9012 W Capital Way', 'Tacoma','WA', '10001', 'USA', '(206) 555-0100', 1),
  (3, 'Lew',    'Judy', 'Sales Manager',         'Ms.', '1973-08-30', '2002-04-01', '2345 Moss Bay Blvd','Kirkland','WA','10007', 'USA', '(206) 555-0103', 2);

-- Suppliers
INSERT INTO Supplier (supplierId, companyName, contactName, contactTitle, address, city, region, postalCode, country, phone, fax)
VALUES
  (1, 'Supplier SWRXU', 'Adolphi, Stephan',   'Purchasing Manager',   '2345 Gilbert St.',       'London',      NULL,       '10023', 'UK',  '(171) 456-7890', NULL),
  (2, 'Supplier VHQZD', 'Hance, Jim',         'Order Administrator',  'P.O. Box 5678',          'New Orleans', 'LA',       '10013', 'USA', '(100) 555-0111', NULL),
  (3, 'Supplier STUAZ', 'Parovszky, Alfons',  'Sales Representative', '1234 Oxford Rd.',        'Ann Arbor',   'MI',       '10026', 'USA', '(313) 555-0109', '(313) 555-0112');

-- Categories
INSERT INTO Category (categoryId, categoryName, description)
VALUES
  (1, 'Beverages',      'Soft drinks, coffees, teas, beers, and ales'),
  (2, 'Condiments',     'Sweet and savory sauces, relishes, spreads, and seasonings'),
  (3, 'Confections',    'Desserts, candies, and sweet breads'),
  (4, 'Dairy Products', 'Cheeses'),
  (5, 'Grains/Cereals', 'Breads, crackers, pasta, and cereal'),
  (6, 'Meat/Poultry',   'Prepared meats'),
  (7, 'Produce',        'Dried fruit and bean curd'),
  (8, 'Seafood',        'Seaweed and fish');

-- Products
INSERT INTO Product (productId, productName, supplierId, categoryId, quantityPerUnit, unitPrice, unitsInStock, unitsOnOrder, reorderLevel, discontinued)
VALUES
  (1, 'Chai',               1, 1, '10 boxes x 20 bags',  18.00, 39, 0, 10, '0'),
  (2, 'Chang',              1, 1, '24 - 12 oz bottles',  19.00, 17, 40, 25, '0'),
  (3, 'Aniseed Syrup',      1, 2, '12 - 550 ml bottles', 10.00, 13, 70, 25, '0'),
  (4, 'Chef Anton Cajun',   2, 2, '48 - 6 oz jars',      22.00, 53, 0,  0,  '0'),
  (5, 'Tofu',               3, 7, '40 - 100 g pkgs.',    23.25, 35, 0,  0,  '0');

-- Customers
INSERT INTO Customer (custId, companyName, contactName, contactTitle, address, city, region, postalCode, country, phone, fax)
VALUES
  (1, 'Alfreds Futterkiste',  'Maria Anders',   'Sales Representative', 'Obere Str. 57',           'Berlin',      NULL, '12209', 'Germany', '030-0074321', '030-0076545'),
  (2, 'Ana Trujillo Empared', 'Ana Trujillo',   'Owner',               'Avda. Constitucion 2222', 'Mexico D.F.', NULL, '05021', 'Mexico',  '(5) 555-4729', '(5) 555-3745'),
  (3, 'Antonio Moreno Taq',   'Antonio Moreno', 'Owner',               'Mataderos 2312',          'Mexico D.F.', NULL, '05023', 'Mexico',  '(5) 555-3932', NULL);

-- Shippers
INSERT INTO Shipper (shipperId, companyName, phone)
VALUES
  (1, 'Speedy Express',  '(503) 555-9831'),
  (2, 'United Package',  '(503) 555-3199'),
  (3, 'Federal Shipping','(503) 555-9931');

-- SalesOrders
INSERT INTO SalesOrder (orderId, custId, employeeId, orderDate, requiredDate, shippedDate, shipperId, freight, shipName, shipAddress, shipCity, shipRegion, shipPostalCode, shipCountry, deliveryStatus)
VALUES
  (1, 1, 1, '2024-01-10', '2024-01-20', '2024-01-15', 1, 32.38, 'Alfreds Futterkiste', 'Obere Str. 57',           'Berlin',      NULL, '12209', 'Germany', 'DELIVERED'),
  (2, 2, 2, '2024-02-05', '2024-02-15', '2024-02-10', 2, 11.61, 'Ana Trujillo',        'Avda. Constitucion 2222', 'Mexico D.F.', NULL, '05021', 'Mexico',  'SHIPPED'),
  (3, 3, 3, '2024-03-01', '2024-03-11', NULL,         3, 65.83, 'Antonio Moreno',      'Mataderos 2312',          'Mexico D.F.', NULL, '05023', 'Mexico',  'PENDING'),
  (4, 1, 2, '2024-03-15', '2024-03-25', NULL,         1, 41.34, 'Alfreds Futterkiste', 'Obere Str. 57',           'Berlin',      NULL, '12209', 'Germany', 'PENDING'),
  (5, 2, 1, '2024-04-01', '2024-04-11', '2024-04-05', 2, 51.30, 'Ana Trujillo',        'Avda. Constitucion 2222', 'Mexico D.F.', NULL, '05021', 'Mexico',  'DELIVERED');

-- OrderDetails
INSERT INTO OrderDetail (orderDetailId, orderId, productId, unitPrice, quantity, discount)
VALUES
  (1, 1, 1, 18.00, 10, 0.00),
  (2, 1, 2, 19.00, 5,  0.05),
  (3, 2, 3, 10.00, 20, 0.00),
  (4, 3, 4, 22.00, 15, 0.10),
  (5, 4, 5, 23.25, 8,  0.00),
  (6, 5, 1, 18.00, 12, 0.05);

SET FOREIGN_KEY_CHECKS = 1;
