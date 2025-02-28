# Coupon Book Service

This project implements a Coupon Book Service that enables businesses to create coupon books, upload coupon codes, assign coupons to users, and manage coupon redemptions. The service is designed for scalability and high availability using modern cloud technologies.

---

## High Level System Architecture

The service is deployed on AWS using the following components:

- **Amazon VPC:** The entire system runs inside a Virtual Private Cloud, providing network isolation and security.
- **Application Load Balancer (ALB):** Publicly accessible, the ALB routes incoming HTTP/HTTPS requests to the backend services.
- **ECS Fargate:** The Coupon Book Service is containerized and runs on AWS Fargate, enabling scalable and serverless container management.
- **Amazon RDS (PostgreSQL):** The service stores data in an RDS PostgreSQL database. The database supports migrations to manage schema changes over time.
- **Additional Services:** The architecture can be extended with an API Gateway, monitoring, logging, and CI/CD pipelines for automated deployments.

*(A detailed architecture diagram is provided below.)*

![AWS Architecture Diagram](https://imgur.com/a/zqxfDhB)
---

## High Level Database Design

The database follows a relational design with the following key entities:

- **CouponBook:** Represents a collection of coupons. It includes properties such as `name`, `description`, `allowMultipleRedemptions`, `maxCodesPerUser`, and a `maxRedemptions` field (defining the maximum number of redemptions allowed per coupon when multiple redemptions are enabled).
- **Coupon:** Represents individual coupons. Coupons are linked to a CouponBook and can be assigned to a User. A composite unique constraint ensures that the same code can exist in different coupon books. The entity also includes a `redemptionCount` to track the number of times it has been redeemed, and a `status` (with values like `AVAILABLE`, `ASSIGNED`, `LOCKED`, and `REDEEMED`).
- **User:** Represents the end user who can be assigned coupons. A user may have multiple coupons.

---

## API Endpoints

The API is RESTful and exposes the following endpoints:

- **POST /coupons**  
  _Create a new coupon book_  
  **Request:** JSON object with coupon book details (name, description, allowMultipleRedemptions, maxCodesPerUser, maxRedemptions).  
  **Response:** The created coupon book.

- **POST /coupons/codes**  
  _Upload a code list to an existing coupon book_  
  **Request:** JSON object with `couponBookId` and an array of coupon codes.  
  **Response:** An array of created coupon objects.

- **POST /coupons/assign**  
  _Assign a new random coupon code to a user_  
  **Request:** JSON object with `couponBookId` and `userId`.  
  **Response:** The assigned coupon.

- **POST /coupons/assign/{code}**  
  _Assign a given coupon code to a user_  
  **Request:** Path parameter `code` and JSON object with `couponBookId` and `userId`.  
  **Response:** The assigned coupon.

- **POST /coupons/lock/{code}**  
  _Lock a coupon for redemption_  
  **Request:** Path parameter `code` and JSON object with `couponBookId` and `userId`.  
  **Response:** The locked coupon.

- **POST /coupons/redeem/{code}**  
  _Redeem a coupon_  
  **Request:** Path parameter `code` and JSON object with `couponBookId` and `userId`.  
  **Response:** The redeemed coupon (with updated redemptionCount and status).

All endpoints are documented using Swagger. Detailed request and response schemas are available in the Swagger UI at:  
**http://localhost:3000/api**

---

## Pseudocode for Key Operations

### Assign a Coupon to a User

```
function assignCoupon(couponBookId, userId):
    couponBook = find CouponBook by couponBookId
    if couponBook not found:
        throw error
    user = find User by userId
    if user not found:
        throw error
    if couponBook.maxCodesPerUser defined:
        count = count coupons assigned to user in couponBook
        if count >= couponBook.maxCodesPerUser:
            throw error "Max coupons reached"
    coupon = find one available coupon in couponBook
    if coupon not found:
        throw error "No available coupon"
    coupon.user = user
    coupon.status = ASSIGNED
    save coupon
    return coupon
```

### Lock a Coupon for Redemption

```
function lockCoupon(code, couponBookId, userId):
    coupon = find coupon by code, couponBookId, userId, and status ASSIGNED
    if coupon not found:
        throw error
    coupon.status = LOCKED
    save coupon
    return coupon
```

### Redeem a Coupon

```
function redeemCoupon(code, couponBookId, userId):
    coupon = find coupon by code, couponBookId, userId, and status LOCKED
    if coupon not found:
        throw error
    if couponBook.allowMultipleRedemptions is true:
        if coupon.redemptionCount + 1 >= couponBook.maxRedemptions:
            coupon.redemptionCount++
            coupon.status = REDEEMED  // Last allowed redemption
        else:
            coupon.redemptionCount++
            // Remains LOCKED for further redemptions
    else:
        coupon.status = REDEEMED
    save coupon
    return coupon
```

---

## High-Level Deployment Strategy

**Cloud Platform:**  
Deploy on AWS using services such as ECS Fargate for containerized microservices, Amazon RDS for PostgreSQL, and an Application Load Balancer (ALB) to route traffic. Optionally, use an API Gateway for more advanced routing and security.

**CI/CD Pipeline:**  
- **Code Repository:** GitHub or GitLab.  
- **Build & Test:** Use AWS CodeBuild or GitHub Actions to build and test the Docker images.  
- **Deployment:** Deploy using AWS ECS (Fargate) with AWS CodeDeploy or AWS CodePipeline.  
- **Monitoring:** Leverage CloudWatch for logs and performance monitoring.

**Scalability & Availability:**  
- Auto-scaling ECS tasks based on load.  
- Multi-AZ deployments for RDS to ensure high availability.  
- Use an ALB to distribute incoming traffic and handle failover.

---

## Local Testing

### System Requirements

- **Docker:** Version 20+  
- **Docker Compose:** Version 1.27+  
- **Environment:** A recent version of Node.js (for local development, though Docker handles runtime)

### Steps to Run Locally

1. **Clone the Repository:**  
   ```bash
   git clone <repository_url>
   cd coupon-api
   ```

2. **Create an .env File:**  
   Place an `.env` file in the root directory with the following (example) values:
   ```env
   DB_HOST=coupons-db
   DB_PORT=5432
   DB_USER=admin
   DB_PASSWORD=admin
   DB_NAME=coupons-service
   PORT=3000
   ```

3. **Launch the Stack:**  
   Run Docker Compose to build and start both the database and application containers:
   ```bash
   docker-compose up --build
   ```
   This will build your NestJS app, start PostgreSQL with migrations, and expose the API on port 3000.

4. **Access Swagger Documentation:**  
   Open your browser and navigate to [http://localhost:3000/api](http://localhost:3000/api) to test the endpoints using the interactive Swagger UI.

5. **Database Migrations:**  
   The PostgreSQL container supports migrations; these are automatically applied on application startup.
