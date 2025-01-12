import Fastify, { RequestGenericInterface } from "fastify";
import { Cache } from "./cache";
import { GovskyPrismaClient } from "@govsky/database";
import { allowedExtensions } from "@govsky/config";
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
    console.log(request.params.domain, allowedExtensions);
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

    let handles: string[] | undefined = cache.get(extension);

    if (!handles) {
      // Cache miss, query database
      const where: Record<string, string> = { handlePart1 };
      if (handlePart2) where.handlePart2 = handlePart2;
      if (handlePart3) where.handlePart3 = handlePart3;
      const data = await prisma.user.findMany({
        where: { ...where, is_valid: true },
      });
      handles = data.map((el) => el.handle);
      // Five minute cache
      cache.set(extension, handles, 5 * 60_000);
    }

    reply.send({ handles });
  });

  fastify.listen({ port }, (err) => {
    if (err) throw err;
    console.log(`Fastify server listening at http://localhost:${port}`);
  });
}

setupServer();
