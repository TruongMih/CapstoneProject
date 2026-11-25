import { AppErrors } from "../errors/AppErrors.js";
import { signAccessToken } from "../lib/jwt.js";
import { createUser, findUserByEmail, findUserByEmailWithPass } from "../repositories/user.repository.js";
import { validateAuthen } from "../validators/validateAuthen.js";
import { validatePassword } from "../validators/validatePassword.js";
import bcrypt from 'bcryptjs';

export async function registerUser(
    email: string,
    password: string
): Promise<void> {
    validateAuthen(email,password);
    validatePassword(password);

    const normalizeEmail = email.toLowerCase().trim();

    const existingUser = await findUserByEmail(normalizeEmail);
    if(existingUser){
        throw new AppErrors(409, 'Email already present');
    }

    const passHash = await bcrypt.hash(password, 10);
    await createUser(normalizeEmail, passHash);
}

export async function loginUser(
    email: string,
    password: string
): Promise<{accessToken: string}>{

    validateAuthen(email, password);
    const nornalizeEmail = email.toLowerCase().trim();
    const user = await findUserByEmailWithPass(nornalizeEmail);

    if(!user?.password_hash){
        throw new AppErrors(401,'Invalid email or password');
    }
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if(!isValidPassword){
        throw new AppErrors(401,'Invalid email or password');
    }

    const accessToken = await signAccessToken({
        user_id: user.id,
        email: user.email,
        role: user.role
    });

    return {accessToken};
}