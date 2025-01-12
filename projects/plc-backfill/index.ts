const port = process.env.PORT || 3000;
import { backfill } from "./backfill";
import { validate } from "./validate";
import { GovskyPrismaClient } from "@govsky/database";

const allowedExtensions = [".gov", ".gov.uk", ".gov.br"];

// Start process that keeps PLC directory up-to-date
backfill();

// Start process to validate relevant extensions
validate(allowedExtensions);
