# Ecomart API Documentation Overview

Ecomart is a multi-vendor eCommerce platform built with Node.js, Express.js, and MongoDB. This document outlines all available API endpoints.

**[Base URL / Domain](https://ecomart-api.up.railway.app)** `https://ecomart-api.up.railway.app`

## Authentication

Ecomart uses JWT (JSON Web Token) for authentication. To access protected endpoints, clients must include the JWT token in the `Authorization` header as follows.

Role-based authorization is implemented to restrict access to certain endpoints based on user roles (e.g., admin, shop owner, employee, customer, etc).

## Endpoints

### Company Endpoints

- **Company Employee Login**

  - **Endpoint:** `domain/api/company/login`
  - **Method:** POST
  - **Description:** Authenticate an employee of company and return a JWT token.
  - **Access:** Roles allowed: **company employee.**

- **View Company**
  - **Endpoint:** `domain/api/company/`
  - **Method:** GET
  - **Description:** Retrieve details of the logged-in company.
  - **Access:** Roles allowed: **company employee.**

---

### Shop Endpoints

- **Register Shop**

  - **Endpoint:** `domain/api/shop/register`
  - **Method:** POST
  - **Description:** Register a new shop.
  - **Access:** Roles allowed: **open endpoint.**

- **Shop Employee Login**

  - **Endpoint:** `domain/api/shop/login`
  - **Method:** POST
  - **Description:** Authenticate an employee of shop and return a JWT token.
  - **Access:** Roles allowed: **shop employee.**

- **View Shops**

  - **Endpoint:** `domain/api/shop/`
  - **Method:** GET
  - **Description:** Retrieve a list of all shops.
  - **Access:** Roles allowed: **open endpoint.**

- **View Shop**

  - **Endpoint:** `domain/api/shop/:id`
  - **Method:** GET
  - **Description:** Retrieve details of a specific shop by ID.
  - **Access:** Roles allowed: **open endpoint.**

- **Update Shop**

  - **Endpoint:** `domain/api/shop/:id`
  - **Method:** PUT
  - **Description:** Update the details of a specific shop by ID.
  - **Access:** Roles allowed: **company and shop employee.**

- **Delete Shop**
  - **Endpoint:** `domain/api/shop/:id`
  - **Method:** DELETE
  - **Description:** Delete a specific shop by ID.
  - **Access:** Roles allowed: **company and shop employee.**

---

### Employee Endpoints

- **Create Employee**

  - **Endpoint:** `domain/api/employee/create`
  - **Method:** POST
  - **Description:** Create a new employee.
  - **Access:** Roles allowed: **company and shop employee.**

- **View Employee**

  - **Endpoint:** `domain/api/employee/:id`
  - **Method:** GET
  - **Description:** Retrieve details of a specific employee by ID.
  - **Access:** Roles allowed: **company and shop employee.**

- **View Employees**

  - **Endpoint:** `domain/api/employee/`
  - **Method:** GET
  - **Description:** Retrieve a list of all employees.
  - **Access:** Roles allowed: **company employee.**

- **Update Employee**

  - **Endpoint:** `domain/api/employee/:id`
  - **Method:** PUT
  - **Description:** Update the details of a specific employee by ID.
  - **Access:** Roles allowed: **company and shop employee.**

- **Delete Employee**

  - **Endpoint:** `domain/api/employee/:id`
  - **Method:** DELETE
  - **Description:** Delete a specific employee by ID.
  - **Access:** Roles allowed: **company and shop employee.**

- **View Company/Shop Employees**
  - **Endpoint:** `domain/api/employee/provider/:id`
  - **Method:** GET
  - **Description:** Retrieve employees for a specific company/shop by ID.
  - **Access:** Roles allowed: **company and shop employee.**

---

### Customer Endpoints

- **Signup Customer**

  - **Endpoint:** `domain/api/customer/signup`
  - **Method:** POST
  - **Description:** Register a new customer.
  - **Access:** Roles allowed: **open endpoint.**

- **Login Customer**

  - **Endpoint:** `domain/api/customer/login`
  - **Method:** POST
  - **Description:** Authenticate a customer and return a JWT token.
  - **Access:** Roles allowed: **customer.**

- **View Customers**

  - **Endpoint:** `domain/api/customer`
  - **Method:** GET
  - **Description:** Retrieve a list of all customers.
  - **Access:** Roles allowed: **company employee.**

- **View Customer**

  - **Endpoint:** `domain/api/customer/:id`
  - **Method:** GET
  - **Description:** Retrieve details of a specific customer by ID.
  - **Access:** Roles allowed: **customer.**

- **Update Customer**

  - **Endpoint:** `domain/api/customer/:id`
  - **Method:** PUT
  - **Description:** Update the details of a specific customer by ID.
  - **Access:** Roles allowed: **customer.**

- **Delete Customer**
  - **Endpoint:** `domain/api/customer/:id`
  - **Method:** DELETE
  - **Description:** Delete a specific customer by ID.
  - **Access:** Roles allowed: **customer.**

---

### Category Endpoints

- **Create Category**

  - **Endpoint:** `domain/api/category/create`
  - **Method:** POST
  - **Description:** Create a new product category.
  - **Access:** Roles allowed: **company employee.**

- **View Categories**

  - **Endpoint:** `domain/api/category`
  - **Method:** GET
  - **Description:** Retrieve a list of all categories.
  - **Access:** Roles allowed: **open endpoint.**

- **View Category**

  - **Endpoint:** `domain/api/category/:id`
  - **Method:** GET
  - **Description:** Retrieve details of a specific category by ID.
  - **Access:** Roles allowed: **open endpoint.**

- **Update Category**

  - **Endpoint:** `domain/api/category/:id`
  - **Method:** PUT
  - **Description:** Update the details of a specific category by ID.
  - **Access:** Roles allowed: **company employee.**

- **Delete Category**
  - **Endpoint:** `domain/api/category/:id`
  - **Method:** DELETE
  - **Description:** Delete a specific category by ID.
  - **Access:** Roles allowed: **company employee.**

---

### Product Endpoints

- **Create Product**

  - **Endpoint:** `domain/api/product/create`
  - **Method:** POST
  - **Description:** Add a new product.
  - **Access:** Roles allowed: **company and shop employee.**

- **View Products**

  - **Endpoint:** `domain/api/product/`
  - **Method:** GET
  - **Description:** Retrieve a list of all products.
  - **Access:** Roles allowed: **open endpoint.**

- **View Product**

  - **Endpoint:** `domain/api/product/:id`
  - **Method:** GET
  - **Description:** Retrieve details of a specific product by ID.
  - **Access:** Roles allowed: **open endpoint.**

- **Update Product**

  - **Endpoint:** `domain/api/product/:id`
  - **Method:** PUT
  - **Description:** Update the details of a specific product by ID.
  - **Access:** Roles allowed: **company and shop employee.**

- **Delete Product**

  - **Endpoint:** `domain/api/product/:id`
  - **Method:** DELETE
  - **Description:** Delete a specific product by ID.
  - **Access:** Roles allowed: **company and shop employee.**

- **View Shop Products**

  - **Endpoint:** `domain/api/product/shop/:id`
  - **Method:** GET
  - **Description:** Retrieve products for a specific shop by ID.
  - **Access:** Roles allowed: **shop employee.**

- **Review Product**
  - **Endpoint:** `domain/api/product/create-review`
  - **Method:** POST
  - **Description:** Submit a review for a product.
  - **Access:** Roles allowed: **customer.**

---

### Coupon Endpoints

- **Create Coupon**

  - **Endpoint:** `domain/api/coupon/create`
  - **Method:** POST
  - **Description:** Create a new coupon.
  - **Access:** Roles allowed: **company and shop employee.**

- **View Coupons**

  - **Endpoint:** `domain/api/coupon/`
  - **Method:** GET
  - **Description:** Retrieve a list of all coupons.
  - **Access:** Roles allowed: **company employee.**

- **View Coupon**

  - **Endpoint:** `domain/api/coupon/:id`
  - **Method:** GET
  - **Description:** Retrieve details of a specific coupon by ID.
  - **Access:** Roles allowed: **company and shop employee.**

- **Validate Coupon**

  - **Endpoint:** `domain/api/coupon/validate`
  - **Method:** POST
  - **Description:** Validate a coupon code.
  - **Access:** Roles allowed: **open endpoint.**

- **Update Coupon**

  - **Endpoint:** `domain/api/coupon/:id`
  - **Method:** PUT
  - **Description:** Update the details of a specific coupon by ID.
  - **Access:** Roles allowed: **company and shop employee.**

- **Delete Coupon**

  - **Endpoint:** `domain/api/coupon/:id`
  - **Method:** DELETE
  - **Description:** Delete a specific coupon by ID.
  - **Access:** Roles allowed: **company and shop employee.**

- **View Shop Coupons**
  - **Endpoint:** `domain/api/coupon/shop/:id`
  - **Method:** GET
  - **Description:** Retrieve coupons for a specific shop by ID.
  - **Access:** Roles allowed: **shop employee.**

---

### Order Endpoints

- **Create Order**

  - **Endpoint:** `domain/api/order/create`
  - **Method:** POST
  - **Description:** Place a new order.
  - **Access:** Roles allowed: **customer.**

- **View Orders**

  - **Endpoint:** `domain/api/order/`
  - **Method:** GET
  - **Description:** Retrieve a list of all orders.
  - **Access:** Roles allowed: **any user.**

- **Track Order**

  - **Endpoint:** `domain/api/order/:id`
  - **Method:** GET
  - **Description:** Track the status of a specific order by ID.
  - **Access:** Roles allowed: **any user.**

- **Update Order Status**

  - **Endpoint:** `domain/api/order/updateStatus/:id`
  - **Method:** PUT
  - **Description:** Update the status of a specific order by ID.
  - **Access:** Roles allowed: **company and shop employee.**

- **Apply Order Refund**

  - **Endpoint:** `domain/api/order/applyRefund/:id`
  - **Method:** PUT
  - **Description:** Request a refund for a specific order.
  - **Access:** Roles allowed: **customer.**

- **Accept Order Refund**

  - **Endpoint:** `domain/api/order/acceptRefund/:id`
  - **Method:** PUT
  - **Description:** Accept a refund request for a specific order.
  - **Access:** Roles allowed: **company and shop employee.**

- **Cancel Order**
  - **Endpoint:** `domain/api/order/canceledOrder/:id`
  - **Method:** GET
  - **Description:** Cancel a specific order by ID.
  - **Access:** Roles allowed: **any user.**

---

## Conclusion

This documentation provides an overview of the Ecomart API. Ensure you follow the API usage guidelines for authentication and data handling.
