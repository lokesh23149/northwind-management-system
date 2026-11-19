# Northwind Business Management System

A complete full-stack enterprise web application built for a client technical assessment. This solution modernizes the classic **Northwind** relational database into a multi-tiered architecture featuring a responsive **React.js (Vite + Tailwind CSS)** dashboard and a robust **Java 17+ / Spring Boot 3 / Spring Data JPA** REST API backend.

---

## 📑 Table of Contents
1. [Project Overview & Architecture](#-project-overview--architecture)
2. [Database Schema & ERD Design (Phase 1)](#-database-schema--erd-design-phase-1)
3. [Required Modules & Implementation](#-required-modules--implementation)
4. [Project Directory Layout](#-project-directory-layout)
5. [Backend Architecture (Phase 2)](#-backend-architecture-phase-2)
6. [Frontend Architecture (Phase 3)](#-frontend-architecture-phase-3)
7. [REST API Documentation & Endpoints](#-rest-api-documentation--endpoints)
8. [Setup & Running Instructions](#-setup--running-instructions)
9. [Postman API Test Suite (Phase 4)](#-postman-api-test-suite-phase-4)

---

## 🚀 Project Overview & Architecture

I designed this application following enterprise domain-driven design (DDD) and layered architecture principles to ensure high maintainability, strict relational data integrity, and fast response times.

| Layer | Technologies & Tools |
| :--- | :--- |
| **Frontend** | React 18, Vite 5, Tailwind CSS 3, Axios, Lucide React Icons |
| **Backend** | Java 17+, Spring Boot 3.3.4, Spring Data JPA, Hibernate, Jakarta Validation, SpringDoc OpenAPI (Swagger UI) |
| **Database** | MySQL 8.0+ (Normalized Northwind Relational Database), optional H2 in-memory profile |
| **Build Tools** | Apache Maven 3.9+, Node.js (v20+), npm |
| **API Testing** | Postman Collection v2.1, Swagger UI (`http://localhost:8080/swagger-ui.html`) |

---

## 🗄️ Database Schema & ERD Design (Phase 1)

I inspected and modernized the relational schema from the Northwind database, adapting it for MySQL 8 InnoDB standards and JPA auto-increment conventions with foreign key constraints and performance indexes.

### Relational Entity-Relationship Diagram (ERD)

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

### Table Mapping Across Requirements

1. **`Employee`**
   - **Fields**: `employeeId` (PK), `lastname`, `firstname`, `title`, `titleOfCourtesy`, `birthDate`, `hireDate`, `address`, `city`, `region`, `postalCode`, `country`, `phone`, `email`, `notes`, `mgrId` (FK self-referencing to `Employee`).
   - **Usage**: Full Employee CRUD, organizational hierarchy mapping.

2. **`Product`**, **`Category`**, **`Supplier`**
   - **Fields**: `productId` (PK), `productName`, `supplierId` (FK), `categoryId` (FK), `quantityPerUnit`, `unitPrice`, `unitsInStock`, `unitsOnOrder`, `reorderLevel`, `discontinued`.
   - **Usage**: Real-time stock tracking, pricing, low stock threshold alerts (`unitsInStock <= reorderLevel`), category filtering.

3. **`Customer`**
   - **Fields**: `custId` (PK), `companyName`, `contactName`, `contactTitle`, `address`, `city`, `region`, `postalCode`, `country`, `phone`, `email`, `fax`.
   - **Usage**: Customer registration, address management, order history linkage.

4. **`SalesOrder`** & **`OrderDetail`**
   - **Fields (`SalesOrder`)**: `orderId` (PK), `custId` (FK), `employeeId` (FK), `shipperId` (FK), `orderDate`, `requiredDate`, `shippedDate`, `freight`, `shipName`, `shipAddress`, `shipCity`, `shipRegion`, `shipPostalCode`, `shipCountry`, `deliveryStatus`.
   - **Fields (`OrderDetail`)**: `orderDetailId` (PK), `orderId` (FK), `productId` (FK), `unitPrice`, `quantity`, `discount`.
   - **Usage**: Multi-product purchase workflow, atomic transactional stock deductions, subtotal and freight calculations.

5. **`Shipper`** & Delivery Management
   - **Fields (`Shipper`)**: `shipperId` (PK), `companyName`, `phone`.
   - **Delivery Status**: `deliveryStatus` (`PENDING`, `SHIPPED`, `DELIVERED`).
   - **Usage**: Dispatch management, tracking updates, automatic timestamping when shipped.

---

## 🎯 Required Modules & Implementation

### 1. Employee Management
- **Add Employee**: Full form with validation for name, title, hire date, contact info, and manager assignment.
- **View Employees**: Searchable table displaying ID, full name, role, email, phone, location, and manager.
- **Update Employee**: Edit modal with pre-populated fields.
- **Delete Employee**: Soft/hard delete with confirmation dialog.

### 2. Product Management
- **Add & Edit Products**: Manage product names, categories, pricing, stock levels, reorder thresholds, and discontinued status.
- **Stock Tracking**: Visual alert badges for low inventory (`unitsInStock <= reorderLevel`).
- **Quick Stock Adjuster**: Direct inline / modal stock updates (`PATCH /api/products/{id}/stock`).
- **Category Filter & Search**: Instant filtering by category dropdown and search queries.

### 3. Customer Management
- **Register Customers**: Form validation requiring company name, primary contact, email, and billing address.
- **View Customers**: Search by company, contact person, city, or country.
- **Update & Delete**: Comprehensive editing and safe deletion with relational constraint checks.

### 4. Purchase & Orders (Multi-Product Workflow)
- **Multi-Product Purchase**: Select customer, carrier, sales representative, and add multiple product line items dynamically.
- **Atomic Stock Business Logic**:
  * For each product in the order, verifies `unitsInStock >= quantity`.
  * If stock is insufficient, rejects the transaction with an `InsufficientStockException` detailing available vs. requested stock.
  * Decrements product inventory atomically in MySQL.
  * Calculates line totals: `quantity * unitPrice * (1 - discount)`.
  * Computes subtotal, freight fee, and grand total.
  * Creates order with initial `deliveryStatus = 'PENDING'`.
- **Order Cancellation**: If an order is cancelled before delivery, reserved items are immediately restored to warehouse inventory.

### 5. Delivery Management
- **Shipping Overview**: Dedicated shipments dashboard filtering by `PENDING`, `SHIPPED`, or `DELIVERED`.
- **Status State Machine**:
  * `PENDING`: Order is created, items reserved in warehouse.
  * `SHIPPED`: Dispatch button automatically stamps `shippedDate` with current timestamp.
  * `DELIVERED`: Order marked fulfilled and completed.
- **Destination & Carrier Updates**: Ability to update recipient address and assigned shipper.

---

## 📂 Project Directory Layout

```
northwind-management-system/
├── backend/                                   # Spring Boot 3 Maven Project
│   ├── pom.xml                                # Maven build descriptor
│   ├── .mvn/wrapper/                          # Maven wrapper configuration
│   └── src/
│       └── main/
│           ├── java/com/northwind/management/
│           │   ├── NorthwindApplication.java  # Main Spring Boot entrypoint
│           │   ├── config/                    # CORS & OpenAPI (Swagger) configuration
│           │   │   ├── CorsConfig.java
│           │   │   └── OpenApiConfig.java
│           │   ├── entity/                    # JPA Entities
│           │   │   ├── Category.java
│           │   │   ├── Customer.java
│           │   │   ├── DeliveryStatus.java    # Enum: PENDING, SHIPPED, DELIVERED
│           │   │   ├── Employee.java
│           │   │   ├── OrderDetail.java
│           │   │   ├── Product.java
│           │   │   ├── SalesOrder.java
│           │   │   ├── Shipper.java
│           │   │   └── Supplier.java
│           │   ├── dto/                       # Request/Response Data Transfer Objects
│           │   │   ├── ApiResponse.java       # Generic API response envelope
│           │   │   ├── CustomerDto.java
│           │   │   ├── DashboardStatsDto.java
│           │   │   ├── DeliveryUpdateDto.java
│           │   │   ├── EmployeeDto.java
│           │   │   ├── OrderItemRequestDto.java
│           │   │   ├── OrderItemResponseDto.java
│           │   │   ├── OrderRequestDto.java
│           │   │   ├── OrderResponseDto.java
│           │   │   └── ProductDto.java
│           │   ├── repository/                # Spring Data JPA Repositories
│           │   │   ├── CategoryRepository.java
│           │   │   ├── CustomerRepository.java
│           │   │   ├── EmployeeRepository.java
│           │   │   ├── OrderDetailRepository.java
│           │   │   ├── ProductRepository.java
│           │   │   ├── SalesOrderRepository.java
│           │   │   ├── ShipperRepository.java
│           │   │   └── SupplierRepository.java
│           │   ├── service/                   # Business Logic Layer
│           │   │   ├── CustomerService.java
│           │   │   ├── DashboardService.java
│           │   │   ├── DeliveryService.java
│           │   │   ├── EmployeeService.java
│           │   │   ├── OrderService.java      # Transactional purchase & stock logic
│           │   │   └── ProductService.java
│           │   ├── controller/                # REST Controllers
│           │   │   ├── CategoryController.java
│           │   │   ├── CustomerController.java
│           │   │   ├── DashboardController.java
│           │   │   ├── DeliveryController.java
│           │   │   ├── EmployeeController.java
│           │   │   ├── OrderController.java
│           │   │   ├── ProductController.java
│           │   │   └── ShipperController.java
│           │   └── exception/                 # Global Exception Handling
│           │       ├── BadRequestException.java
│           │       ├── GlobalExceptionHandler.java
│           │       ├── InsufficientStockException.java
│           │       └── ResourceNotFoundException.java
│           └── resources/
│               ├── application.properties     # MySQL configuration
│               └── application-h2.properties  # Optional in-memory test profile
│
├── frontend/                                  # React 18 + Vite + Tailwind CSS
│   ├── package.json
│   ├── vite.config.js                         # Proxy to backend on port 8080
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── index.html
│   └── src/
│       ├── main.jsx
│       ├── App.jsx                            # Main routing and global state
│       ├── index.css                          # Tailwind CSS imports
│       ├── api/
│       │   └── axiosClient.js                 # Axios instance with interceptors
│       ├── services/                          # API Service calls
│       │   ├── customerService.js
│       │   ├── dashboardService.js
│       │   ├── deliveryService.js
│       │   ├── employeeService.js
│       │   ├── orderService.js
│       │   └── productService.js
│       ├── components/
│       │   ├── common/                        # Reusable UI components
│       │   │   ├── Badge.jsx
│       │   │   ├── ConfirmDialog.jsx
│       │   │   ├── Modal.jsx
│       │   │   ├── Spinner.jsx
│       │   │   └── Toast.jsx
│       │   └── layout/                        # App Layout
│       │       ├── Layout.jsx
│       │       ├── Navbar.jsx
│       │       └── Sidebar.jsx
│       └── pages/                             # Core Module Pages
│           ├── CreateOrderPage.jsx            # Multi-product purchase form
│           ├── CustomersPage.jsx              # Customer directory
│           ├── DashboardPage.jsx              # Metrics & inventory alerts
│           ├── DeliveriesPage.jsx             # Shipping & delivery statuses
│           ├── EmployeesPage.jsx              # Employee management
│           ├── OrdersPage.jsx                 # Order history & details drawer
│           └── ProductsPage.jsx               # Products, pricing & stock
│
├── database/                                  # Database Scripts & Docs
│   ├── 01_schema.sql                          # MySQL 8 table DDL with constraints
│   ├── 02_seed_data.sql                       # Authentic Northwind data (6,400+ lines)
│   ├── northwind_original.sql                 # Original backup from sealbro/northwind
│   └── setup_instructions.md
│
├── postman/                                   # API Test Suite
│   └── Northwind_Management_System.postman_collection.json
│
└── README.md                                  # Complete System Documentation
```

---

## 📡 REST API Documentation & Endpoints

### 1. Dashboard
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/dashboard/stats` | Returns total counts, pending shipments, low stock count, revenue |

### 2. Employee Management
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/employees` | List all employees (supports `?search=` filter) |
| `GET` | `/api/employees/{id}` | Get employee by ID |
| `POST` | `/api/employees` | Create employee (validates firstname, lastname, email) |
| `PUT` | `/api/employees/{id}` | Update existing employee details |
| `DELETE` | `/api/employees/{id}` | Delete employee |

### 3. Product Management
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/products` | List products (supports `?search=`, `?categoryId=`, `?lowStock=true`) |
| `GET` | `/api/products/{id}` | Get product by ID |
| `POST` | `/api/products` | Create product (validates price >= 0, stock >= 0) |
| `PUT` | `/api/products/{id}` | Update product information |
| `PATCH` | `/api/products/{id}/stock` | Quick stock update (`{ "unitsInStock": 150 }`) |
| `DELETE` | `/api/products/{id}` | Delete product |

### 4. Customer Management
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/customers` | List all customers (supports `?search=` query) |
| `GET` | `/api/customers/{id}` | Get customer by ID |
| `POST` | `/api/customers` | Register customer |
| `PUT` | `/api/customers/{id}` | Update customer information |
| `DELETE` | `/api/customers/{id}` | Delete customer |

### 5. Purchase & Orders
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/orders` | Place multi-product purchase order, deduct stock atomically |
| `GET` | `/api/orders` | List orders (supports `?status=`, `?search=`) |
| `GET` | `/api/orders/{id}` | Get order details with line items and customer info |
| `PUT` | `/api/orders/{id}/cancel` | Cancel order and restore product stock |

#### Sample Purchase Request Payload (`POST /api/orders`):
```json
{
  "custId": 1,
  "employeeId": 1,
  "shipperId": 2,
  "freight": 25.00,
  "shipName": "Alfreds Futterkiste",
  "shipAddress": "Obere Str. 57",
  "shipCity": "Berlin",
  "shipCountry": "Germany",
  "items": [
    {
      "productId": 1,
      "quantity": 5,
      "discount": 0.05
    },
    {
      "productId": 2,
      "quantity": 10,
      "discount": 0.00
    }
  ]
}
```

### 6. Delivery Management
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/deliveries` | List shipments (supports `?status=PENDING|SHIPPED|DELIVERED`) |
| `GET` | `/api/deliveries/{orderId}`| Get shipping details for an order |
| `PATCH`| `/api/deliveries/{orderId}/status` | Update status to `SHIPPED` or `DELIVERED`, set shipped date |

#### Sample Delivery Status Update Payload (`PATCH /api/deliveries/10248/status`):
```json
{
  "deliveryStatus": "SHIPPED",
  "shippedDate": "2026-11-19T14:30:00"
}
```

---

## 🛠️ Setup & Running Instructions

### Step 1: Database Setup (MySQL)

1. Open your terminal or MySQL command line client:
   ```bash
   mysql -u root -p
   ```
2. Import the schema and seed data:
   ```bash
   mysql -u root -p < database/01_schema.sql
   mysql -u root -p < database/02_seed_data.sql
   ```
3. Verify the database:
   ```sql
   USE Northwind;
   SHOW TABLES;
   SELECT COUNT(*) FROM Product;      -- 77 rows
   SELECT COUNT(*) FROM Customer;     -- 91 rows
   SELECT COUNT(*) FROM SalesOrder;   -- 830 rows
   SELECT COUNT(*) FROM Employee;     -- 9 rows
   ```

### Step 2: Backend Setup (Spring Boot)

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Configure your MySQL credentials in `src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/Northwind?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
   spring.datasource.username=root
   spring.datasource.password=your_password
   ```
3. Run the Spring Boot application using Maven:
   ```bash
   mvn spring-boot:run
   ```
   *(Or with the wrapper: `./mvnw spring-boot:run` on Linux/macOS, or `mvnw.cmd spring-boot:run` on Windows).*
4. The backend will start on **`http://localhost:8080`**.
5. View the interactive Swagger API documentation at:
   **`http://localhost:8080/swagger-ui.html`**

*(Note: To run in demo mode without MySQL installed, use `--spring.profiles.active=h2` to launch the in-memory H2 database).*

### Step 3: Frontend Setup (React + Vite)

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open your browser at **`http://localhost:5173`**.

---

## 🧪 Postman API Test Suite (Phase 4)

A complete Postman Collection is provided in `postman/Northwind_Management_System.postman_collection.json`.

### How to Import and Test:
1. Open **Postman**.
2. Click **Import** in the upper left corner.
3. Select `postman/Northwind_Management_System.postman_collection.json`.
4. The collection is configured with the environment variable `baseUrl = http://localhost:8080/api`.
5. Execute requests in each module folder:
   - **Dashboard**: `Get Dashboard Stats`
   - **Employee Management**: CRUD operations on `/employees`
   - **Product Management**: CRUD, low stock filtering, stock patches on `/products`
   - **Customer Management**: CRUD operations on `/customers`
   - **Purchase & Orders**: Multi-item purchase order, stock deduction verification, insufficient stock 400 test, order cancellation with stock restoration
   - **Delivery Management**: List shipments by `PENDING`, `SHIPPED`, `DELIVERED`, update delivery status with tracking date
