import prisma from "../config/prisma_config.js";


export const getAllGuests = async (eventId) => {
    try {
        let guests = await prisma.event_guests.findMany({
            where: { event_id: Number(eventId) },
            include: {
                card_type: { select: { name: true } },
            }
        });
        let response = guests.map((guest) => ({
            ...guest,
            card_type: guest.card_type.name,
        }))
        return { success: true, data: response };
    } catch (err) {
        console.log("Error in getting all the guests", err);
        return { success: false, message: "Something went wrong", data: err.message };
    }
}

export const addNewGuest = async (body) => {
    try {
        const newGuest = await prisma.event_guests.create({
            data: body,
        });
        return { success: true, data: newGuest };
    } catch (err) {
        console.log("Error in adding a new guest", err);
        return { success: false, message: "Something went wrong", data: err.message };
    }
}

export const checkIfGuestExists = async (phone, eventId) => {
    try {
        const existingGuest = await prisma.event_guests.findFirst({ where: { phone: phone, event_id: Number(eventId) } });
        if (existingGuest) {
            return true;
        }
        else {
            return false;
        }
    } catch (err) {
        console.log("Error in checking if guest exists", err);
        return false;
    }
}