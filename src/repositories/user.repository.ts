import { AppErrors } from "../errors/AppErrors.js";
import { pool } from "../lib/db.js";
import type { DBUserRow, User } from "../types/users.js";

// find user by email
export async function findUserByEmail(email: string): Promise<User | null> {
    const result = await pool.query<DBUserRow>(
        `SELECT id, email, role, created_at FROM users WHERE email=$1`, [email]
    );
    return result.rows[0] || null;
}

export async function createUser(email:string, password_hash: string): Promise<User> {
    const result = await pool.query<DBUserRow>(
        `INSERT INTO users (email, password_hash)
        VALUES ($1, $2)
        RETURNING id, email, password_hash, created_at
        `,
        [email, password_hash]
    );
    const user = result.rows[0];
    if(user === undefined){
        throw new Error("Lost info");
    }
    return user;
}