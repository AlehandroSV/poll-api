import { FastifyInstance } from "fastify";
import { GetPollParamsSchema } from "../../validators/Poll/GetPoll";
import { voting } from "../../utils/votingPubSub";

export async function PollResult(app: FastifyInstance) {
  console.log("a");

  app.get(
    "/poll/:pollId/result",
    { websocket: true },
    async (connection, req) => {
      const { pollId } = await GetPollParamsSchema.validate(req.params, {
        abortEarly: false,
      });

      voting.subscribe(pollId, (message) => {
        connection.socket.send(JSON.stringify(message));
      });
    }
  );
}
