import { pool } from "../../config/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../../config";

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
  signinUser,
};
export default authServices;
