# nanobanana-cli

CLI for generating and editing images using Google's Gemini image generation models.

## Environment

Requires `.env` with `GEMINI_API_KEY`. Get one at https://aistudio.google.com/apikey

## Commands

```bash
nanobanana-cli generate "a cat riding a skateboard"                     # Generate image, auto-named file
nanobanana-cli generate "a cat riding a skateboard" -o cat.png          # Save to specific file
nanobanana-cli generate "a cat riding a skateboard" --aspect 16:9       # Set aspect ratio
nanobanana-cli generate "a cat riding a skateboard" --size 2K           # Set resolution (pro model only)
nanobanana-cli generate "a cat riding a skateboard" --model gemini-3-pro-image-preview  # Use pro model
nanobanana-cli generate "put a hat on the cat" --image cat.png          # Edit existing image
nanobanana-cli generate "group photo" --image a.png --image b.png       # Multiple input images (up to 14)
nanobanana-cli generate "a sunset" --no-text                            # Image-only output (no text description)
```

## Models

| Model | Max input images | Resolutions |
|-------|-----------------|-------------|
| `gemini-2.5-flash-image` (default) | 3 | 1K only (1024px) |
| `gemini-3-pro-image-preview` | 14 (5 high-fidelity) | 1K, 2K, 4K |

## Aspect Ratios

`1:1` (default), `2:3`, `3:2`, `3:4`, `4:3`, `4:5`, `5:4`, `9:16`, `16:9`, `21:9`

## Output

JSON to stdout: `{"ok": true, "data": {"file": "output.png", "model": "...", "text": "...", "aspect_ratio": "1:1"}}` or `{"ok": false, "error": "message"}`
