# nanobanana-cli

CLI for generating and editing images using Google's Gemini image generation models (Nano Banana). Wraps the `@google/genai` SDK.

## Commands

```bash
nanobanana-cli generate "a cat riding a skateboard"                     # Generate image, save to auto-named file
nanobanana-cli generate "a cat riding a skateboard" -o cat.png          # Save to specific file
nanobanana-cli generate "a cat riding a skateboard" --aspect 16:9       # Set aspect ratio
nanobanana-cli generate "a cat riding a skateboard" --size 2K           # Set resolution (1K, 2K, 4K — pro model only)
nanobanana-cli generate "a cat riding a skateboard" --model gemini-3-pro-image-preview  # Use pro model
nanobanana-cli generate "put a hat on the cat" --image cat.png          # Edit existing image
nanobanana-cli generate "group photo" --image a.png --image b.png       # Multiple input images (up to 14)
nanobanana-cli generate "a sunset" --no-text                            # Image-only output (no text description)
```

## Architecture

```
nanobanana-cli/
├── bin/nanobanana-cli.js    # #!/usr/bin/env node → import "../dist/cli.js"
├── src/
│   ├── cli.ts               # Commander program definition
│   ├── config.ts            # dotenv loading, env var validation
│   └── commands/
│       └── generate.ts      # Image generation: text+images → image file
├── package.json             # "type": "module", bin field
├── tsconfig.json
├── .env                     # GEMINI_API_KEY (gitignored)
├── .env.example
├── .gitignore
├── AGENTS.md
└── README.md
```

## API Details

Uses `@google/genai` SDK (`GoogleGenAI` class).

### Models

| Model | Description | Max input images | Resolutions |
|-------|-------------|-----------------|-------------|
| `gemini-2.5-flash-image` | Fast, efficient (default) | 3 | 1K only (1024px) |
| `gemini-3-pro-image-preview` | Pro quality, thinking | 14 (5 high-fidelity) | 1K, 2K, 4K |

### Aspect Ratios

`1:1` (default), `2:3`, `3:2`, `3:4`, `4:3`, `4:5`, `5:4`, `9:16`, `16:9`, `21:9`

### SDK Usage Pattern

```typescript
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey });
const response = await ai.models.generateContent({
  model: "gemini-2.5-flash-image",
  contents: [
    { text: "prompt text" },
    // Optional input images:
    { inlineData: { mimeType: "image/png", data: base64Data } },
  ],
  config: {
    responseModalities: ["TEXT", "IMAGE"],  // or ["IMAGE"] for image-only
    imageConfig: {
      aspectRatio: "16:9",     // optional
      imageSize: "2K",         // optional, pro model only (1K, 2K, 4K)
    },
  },
});

// Response parts contain text and/or images
for (const part of response.candidates[0].content.parts) {
  if (part.text) console.log(part.text);
  if (part.inlineData) {
    const buffer = Buffer.from(part.inlineData.data, "base64");
    fs.writeFileSync("output.png", buffer);
  }
}
```

## Output Format

```json
{"ok": true, "data": {"file": "output.png", "model": "gemini-2.5-flash-image", "text": "optional model description", "aspect_ratio": "1:1"}}
{"ok": false, "error": "message"}
```

The generated image is written to disk. The JSON metadata goes to stdout.

## Environment

Requires `.env` with `GEMINI_API_KEY`. Get one at https://aistudio.google.com/apikey
