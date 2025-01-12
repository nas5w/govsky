import { AtpAgent } from "@atproto/api";
import { PrismaClient } from "@prisma/client";

const VALIDATION_INTERVAL = 5 * 60_000;

const agent = new AtpAgent({ service: "https://public.api.bsky.app" });

const prisma = new PrismaClient();

export function validate(extensions: string[]) {
  runValidation(extensions);
  setInterval(() => {
    runValidation(extensions);
  }, VALIDATION_INTERVAL);
}

async function runValidation(extensions: string[]) {
  const toValidate: { id: number; handle: string; did: string }[] = [];

  for (const extension of extensions) {
    const [handlePart1, handlePart2, handlePart3] = extension
      .split(".")
      .reverse();

    const where: Record<string, string> = { handlePart1 };
    if (handlePart2) where.handlePart2 = handlePart2;
    if (handlePart3) where.handlePart3 = handlePart3;

    const data = await prisma.user.findMany({ where });

    toValidate.push(
      ...data.map(({ id, handle, did }) => ({ id, handle, did }))
    );
  }

  const validationMap = toValidate.reduce((acc, el) => {
    acc[el.did] = { handle: el.handle, id: el.id };
    return acc;
  }, {} as Record<string, { handle: string; id: number }>);

  const actors: { did: string; handle: string }[] = [];
  while (toValidate.length) {
    const lookup = await agent.getProfiles({
      actors: toValidate.splice(0, 25).map((el) => el.did),
    });
    actors.push(
      ...lookup.data.profiles.map(({ did, handle }) => ({
        did,
        handle,
      }))
    );
  }

  for (const actor of actors) {
    const valid =
      actor.handle.toLowerCase() ===
      validationMap[actor.did].handle.toLowerCase();

    await prisma.user.update({
      where: {
        id: validationMap[actor.did].id,
      },
      data: {
        is_valid: valid,
        validated_at: new Date(),
      },
    });
  }
}
