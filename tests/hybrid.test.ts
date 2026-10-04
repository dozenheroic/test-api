import { test } from "node:test";
import assert from "node:assert/strict";
import { API } from "../index";

test("POST /tickets — создание билета через реальный API", async () => {
    const api = new API();

    const response = await api.app.handle(
        new Request("http://localhost/tickets", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                title: "Hybrid Test Ticket",
                description: "Тест гибридного взаимодействия",
                price: 1500,
            }),
        })
    );

    assert.equal(response.status, 200);

    const ticket = await response.json();

    assert.equal(ticket.title, "Hybrid Test Ticket");
    assert.equal(ticket.description, "Тест гибридного взаимодействия");
    assert.equal(ticket.price, 1500);

    console.log("Создан билет:", ticket);
});

test("POST /tickets — отклонение некорректной цены", async () => {
    const api = new API();

    const response = await api.app.handle(
        new Request("http://localhost/tickets", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                title: "Invalid Ticket",
                description: "Тест негативного сценария",
                price: "1500",
            }),
        })
    );

    assert.notEqual(response.status, 200);

    console.log("Статус некорректного запроса:", response.status);
});

test("GET /tickets/:id — получение существующего билета через реальный API", async () => {
    const api = new API();

    const createResponse = await api.app.handle(
        new Request("http://localhost/tickets", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                title: "GET Integration Ticket",
                description: "Проверка получения через API",
                price: 2000,
            }),
        })
    );

    assert.equal(createResponse.status, 200);

    const createdTicket = await createResponse.json();

    const getResponse = await api.app.handle(
        new Request(`http://localhost/tickets/${createdTicket.id}`, {
            method: "GET",
        })
    );

    assert.equal(getResponse.status, 200);

    const ticket = await getResponse.json();

    assert.equal(ticket.id, createdTicket.id);
    assert.equal(ticket.title, "GET Integration Ticket");
    assert.equal(ticket.price, 2000);

    console.log("Получен билет через реальный API:", ticket);
});

test("GET /tickets/:id — несуществующий билет", async () => {
    const api = new API();

    const response = await api.app.handle(
        new Request("http://localhost/tickets/999999", {
            method: "GET",
        })
    );

    assert.equal(response.status, 404);

    const body = await response.json();

    assert.equal(body.error, "Билет не найден");

    console.log("Для несуществующего билета получен статус:", response.status);
});

test("DELETE /tickets/:id — удаление существующего билета", async () => {
    const api = new API();

    const createResponse = await api.app.handle(
        new Request("http://localhost/tickets", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                title: "Ticket To Delete",
                description: "Билет для проверки удаления",
                price: 500,
            }),
        })
    );

    assert.equal(createResponse.status, 200);

    const createdTicket = await createResponse.json();

    const deleteResponse = await api.app.handle(
        new Request(`http://localhost/tickets/${createdTicket.id}`, {
            method: "DELETE",
        })
    );

    assert.equal(deleteResponse.status, 200);

    const deletedTicket = await deleteResponse.json();

    assert.equal(deletedTicket.id, createdTicket.id);

    console.log("Удалён билет:", deletedTicket);
});

test("DELETE /tickets/:id — удаление несуществующего билета", async () => {
    const api = new API();

    const response = await api.app.handle(
        new Request("http://localhost/tickets/999999", {
            method: "DELETE",
        })
    );

    assert.notEqual(response.status, 200);

    console.log("Статус удаления несуществующего билета:", response.status);
});