import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class TicketController {
    static async create({
        title,
        description,
        price,
    }: {
        title: string;
        description: string;
        price: number;
    }) {
        if (price < 0) {
            throw new Error("Цена не может быть отрицательной");
        }

        return prisma.ticket.create({
            data: { title, description, price },
        });
    }

   static async getById({ id }: { id: number }) {
    const ticket = await prisma.ticket.findUnique({
        where: { id },
    });

    if (!ticket) {
        throw new Error("Билет не найден");
    }

    return ticket;
}

    static async getAll() {
        return prisma.ticket.findMany();
    }

    static async deleteById({ id }: { id: number }) {
        return prisma.ticket.delete({
            where: { id },
        });
    }
}