import { Command } from "commander";
import { generateCommand } from "./commands/generate.js";

const program = new Command();

// Helper for repeatable options
function collect(val: string, arr: string[]) {
  arr.push(val);
  return arr;
}

program
  .name("nanobanana-cli")
  .version("0.1.0")
  .description("CLI for Gemini image generation (Nano Banana)");

program.command("generate")
  .description("Generate or edit an image from a text prompt")
  .argument("<prompt>", "Text prompt describing the image to generate")
  .option("-o, --output <path>", "Output file path (default: auto-generated)")
  .option("-i, --image <path>", "Input image path (repeatable for multiple images)", collect, [])
  .option("--aspect <ratio>", "Aspect ratio (1:1, 2:3, 3:2, 3:4, 4:3, 4:5, 5:4, 9:16, 16:9, 21:9)")
  .option("--size <resolution>", "Image resolution: 1K, 2K, 4K (pro model only)")
  .option("--model <id>", "Model ID", "gemini-2.5-flash-image")
  .option("--no-text", "Request image-only output (no text description)")
  .action(generateCommand);

program.parse();