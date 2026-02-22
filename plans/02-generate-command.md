# Step 2: Implement the `generate` command

The core command: generate or edit images from a text prompt, optionally with input images.

## Context

- Read `~/tools/nanobanana-cli/AGENTS.md` for full API details, SDK usage pattern, models, aspect ratios, and output format
- Read `~/tools/nanobanana-cli/src/config.ts` for how the API key is loaded
- Read `~/tools/nanobanana-cli/src/cli.ts` for the existing Commander setup

## Tasks

1. **Create src/commands/generate.ts**

   Implements the image generation logic:

   **Input assembly** — Build a `contents` array for the API:
   - Always include `{ text: prompt }` from the positional `<prompt>` argument
   - If `--image <path>` is provided (repeatable), read each file, base64-encode it, detect MIME type from extension (png→`image/png`, jpg/jpeg→`image/jpeg`, gif→`image/gif`, webp→`image/webp`), and add `{ inlineData: { mimeType, data } }` to contents

   **API call** using `@google/genai` SDK:
   ```typescript
   import { GoogleGenAI } from "@google/genai";

   const ai = new GoogleGenAI({ apiKey });
   const response = await ai.models.generateContent({
     model: opts.model,
     contents: contents,
     config: {
       responseModalities: opts.noText ? ["IMAGE"] : ["TEXT", "IMAGE"],
       imageConfig: {
         ...(opts.aspect && { aspectRatio: opts.aspect }),
         ...(opts.size && { imageSize: opts.size }),
       },
     },
   });
   ```

   **Response processing**:
   - Iterate `response.candidates[0].content.parts`
   - Collect any `part.text` into a `text` string
   - For `part.inlineData`, decode base64 to a Buffer and write to the output file
   - If multiple images are returned, save them with numbered suffixes (e.g., `output-1.png`, `output-2.png`)

   **Output file naming**:
   - If `--output` / `-o` is provided, use that path
   - Otherwise, auto-generate a filename: slugify the first 40 chars of the prompt + timestamp + `.png` (e.g., `a-cat-riding-a-skateboard-1708561234.png`)
   - Save in current working directory

   **Stdout output** (JSON envelope):
   ```json
   {"ok": true, "data": {"files": ["output.png"], "model": "gemini-2.5-flash-image", "text": "...", "aspect_ratio": "1:1", "size": null}}
   ```

   **Error handling**:
   - Wrap the API call in try/catch
   - On error, output `{ok: false, error: message}` to stdout and exit 1
   - Log progress messages to stderr (e.g., `"Generating image..."`)

2. **Wire into src/cli.ts**:
   ```typescript
   program.command("generate")
     .description("Generate or edit an image from a text prompt")
     .argument("<prompt>", "Text prompt describing the image to generate")
     .option("-o, --output <path>", "Output file path (default: auto-generated)")
     .option("-i, --image <path>", "Input image path (repeatable for multiple images)", collect, [])
     .option("--aspect <ratio>", "Aspect ratio (1:1, 2:3, 3:2, 3:4, 4:3, 4:5, 5:4, 9:16, 16:9, 21:9)")
     .option("--size <resolution>", "Image resolution: 1K, 2K, 4K (pro model only)")
     .option("--model <id>", "Model ID", "gemini-2.5-flash-image")
     .option("--no-text", "Request image-only output (no text description)")
     .action(async (prompt, opts) => { ... });
   ```

   The `collect` helper for repeatable `--image`:
   ```typescript
   function collect(val: string, arr: string[]) {
     arr.push(val);
     return arr;
   }
   ```

3. **Build**: `npm run build`

4. **Commit**:
   ```bash
   git add -A
   git commit -m "feat: add generate command for text-to-image and image editing"
   ```

## Verification

```bash
# Requires GEMINI_API_KEY in .env

# Basic text-to-image
nanobanana-cli generate "a friendly robot waving hello" -o /tmp/robot.png
file /tmp/robot.png
# Should say: PNG image data

# With aspect ratio
nanobanana-cli generate "a panoramic mountain landscape" --aspect 16:9 -o /tmp/landscape.png

# With input image (image editing)
nanobanana-cli generate "add a party hat to this robot" --image /tmp/robot.png -o /tmp/robot-hat.png

# Auto-named output
nanobanana-cli generate "a tiny banana" | jq '.data.files'
# Should print array with auto-generated filename

# Pro model with resolution
nanobanana-cli generate "detailed botanical illustration" --model gemini-3-pro-image-preview --size 2K -o /tmp/botanical.png
```
