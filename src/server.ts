import { fastify } from "fastify";
import fastifyCors from "@fastify/cors";

import env from "./utils/env";
import { CreatePoll } from "./routes/Poll/createPoll";

const app = fastify();

app.register(fastifyCors, {
  origin: "*",
});

app.register(CreatePoll);

app.listen({ port: env.port }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  console.log(`Server running at ${address}`);
  console.log(app.printRoutes());
});
