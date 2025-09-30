import { Router } from 'express';
import { requireAuth } from '../middleware/auth_middleware.js';
import { checkCardTypeExists, checkEventTypeExists, createEventCardTypes, createEventType, getEventCardTypes, getEventTypeById, getEventTypes } from '../controllers/event_types_controller.js';
import { removeEmptyFields } from '../utils/helper.js';

const router = Router();
router.get('/', async (req, res) => {
    let types = await getEventTypes();
    if (types.success !== true) {
        return res.status(types.code).json({ message: types.message })
    }
    return res.status(200).json({ success: true, message: 'Loaded successfully!', data: types.data });
});

router.get('/:id', async (req, res) => {
    let id = parseInt(req.params.id);
    let type = await getEventTypeById(id)
    if (type.success !== true) {
        return res.status(type.code).json({ message: type.message });
    }
    return res.status(200).json({ success: true, message: 'Loaded successfully!', data: type.data });
})

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

router.get('/card/:id', async (req, res) => {
    let id = parseInt(req.params.id);
    let card = await getEventCardTypes(id);
    if (card.success !== true) {
        return res.status(card.code).json({ message: card.message });
    }
    return res.status(200).json({ success: true, message: 'Loaded successfully!', data: card.data });
})

router.post('/card', requireAuth, async (req, res) => {
    let { event_type_id, name, description, value } = req.body || {};
    if (!name || !event_type_id || isNaN(value) || !value) {
        return res.status(401).json({ success: false, message: 'fill all fields correctly!' });
    }
    if (await checkCardTypeExists(name, parseInt(event_type_id))) {
        return res.status(409).json({ message: "Card Type already exists for this Event Type!" })
    }

    let body = { event_type_id, name, description };
    let card = await createEventCardTypes(body);
    if (card.success !== true) {
        return res.status(card.code).json({ message: card.message });
    }
    return res.status(200).json({ success: true, message: 'Loaded successfully!', data: card.data });
})

export default router;