import { GoogleGenAI } from "@google/genai";
import fs from "fs";
import path from "path";
import { getApiKey } from "../config.js";

// Helper to get MIME type from file extension
function getMimeType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case ".png": return "image/png";
    case ".jpg":
    case ".jpeg": return "image/jpeg";
    case ".gif": return "image/gif";
    case ".webp": return "image/webp";
    default: throw new Error(`Unsupported image format: ${ext}`);
  }
}

// Helper to slugify prompt for filename
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Helper to generate auto filename
function generateFilename(prompt: string): string {
  const slug = slugify(prompt.slice(0, 40));
  const timestamp = Math.floor(Date.now() / 1000);
  return `${slug}-${timestamp}.png`;
}

export async function generateCommand(prompt: string, opts: any) {
  try {
    console.error("Generating image...");
    
    const apiKey = getApiKey();
    const ai = new GoogleGenAI({ apiKey });
    
    // Build contents array
    const contents: any[] = [{ text: prompt }];
    
    // Add input images if provided
    for (const imagePath of opts.image || []) {
      if (!fs.existsSync(imagePath)) {
        throw new Error(`Image file not found: ${imagePath}`);
      }
      
      const imageBuffer = fs.readFileSync(imagePath);
      const base64Data = imageBuffer.toString("base64");
      const mimeType = getMimeType(imagePath);
      
      contents.push({
        inlineData: {
          mimeType,
          data: base64Data,
        },
      });
    }
    
    // Prepare API request
    const requestConfig: any = {
      model: opts.model,
      contents,
      config: {
        responseModalities: opts.noText ? ["IMAGE"] : ["TEXT", "IMAGE"],
        imageConfig: {},
      },
    };
    
    // Add optional image config
    if (opts.aspect) {
      requestConfig.config.imageConfig.aspectRatio = opts.aspect;
    }
    if (opts.size) {
      requestConfig.config.imageConfig.imageSize = opts.size;
    }
    
    // Make API call
    const response = await ai.models.generateContent(requestConfig);
    
    // Process response
    if (!response.candidates || !response.candidates[0] || !response.candidates[0].content || !response.candidates[0].content.parts) {
      throw new Error("No valid response from API");
    }
    
    let text = "";
    const outputFiles: string[] = [];
    let imageCount = 0;
    
    for (const part of response.candidates[0].content.parts) {
      if (part.text) {
        text += part.text;
      }
      
      if (part.inlineData && part.inlineData.data) {
        imageCount++;
        
        // Determine output filename
        let outputPath: string;
        if (opts.output) {
          // Use provided output path, adding suffix for multiple images
          if (imageCount > 1) {
            const ext = path.extname(opts.output);
            const base = opts.output.slice(0, -ext.length);
            outputPath = `${base}-${imageCount}${ext}`;
          } else {
            outputPath = opts.output;
          }
        } else {
          // Auto-generate filename
          if (imageCount > 1) {
            const autoName = generateFilename(prompt);
            const ext = path.extname(autoName);
            const base = autoName.slice(0, -ext.length);
            outputPath = `${base}-${imageCount}${ext}`;
          } else {
            outputPath = generateFilename(prompt);
          }
        }
        
        // Write image to file
        const buffer = Buffer.from(part.inlineData.data, "base64");
        fs.writeFileSync(outputPath, buffer);
        outputFiles.push(outputPath);
      }
    }
    
    // Output JSON result
    const result = {
      ok: true,
      data: {
        files: outputFiles,
        model: opts.model,
        text: text || null,
        aspect_ratio: opts.aspect || null,
        size: opts.size || null,
      },
    };
    
    console.log(JSON.stringify(result));
    
  } catch (error) {
    const errorResult = {
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    };
    
    console.log(JSON.stringify(errorResult));
    process.exit(1);
  }
}