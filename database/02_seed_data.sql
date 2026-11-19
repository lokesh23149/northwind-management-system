USE Northwind;
SET FOREIGN_KEY_CHECKS=0;

-- Employee (3 rows)
INSERT INTO Employee(employeeid, lastname, firstname, title, titleofcourtesy, birthdate, hiredate, address, city, region, postalcode, country, phone, mgrid)
  VALUES(1, N'Davis', N'Sara', N'CEO', N'Ms.', '1958-12-08 00:00:00.000', '2002-05-01 00:00:00.000', N'7890 - 20th Ave. E., Apt. 2A', N'Seattle', N'WA', N'10003', N'USA', N'(206) 555-0101', NULL);
INSERT INTO Employee(employeeid, lastname, firstname, title, titleofcourtesy, birthdate, hiredate, address, city, region, postalcode, country, phone, mgrid)
  VALUES(2, N'Funk', N'Don', N'Vice President, Sales', N'Dr.', '1962-02-19 00:00:00.000', '2002-08-14 00:00:00.000', N'9012 W. Capital Way', N'Tacoma', N'WA', N'10001', N'USA', N'(206) 555-0100', 1);
INSERT INTO Employee(employeeid, lastname, firstname, title, titleofcourtesy, birthdate, hiredate, address, city, region, postalcode, country, phone, mgrid)
  VALUES(3, N'Lew', N'Judy', N'Sales Manager', N'Ms.', '1973-08-30 00:00:00.000', '2002-04-01 00:00:00.000', N'2345 Moss Bay Blvd.', N'Kirkland', N'WA', N'10007', N'USA', N'(206) 555-0103', 2);

-- Supplier (3 rows)
INSERT INTO Supplier(supplierid, companyname, contactname, contacttitle, address, city, region, postalcode, country, phone, fax)
  VALUES(1, N'Supplier SWRXU', N'Adolphi, Stephan', N'Purchasing Manager', N'2345 Gilbert St.', N'London', NULL, N'10023', N'UK', N'(171) 456-7890', NULL);
INSERT INTO Supplier(supplierid, companyname, contactname, contacttitle, address, city, region, postalcode, country, phone, fax)
  VALUES(2, N'Supplier VHQZD', N'Hance, Jim', N'Order Administrator', N'P.O. Box 5678', N'New Orleans', N'LA', N'10013', N'USA', N'(100) 555-0111', NULL);
INSERT INTO Supplier(supplierid, companyname, contactname, contacttitle, address, city, region, postalcode, country, phone, fax)
  VALUES(3, N'Supplier STUAZ', N'Parovszky, Alfons', N'Sales Representative', N'1234 Oxford Rd.', N'Ann Arbor', N'MI', N'10026', N'USA', N'(313) 555-0109', N'(313) 555-0112');

-- Category (8 rows)
INSERT INTO Category(categoryid, categoryname, description)
  VALUES(1, N'Beverages', N'Soft drinks, coffees, teas, beers, and ales');
INSERT INTO Category(categoryid, categoryname, description)
  VALUES(2, N'Condiments', N'Sweet and savory sauces, relishes, spreads, and seasonings');
INSERT INTO Category(categoryid, categoryname, description)
  VALUES(3, N'Confections', N'Desserts, candies, and sweet breads');
INSERT INTO Category(categoryid, categoryname, description)
  VALUES(4, N'Dairy Products', N'Cheeses');
INSERT INTO Category(categoryid, categoryname, description)
  VALUES(5, N'Grains/Cereals', N'Breads, crackers, pasta, and cereal');
INSERT INTO Category(categoryid, categoryname, description)
  VALUES(6, N'Meat/Poultry', N'Prepared meats');
INSERT INTO Category(categoryid, categoryname, description)
  VALUES(7, N'Produce', N'Dried fruit and bean curd');
INSERT INTO Category(categoryid, categoryname, description)
  VALUES(8, N'Seafood', N'Seaweed and fish');

-- Product (5 rows)
INSERT INTO Product(productid, productname, supplierid, categoryid, unitprice, discontinued)
  VALUES(1, N'Product HHYDP', 1, 1, 18.00, 0);
INSERT INTO Product(productid, productname, supplierid, categoryid, unitprice, discontinued)
  VALUES(2, N'Product RECZE', 1, 1, 19.00, 0);
INSERT INTO Product(productid, productname, supplierid, categoryid, unitprice, discontinued)
  VALUES(3, N'Product IMEHJ', 1, 2, 10.00, 0);
INSERT INTO Product(productid, productname, supplierid, categoryid, unitprice, discontinued)
  VALUES(4, N'Product KSBRM', 2, 2, 22.00, 0);
INSERT INTO Product(productid, productname, supplierid, categoryid, unitprice, discontinued)
  VALUES(5, N'Product EPEIM', 2, 2, 21.35, 1);

-- Customer (3 rows)
INSERT INTO Customer(custid, companyname, contactname, contacttitle, address, city, region, postalcode, country, phone, fax)
  VALUES(1, N'Customer NRZBB', N'Allen, Michael', N'Sales Representative', N'Obere Str. 0123', N'Berlin', NULL, N'10092', N'Germany', N'030-3456789', N'030-0123456');
