import { Router } from 'express';
import { requireAuth } from '../middleware/auth_middleware.js';
import { checkEventTypeExists, createEventType, getEventTypes } from '../controllers/event_types_controller.js';
import { removeEmptyFields } from '../utils/helper.js';

const router = Router();
router.get('/', async (req, res) => {
    let types = await getEventTypes();
    if (types.success !== true) {
        return res.status(types.code).json({ message: types.message })
    }
    return res.status(200).json({ success: true, message: 'Loaded successfully!', data: types.data });

});

router.post('/', requireAuth, async (req, res) => {
    const { name, description, logo } = req.body || {};
    if (!name) {
        return res.status(401).json({ error: 'Name is required' });
    }
    if (await checkEventTypeExists(name)) {
        return res.status(409).json({ message: "Type already exists" })
    }

    let body = { name, description, logo };
    let type = await createEventType(removeEmptyFields(body))
    if (type.success !== true) {
        return res.status(type.code).json({ message: type.message });
    }
    return res.status(200).json({ success: true, message: 'Created successfully!', data: type.data });
});

export default router;