# Northwind Database Setup & ERD Specification

## 1. Database Overview
This system uses the relational **Northwind** database architecture, modernized for MySQL 8.0+ and Spring Boot JPA with proper integer primary keys, auto-increment sequences, foreign key constraints, and indices.

## 2. Entity-Relationship Design

```
+------------------+         +-------------------+         +--------------------+
|     Employee     |         |     Customer      |         |      Shipper       |
+------------------+         +-------------------+         +--------------------+
| PK employeeId    |         | PK custId         |         | PK shipperId       |
|    lastname      |         |    companyName    |         |    companyName     |
|    firstname     |         |    contactName    |         |    phone           |
|    title         |         |    email, phone   |         +---------+----------+
|    mgrId (FK)----+----+    |    city, country  |                   |
+--------+---------+    |    +---------+---------+                   |
         |              |              |                             |
         |              +--------------+                             |
         |                             |                             |
         +-----------------------------+                             |
                                       |                             |
                                       v                             v
                             +-------------------+         +--------------------+
                             |    SalesOrder     |<--------+      Shipper       |
                             +-------------------+
                             | PK orderId        |
                             | FK custId         |
                             | FK employeeId     |
                             | FK shipperId      |
                             |    orderDate      |
                             |    requiredDate   |
                             |    shippedDate    |
                             |    deliveryStatus | (PENDING / SHIPPED / DELIVERED)
                             |    freight, etc.  |
                             +---------+---------+
                                       | 1
                                       |
                                       | N
                             +---------v---------+
                             |    OrderDetail    |
                             +-------------------+
                             | PK orderDetailId  |
                             | FK orderId        |
                             | FK productId      |----+
                             |    unitPrice      |    |
                             |    quantity       |    |
                             |    discount       |    |
                             +-------------------+    |
                                                      |
                                                      v
                             +-------------------+  +--------------------+
                             |     Category      |  |      Supplier      |
                             +-------------------+  +--------------------+
                             | PK categoryId     |  | PK supplierId      |
                             |    categoryName   |  |    companyName     |
                             +---------+---------+  +---------+----------+
                                       |                      |
                                       v                      v
                             +-------------------------------------------+
                             |                  Product                  |
                             +-------------------------------------------+
                             | PK productId                              |
                             | FK categoryId                             |
                             | FK supplierId                             |
                             |    productName                            |
                             |    unitPrice                              |
                             |    unitsInStock                           |
                             |    unitsOnOrder                           |
                             |    reorderLevel                           |
                             |    discontinued                           |
                             +-------------------------------------------+
```

## 3. How Existing Tables are Reused Across Features

| Required Feature | Primary Database Table(s) | Key Columns & Relationship Mapping |
| :--- | :--- | :--- |
| **1. Employee Management** | `Employee` | `employeeId` (PK), `firstname`, `lastname`, `title`, `email`, `phone`, `hireDate`, `mgrId` (Self-referencing manager) |
| **2. Product Management** | `Product`, `Category`, `Supplier` | `productId` (PK), `productName`, `unitPrice`, `unitsInStock`, `reorderLevel`, `categoryId`, `supplierId` |
| **3. Customer Management** | `Customer` | `custId` (PK), `companyName`, `contactName`, `contactTitle`, `email`, `phone`, `city`, `country` |
| **4. Purchase & Orders** | `SalesOrder`, `OrderDetail`, `Product` | `orderId` (PK), `custId` (FK), `employeeId` (FK), `orderDate`, `freight`, `OrderDetail` (`productId`, `quantity`, `unitPrice`, `discount`). Stock is atomically deducted from `Product.unitsInStock`. |
| **5. Delivery Management** | `SalesOrder`, `Shipper` | `orderId`, `shipperId` (FK), `shippedDate`, `shipName`, `shipAddress`, `shipCity`, `shipCountry`, `deliveryStatus` (`PENDING`, `SHIPPED`, `DELIVERED`) |

## 4. Setup in MySQL Server

Open your MySQL client or CLI (`mysql -u root -p`) and run:
```bash
mysql -u root -p < database/01_schema.sql
mysql -u root -p < database/02_seed_data.sql
```
Or execute them sequentially in MySQL Workbench / phpMyAdmin.
