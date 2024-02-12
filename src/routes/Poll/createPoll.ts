import { FastifyInstance } from "fastify";
import { ValidationError } from "yup";

import { prisma } from "../../utils/prisma";
import { CreatePollBodySchema } from "../../validators/Poll/CreatePoll";

export async function CreatePoll(app: FastifyInstance) {
  app.post("/poll", async (req, res) => {
    try {
      const { title, options } = await CreatePollBodySchema.validate(req.body, {
        abortEarly: false,
      });

      const data = await prisma.poll.create({
        data: {
          title,
          options: {
            createMany: {
              data: options.map((option) => {
                return {
                  title: option,
                };
              }),
            },
          },
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
          message: "Tivemos um erro ao criar a enquete.",
        });
      }
    }
  });
}
