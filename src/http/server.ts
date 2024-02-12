import { fastify } from "fastify";
import fastifyCors from "@fastify/cors";

import { CreatePoll } from "../routes/Poll/createPoll";

const app = fastify();

app.register(fastifyCors, {
  origin: "*",
});

app.register(CreatePoll);

app.listen({ port: 3333 }).then(() => {
  console.log("Rodando");
});
