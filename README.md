# RentNest API 🏠

**Find & List Rental Properties with Ease**

RentNest is a RESTful backend API for a rental property marketplace. It enables landlords to list rental properties, tenants to discover and rent properties, and administrators to manage the platform.

Built with **Express.js**, **Bun**, **TypeScript**, **Prisma ORM**, and **PostgreSQL**, the project follows a modular architecture with scalability and maintainability in mind.

---

## ✨ Features

### Public

- Browse available rental properties
- Search properties by location
- Filter by category, price, bedrooms, bathrooms, and availability
- View property details
- Browse property categories

### Tenant

- Register and authenticate
- Update profile
- Submit rental requests
- View rental request history
- Complete payments
- View payment history
- Leave property reviews after successful rentals

### Landlord

- Create property listings
- Update property information
- Delete property listings
- Manage property availability
- View rental requests
- Approve or reject rental requests

### Admin

- View all users
- Ban or unban users
- Manage categories
- View all properties
- View all rental requests
- Moderate platform activity

---

# Tech Stack

| Technology          | Purpose                              |
| ------------------- | ------------------------------------ |
| Bun                 | JavaScript Runtime & Package Manager |
| Express.js          | Backend Framework                    |
| TypeScript          | Static Typing                        |
| Prisma ORM          | Database ORM                         |
| PostgreSQL          | Relational Database                  |
| JWT                 | Authentication                       |
| bcrypt              | Password Hashing                     |
| Zod                 | Request Validation                   |
| Stripe / SSLCommerz | Payment Gateway                      |

---

# Project Structure

```text
src/
│
├── app.ts
├── server.ts
│
├── config/
├── middlewares/
├── utils/
├── helpers/
├── constants/
├── lib/
│
├── routes/
│
├── modules/
│   ├── auth/
│   ├── category/
│   ├── property/
│   ├── rental/
│   ├── payment/
│   ├── review/
│   └── admin/
│
└── prisma/
```

---

# Installation

Clone the repository.

```bash
git clone <repository-url>
```

Navigate to the project.

```bash
cd rentnest-api
```

Install dependencies.

```bash
bun install
```

---

# Environment Variables

Create a `.env` file in the project root.

```env
PORT=5000

DATABASE_URL=

JWT_ACCESS_SECRET=
JWT_ACCESS_EXPIRES_IN=7d

JWT_REFRESH_SECRET=
JWT_REFRESH_EXPIRES_IN=30d

BCRYPT_SALT_ROUNDS=10

STRIPE_SECRET_KEY=

SSLCOMMERZ_STORE_ID=
SSLCOMMERZ_STORE_PASSWORD=
SSLCOMMERZ_IS_LIVE=false
```

---

# Database

Generate Prisma Client.

```bash
bunx prisma generate
```

Run migrations.

```bash
bunx prisma migrate dev
```

Open Prisma Studio.

```bash
bunx prisma studio
```

---

# Run the Server

Development

```bash
bun run dev
```

Production

```bash
bun run start
```

---

# API Modules

- Authentication
- Categories
- Properties
- Rental Requests
- Payments
- Reviews
- Administration

---

# Authentication

Authentication is handled using JWT.

Protected routes require:

```http
Authorization: Bearer <access_token>
```

---

# API Endpoints

## Authentication

| Method | Endpoint             |
| ------ | -------------------- |
| POST   | `/api/auth/register` |
| POST   | `/api/auth/login`    |
| GET    | `/api/auth/me`       |

---

## Categories

| Method | Endpoint              |
| ------ | --------------------- |
| POST   | `/api/categories`     |
| GET    | `/api/categories`     |
| GET    | `/api/categories/:id` |
| PATCH  | `/api/categories/:id` |
| DELETE | `/api/categories/:id` |

---

## Properties

| Method | Endpoint              |
| ------ | --------------------- |
| POST   | `/api/properties`     |
| GET    | `/api/properties`     |
| GET    | `/api/properties/:id` |
| PATCH  | `/api/properties/:id` |
| DELETE | `/api/properties/:id` |

---

## Rental Requests

| Method | Endpoint           |
| ------ | ------------------ |
| POST   | `/api/rentals`     |
| GET    | `/api/rentals`     |
| GET    | `/api/rentals/:id` |
| PATCH  | `/api/rentals/:id` |

---

## Payments

| Method | Endpoint                |
| ------ | ----------------------- |
| POST   | `/api/payments/create`  |
| POST   | `/api/payments/confirm` |
| GET    | `/api/payments`         |
| GET    | `/api/payments/:id`     |

---

## Reviews

| Method | Endpoint       |
| ------ | -------------- |
| POST   | `/api/reviews` |

---

## Admin

| Method | Endpoint                |
| ------ | ----------------------- |
| GET    | `/api/admin/users`      |
| PATCH  | `/api/admin/users/:id`  |
| GET    | `/api/admin/properties` |
| GET    | `/api/admin/rentals`    |

---

# User Roles

| Role     | Description                                                      |
| -------- | ---------------------------------------------------------------- |
| Tenant   | Browse properties, request rentals, make payments, leave reviews |
| Landlord | Manage properties and rental requests                            |
| Admin    | Manage users, categories, properties, and rental requests        |

---

# Request Validation

Incoming requests are validated before reaching controllers using schema-based validation.

Validation includes:

- Required fields
- Data types
- Business rules
- Custom validation messages

---

# Error Handling

The API returns consistent JSON responses.

Example:

```json
{
	"success": false,
	"message": "Property not found",
	"errors": []
}
```

---

# Success Response

```json
{
	"success": true,
	"message": "Property created successfully",
	"data": {}
}
```

---

# License

This project is intended for educational and portfolio purposes.

Feel free to modify and extend it according to your requirements.
