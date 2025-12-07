# Vehicle Rental System API

A backend App for a vehicle rental platform with role based API and AUTH Middleware. Built with **Express**, **TypeScript**, and **Raw SQL (PostgreSQL)**, **bcryptjs**, **jsonwebtoken** .

---

## 🔗 Live Deployment

**Base URL:** [https://rental-vehicle-api.vercel.app/](https://rental-vehicle-api.vercel.app/)

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

- CRUD operations for vehicle inventory with auth middleware for safety.
- Availability tracking (available vs booked).

### 📅 Booking System (Transactional)

- **Basic:** can create, update, see the bookings done with role based.
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
CONNECTION_STR = Connection string for neonDB
PORT = 5000
JWT_SECRET = Your secret key
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

# [click here](https://github.com/blue9kamrul/A2-rental-vehicle-system)

### Live deployment

# [click here](https://rental-vehicle-api.vercel.app/)
