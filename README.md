# Vehicle Rental System API

A backend App for a vehicle rental platform with role based API and AUTH Middleware. Built with **Express**, **TypeScript**, and **Raw SQL (PostgreSQL)**, **bcryptjs**, **jsonwebtoken** .

---

## 🔗 Live Deployment

**Base URL:** []()

---

## 🛠️ Technology Stack

- **Runtime Environment:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** PostgreSQL (hosted on **NeonDB**)
- **Query Method:** Raw SQL
- **Authentication:** JWT (JSON Web Tokens) & Bcrypt
- **Deployment:** Vercel

---

## ✨ Key Features

### 👤 User Roles

- **Admin:** Have full access to view, update and delete users and vehicles. Also can manage the bookings functionality.
- **Customer:** Can register, login, see vehicles, and book vehicles.

### 🔑 Authentication & Security

- Secure **JWT-based** authentication and authorization.
- Password hashing using **bcrypt**.
- **Role-Based Access Control** middleware to protect admin routes.

### 🚙 Vehicle Management

- CRUD operations for vehicle inventory.
- Availability tracking (available vs booked).

### 📅 Booking System (Transactional)

- **Basic:** can create, update, see the bookings done.
- **Logic:** Prevents double-booking and validates start/end dates.
- **Pricing:** Total price calculation based on rental duration.

---

## ⚙️ Setup & Usage Instructions

Follow these steps to run the project locally.

### 1. Clone the Repository

```bash
git clone https://github.com/blue9kamrul/A2
cd A2-rental-vehicle-system
```

---

### 2. Environment variables

```bash
CONNECTION_STR = postgresql://neondb_owner:npg_E6O1DFQLMBro@ep-dry-term-a8osgu2c-pooler.eastus2.azure.neon.tech/neondb?sslmode=require&channel_binding=require
PORT = 5000
JWT_SECRET = KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30
```

---

### 3. Install dependencies

```bash
npm install
```

---

### 4. Run the server

```bash
npm run dev
```

---

### 5. Base Url

```bash
http://localhost:5000/api/v1
```

---

### Github Repository

## [click here](https://github.com/blue9kamrul/A2-rental-vehicle-system)

### Live deployment
