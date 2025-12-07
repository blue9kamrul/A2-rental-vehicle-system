import config from ".";
import { Pool } from "pg";

//DB connection
export const pool = new Pool({
  connectionString: `${config.connection_str}`,
});

const initDB = async () => {
  //users table
  await pool.query(`
        CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL CHECK (email = LOWER(email)),
        password TEXT NOT NULL CHECK (LENGTH(password) >= 6),
        phone VARCHAR(15) NOT NULL,
        role VARCHAR(50) NOT NULL CHECK(role IN ('admin', 'customer'))
        )`);

  //vehicles table
  await pool.query(`
        CREATE TABLE IF NOT EXISTS vehicles(
        id SERIAL PRIMARY KEY,
        vehicle_name TEXT NOT NULL,
        type VARCHAR(100) NOT NULL CHECK (type IN ('car', 'bike', 'truck', 'van')),
        registration_number VARCHAR(200) UNIQUE NOT NULL,
        daily_rent_price DECIMAL(10,2) NOT NULL CHECK (daily_rent_price > 0),
        availability_status VARCHAR(50) NOT NULL CHECK (availability_status IN ('available', 'booked'))
        )`);

  //bookings table
  await pool.query(`
        CREATE TABLE IF NOT EXISTS bookings(
        id SERIAL PRIMARY KEY,
        customer_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        vehicle_id INT NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
        rent_start_date TIMESTAMP NOT NULL,
        rent_end_date TIMESTAMP NOT NULL CHECK (rent_end_date > rent_start_date),
        total_price DECIMAL(10,2) NOT NULL CHECK (total_price > 0),
        status VARCHAR(150) NOT NULL CHECK (status IN ('active', 'cancelled', 'returned'))
        )`);
};

export default initDB;
