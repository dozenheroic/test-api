import dotenv from "dotenv";
import { Elysia } from "elysia";
import { node } from "@elysiajs/node";
import cors from "@elysiajs/cors";
import { Router } from "./scr/routers/Router";

export class API {
  public app = new Elysia({ adapter: node() });

  constructor() {
    dotenv.config();
    this.useMiddlewares();
    this.useRoutes();
  }

  private useMiddlewares() {
    this.app.use(cors());
  }

  private useRoutes() {
    this.app.group("/tickets", (app) => app.use(Router.tickets));
  }

  async init() {
    return this.app.listen(process.env.PORT || 5000);
  }
}

if (require.main === module) {
  const api = new API();

  api.init().then(() =>
    console.log(`Server running at: ${process.env.PORT || 5000}`)
  );
}