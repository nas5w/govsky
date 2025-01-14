import { backfill } from "./backfill";
import { validate } from "./validate";
import { allowedExtensions } from "@govsky/config";

const BACKFILL_INTERVAL = 5 * 60_000;
const VALIDATION_INTERVAL = 5 * 60_000;

// Start process that keeps PLC directory up-to-date
console.log("Starting backfill cron");
setInterval(() => {
  backfill();
}, BACKFILL_INTERVAL);

// Start process to validate relevant extensions
console.log("Starting validate cron");
setInterval(() => {
  validate(allowedExtensions);
}, VALIDATION_INTERVAL);
