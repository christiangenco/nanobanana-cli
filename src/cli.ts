import { Command } from "commander";

const program = new Command();

program
  .name("nanobanana-cli")
  .version("0.1.0")
  .description("CLI for Gemini image generation (Nano Banana)");

program.parse();