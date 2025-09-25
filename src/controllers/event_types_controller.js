import prisma from "../config/prisma_config.js";


export const getEventTypes = async () => {
    try {
        const eventTypes = await prisma.event_types.findMany();
        return { success: true, data: eventTypes };
    } catch (err) {
        console.log("Error in getting all Event Types", err);
        return { success: false, message: "Internal Server Error", data: err.message };
    }
}

export const createEventType = async (body) => {
    try {
        const eventType = await prisma.event_types.create({
            data: body,
        });

        return { success: true, data: eventType };
    } catch (err) {
        console.log("Error in creating new EventType", err);
        return { success: false, message: "Internal Server Error", data: err.message };
    }
}

export const updateEventType = async (id, body) => {
    try {
        const updatedEventType = await prisma.event_types.update({ where: { id }, data: body });
        return { success: true, data: updatedEventType };
    } catch (err) {
        console.log(`Error in updating EventType with ID ${id}`, err);
        return { success: false, message: "Internal Server Error", data: err.message };
    }
}

export const deleteEventType = async (id) => {
    try {
        const deletedEventType = await prisma.event_types.delete({ where: { id } });
        return { success: true, data: deletedEventType };
    } catch (err) {
        console.log(`Error in deleting EventType with ID ${id}`, err);
        return { success: false, message: "Internal Server Error", data: err.message };
    }
}

export const getEventTypeById = async (id) => {
    try {
        const eventType = await prisma.event_types.findUnique({ where: { id } });
        return { success: true, data: eventType };
    } catch (err) {
        console.log(`Error in getting EventType with ID ${id}`, err);
        return { success: false, message: "Internal Server Error", data: err.message };
    }
}

export const getEventCardTypes = async (id) => {
    try {
        const card = await prisma.card_types.findMany({ select: { id: true, name: true }, where: { event_type_id: id } });
        return { success: true, data: card };
    } catch (err) {
        console.log("Error in getting all Event Cards Types", err);
        return { success: false, message: "Internal Server Error", data: err.message };
    }
}

export const createEventCardTypes = async (data) => {
    try {
        const card = await prisma.card_types.create({ data: data });
        return { success: true, data: card };
    } catch (err) {
        console.log("Error in getting all Event Cards Types", err);
        return { success: false, message: "Internal Server Error", data: err.message };
    }
}

export const checkEventTypeExists = async (name) => {
    try {
        const eventType = await prisma.event_types.findFirst({ where: { name } });
        if (eventType) {
            return true;
        };
        return false;
    } catch (err) {
        console.log(`Error in checking EventType with Name ${name} exists`, err);
        return false;
    }
}

export const checkCardTypeExists = async (name, eventId) => {
    try {
        const cardType = await prisma.card_types.findFirst({ where: { AND: [{ name }, { event_type_id: eventId }] } });
        if (cardType) {
            return true;
        };
        return false;
    } catch (err) {
        console.log(`Error in checking Card Type with Name ${name} and Event Id ${eventId} exists`, err);
    }
}