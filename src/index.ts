import "dotenv/config";
import { start } from "./server";

start().catch(err => {
  console.error("Fatal error:", err);
  process.exit(1);
});
