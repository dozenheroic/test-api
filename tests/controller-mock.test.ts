import { test } from "node:test";
import assert from "node:assert/strict";

const mockRequire = require("mock-require");

const fakeTicket = {
    create: async ({ data }: any) => ({
        id: 999,
        ...data,
        createdAt: new Date().toISOString(),
    }),

    findUnique: async ({ where }: any) => ({
        id: where.id,
        title: "Mock ticket",
        description: "Тестовый билет",
        price: 100,
    }),

    findMany: async () => [
        {
            id: 999,
            title: "Mock ticket",
            description: "Тестовый билет",
            price: 100,
        },
    ],

    delete: async ({ where }: any) => ({
        id: where.id,
        title: "Deleted mock ticket",
        description: "Тестовый билет",
        price: 100,
    }),
};

class FakePrismaClient {
    ticket = fakeTicket;
}

mockRequire("@prisma/client", {
    PrismaClient: FakePrismaClient,
});

const { TicketController } = require("../scr/controllers/TicketController");

test("Controller → Mock Prisma: получение билета по ID", async () => {
    const ticket = await TicketController.getById({ id: 999 });

    assert.equal(ticket.id, 999);
    assert.equal(ticket.title, "Mock ticket");
    assert.equal(ticket.price, 100);

    console.log("Получен билет из Mock Prisma:", ticket);
});

test("Controller → Mock Prisma: создание билета", async () => {
    const ticket = await TicketController.create({
        title: "Mock Created Ticket",
        description: "Создание через Mock Prisma",
        price: 2500,
    });

    assert.equal(ticket.id, 999);
    assert.equal(ticket.title, "Mock Created Ticket");
    assert.equal(ticket.description, "Создание через Mock Prisma");
    assert.equal(ticket.price, 2500);

    console.log("Создан билет через Mock Prisma:", ticket);
});

test("Controller → Mock Prisma: отрицательная цена отклоняется", async () => {
    await assert.rejects(
        () =>
            TicketController.create({
                title: "Invalid Ticket",
                description: "Отрицательная цена",
                price: -100,
            }),
        {
            message: "Цена не может быть отрицательной",
        }
    );

    console.log("Отрицательная цена корректно отклонена");
});