import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import prisma from "../config/prisma_config.js";
import { hashValue, validateEmail } from "../utils/helper.js";
import { signAccessToken, signRefreshToken } from "../utils/jwt.js";
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

export const register = async (name, phone, email, password) => {
    try {
        const hashedPassword = await bcrypt.hash(String(password), 10);
        let user = await prisma.users.create({
            data: {
                full_name: name,
                phone,
                email,
                password: hashedPassword
            },
        });
        if (!user) {
            return { code: 401, success: false, "message": "User already exists" };
        }
        return { code: 200, success: true, data: user }
    } catch (e) {
        console.log(e);
        return { code: 500, success: false, message: "Internal Server Error", data: e.message };
    }
}
export const login = async (user_name, password) => {
    try {
        let user = null;
        if (validateEmail(user_name)) {
            user = await prisma.users.findUnique({ where: { email: user_name } })
        }
        else {
            user = await prisma.users.findUnique({ where: { phone: user_name } })
        }
        if (user === null) {
            return { code: 403, success: false, message: "User not found" };
        }
        if (!(await bcrypt.compare(String(password), user.password))) {
            return { code: 403, success: false, message: "Invalid credentials" };
        }
        return { success: true, data: user }
    } catch (error) {
        console.error(error);
        return { code: 500, success: false, message: "Internal server error", data: error.message };
    }
}

export const checkUser = async (user_name) => {
    let user = null;
    if (validateEmail(user_name)) {
        user = await prisma.users.findUnique({ where: { email: user_name } })
    }
    else {
        user = await prisma.users.findUnique({ where: { phone: user_name } })
    }
    console.log("user", user);

    if (user === null) {
        return false;
    }
    return true;
}

// Refresh Token Functions
export const issueTokensForUser = async (user) => {
    const { accessToken, refreshToken, expiresAt } = buildTokens(user);
    await storeRefreshToken(user.id, refreshToken, expiresAt);
    return { accessToken, refreshToken };
}

const storeRefreshToken = async function (userId, rawToken, expiresAt) {
    const token_hash = await hashValue(rawToken);
    return prisma.$transaction(async (tx) => {
        const deleted = await tx.refresh_token.updateMany({
            where: { user_id: userId, revoked_at: null },
            data: { revoked_at: new Date() },
        });
        return await tx.refresh_token.create({
            data: { user_id: userId, token: token_hash, expires_at: expiresAt },
        });
    });
}

const buildTokens = (user) => {
    const payload = { userId: user.id, email: user.email };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);
    // decode refresh to get expiry timestamp (seconds since epoch)
    const { exp } = jwt.decode(refreshToken);
    const expiresAt = new Date(exp * 1000);
    return { accessToken, refreshToken, expiresAt };
};