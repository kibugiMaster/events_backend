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

export const checkInGuest = async (access_code) => {
    try {
        let check = await prisma.event_guests.findFirst({ where: { access_code: access_code, is_checked: false }, include: { card_type: { select: { name: true, value: true } } } })
        // if (check) {
        //     check = await prisma.event_guests.update({
        //         where: { access_code: access_code },
        //         data: { is_checked: (check.checkin_count > check.card_type.value), checkin_count: { increment: 1 } },
        //     });
        // } else {
        //     return { success: false, message: "Access code not found" }
        // }
        // const checkedInGuest = check;
        return { success: true, data: check.checkin_count };
    } catch (err) {
        console.log("Error in checking in guest", err);
        return { success: false, message: "Something went wrong", data: err.message };
    }
}