import { FastifyInstance } from "fastify";
import { ValidationError } from "yup";
import { randomUUID } from "crypto";

import { prisma } from "../../utils/prisma";
import {
  VotePollBodySchema,
  VotePollParamsSchema,
} from "../../validators/Poll/VotePoll";

export async function VoteOnPoll(app: FastifyInstance) {
  app.post("/poll/:pollId/votes", async (req, res) => {
    try {
      const { pollId } = await VotePollParamsSchema.validate(req.params, {
        abortEarly: false,
      });

      const { pollOptionId } = await VotePollBodySchema.validate(req.body, {
        abortEarly: false,
      });

      let { sessionId } = req.cookies;

      if (sessionId) {
        const userPreviousVoteOnPoll = await prisma.vote.findUnique({
          where: {
            sessionId_pollId: {
              pollId,
              sessionId,
            },
          },
        });

        if (
          userPreviousVoteOnPoll &&
          userPreviousVoteOnPoll?.pollOptionId !== pollOptionId
        ) {
          await prisma.vote.delete({
            where: {
              id: userPreviousVoteOnPoll.id,
            },
          });
        } else if (userPreviousVoteOnPoll) {
          return res.status(400).send({
            status: "error",
            message: "Você não pode votar novamente nessa enquete",
          });
        }
      }

      if (!sessionId) {
        sessionId = randomUUID();

        res.setCookie("sessionId", sessionId, {
          path: "/",
          maxAge: 60 * 60 * 24 * 30, // 30 days
          signed: true,
          httpOnly: true,
        });
      }

      const data = await prisma.vote.create({
        data: {
          sessionId,
          pollId,
          pollOptionId,
        },
      });

      res.status(201).send(data);
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
          message: "Tivemos um erro ao registrar seu voto na enquete.",
        });
      }
    }
  });
}
