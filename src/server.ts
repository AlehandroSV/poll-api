import { fastify } from "fastify";
import fastifyCors from "@fastify/cors";
import fastifyCookie from "@fastify/cookie";

import env from "./utils/env";
import { CreatePoll } from "./routes/Poll/createPoll";
import { GetPoll } from "./routes/Poll/getPoll";
import { VoteOnPoll } from "./routes/Poll/voteOnPoll";

const app = fastify();

app.register(fastifyCors, {
  origin: "*",
});

app.register(fastifyCookie, {
  secret: env.secretCookie,
  hook: "onRequest",
  parseOptions: {},
});

app.register(CreatePoll);
app.register(GetPoll);
app.register(VoteOnPoll);

app.listen({ port: env.port }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  console.log(`Server running at ${address}`);
  console.log(app.printRoutes());
});
