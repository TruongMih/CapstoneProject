import { AppErrors } from "../errors/AppErrors.js";

export function validateAuthen(email: string, password: string): void{
    if(!email || !password){
        throw new AppErrors(400, "Email and password are required");
    }
}