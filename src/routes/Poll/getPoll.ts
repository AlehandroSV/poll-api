import { FastifyInstance } from "fastify";
import { ValidationError } from "yup";

import { prisma } from "../../utils/prisma";
import { GetPollSchema } from "../../validators/Poll/GetPoll";

export async function GetPoll(app: FastifyInstance) {
  app.get("/poll/:pollId", async (req, res) => {
    try {
      const validatedParams = await GetPollSchema.validate(req.params, {
        abortEarly: false,
      });

      const data = await prisma.poll.findMany({
        where: {
          id: validatedParams.pollId,
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

      res.status(200).send(data);
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
