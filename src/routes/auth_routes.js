import { Router } from 'express';
import { login, register } from '../controllers/auth_controller.js';

const router = Router();

router.post('/register', async (req, res) => {
    const { full_name, phone, email, password } = req.body || {};

    if (!email || !password) { return res.status(401).json({ status: 1, message: "Email and password are required." }); }
    let user = await register(full_name, phone, email, password);
    if (user.success !== true) {
        return res.status(500).json(user);
    }
    return res.json(user);
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body || {};

    if (!email || !password) { return res.status(401).json({ status: 1, message: "Email and password are required." }); }
    let user = await login(email, password);
    return res.json(user);
});

export default router;