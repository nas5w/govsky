import { backfill } from "./backfill";
import { validate } from "./validate";
import { allowedExtensions } from "@govsky/config";

// Start process that keeps PLC directory up-to-date
backfill();

// Start process to validate relevant extensions
validate(allowedExtensions);
