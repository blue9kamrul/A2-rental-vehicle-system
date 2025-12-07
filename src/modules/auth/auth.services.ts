import { pool } from "../../config/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../../config";
import { REPLCommand } from "repl";

//creating new user
const createUser = async (payload: Record<string, unknown>) => {
  const { name, email, password, phone, role } = payload;

  const hashedPassword = await bcrypt.hash(password as string, 10);
  const result = await pool.query(
    `INSERT INTO users (name, email, password, phone, role) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [name, email, hashedPassword, phone, role]
  );
  delete result.rows[0].password;
  return result.rows[0];
};

//logging in user
const signinUser = async (Payload: Record<string, unknown>) => {
  const { email, password } = Payload;
  const result = await pool.query(
    `
        SELECT * FROM users WHERE email = $1
    `,
    [email]
  );

  if (result.rows.length === 0) {
    return { error: "User not found" };
  }
  const user = result.rows[0];
  const matched = await bcrypt.compare(password as string, user.password);
  if (!matched) {
    return { error: "Invalid password" };
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    config.jwtSecret as string,
    { expiresIn: "7d" }
  );
  delete user.password;
  console.log("Generated Token:", token);
  return { token, user };
};

//exports
const authServices = {
  createUser,
  signinUser,
};
export default authServices;
