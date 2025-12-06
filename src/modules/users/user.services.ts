import bcrypt from "bcryptjs";
import { pool } from "../../config/db";

//retrieve all users - admin only
const getAllUsers = async () => {
  const result = await pool.query(
    "SELECT id, name, email, phone, role FROM users"
  );
  return result.rows;
};

//update user - with role-based logic
const updateUsers = async (
  userId: string,
  userData: { name?: string; email?: string; phone?: string; role?: string },
  requestingUserRole: string
) => {
  const { name, email, phone, role } = userData;

  // If customer tries to update role, return error
  if (requestingUserRole !== "admin" && role !== undefined) {
    return { error: "Only admins can update user roles" };
  }

  let result;

  if (requestingUserRole === "admin") {
    // Admin can update everything including role
    result = await pool.query(
      `UPDATE users 
       SET name = COALESCE($1, name),
           email = COALESCE($2, email),
           phone = COALESCE($3, phone),
           role = COALESCE($4, role)
       WHERE id = $5 
       RETURNING id, name, email, phone, role`,
      [name, email, phone, role, userId]
    );
  } else {
    // Customer can only update name, email, phone
    result = await pool.query(
      `UPDATE users 
       SET name = COALESCE($1, name),
           email = COALESCE($2, email),
           phone = COALESCE($3, phone)
       WHERE id = $4 
       RETURNING id, name, email, phone, role`,
      [name, email, phone, userId]
    );
  }

  return result.rows[0];
};

// delete user - admin only
const deleteUser = async (userId: string) => {
  const result = await pool.query(
    "DELETE FROM users WHERE id = $1 RETURNING id, name, email, phone, role",
    [userId]
  );
  return result.rows[0];
};

const userServices = {
  getAllUsers,
  updateUsers,
  deleteUser,
};
export default userServices;
