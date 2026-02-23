import axios from 'axios';
import https from "https";
import { normalizePhoneNumber } from '../utils/helper.js';

export const sendWhatsappMessage = async () => {
    // const accountSid = 'AC6cd6a07b27e2e5bc03611168851a7f40';
    // const authToken = 'cea367acd6d9c25188c8528d9e69f8c6';
    // const client = require('twilio')(accountSid, authToken);

    // client.messages
    //     .create({
    //         from: 'whatsapp:+14155238886',
    //         contentSid: 'HX350d429d32e64a552466cafecbe95f3c',
    //         contentVariables: '{"1":"12/1","2":"3pm"}',
    //         to: 'whatsapp:+255626506214'
    //     })
    //     .then(message => console.log(message.sid))
    //     .done();

    // const accountSid = 'AC6cd6a07b27e2e5bc03611168851a7f40';
    // const authToken = '[AuthToken]';
    // const client = require('twilio')(accountSid, authToken);

    // client.messages
    //     .create({
    //         body: 'Your appointment is coming up on July 21 at 3PM nice',
    //         from: 'whatsapp:+14155238886',
    //         to: 'whatsapp:+255626506214'
    //     })
    //     .then(message => console.log(message.sid))
    //     .done();

    const url = "https://www.wasenderapi.com/api/send-message";
    const api_key = "cab709175a00398167597df6df5efc1ba5063bd785b32d3b65d50dca9d3ce43b"
    const body = {
        "to": "255626506214",
        "text": "Hello from WasenderAPI!"
    }
    const header = {
        Authorization: `Bearer ${api_key}`,
        Content_Type: "application/json",
    };
}

// 201 - CREATED - The request was successful.We created a new resource and the response body contains the representation.
// {
//     "account_sid": "AC6cd6a07b27e2e5bc03611168851a7f40",
//         "api_version": "2010-04-01",
//             "body": "Your appointment is coming up on 12/1 at 3pm",
//                 "date_created": "Mon, 16 Feb 2026 12:48:12 +0000",
//                     "date_sent": null,
//                         "date_updated": "Mon, 16 Feb 2026 12:48:12 +0000",
//                             "direction": "outbound-api",
//                                 "error_code": null,
//                                     "error_message": null,
//                                         "from": "whatsapp:+14155238886",
//                                             "messaging_service_sid": null,
//                                                 "num_media": "0",
//                                                     "num_segments": "1",
//                                                         "price": null,
//                                                             "price_unit": null,
//                                                                 "sid": "MM99973bf4cc6a716fe4c4f220069318c6",
//                                                                     "status": "queued",
//                                                                         "subresource_uris": {
//         "media": "/2010-04-01/Accounts/AC6cd6a07b27e2e5bc03611168851a7f40/Messages/MM99973bf4cc6a716fe4c4f220069318c6/Media.json"
//     },
//     "to": "whatsapp:+255626506214",
//         "uri": "/2010-04-01/Accounts/AC6cd6a07b27e2e5bc03611168851a7f40/Messages/MM99973bf4cc6a716fe4c4f220069318c6.json"
// }


export async function sendImage(req, res) {
    try {
        const api_key = "cab709175a00398167597df6df5efc1ba5063bd785b32d3b65d50dca9d3ce43b"

        const config = {
            method: 'POST',
            url: 'https://www.wasenderapi.com/api/send-message',
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