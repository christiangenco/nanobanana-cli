import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Find project root directory using import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

// Load .env from project root
dotenv.config({ path: path.join(projectRoot, ".env") });

export function getApiKey(): string {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    console.log(JSON.stringify({ ok: false, error: "GEMINI_API_KEY not found in .env file" }));
    process.exit(1);
  }
  
  return apiKey;
}