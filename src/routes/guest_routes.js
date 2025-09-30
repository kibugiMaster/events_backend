import { Router } from "express";
import { requireAuth } from "../middleware/auth_middleware.js";
import { addNewGuest, checkIfGuestExists, checkInGuest, getAllGuests } from "../controllers/guest_controller.js";
import { generateRandomCode, removeEmptyFields } from "../utils/helper.js";

const router = new Router();

router.get("/:eventId", requireAuth, async (req, res) => {
    const { eventId } = req.params;
    let guest = await getAllGuests(eventId);
    if (guest.success !== true) {
        return res.status(401).json(guest);
    }
    return res.json({ success: true, message: "Loaded successfully!", data: guest.data });
})

router.post("/", requireAuth, async (req, res) => {
    const { full_name, email, phone, event_id, card_type_id } = req.body || {};
    if (!full_name || !phone || !card_type_id || !event_id) {
        return res.status(422).json({
            success: false,
            message: "Please provide all the required fields"
        })
    }

    if (await checkIfGuestExists(phone, event_id)) {
        return res.status(422).json({
            success: false,
            message: "Guest already exists!"
        })
    }

    let code = generateRandomCode(20) + "-event-share-" + generateRandomCode(10);
    let body = removeEmptyFields(req.body);
    body.access_code = code;
    body.card_type_id = Number(card_type_id);
    body.event_id = Number(event_id);

    let guest = await addNewGuest(body);
    if (guest.success !== true) {
        return res.status(401).json(guest);
    }
    return res.json({ success: true, message: "Created successfully!", data: guest.data });
})

router.post("/check-in", requireAuth, async (req, res) => {
    const { access_code } = req.body || {};
    if (!access_code) {
        return res.status(422).json({
            success: false,
            message: "Please provide an access code"
        })
    }
    let check = await checkInGuest(access_code);
    if (check.success !== true) {
        return res.status(401).json(check);
    }
    return res.json({ success: true, message: "Checked in successfully!", data: check.data });
}
)

export default router;