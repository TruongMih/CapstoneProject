import { AppErrors } from "../errors/AppErrors.js";
import { createUser, findUserByEmail } from "../repositories/user.repository.js";
import { validatePassword } from "../validators/validatePassword.js";
import bcrypt from 'bcryptjs'

export async function registerUser(
    email: string,
    password: string
): Promise<void> {
    if(!email || !password){
        throw new AppErrors(400,'Email and password are required');
    }
    validatePassword(password);
    
    const normalizeEmail = email.toLowerCase().trim();

    const existingUser = await findUserByEmail(normalizeEmail);
    if(existingUser){
        throw new AppErrors(409, 'Email already present');
    }

    const passHash = await bcrypt.hash(password, 10);
    await createUser(normalizeEmail, passHash);
}