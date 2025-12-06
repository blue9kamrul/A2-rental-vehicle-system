import { pool } from "../../config/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../../config";

//creating new user
const createUser = async (payload: Record<string, unknown>) => {
  //logic to create user in DB
  const { name, email, password, phone, role } = payload;

  const hashedPassword = await bcrypt.hash(password as string, 10);
  const result = await pool.query(
    `INSERT INTO users (name, email, password, phone, role) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [name, email, hashedPassword, phone, role]
  );
  return result;
};

//logging in user
const signinUser = async (email: string, password: string) => {
  const result = await pool.query(
    `
        SELECT * FROM users WHERE email = $1
    `,
    [email]
  );

  if (result.rows.length === 0) {
    return null;
  }
  const user = result.rows[0];
  const matched = await bcrypt.compare(password, user.password);
  if (!matched) {
    return false;
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    config.jwtSecret as string,
    { expiresIn: "7d" }
  );
  console.log("Generated Token:", token);
  return { token, user };
};

const authServices = {
  createUser,
  signinUser,
};
export default authServices;
