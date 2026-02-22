# nanobanana-cli

CLI for generating and editing images using Google's Gemini models (Nano Banana)

## Prerequisites

- Node.js 18+
- Gemini API key from [AI Studio](https://aistudio.google.com/apikey)

## Setup

```bash
git clone https://github.com/christiangenco/nanobanana-cli.git
cd nanobanana-cli
npm install
npm run build
npm link
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY
```

## Usage

### Basic Generation

```bash
nanobanana-cli generate "a cat riding a skateboard"
nanobanana-cli generate "a majestic mountain landscape at sunset" -o landscape.png
```

### Image Editing

```bash
nanobanana-cli generate "put a hat on the cat" --image cat.png
nanobanana-cli generate "group photo" --image a.png --image b.png
```

### Advanced Options

```bash
# Set aspect ratio
nanobanana-cli generate "a sunset" --aspect 16:9

# Use pro model with higher resolution
nanobanana-cli generate "detailed artwork" --model gemini-3-pro-image-preview --size 2K

# Image-only output (no text description)
nanobanana-cli generate "abstract art" --no-text
```

## Command Reference

### `generate`

Generate or edit images with text prompts.

```
Usage: nanobanana-cli generate [options] <prompt>

Arguments:
  prompt                    Text description of desired image

Options:
  -o, --output <file>       Output filename (default: auto-generated)
  --model <model>           Model to use (default: gemini-2.5-flash-image)
  --aspect <ratio>          Aspect ratio (default: 1:1)
  --size <size>             Resolution: 1K, 2K, 4K (pro model only)
  --image <file>            Input image(s) for editing (can be used multiple times)
  --no-text                 Image-only output, no text description
  -h, --help                Display help
```

## Models

| Model | Description | Max Input Images | Available Resolutions |
|-------|-------------|-----------------|----------------------|
| `gemini-2.5-flash-image` | Fast, efficient (default) | 3 | 1K only (1024px) |
| `gemini-3-pro-image-preview` | Pro quality, thinking | 14 (5 high-fidelity) | 1K, 2K, 4K |

## Aspect Ratios

Supported aspect ratios: `1:1` (default), `2:3`, `3:2`, `3:4`, `4:3`, `4:5`, `5:4`, `9:16`, `16:9`, `21:9`

## Output Format

All commands output JSON to stdout:

```json
{"ok": true, "data": {"file": "output.png", "model": "gemini-2.5-flash-image", "text": "optional model description", "aspect_ratio": "1:1"}}
{"ok": false, "error": "error message"}
```

The generated image is saved to disk, with metadata sent to stdout.

## How It Works

- Built with TypeScript and Commander.js
- Uses Google's `@google/genai` SDK
- Supports both text-only prompts and image editing with multiple input images
- Automatically handles image encoding/decoding and file I/O
- Pro model supports higher resolutions and more input images

## Environment Variables

```env
GEMINI_API_KEY=your_api_key_here
```

Get your API key at https://aistudio.google.com/apikey