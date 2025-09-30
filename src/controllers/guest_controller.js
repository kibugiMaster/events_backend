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

export const getGuestById = async (id) => {
    try {
        const guest = await prisma.event_guests.findUnique({
            where: { id: Number(id) },
            include: {
                card_type: { select: { name: true } },
            }
        });
        let response = { ...guest, card_type: guest.card_type.name }
        return { success: true, data: response };
    } catch (err) {
        console.log("Error in getting guest by id", err);
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

export const updateGuestDetails = async (id, body) => {
    try {
        const updatedGuest = await prisma.event_guests.update({
            where: { id: Number(id) },
            data: body,
        });
        return { success: true, data: updatedGuest };
    } catch (err) {
        console.log("Error in updating guest details", err);
        return { success: false, message: "Something went wrong", data: err.message };
    }
}

export const deleteGuest = async (id) => {
    try {
        const deletedGuest = await prisma.event_guests.delete({
            where: { id: Number(id) },
        });
        return { success: true, data: deletedGuest };
    } catch (err) {
        console.log("Error in deleting guest", err);
        return { success: false, message: "Something went wrong", data: err.message };
    }
}

export const checkInGuest = async (access_code, event_id) => {
    try {
        let guest = await prisma.event_guests.findFirst({
            where: { access_code: access_code, is_checked: false, event_id: Number(event_id) },
            include: { card_type: { select: { name: true, value: true } } }
        })
        if (!guest) {
            return { success: false, message: "Access code not found or already checked in fully" };
        }

        // Check if guest can still check in
        if (guest.checkin_count < guest.card_type.value) {
            guest = await prisma.event_guests.update({
                where: { id: guest.id }, 
                data: {
                    checkin_count: { increment: 1 },
                    is_checked: guest.checkin_count + 1 >= guest.card_type.value, // mark true if this is the last allowed scan
                },
                include: {
                    card_type: { select: { name: true, value: true } }
                }
            });

            return { success: true, data: guest };
        } else {
            return { success: false, message: "This card has reached its maximum scans" };
        }
    } catch (err) {
        console.log("Error in checking in guest", err);
        return { success: false, message: "Something went wrong", data: err.message };
    }
}