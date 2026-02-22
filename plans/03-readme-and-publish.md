# Step 3: README, git repo registration, and final polish

## Context

- Read `~/tools/nanobanana-cli/AGENTS.md` for command reference
- Read `~/tools/agent-toolkit/BEST_PRACTICES.md` for README conventions and registration steps

## Tasks

1. **Create README.md** in `~/tools/nanobanana-cli/`:
   - One-line description: "CLI for generating and editing images using Google's Gemini models (Nano Banana)"
   - Prerequisites: Node.js 18+, Gemini API key
   - Setup: clone, `npm install`, `npm run build`, `npm link`, copy `.env.example` → `.env` and add key
   - Full command reference with examples for all flags
   - Models section explaining Flash vs Pro
   - Aspect ratios and resolutions table
   - How it works: uses `@google/genai` SDK, Commander for CLI

2. **Update `~/tools/AGENTS.md`** — add `nanobanana-cli` entry to the tool index table:
   ```
   | [nanobanana-cli](nanobanana-cli/) | Gemini image generation and editing (Nano Banana) |
   ```
   Insert alphabetically (between `meta-ads-cli` and `namecheap-cli`).

3. **Add to sync.sh** — check `~/tools/agent-toolkit/sync.sh` for the repos list format and add `nanobanana-cli`.

4. **Create GitHub repo**:
   ```bash
   cd ~/tools/nanobanana-cli
   gh repo create christiangenco/nanobanana-cli --public --source=. --push
   ```

5. **Final end-to-end test**:
   ```bash
   nanobanana-cli --help
   nanobanana-cli generate "a tiny golden banana on a velvet cushion" -o /tmp/final-test.png
   file /tmp/final-test.png
   open /tmp/final-test.png  # macOS: view the image
   ```

6. **Commit**:
   ```bash
   git add -A
   git commit -m "docs: add README, register in toolkit index"
   git push
   ```

## Verification

- `nanobanana-cli --help` shows the generate command with all options
- `cat ~/tools/AGENTS.md` includes nanobanana-cli in the table
- `git -C ~/tools/nanobanana-cli log --oneline` shows all commits
- `gh repo view christiangenco/nanobanana-cli` shows the public repo
- End-to-end generation produces a valid PNG image
