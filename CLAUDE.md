# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

A single-file React app (`frontend-roadmap-v3.jsx`) — a personal SDE interview prep tracker. No build system lives in this repo; the file is meant to be dropped into an external React project (e.g. Vite, Next.js, or an online sandbox like StackBlitz).

## Architecture

The entire app is one self-contained export-default component with no external dependencies beyond React's `useState`. All state is in-memory; nothing persists across page reloads.

**Three views, one tab system:**

| Tab | Component | State |
|-----|-----------|-------|
| 学习日志 (Learning Log) | `LogView` | `logs` (INITIAL_LOGS pre-seeded) |
| 练习题 (Problem Tracker) | `ProblemView` | `problems` (starts empty) |
| W1–W5 (Weekly Roadmap) | inline in `App` | `done`, `expanded`, `activeWeek` |

**Key data structures at the top of the file:**
- `WEEKS` — 5-week learning plan, each week has 7 `weekdays` with task details
- `CUT_ITEMS` — topics deliberately excluded from the plan (shown in a collapsible panel)
- `INITIAL_LOGS` — pre-seeded learning log entries
- `TYPE_STYLE` / `TAG_COLORS` — color mappings for activity types and topic tags

**No routing, no context, no external state library.** All state lives in `App` and is passed down as props.

## Running / Editing

Since there's no package.json here, to preview changes:
1. Copy `frontend-roadmap-v3.jsx` into a React project that supports JSX (e.g. `npx create vite@latest` with React template)
2. Rename to `App.jsx` and replace the default App, or import it as a component
3. Run `npm run dev`

Alternatively, paste the file contents directly into a sandbox (StackBlitz, CodeSandbox) — it is fully self-contained.

## Content Language

Task descriptions and UI labels are in Simplified Chinese. Topic tags, difficulty levels (`Easy`/`Medium`/`Hard`), and status values (`Solved`/`Attempted`/`Reviewing`) remain in English as they are used as data keys.
