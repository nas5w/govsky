import { AtpAgent } from "@atproto/api";
import { GovskyPrismaClient } from "@govsky/database";

const agent = new AtpAgent({ service: "https://public.api.bsky.app" });

const prisma = new GovskyPrismaClient();

export function validate(extensions: string[]) {
  runValidation(extensions).catch((e) => {
    console.error("Failed validation run", e);
  });
}

async function runValidation(extensions: string[]) {
  console.log("Running handle validations...");

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

  const actors: { did: string; handle: string; displayName?: string }[] = [];
  while (toValidate.length) {
    const lookup = await agent.getProfiles({
      actors: toValidate.splice(0, 25).map((el) => el.did),
    });
    actors.push(
      ...lookup.data.profiles.map(({ did, handle, displayName }) => ({
        did,
        handle,
        displayName,
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
        displayName: actor.displayName || null,
        validated_at: new Date(),
      },
    });
  }
}
