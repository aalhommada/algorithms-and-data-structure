# CLAUDE.md - Project Guide

## How to Answer (always)

- **Use simple English.** Short sentences. Plain words instead of jargon. If a
  technical term is unavoidable, explain it in the same breath.
- **Use tables and diagrams whenever they make the answer clearer** than prose —
  comparisons, before/after, trade-offs, step sequences, file structures. Prefer
  a small table over a long paragraph.
- Do not pad the answer. Say the thing, show it, stop.

## Project Overview

An algorithms and data structures documentation site built with **Fumadocs**. It covers 73 problems with beginner-friendly explanations, animated visualizations, and solutions in **Python** and **TypeScript**, plus a 32-page **system design** section.

The migration from Nextra is complete — Nextra is fully removed, and every page has been rewritten. The original Nextra `.mdx` files are preserved in `content-backup/` for reference and can be deleted once you are satisfied nothing is missing.

## The Goal

**This is meant to be the best single place to learn this material.** Two commitments follow from that, and they decide most arguments about what to write.

### Completeness

A reader should never have to go elsewhere for a core topic. Two halves, both expected to be whole:

| Half | Means |
|---|---|
| **Algorithms and data structures** | Every fundamental structure, every major technique, and enough problems per pattern that the pattern is actually learned — not one token example |
| **System design** | A complete study: every building block explained with its cost, then designs that assemble those blocks under real pressure |

When a topic is missing, that is a gap to fill, not a scope decision already made. Prefer adding the missing page over narrowing the promise. Depth on a topic already covered still beats a thin new page — but a genuinely absent fundamental beats both.

### Teaching how to think

The reader should finish a page able to attack a problem they have **never seen**. That is a higher bar than understanding the solution on the page, and it changes how pages are written.

The method, applied on every page:

```
1. Show the obvious approach first — and let it fail honestly.
     The reader must feel the problem before being handed the fix.

2. Name the observation that breaks the deadlock.
     One sentence. This is the reusable part; everything else is detail.

3. Prove the leap is safe.
     "Why is it OK to skip those?" IS the problem. Never assert — argue.

4. Walk real numbers through it.
     A concrete trace, not a description of a trace.

5. Say what the idea generalises to.
     Where else does this move work? That is what makes it transferable.
```

Step 3 is the one most often skipped, and it is the one that matters. A reader who is told *"use two pointers"* has memorised a trick. A reader shown *why discarding that half provably cannot lose the answer* has gained a tool they can aim at something new.

The system design section is the same five steps aimed at problems with no single right answer. It deliberately contains **no code**. It is about trade-offs between components, and code would hide that. Every worked design follows the same six steps and ends with a "what was traded away" table:

```
clarify → estimate → interface → simplest version → add under pressure → trade-offs
```

All 13 worked designs carry all six. Where a system has no external caller — the web crawler is a pipeline, not a service — the interface step becomes *"name what crosses each boundary"* rather than being dropped. Skipping a step because it is awkward is how a reader learns the method is optional, which it is not.

## Tech Stack

- **Framework**: Fumadocs 16 on Next.js 16 (App Router, Turbopack) + React 19
- **Styling**: Tailwind CSS 4
- **Visualizations**: custom SVG/flex components in `components/viz/` — no external diagram library
- **Content**: MDX via `fumadocs-mdx`, source of truth in `content/docs/`

## Project Structure

```
/
├── app/
│   ├── layout.tsx              # Root layout, metadata, Poppins font
│   ├── global.css              # Tailwind + Fumadocs theme + font override
│   ├── api/search/route.ts     # Search index — REQUIRED, see below
│   └── docs/                   # There is no landing page — / redirects here
│       ├── layout.tsx          # Sidebar/nav shell
│       └── [[...slug]]/page.tsx  # Renders <ProblemMeta> from frontmatter
├── source.config.ts            # Frontmatter schema (difficulty, pattern, …)
├── mdx-components.tsx          # Global MDX component registry (see below)
├── lib/
│   ├── source.ts               # Fumadocs loader + Lucide icon resolver
│   ├── patterns.ts             # CLOSED list of canonical pattern names
│   └── utils.ts                # cn() helper
├── components/
│   ├── algorithm/              # Problem-page primitives
│   │   ├── ProblemMeta.tsx     # Rendered by page.tsx, NOT written in MDX
│   │   ├── Difficulty.tsx
│   │   ├── Tags.tsx
│   │   ├── LeetCodeLink.tsx
│   │   ├── Complexity.tsx
│   │   └── CodeTabs.tsx        # Python / TypeScript switcher
│   └── viz/                    # Animated visualizations
│       ├── useStepper.ts       # Shared frame cursor + autoplay
│       ├── VizShell.tsx        # Shared chrome: canvas, controls, notes
│       ├── palette.ts          # Shared CellState colour vocabulary
│       ├── ArrayViz.tsx        # Cells or bars, pointers, water overlay
│       ├── GridViz.tsx         # 2D grids — matrix and flood-fill problems
│       ├── ArchViz.tsx         # Boxes and arrows — system design only
│       ├── LinkedListViz.tsx
│       ├── TreeViz.tsx         # Level-order array; also used for heaps
│       ├── GraphViz.tsx
│       ├── HashMapViz.tsx
│       └── StackViz.tsx        # Stack or queue
├── content/docs/               # All MDX content
│   ├── index.mdx               # Docs landing page
│   ├── meta.json               # Top-level sidebar order
│   ├── patterns/               # Cross-cutting technique map
│   ├── arrays/ strings/ linked-lists/ stacks-queues/ trees/ graphs/ heaps/
│   ├── searching/ backtracking/ dynamic-programming/ greedy/ design/
│   └── system-design/          # 18 foundations + 13 worked designs
└── content-backup/             # Original Nextra files (safe to delete)
```

