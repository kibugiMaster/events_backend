import { Router } from 'express';
import { checkUser, getUserById, issueTokensForUser, login, register } from '../controllers/auth_controller.js';
import { validateEmail } from '../utils/helper.js';
import { refreshExpiresMs } from '../utils/jwt.js';
import { requireAuth } from '../middleware/auth_middleware.js';

const router = Router();

router.post('/register', async (req, res) => {
    const { full_name, phone, email, password } = req.body || {};

    if (!email || !password || !full_name || !phone) { return res.status(401).json({ status: 1, message: "Fill all fields. Full name, Phone number, Email and Password are required." }); }
    if (!validateEmail(email)) { return res.status(401).json({ status: 1, message: "Invalid Email address" }); }
    if (await checkUser(email) || await checkUser(phone)) {
        return res.status(401).json({ success: false, message: "User already exists" })
    }


    let user = await register(full_name, phone, email, password);
    if (user.success !== true) {
        return res.status(user.code).json(user);
    }
    delete user.data.password;

    const tokens = await issueTokensForUser({ ...user.data, id: user.data.id });
    res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: refreshExpiresMs(),
        path: '/api/auth/refresh',
    });
    return res.json({ success: true, message: "User created successfully.", data: user.data, token: tokens.accessToken });
});

router.post('/login', async (req, res) => {
    const { user_name, password } = req.body || {};

    if (!user_name || !password) { return res.status(401).json({ status: 1, message: "user_name and password are required." }); }
    let user = await login(user_name, password);
    if (user.success !== true) {
        return res.status(user.code).json(user);
    }
    delete user.data.password;

    const tokens = await issueTokensForUser({ ...user.data, id: user.data.id });
    res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: refreshExpiresMs(),
        path: '/api/auth/refresh',
    });
    return res.json({ success: true, message: "User created successfully.", data: user.data, token: tokens.accessToken });
});

router.get('/profile', requireAuth, async (req, res) => {
    const user_id = req.user.userId;
    let user = await getUserById(user_id);
    if (user.success !== true) {
        return res.status(user.code).json(user).slice();
    }
    return res.json(user);
})

router.get('/check', requireAuth, async (req, res) => {
    res.json({ status: 0, message: 'Authenticated' })
});

export default router;