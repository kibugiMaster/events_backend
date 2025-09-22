import bcrypt from 'bcrypt';

export const hashValue = async function (value) {
    const saltRounds = 10;
    return bcrypt.hash(value, saltRounds);
}