import { fastify } from "fastify";
import cors from "@fastify/cors";
import cookies from "@fastify/cookie";
import webSocket from "@fastify/websocket";

import env from "./utils/env";
import { CreatePoll } from "./routes/Poll/createPoll";
import { GetPoll } from "./routes/Poll/getPoll";
import { VoteOnPoll } from "./routes/Poll/voteOnPoll";
import { PollResult } from "./ws/Poll/pollResult";

const app = fastify();

app.register(webSocket);

app.register(cors, {
  origin: "*",
});

app.register(cookies, {
  secret: env.secretCookie,
  hook: "onRequest",
  parseOptions: {},
});

app.register(CreatePoll);
app.register(GetPoll);
app.register(VoteOnPoll);
app.register(PollResult);

app.listen({ port: env.port }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  console.log(`Server running at ${address}`);
  console.log(app.printRoutes());
});
