import { Router } from "express";
import { createFaq, deleteFaq, getAllFaqs, updateFaq } from "../controllers/faq_controller.js";
import { requireAuth } from "../middleware/auth_middleware.js";
import { removeEmptyFields } from "../utils/helper.js";

const router = Router();

router.get("/", async (req, res) => {
    let faq = await getAllFaqs();

    return res.json({
        success: true,
        message: faq.message,
        data: faq.data
    });
})

router.post("/", requireAuth, async (req, res) => {
    const { question, answer } = req.body || {};
    if (!question || !answer) {
        return res.status(401).json({ message: 'Please provide a valid question and answer' });
    }

    let faq = await createFaq(question, answer);
    if (faq.succuss !== true) {
        return res.status(500).json({ message: faq.message });
    }
    return res.json({
        success: true,
        data: faq.data
    });
})

router.put("/", requireAuth, async (req, res) => {
    const { faq_id, question, answer } = req.body || {};
    if (!question && !answer) {
        return res.status(401).json({ message: 'Please provide a valid question and answer' });
    }
    if (!faq_id) {
        return res.status(401).json({ message: 'Please provide a valid faq id' });
    }

    let body = { question, answer };
    let faq = await updateFaq(faq_id, removeEmptyFields(body));
    if (faq.succuss !== true) {
        return res.status(500).json({ message: faq.message });
    }
    return res.json({
        success: true,
        data: faq.data
    });
})

router.delete("/:id", requireAuth, async (req, res) => {
    const { id } = req.params || {};
    if (!id) {
        return res.status(401).json({ message: 'Please provide a valid question and answer' });
    }

    let faq = await deleteFaq(id);
    if (faq.succuss !== true) {
        return res.status(500).json({ message: faq.message });
    }
    return res.json({
        success: true,
        data: faq.data
    });
})

export default router;