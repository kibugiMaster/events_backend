import prisma from "../config/prisma_config.js";


export const getAllFaqs = async () => {
    try {
        const faqs = await prisma.faqs.findMany();
        if (!faqs.length) {
            return ({ success: false, message: 'No FAQs found' });
        }
        return { success: true, message: "FAQs fetched successfully", data: faqs }
    } catch (err) {
        console.log(err);
        return ({ succuss: false, message: "Internal server error" });
    }
}

export const createFaq = async (question, answer) => {
    try {
        const faq = await prisma.faqs.create({
            data: {
                question,
                answer
            }
        })
        return ({ succuss: true, message: "FAQ created successfully", data: faq })
    } catch (err) {
        console.log(err);
        return ({ succuss: false, message: "Internal server error" });
    }
}

export const updateFaq = async (id, body) => {
    try {
        const faq = await prisma.faqs.update({ where: { id }, data: body })
        return ({ succuss: true, message: "FAQ updated successfully", data: faq })
    } catch (err) {
        console.log(err);
        return ({ succuss: false, message: "Internal server error" });
    }
}

export const deleteFaq = async (id) => {
    try {
        const faq = await prisma.faqs.delete({ where: { id: Number(id) } })
        return ({ succuss: true, message: "FAQ deleted successfully", data: faq })
    } catch (err) {
        console.log(err);
        return ({ succuss: false, message: "Internal server error" });
    }
}