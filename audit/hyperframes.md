# HyperFrames — Audit Report

## What is HyperFrames?

HyperFrames is an **AI-agent skill system** for video generation from HTML compositions. It is NOT a traditional library or CLI — it's orchestrated by an AI agent through structured skill files.

## Key Findings

### Architecture
- Skill files live in `.agents/skills/hyperframes/`
- Core CLI: `npx hyperframes` (npm package)
- Renders HTML compositions to MP4 video
- Uses headless Chrome for rendering

### Capabilities
| Capability | Status |
|---|---|
| Product launch / promo video | Available |
| Faceless explainer | Available |
| Motion graphics | Available |
| Music-to-video | Available |
| General video | Available (catch-all) |
| PR-to-video | Available |
| Embedded captions | Available |
| Talking-head recut | Available |
| Slideshow / deck | Available |
| Remotion port | Available |

### Commands
- `npx hyperframes init` — Scaffold project
- `npx hyperframes render` — Render composition to video
- `npx hyperframes publish` — Publish to stable URL
- `npx hyperframes check` — Validate compositions
- `npx hyperframes skills` — Install skill set
- `npx hyperframes skills update <name>` — Install specific workflow

### Configuration
- `hyperframes.json` — Project config
- `BRIEF.md` — Routing artifact (all confirmed fields)
- `STORYBOARD.md` — Optional storyboard
- Environment: `HYPERFRAMES_SKIP_SKILLS=1` for CI

### API Keys
- `HYPERFRAMES_API_KEY` — Main API key (for generative video)
- HeyGen OAuth — For AI presenter features
- Figma API — For Figma import

### Integration with Next.js
- Lives as agent skill, not runtime dependency
- Compositions are standalone HTML files
- Renders to MP4 via `npx hyperframes render`
- Can publish to stable public URLs

## FIRMA Integration Plan

### What we built (FASE 7)
1. **Media Model** — `src/types/media.ts` with normalized media types
2. **Tokko Adapter** — Converts Property media to normalized MediaItems
3. **Storyboard Generator** — Creates storyboards from real property images
4. **HyperFrames Adapter** — Wraps HyperFrames behind clean interface
5. **Video Generator** — Orchestrates the full pipeline
6. **API Endpoint** — `/api/media/generate-property-video`
7. **Property Video CTA** — UI for properties without Tokko video

### Architecture
```
Property (Tokko)
  ↓
Media Adapter (normalize)
  ↓
Storyboard Generator (select images, create scenes)
  ↓
HyperFrames Adapter (build BRIEF.md, invoke render)
  ↓
Video Output (MP4)
```

### Current Status
- HyperFrames CLI: NOT installed as project dependency
- Adapter: Mock mode (returns error when not configured)
- When `HYPERFRAMES_API_KEY` is set: Real adapter activates
- No automatic generation — manual trigger only

### Future Steps
1. Install HyperFrames: `npm install hyperframes`
2. Set `HYPERFRAMES_API_KEY` in `.env.local`
3. Run `npx hyperframes init` to scaffold
4. Test with 1 property (manual trigger)
5. If working, expand to all properties