INSERT INTO Customer(custid, companyname, contactname, contacttitle, address, city, region, postalcode, country, phone, fax)
  VALUES(2, N'Customer MLTDN', N'Hassall, Mark', N'Owner', N'Avda. de la ConstituciÃ³n 5678', N'MÃ©xico D.F.', NULL, N'10077', N'Mexico', N'(5) 789-0123', N'(5) 456-7890');
INSERT INTO Customer(custid, companyname, contactname, contacttitle, address, city, region, postalcode, country, phone, fax)
  VALUES(3, N'Customer KBUDE', N'Peoples, John', N'Owner', N'Mataderos  7890', N'MÃ©xico D.F.', NULL, N'10097', N'Mexico', N'(5) 123-4567', NULL);

-- Shipper (3 rows)
INSERT INTO Shipper(shipperid, companyname, phone)
  VALUES(1, N'Shipper GVSUA', N'(503) 555-0137');
INSERT INTO Shipper(shipperid, companyname, phone)
  VALUES(2, N'Shipper ETYNR', N'(425) 555-0136');
INSERT INTO Shipper(shipperid, companyname, phone)
  VALUES(3, N'Shipper ZHISN', N'(415) 555-0138');

-- SalesOrder (5 rows)
INSERT INTO SalesOrder(orderid, custid, employeeid, orderdate, requireddate, shippeddate, shipperid, freight, shipname, shipaddress, shipcity, shipregion, shippostalcode, shipcountry)
  VALUES(10248, 85, 5, '2006-07-04 00:00:00.000', '2006-08-01 00:00:00.000', '2006-07-16 00:00:00.000', 3, 32.38, N'Ship to 85-B', N'6789 rue de l''Abbaye', N'Reims', NULL, N'10345', N'France');
INSERT INTO SalesOrder(orderid, custid, employeeid, orderdate, requireddate, shippeddate, shipperid, freight, shipname, shipaddress, shipcity, shipregion, shippostalcode, shipcountry)
  VALUES(10249, 79, 6, '2006-07-05 00:00:00.000', '2006-08-16 00:00:00.000', '2006-07-10 00:00:00.000', 1, 11.61, N'Ship to 79-C', N'Luisenstr. 9012', N'MÃ¼nster', NULL, N'10328', N'Germany');
INSERT INTO SalesOrder(orderid, custid, employeeid, orderdate, requireddate, shippeddate, shipperid, freight, shipname, shipaddress, shipcity, shipregion, shippostalcode, shipcountry)
  VALUES(10250, 34, 4, '2006-07-08 00:00:00.000', '2006-08-05 00:00:00.000', '2006-07-12 00:00:00.000', 2, 65.83, N'Destination SCQXA', N'Rua do PaÃ§o, 7890', N'Rio de Janeiro', N'RJ', N'10195', N'Brazil');
INSERT INTO SalesOrder(orderid, custid, employeeid, orderdate, requireddate, shippeddate, shipperid, freight, shipname, shipaddress, shipcity, shipregion, shippostalcode, shipcountry)
  VALUES(10251, 84, 3, '2006-07-08 00:00:00.000', '2006-08-05 00:00:00.000', '2006-07-15 00:00:00.000', 1, 41.34, N'Ship to 84-A', N'3456, rue du Commerce', N'Lyon', NULL, N'10342', N'France');
INSERT INTO SalesOrder(orderid, custid, employeeid, orderdate, requireddate, shippeddate, shipperid, freight, shipname, shipaddress, shipcity, shipregion, shippostalcode, shipcountry)
  VALUES(10252, 76, 4, '2006-07-09 00:00:00.000', '2006-08-06 00:00:00.000', '2006-07-11 00:00:00.000', 2, 51.30, N'Ship to 76-B', N'Boulevard Tirou, 9012', N'Charleroi', NULL, N'10318', N'Belgium');

-- OrderDetail (10 rows)
INSERT INTO OrderDetail(orderid, productid, unitprice, quantity, discount)
  VALUES(10248, 11, 14.00, 12, 0);
INSERT INTO OrderDetail(orderid, productid, unitprice, quantity, discount)
  VALUES(10248, 42, 9.80, 10, 0);
INSERT INTO OrderDetail(orderid, productid, unitprice, quantity, discount)
  VALUES(10248, 72, 34.80, 5, 0);
INSERT INTO OrderDetail(orderid, productid, unitprice, quantity, discount)
  VALUES(10249, 14, 18.60, 9, 0);
INSERT INTO OrderDetail(orderid, productid, unitprice, quantity, discount)
  VALUES(10249, 51, 42.40, 40, 0);
INSERT INTO OrderDetail(orderid, productid, unitprice, quantity, discount)
  VALUES(10250, 41, 7.70, 10, 0);
INSERT INTO OrderDetail(orderid, productid, unitprice, quantity, discount)
  VALUES(10250, 51, 42.40, 35, 0.15);
INSERT INTO OrderDetail(orderid, productid, unitprice, quantity, discount)
  VALUES(10250, 65, 16.80, 15, 0.15);
INSERT INTO OrderDetail(orderid, productid, unitprice, quantity, discount)
  VALUES(10251, 22, 16.80, 6, 0.05);
INSERT INTO OrderDetail(orderid, productid, unitprice, quantity, discount)
  VALUES(10251, 57, 15.60, 15, 0.05);

SET FOREIGN_KEY_CHECKS=1;
