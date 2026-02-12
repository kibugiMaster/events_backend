import prisma from "../config/prisma_config.js";


export const getAllEvents = async (user_id) => {
    try {
        const events = await prisma.events.findMany({
            where: { user_id: user_id }, include: {
                user: { select: { full_name: true, email: true, phone: true } },
                _count: {
                    select: {
                        event_guests: true,
                        event_gallery: true,
                    },
                },
            },
        });
        const formatted = events.map(({ _count, ...rest }) => ({
            ...rest,
            total_user: _count.event_guests,
            total_media: _count.event_gallery,
        }));

        return {
            success: true,
            data: formatted
        };
    } catch (err) {
        console.log("Error in getting all events", err);
        return { success: false, message: "Internal Server Error" };
    }
}

export const getSingleEvent = async (id, user_id) => {
    try {
        const event = await prisma.events.findFirst({ where: { id: Number(id), user_id: user_id } });
        if (!event) {
            return { success: false, message: "No such event exists." }
        }
        return {
            success: true,
            data: event
        };
    } catch (err) {
        console.log("Error in getting a single event", err);
        throw new Error(err.message);
    }
}

export const createEvent = async (eventData) => {
    try {
        const event = await prisma.events.create({
            data: eventData
        });
        return {
            success: true,
            data: event
        };
    } catch (err) {
        console.log("Error in creating an event", err);
        throw new Error(err.message);
    }
}

