import * as http from "http";
const port = process.env.PORT || 3000;
import { Cache } from "./cache";
import { GovskyPrismaClient } from "@govsky/database";

const allowedExtensions = [".gov", ".gov.uk", ".gov.br"];

// Simple HTTP server for API
const prisma = new GovskyPrismaClient();

const cache = new Cache();

http
  .createServer(async function (req, res) {
    const extension = allowedExtensions.find((ext) => {
      return new RegExp(`^/api/${ext}\$`, "i").test(req.url || "");
    });

    if (!extension) {
      res.writeHead(400, { "Content-Type": "application.json" });
      res.write(
        JSON.stringify({
          error: `Extension must be one of: ${allowedExtensions.join(", ")}`,
        })
      );
      res.end();
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

    res.writeHead(200, { "Content-Type": "application/json" });
    res.write(JSON.stringify({ handles }));
    res.end();
  })
  .listen(port, () => {
    console.log(`App running on port ${port}`);
  });
