import { FastifyInstance } from "fastify";
import { ValidationError } from "yup";

import { prisma } from "../../utils/prisma";
import { GetPollParamsSchema } from "../../validators/Poll/GetPoll";
import { redis } from "../../utils/redis";

export async function GetPoll(app: FastifyInstance) {
  app.get("/poll/:pollId", async (req, res) => {
    try {
      const { pollId } = await GetPollParamsSchema.validate(req.params, {
        abortEarly: false,
      });

      const data = await prisma.poll.findUnique({
        where: {
          id: pollId,
        },
        include: {
          options: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      });

      if (!data) {
        return res.status(400).send({
          status: "not-found",
          message: "Enquete não encontrada.",
        });
      }

      const result = await redis.zrange(pollId, 0, -1, "WITHSCORES");

      const votes = result.reduce((obj, line, index) => {
        if (index % 2 === 0) {
          const score = result[index + 1];

          Object.assign(obj, { [line]: Number(score) });
        }

        return obj;
      }, {} as Record<string, number>);

      res.status(200).send({
        poll: {
          id: data.id,
          title: data.title,
          options: data.options.map((option) => {
            return {
              id: option.id,
              title: option.title,
              score: option.id in votes ? votes[option.id] : 0,
            };
          }),
        },
      });
    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(400).send({
          status: "error",
          errors: error.inner.map((e) => ({
            path: e.path,
            message: e.message,
          })),
          message: "Houve um erro de validação.",
        });
      } else {
        res.status(500).send({
          status: "error",
          message: "Tivemos um erro ao resgatar a enquete.",
        });
      }
    }
  });
}
