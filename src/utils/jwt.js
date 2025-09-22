import jwt from 'jsonwebtoken';
import ms from 'ms';

const accessExp = process.env.ACCESS_TOKEN_EXP || '15m';
const refreshExp = process.env.REFRESH_TOKEN_EXP || '7d';
export const signAccessToken = (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: accessExp });
}

export const signRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: refreshExp });
}

export const verifyAccessToken = async (token) => {
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
}

function verifyRefreshToken(token) {
    return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
}

export const refreshExpiresMs = () => {
    return ms(refreshExp); // e.g. '7d' -> ms value for cookie maxAge
}

export default {
    verifyAccessToken
};