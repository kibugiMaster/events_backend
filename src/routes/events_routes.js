import { Router } from "express";
import { createEvent, getAllEvents, getSingleEvent } from "../controllers/event_controller.js";
import { requireAuth } from "../middleware/auth_middleware.js";
import { generateRandomCode } from "../utils/helper.js";

const router = Router();

router.get("/", requireAuth, async (req, res) => {
    const user_id = req.user.userId;
    let events = await getAllEvents(user_id);
    return res.status(200).json({ succuss: true, message: "Loaded successfully!", data: events.data });
});

router.get("/:id", requireAuth, async (req, res) => {
    let { id } = req.params;
    const user_id = req.user.userId;

    let event = await getSingleEvent(id, user_id);
    if (event.success !== true) {
        return res.status(401).json({ success: false, message: "No such event found!" })
    }
    return res.status(200).json({ succuss: true, message: "Loaded successfully!", data: event })
});

router.post("/", requireAuth, async (req, res) => {
    let { title, description, event_type_id, event_date, event_time, event_location, map_link, } = req.body || {};
    let user_id = req.user.userId;

    if (!title || !event_type_id || !event_date || !event_time || !event_location) {
        return res.status(400).json({ success: false, message: "Please fill all the fields!" })
    }
    let access_code = generateRandomCode(6)
    let body = {
        user_id,
        title,
        description,
        event_type_id: Number(event_type_id),
        event_date: new Date(event_date),
        event_time,
        event_location,
        map_link,
        access_code
    }
    let events = await createEvent(body);
    return res.status(200).json({ succuss: true, message: "Created successfully!", data: events.data });
});

export default router;