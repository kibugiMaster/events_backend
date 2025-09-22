import bcrypt from 'bcrypt';

export const hashValue = async function (value) {
    const saltRounds = 10;
    return bcrypt.hash(value, saltRounds);
}

export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return !email || typeof email !== 'string' || emailRegex.test(email);
}