## Key Conventions

### MDX files need no imports

Every component is registered globally in `mdx-components.tsx`, which `app/docs/[[...slug]]/page.tsx` passes to the compiled MDX. Content files start directly with frontmatter and then a `##` heading — do **not** add `import` statements to MDX.

To expose a new component to content, add it to `getMDXComponents()`.

### Problem metadata lives in frontmatter, never in the body

`<ProblemMeta>` is rendered by `app/docs/[[...slug]]/page.tsx` from the page's frontmatter. **Do not write the tag into an MDX file** — it appears automatically on any page whose frontmatter carries `difficulty`.

The schema is defined in `source.config.ts`. Putting it there rather than in the body is what lets the site read it: sidebar badges, filtering, and the search index's difficulty tag all depend on `page.data.difficulty` being available to the loader.

### `pattern` is a closed vocabulary

`lib/patterns.ts` holds the canonical list, and `source.config.ts` enforces it with a zod enum — an unknown pattern **fails the build**.

This is deliberate. The pattern names were once free text and drifted to 46 distinct strings across 56 pages (eight near-identical spellings of "hash map"), which defeated the point of a guide built on *recognising* patterns.

Put nuance in `variant` (free text), not in a new pattern. It renders as `Two Pointers · converging`. Adding a pattern to the closed list is a deliberate act — prefer a variant first.

### No `# Heading` at the top of a page

`DocsTitle` already renders the frontmatter `title`. A duplicate H1 in the body would appear twice.

### Page structure

Every problem page follows the same skeleton, and new pages should too:

```mdx
---
title: Two Sum
description: One sentence describing the problem and the technique
difficulty: easy                 # easy | medium | hard
pattern: Hash Map                # must exist in lib/patterns.ts
variant: complement lookup       # optional free-text nuance
tags: ["Array", "Hash Table"]
leetcode: https://leetcode.com/problems/two-sum/
problemNumber: 1
---

## Problem Statement     — examples in a ```text block
## Intuition             — naive approach first, then the insight in a <Callout>
## Approach              — <Steps>/<Step>, then a visualization
## Solution              — <CodeTabs> with Python and TypeScript
## Complexity Analysis   — <Complexity time="O(n)" space="O(n)" /> plus prose
## Edge Cases            — <Accordions>/<Accordion>
## Related Problems      — bullet links to sibling pages
```

### Visualizations

All viz components take a `frames` array and share the playback chrome and colour language. Cell states are `idle | active | compare | match | done | discard` (see `components/viz/palette.ts`) — reuse them rather than inventing per-page colours.

```mdx
<ArrayViz
  title="nums = [2, 7, 11, 15]"
  variant="cells"            {/* or "bars", which supports an `overlay` for water */}
  frames={[
    {
      values: [2, 7, 11, 15],
      states: ["active", "idle", "idle", "idle"],
      pointers: [{ index: 0, label: "i" }],
      vars: { total: 0 },
      note: "What is happening in this frame.",
    },
  ]}
/>
```

A single-frame viz renders without playback controls. `ArrayDiagram`, `LinkedListDiagram`, `TreeDiagram`, `GridDiagram` and `ArchDiagram` are static conveniences for that case.

**Picking one.** `TreeViz` takes a level-order array (index `i` has children at `2i+1` / `2i+2`), which is also exactly a binary heap's layout — so heap pages reuse it. `GridViz` is for 2D problems. `StackViz` models a call stack well: items are frames, `hint` is the return value. `ArchViz` is system-design only, and its colours encode component *kind*, so a green box means "durable store" on every page.

### Adding a page means three edits, not one

1. Create the `.mdx` file with full frontmatter.
2. Add it to the folder's `meta.json` under the right `---Difficulty---` separator.
3. Link it from the section index and from `patterns/index.mdx` if it teaches a listed pattern.

The separator and the frontmatter `difficulty` must agree. Nothing enforces this — it is worth checking when adding a batch.

### Search

`app/api/search/route.ts` must exist. Fumadocs enables the search UI by default, so **without this route the search box renders and every query 404s** — a silent failure that looks like "search finds nothing". The route also tags each result with its `difficulty`, so results can be filtered by `?tag=hard`.

### Navigation

Sidebar order comes from `meta.json` in each folder. `"---Label---"` entries render as separators, and `"icon"` accepts any Lucide component name (resolved in `lib/source.ts`).

Adding a page means creating the `.mdx` file **and** listing it in the folder's `meta.json`.

## Writing Guidelines

Explanation quality is the product. Everything else is packaging.

### The non-negotiables

1. **Show the naive approach first**, then the insight that improves on it. Let the naive version fail with real numbers — "O(n²) is 10¹² operations here" — not with the word *slow*.
2. **Justify the insight.** For two-pointer, greedy and binary search especially, *"why is it safe to discard that?"* **is** the problem. An unjustified rule is a trick to memorise and forget.
3. **Use a concrete worked example** with real numbers, not prose about an example.
4. **Call out language differences** — Python's `//` vs `int()`, JavaScript's default string sort, `pop()` on an empty container, falsy `0` from a `Map`.
5. **Name the edge cases** that separate a passing solution from a correct one.
6. **Say where the idea is reused.** End by pointing at the sibling problems the same move solves. A technique seen once is an anecdote; seen three times it is a tool.

