# CLAUDE.md - Project Guide

## Project Overview

An algorithms and data structures documentation site built with **Fumadocs**. It covers 56 LeetCode problems with beginner-friendly explanations, animated visualizations, and solutions in **Python** and **TypeScript**.

The migration from Nextra is complete — Nextra is fully removed, and every page has been rewritten. The original Nextra `.mdx` files are preserved in `content-backup/` for reference and can be deleted once you are satisfied nothing is missing.

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
│   └── docs/                   # There is no landing page — / redirects here
│       ├── layout.tsx          # Sidebar/nav shell
│       └── [[...slug]]/page.tsx
├── mdx-components.tsx          # Global MDX component registry (see below)
├── lib/
│   ├── source.ts               # Fumadocs loader + Lucide icon resolver
│   └── utils.ts                # cn() helper
├── components/
│   ├── algorithm/              # Problem-page primitives
│   │   ├── ProblemMeta.tsx     # Difficulty + pattern + tags + LeetCode link
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
│       ├── LinkedListViz.tsx
│       ├── TreeViz.tsx
│       ├── GraphViz.tsx
│       ├── HashMapViz.tsx
│       └── StackViz.tsx        # Stack or queue
├── content/docs/               # All MDX content
│   ├── index.mdx               # Docs landing page
│   ├── meta.json               # Top-level sidebar order
│   ├── patterns/               # Cross-cutting technique map
│   ├── arrays/ strings/ linked-lists/ stacks-queues/ trees/ graphs/
│   └── searching/ dynamic-programming/ greedy/ design/
└── content-backup/             # Original Nextra files (safe to delete)
```

## Key Conventions

### MDX files need no imports

Every component is registered globally in `mdx-components.tsx`, which `app/docs/[[...slug]]/page.tsx` passes to the compiled MDX. Content files start directly with frontmatter and `<ProblemMeta />` — do **not** add `import` statements to MDX.

To expose a new component to content, add it to `getMDXComponents()`.

### No `# Heading` at the top of a page

`DocsTitle` already renders the frontmatter `title`. A duplicate H1 in the body would appear twice.

### Page structure

Every problem page follows the same skeleton, and new pages should too:

```mdx
---
title: Two Sum
description: One sentence describing the problem and the technique
---

<ProblemMeta
  difficulty="easy"          {/* easy | medium | hard */}
  pattern="Hash Map"
  tags={["Array", "Hash Table"]}
  leetcode="https://leetcode.com/problems/two-sum/"
  problemNumber={1}
/>

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

A single-frame viz renders without playback controls. `ArrayDiagram`, `LinkedListDiagram` and `TreeDiagram` are static conveniences for that case.

### Navigation

Sidebar order comes from `meta.json` in each folder. `"---Label---"` entries render as separators, and `"icon"` accepts any Lucide component name (resolved in `lib/source.ts`).

Adding a page means creating the `.mdx` file **and** listing it in the folder's `meta.json`.

## Writing Guidelines

The whole point of this site is explanation quality. Each page should:

1. **Show the naive approach first**, then the insight that improves on it.
2. **Justify the insight** — especially for two-pointer and greedy solutions, where "why is it safe to skip that?" *is* the problem.
3. **Use a concrete worked example** with real numbers, not just prose.
4. **Call out language differences** — Python's `//` vs `int()`, JavaScript's default string sort, `pop()` on an empty container, falsy `0` from a `Map`.
5. **Name the edge cases** that separate a passing solution from a correct one.

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

## Styling Notes

**Font.** Poppins is loaded via `next/font/google` in `app/layout.tsx` and self-hosted at build time — no runtime request to Google.

**Overriding fumadocs theme variables.** `fumadocs-ui/style.css` is a *pre-compiled* Tailwind bundle that sets variables like `--font-sans` inside `@layer theme`. An `@theme` block in `global.css` will not reliably beat it. Use a plain **unlayered** `:root` rule instead — unlayered declarations always win over layered ones, regardless of import order. This is why the font override in `global.css` is written the way it is.

**Dependency overrides.** `package.json` pins patched `postcss` and `sharp` via `overrides`, because Next 16.2.12 depends on vulnerable versions of both and no stable Next release fixes them yet. Re-check on each Next upgrade; the overrides can be dropped once upstream catches up. PostCSS is the CSS pipeline, so after changing them, confirm the compiled stylesheet still contains Tailwind utilities and `--fd-*` variables.

## Common MDX Pitfalls

- **Nested double quotes in attributes** break the parser. Use `title='… ["a", "b"] …'` with single quotes on the outside.
- **`{` and `}` in prose** are interpreted as JSX expressions. Wrap them in backticks.
- **Component props are JS expressions**, so `frames={[...]}` needs valid JavaScript — trailing commas are fine, but comments inside must use `{/* */}` at the JSX level.
