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

---

# Tech Stack

| Technology | Purpose                              |
| ---------- | ------------------------------------ |
| Bun        | JavaScript Runtime & Package Manager |
| Express.js | Backend Framework                    |
| TypeScript | Static Typing                        |
| Prisma ORM | Database ORM                         |
| PostgreSQL | Relational Database                  |
| JWT        | Authentication                       |
| bcrypt     | Password Hashing                     |
| Stripe     | Payment Gateway                      |

---

# Installation

Clone the repository.

```bash
git clone https://github.com/sumon-chandra/rent-nest.git
```

Navigate to the project.

```bash
cd rent-nest
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

APP_URL=http://localhost:3000

DATABASE_URL=YOUR_DATABASE_URL

JWT_ACCESS_SECRET=YOUR_SECRET
JWT_REFRESH_SECRET=YOUR_SECRET
JWT_ACCESS_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

STRIPE_SECRET_KEY=YOUR_SECRET_KEY
STRIPE_WEBHOOK_SECRET=YOUR_WEBHOOK_SECRET

```

---

# Database

Run migrations.

```bash
bunx prisma migrate dev
```

Generate Prisma Client.

```bash
bunx prisma generate
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

---

# API Modules

- Authentication
- Categories
- Properties
- Rental Requests
- Payments
- Reviews

---

# API Endpoints

#### Main API Route https://rentnestapi2.vercel.app/api/v1/

## Authentication

| Method | Endpoint         | Description                    |
| ------ | ---------------- | ------------------------------ |
| POST   | `/auth/register` | Register tenant or landlord    |
| POST   | `/auth/login`    | Login and receive JWT          |
| GET    | `/auth/me`       | Get current authenticated user |

## Categories

| Method | Endpoint                  | Description             |
| ------ | ------------------------- | ----------------------- |
| POST   | `/categories`             | Create category (Admin) |
| GET    | `/categories`             | Get all categories      |
| GET    | `/categories/:categoryId` | Get category by ID      |
| PATCH  | `/categories/:categoryId` | Update category         |
| DELETE | `/categories/:categoryId` | Delete category         |

## Properties

| Method | Endpoint                  | Description                                              |
| ------ | ------------------------- | -------------------------------------------------------- |
| POST   | `/properties`             | Create property (Landlord)                               |
| GET    | `/properties`             | List properties (supports search/filter/sort/pagination) |
| GET    | `/properties/:propertyId` | Get property details                                     |
| PATCH  | `/properties/:propertyId` | Update property                                          |
| DELETE | `/properties/:propertyId` | Delete property                                          |

## Rental Requests

| Method | Endpoint                                   | Description                               |
| ------ | ------------------------------------------ | ----------------------------------------- |
| POST   | `/rental-requests`                         | Submit rental request                     |
| GET    | `/rental-requests`                         | Get current user's rental requests        |
| GET    | `/rental-requests/:id`               | Get rental request details                |
| PATCH  | `/rental-requests/update-status/:id` | Approve, reject, or cancel rental request |
| DELETE | `/rental-requests/:id`               | Delete rental request                     |

## Payments

| Method | Endpoint               | Description                    |
| ------ | ---------------------- | ------------------------------ |
| POST   | `/payments/checkout`   | Create Stripe Checkout Session |
| POST   | `/payments/webhook`    | Stripe webhook                 |
| GET    | `/payments`            | Payment history                |
| GET    | `/payments/:paymentId` | Payment details                |

---

## Reviews

| Method | Endpoint                          | Description                 |
| ------ | --------------------------------- | --------------------------- |
| POST   | `/reviews`                        | Create review               |
| GET    | `/properties/:propertyId/reviews` | Get reviews for a property  |
| DELETE | `/reviews/:propertyId`            | Delete review (Admin/Owner) |

---

## Users

| Method | Endpoint         | Description                           |
| ------ | ---------------- | ------------------------------------- |
| GET    | `/users`         | Get all users (Admin)                 |
| GET    | `/users/:userId` | Get user by ID (Admin)                |
| GET    | `/users/me`      | Get user authenticated user's profile |
| PATCH  | `/users/update`  | Update user's profile                 |
| DELETE | `/users/:userId` | Delete user's profile                 |

---

# User Roles

| Role     | Description                                                      |
| -------- | ---------------------------------------------------------------- |
| Tenant   | Browse properties, request rentals, make payments, leave reviews |
| Landlord | Manage properties and rental requests                            |
| Admin    | Manage users, categories, properties, and rental requests        |

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
	"statusCode": 200,
	"message": "Property created successfully",
	"data": {}
}
```

---

# License

This project is intended for educational and portfolio purposes.

Feel free to modify and extend it according to your requirements.