### Writing for a beginner

Assume the reader knows loops and arrays, and nothing else. Everything past that is earned in the text.

| Do | Instead of |
|---|---|
| "A hash map trades memory for time — it remembers what it has seen, so looking something up costs one step instead of scanning." | "Use a hash map for O(1) lookup." |
| "Move the left pointer right. Any pair using the old left is now impossible, so nothing is lost." | "Advance `left`." |
| Define the term the first time it appears, in the same sentence. | Assuming *amortised*, *in-place*, *stable*, *invariant* are known. |
| Give the number: "one pass over 10,000 items". | "Linear time." |

Jargon is allowed once explained. Unexplained jargon is where a beginner silently stops following and starts scrolling.

### When adding a problem

Ask what it teaches that a page on the site does not already teach. A problem that only re-runs an existing pattern is fine **if the section is thin on practice**, but say plainly in the intuition which earlier problem it echoes and what is different here. Never present a variation as if it were a new idea — the connection is the lesson.

## Code Style

### TypeScript
- Strict mode; `interface` for object shapes
- PascalCase components, camelCase utilities
- Client components (`'use client'`) only where interactivity requires it — all of `components/viz/`

<!-- prettier-ignore -->
> **Never identify MDX children by component identity.** In a client component,
> `child.type === SomeComponent` fails for children that crossed the RSC
> boundary — they arrive as client-reference proxies, so the check silently
> matches nothing and the component renders `null` with no error. Filter on a
> prop instead (`typeof child.props.label === 'string'`). `CodeTabs` had exactly
> this bug: it rendered no code server-side at all.

### Python examples
- Type hints throughout (3.10+ syntax: `list[int]`, `X | None`)
- PEP 8, descriptive names, docstrings on the main function

## Commands

```bash
npm run dev      # Dev server
npm run build    # Production build — run this after content changes
npm start        # Serve the production build
npm run lint     # Next.js linting
```

## Git — never commit, never push

**Do not run `git commit` or `git push`. Ever. In this repository the owner commits.**

This holds even when the work is finished, verified and obviously ready, and even when a task description implies a commit would be the natural last step. Finishing the work is the deliverable; recording it in history is not yours to do.

| Allowed | Not allowed |
|---|---|
| Edit, create, delete files | `git commit` |
| `git status`, `git diff`, `git log` | `git push` |
| `git add` / staging | `git commit --amend`, rebase, `git reset --hard` |
| Reporting what changed | Creating branches, tags or PRs |

When the work is done, say what changed and leave it in the working tree. Do not ask for permission to commit either — the answer is already no.

## Styling Notes

**Font.** Poppins is loaded via `next/font/google` in `app/layout.tsx` and self-hosted at build time — no runtime request to Google.

**Overriding fumadocs theme variables.** `fumadocs-ui/style.css` is a *pre-compiled* Tailwind bundle that sets variables like `--font-sans` inside `@layer theme`. An `@theme` block in `global.css` will not reliably beat it. Use a plain **unlayered** `:root` rule instead — unlayered declarations always win over layered ones, regardless of import order. This is why the font override in `global.css` is written the way it is.

**Dependency overrides.** `package.json` pins patched `postcss` and `sharp` via `overrides`, because Next 16.2.12 depends on vulnerable versions of both and no stable Next release fixes them yet. Re-check on each Next upgrade; the overrides can be dropped once upstream catches up. PostCSS is the CSS pipeline, so after changing them, confirm the compiled stylesheet still contains Tailwind utilities and `--fd-*` variables.

## Common MDX Pitfalls

- **Nested double quotes in attributes** break the parser. Use `title='… ["a", "b"] …'` with single quotes on the outside.
- **`{` and `}` in prose** are interpreted as JSX expressions. Wrap them in backticks.
- **Component props are JS expressions**, so `frames={[...]}` needs valid JavaScript — trailing commas are fine, but comments inside must use `{/* */}` at the JSX level.
