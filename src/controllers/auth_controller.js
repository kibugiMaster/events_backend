import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

export const register = async (name, phone, email, password) => {
    try {
        // let user = prisma.users.create({
        //     data: {
        //         name,
        //         phone,
        //         email,
        //         password: await bcrypt.hash(password, 10)
        //     },
        // });
        return { success: true, data: user }
    } catch (e) {
        console.log(e);
        return { success: false };
    }
}
export const login = async (email, password) => {

}