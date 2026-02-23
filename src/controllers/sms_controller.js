import axios from 'axios';
import https from "https";
import { normalizePhoneNumber } from '../utils/helper.js';

export const sendWhatsappMessage = async () => {
    const url = process.env.WHATSAPP_API_URL;
    const api_key = process.env.WHATSAPP_API_KEY;
    const body = {
        "to": "255626506214",
        "text": "Hello from WasenderAPI!"
    }
    const header = {
        Authorization: `Bearer ${api_key}`,
        Content_Type: "application/json",
    };
}


export async function sendImage(req, res) {
    try {
        const api_key = process.env.WHATSAPP_API_KEY;

        const config = {
            method: 'POST',
            url: process.env.WHATSAPP_API_URL,
            headers: {
                'Authorization': `Bearer ${api_key}`,
                'Content-Type': 'application/json'
            },
            data: { "to": "+255626506214", "text": "Check out this image!", "imageUrl": "https://wasenderapi.com/logo.png" }
        };

        const response = await axios(config);
        console.log(response.data);
        return res.status(200).json({
            success: true,
            data: response.data
        })
    } catch (error) {
        console.log(`⚠️ Failed checking vehicle:`, error.message,);
        console.error("Data:", error.response.data);
        return res.status(500).json({
            success: false,
            data: error.response
        })
    }
}

export async function sendNormalText(req, res) {
    try {
        const { phone, message } = req.body || {};
        if (!phone || !message) {
            return res.status(400).json({ success: false, message: "Phone number and message are required" });
        }

        const encoded = Buffer
            .from(`${process.env.BEEM_API_KEY}:${process.env.BEEM_API_SECRET}`)
            .toString("base64");

        const url = "https://apisms.beem.africa/v1/send";

        const payload = {
            source_addr: "UZASASA",
            schedule_time: "",
            encoding: 0,
            message: message,
            recipients: [
                {
                    recipient_id: 1,
                    dest_addr: await normalizePhoneNumber(phone),
                },
            ],
        };

        const headers = {
            "Content-Type": "application/json",
            Authorization: `Basic ${encoded}`,
        };

        const response = await axios.post(url, payload, {
            headers,
            httpsAgent: new https.Agent({
                rejectUnauthorized: false, // Allow SSL if needed
            }),
        });

        console.log("📩 SMS RESPONSE:", response.data);
        if (response.data.successful === true) {
            return res.status(200).json({ success: true, message: "Message sent successfully" });
        }

        return res.status(400).json({ success: false, message: "Failed to send message", details: response.data });
    } catch (error) {
        console.error("sendNormalText error:", error?.response?.data || error.message || error);
        return res.status(500).json({ success: false, message: "Internal server error", status: 500 });
    }
}