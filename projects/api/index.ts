import Fastify, { RequestGenericInterface } from "fastify";
import { Cache } from "./cache.js";
import { GovskyPrismaClient } from "@govsky/database";
import { allowedExtensions } from "@govsky/config";
import { ApiUser } from "./types.js";
const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;

const prisma = new GovskyPrismaClient();
const cache = new Cache();

interface RequestGeneric extends RequestGenericInterface {
  Params: {
    domain: string;
  };
}

async function setupServer() {
  const fastify = Fastify();

  await fastify.register(import("@fastify/rate-limit"), {
    max: 30,
    timeWindow: "1 minute",
  });

  fastify.get<RequestGeneric>("/api/:domain", async (request, reply) => {
    reply.header("Access-Control-Allow-Origin", "*");

    const extension = allowedExtensions.find((ext) => {
      return (request.params?.domain || "").toLowerCase() === ext.toLowerCase();
    });

    if (!extension) {
      reply.code(404).send({
        error: `Extension must be one of: ${allowedExtensions.join(", ")}`,
      });
      return;
    }

    // Look up handles, with caching
    const [handlePart1, handlePart2, handlePart3] = extension
      .split(".")
      .reverse();

    let data: ApiUser[] | undefined = cache.get(extension);

    if (!data) {
      // Cache miss, query database
      const where: Record<string, string> = { handlePart1 };
      if (handlePart2) where.handlePart2 = handlePart2;
      if (handlePart3) where.handlePart3 = handlePart3;
      const users = await prisma.user.findMany({
        where: { ...where, is_valid: true },
      });
      data = users.map(({ handle, displayName, did }) => ({
        handle,
        displayName,
        did,
      }));
      // Five minute cache
      cache.set(extension, data, 5 * 60_000);
    }

    reply.send({ data });
  });

  fastify.listen({ port, host: process.env.HOST || "localhost" }, (err) => {
    if (err) throw err;
    console.log(`Fastify server listening at http://localhost:${port}`);
  });
}

setupServer();
