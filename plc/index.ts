import http from "http";
const port = process.env.PORT || 3000;
import { backfill } from "./backfill";

// Start process that keeps PLC directory up-to-date
backfill();

// Simple HTTP server for API
http
  .createServer(function (req, res) {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.write("Hello world");
    res.end();
  })
  .listen(port, () => {
    console.log(`App running on port ${port}`);
  });
