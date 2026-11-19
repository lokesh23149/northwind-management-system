USE Northwind;
SET FOREIGN_KEY_CHECKS=0;

-- 1. Employee (3 rows)
INSERT INTO Employee (employeeId, lastname, firstname, title, titleOfCourtesy, birthDate, hireDate, address, city, region, postalCode, country, phone, mgrId)
VALUES
  (1, 'Davis',  'Sara', 'CEO',                   'Ms.', '1958-12-08', '2002-05-01', '7890 20th Ave E', 'Seattle',  'WA', '10003', 'USA', '(206) 555-0101', NULL),
  (2, 'Funk',   'Don',  'Vice President, Sales', 'Dr.', '1962-02-19', '2002-08-14', '9012 W Capital Way', 'Tacoma','WA', '10001', 'USA', '(206) 555-0100', 1),
  (3, 'Lew',    'Judy', 'Sales Manager',         'Ms.', '1973-08-30', '2002-04-01', '2345 Moss Bay Blvd','Kirkland','WA','10007', 'USA', '(206) 555-0103', 2);

-- 2. Supplier (3 rows)
INSERT INTO Supplier (supplierId, companyName, contactName, contactTitle, address, city, region, postalCode, country, phone, fax)
VALUES
  (1, 'Supplier SWRXU', 'Adolphi, Stephan',   'Purchasing Manager',   '2345 Gilbert St.',       'London',      NULL,       '10023', 'UK',  '(171) 456-7890', NULL),
  (2, 'Supplier VHQZD', 'Hance, Jim',         'Order Administrator',  'P.O. Box 5678',          'New Orleans', 'LA',       '10013', 'USA', '(100) 555-0111', NULL),
  (3, 'Supplier STUAZ', 'Parovszky, Alfons',  'Sales Representative', '1234 Oxford Rd.',        'Ann Arbor',   'MI',       '10026', 'USA', '(313) 555-0109', '(313) 555-0112');

-- 3. Category (8 rows)
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

-- 4. Product (5 rows)
INSERT INTO Product (productId, productName, supplierId, categoryId, quantityPerUnit, unitPrice, unitsInStock, unitsOnOrder, reorderLevel, discontinued)
VALUES
  (1, 'Chai',               1, 1, '10 boxes x 20 bags',  18.00, 39, 0, 10, '0'),
  (2, 'Chang',              1, 1, '24 - 12 oz bottles',  19.00, 17, 40, 25, '0'),
  (3, 'Aniseed Syrup',      1, 2, '12 - 550 ml bottles', 10.00, 13, 70, 25, '0'),
  (4, 'Chef Anton Cajun',   2, 2, '48 - 6 oz jars',      22.00, 53, 0,  0,  '0'),
  (5, 'Tofu',               3, 7, '40 - 100 g pkgs.',    23.25, 35, 0,  0,  '0');

-- 5. Customer (3 rows)
INSERT INTO Customer (custId, companyName, contactName, contactTitle, address, city, region, postalCode, country, phone, fax)
VALUES
  (1, 'Alfreds Futterkiste',  'Maria Anders',   'Sales Representative', 'Obere Str. 57',           'Berlin',      NULL, '12209', 'Germany', '030-0074321', '030-0076545'),
  (2, 'Ana Trujillo Empared', 'Ana Trujillo',   'Owner',               'Avda. Constitucion 2222', 'Mexico D.F.', NULL, '05021', 'Mexico',  '(5) 555-4729', '(5) 555-3745'),
  (3, 'Antonio Moreno Taq',   'Antonio Moreno', 'Owner',               'Mataderos 2312',          'Mexico D.F.', NULL, '05023', 'Mexico',  '(5) 555-3932', NULL);

-- 6. Shipper (3 rows)
INSERT INTO Shipper (shipperId, companyName, phone)
VALUES
  (1, 'Speedy Express',  '(503) 555-9831'),
  (2, 'United Package',  '(503) 555-3199'),
  (3, 'Federal Shipping','(503) 555-9931');

-- 7. SalesOrder (5 rows)
INSERT INTO SalesOrder (orderId, custId, employeeId, orderDate, requiredDate, shippedDate, shipperId, freight, shipName, shipAddress, shipCity, shipRegion, shipPostalCode, shipCountry, deliveryStatus)
VALUES
  (1, 1, 1, '2024-01-10', '2024-01-20', '2024-01-15', 1, 32.38, 'Alfreds Futterkiste', 'Obere Str. 57',           'Berlin',      NULL, '12209', 'Germany', 'DELIVERED'),
  (2, 2, 2, '2024-02-05', '2024-02-15', '2024-02-10', 2, 11.61, 'Ana Trujillo',        'Avda. Constitucion 2222', 'Mexico D.F.', NULL, '05021', 'Mexico',  'SHIPPED'),
  (3, 3, 3, '2024-03-01', '2024-03-11', NULL,         3, 65.83, 'Antonio Moreno',      'Mataderos 2312',          'Mexico D.F.', NULL, '05023', 'Mexico',  'PENDING'),
  (4, 1, 2, '2024-03-15', '2024-03-25', NULL,         1, 41.34, 'Alfreds Futterkiste', 'Obere Str. 57',           'Berlin',      NULL, '12209', 'Germany', 'PENDING'),
  (5, 2, 1, '2024-04-01', '2024-04-11', '2024-04-05', 2, 51.30, 'Ana Trujillo',        'Avda. Constitucion 2222', 'Mexico D.F.', NULL, '05021', 'Mexico',  'DELIVERED');

-- 8. OrderDetail (10 rows)
INSERT INTO OrderDetail (orderId, productId, unitPrice, quantity, discount)
VALUES
  (1, 1, 18.00, 12, 0.00),
  (1, 2, 19.00, 10, 0.00),
  (2, 3, 10.00,  5, 0.00),
  (2, 4, 22.00,  9, 0.05),
  (3, 5, 23.25, 10, 0.00),
  (3, 1, 18.00, 15, 0.10),
  (4, 2, 19.00, 20, 0.00),
  (4, 3, 10.00,  8, 0.00),
  (5, 4, 22.00,  6, 0.05),
  (5, 5, 23.25, 12, 0.10);

SET FOREIGN_KEY_CHECKS=1;
