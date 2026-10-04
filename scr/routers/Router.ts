import { Elysia, t } from "elysia";
import { TicketController } from "../controllers/TicketController";

export class Router {
    static tickets = new Elysia()
        .post(
            "/",
            async ({ body }) => TicketController.create(body),
            {
                body: t.Object({
                    title: t.String(),
                    description: t.String(),
                    price: t.Number(),
                }),
            }
        )
.get(
    "/:id",
    async ({ params, set }) => {
        try {
            return await TicketController.getById({
                id: Number(params.id),
            });
        } catch (error) {
            set.status = 404;

            return {
                error: "Билет не найден",
            };
        }
    },
    {
        params: t.Object({
            id: t.String(),
        }),
    }
)
        .get("/", async () => TicketController.getAll())
        .delete(
            "/:id",
            async ({ params }) => TicketController.deleteById({ id: Number(params.id) }),
            {
                params: t.Object({
                    id: t.String(),
                }),
            }
        );
}
