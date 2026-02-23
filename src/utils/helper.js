import bcrypt from 'bcrypt';

export const hashValue = async function (value) {
    const saltRounds = 10;
    return bcrypt.hash(value, saltRounds);
}

export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return !email || typeof email !== 'string' || emailRegex.test(email);
}

export const removeEmptyFields = (data) => {
    return Object.fromEntries(
        Object.entries(data).filter(
            ([, value]) => value !== null && value !== '' && value !== undefined
        )
    );
}

export const generateRandomCode = (length) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        result += chars[randomIndex];
    }
    return result;
};

export function normalizePhoneNumber(phone) {
    if (!phone) return null;

    // Remove all spaces and non-digit characters
    let cleaned = phone.replace(/\D/g, "");

    // If starts with +255
    if (cleaned.startsWith("255") && cleaned.length === 12) {
        return cleaned;
    }

    // If starts with 0 and has 10 digits
    if (cleaned.startsWith("0") && cleaned.length === 10) {
        return "255" + cleaned.substring(1);
    }

    // If user accidentally omits 0 (like 761...)
    if (cleaned.length === 9 && /^[67]/.test(cleaned)) {
        return "255" + cleaned;
    }

    // If already in correct format
    if (cleaned.startsWith("255") && cleaned.length === 12) {
        return cleaned;
    }

    // Otherwise, invalid
    throw new Error("Invalid phone number format");
}