# Step 1: Scaffold the project

Set up the TypeScript project skeleton with all config files, following the standard `~/tools` CLI conventions.

## Context

- Read `~/tools/nanobanana-cli/AGENTS.md` for architecture and API details
- Read `~/tools/agent-toolkit/BEST_PRACTICES.md` for conventions

## Tasks

1. **Initialize package.json** in `~/tools/nanobanana-cli/`:
   ```json
   {
     "name": "nanobanana-cli",
     "version": "0.1.0",
     "type": "module",
     "bin": { "nanobanana-cli": "./bin/nanobanana-cli.js" },
     "scripts": {
       "build": "tsc",
       "dev": "tsx src/cli.ts"
     },
     "dependencies": {
       "@google/genai": "^1.42.0",
       "commander": "^13.1.0",
       "dotenv": "^16.4.7"
     },
     "devDependencies": {
       "@types/node": "^22.13.4",
       "tsx": "^4.19.3",
       "typescript": "^5.7.3"
     }
   }
   ```

2. **Create tsconfig.json**:
   ```json
   {
     "compilerOptions": {
       "target": "ES2022",
       "module": "Node16",
       "moduleResolution": "Node16",
       "outDir": "dist",
       "rootDir": "src",
       "strict": true,
       "esModuleInterop": true,
       "declaration": true,
       "sourceMap": true
     },
     "include": ["src"]
   }
   ```

3. **Create bin/nanobanana-cli.js**:
   ```js
   #!/usr/bin/env node
   import "../dist/cli.js";
   ```
   Make it executable: `chmod +x bin/nanobanana-cli.js`

4. **Create .gitignore**:
   ```
   .env
   .DS_Store
   node_modules/
   dist/
   ```

5. **Create .env.example**:
   ```
   GEMINI_API_KEY=
   ```

6. **Create src/config.ts** — loads dotenv from `~/tools/nanobanana-cli/.env` (use `path.resolve` with `import.meta.url` to find the project root, not `process.cwd()`). Exports `getApiKey()` that reads `GEMINI_API_KEY` or prints `{ok: false, error: "..."}` to stdout and exits with code 1.

7. **Create src/cli.ts** — minimal Commander program with name `nanobanana-cli`, version `0.1.0`, description `"CLI for Gemini image generation (Nano Banana)"`. No subcommands yet, just `program.parse()`.

8. **Run `npm install`**.

9. **Run `npm run build`** to verify TypeScript compiles.

10. **Run `npm link`** to make `nanobanana-cli` available globally.

11. **Git init and commit**:
    ```bash
    cd ~/tools/nanobanana-cli
    git init
    git add -A
    git commit -m "scaffold: project skeleton with config and CLI entry point"
    ```

## Verification

```bash
nanobanana-cli --help
# Should show: "CLI for Gemini image generation (Nano Banana)" with version 0.1.0
```
