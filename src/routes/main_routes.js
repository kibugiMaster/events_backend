import { Router } from 'express';
import authRoutes from './auth_routes.js';
import faqRoutes from './faq_routes.js';

const router = new Router();

router.get('/', (req, res) => {
    return res.status(200).json({
        message: "Welcome to Events Backend"
    });
}
)

router.use('/auth', authRoutes)
router.use('/faq', faqRoutes)


export default router;