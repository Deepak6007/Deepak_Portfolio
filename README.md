# Bojjagani Deepak — portfolio

Static site for GitHub Pages: https://deepak6007.github.io/Deepak_Portfolio/

No build step. Upload the files as they are; keep every folder next to `index.html`.

```
index.html          the page
CLAUDE.md           project brief that Claude Code reads automatically
.claude/agents/     Claude Code agents (see below)
.claude/commands/   Claude Code slash commands (/preview)
tools/              asset scripts: model compression, inspection, cut-outs
css/style.css       all styling (colours and fonts at the top)
js/main.js          glass glow, reveals, case studies, lightbox, brief builder
js/viewer.js        3D viewers (three.js, bundled in vendor/)
models/             web-optimised GLB models (bike, wheel, joystick)
img/work/           renders and process boards from Portfolio 2026
img/studies/        cut-out models for the More studies cards
img/icons/          tool icons (inlined as an SVG sprite in index.html)
files/              résumé PDF
fonts/              Archivo variable font (OFL)
apps-script/Code.gs optional Google Sheet inbox for briefs
```

## Common edits
- **Contact details**: WhatsApp number and email are at the top of `js/main.js` and in the "Or reach me directly" list in `index.html`.
- **Availability badge**: search `Available for freelance projects` in `index.html`.
- **Add a photo**: export a JPG/WebP about 1600 px on the long side into `img/photo/`, then copy one `<li>` in the photography list.
- **Log briefs to a Google Sheet**: follow the steps at the top of `apps-script/Code.gs`, then paste the web-app URL into `SHEET_ENDPOINT` in `js/main.js`.

## Preview on your laptop
ES modules don't run from a double-clicked file. In this folder run:
`python -m http.server 8000` and open http://localhost:8000

## Working with Claude Code
Open this folder in Claude Code. It reads `CLAUDE.md` automatically, so it already knows the design rules, your facts and the open items.

Agents included (in `.claude/agents/`). Ask for one by name, for example "use the content-editor agent to add a new project":
- **content-editor**: changes text, projects, case studies, services, links
- **design-reviewer**: checks layout, mobile, accessibility and broken links before you publish
- **asset-optimizer**: turns new renders, photos and 3D models into web-ready files
- **photography-page-builder**: builds `photography.html` from your Behance photography portfolio originals
- **deploy-helper**: pushes the site to GitHub Pages after a check

Slash command: `/preview` starts the local server.

### Add your own agent
Create a new file in `.claude/agents/`, for example `.claude/agents/seo-helper.md`:

```
---
name: seo-helper
description: When Claude should use this agent, in one sentence.
tools: Read, Edit, Grep, Glob
---

Instructions for the agent: what it does, which files it touches, and rules it must follow.
```

The `description` decides when Claude Code picks the agent. Leave out `tools` to give it every tool. You can also run `/agents` inside Claude Code to create and edit agents from a menu.
