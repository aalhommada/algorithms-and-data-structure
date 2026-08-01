// source.config.ts
import {
  defineDocs,
  defineConfig,
  frontmatterSchema
} from "fumadocs-mdx/config";
import { z } from "zod";

// lib/patterns.ts
var PATTERNS = {
  "Hash Map": "Trade memory for time \u2014 turn an O(n) search into an O(1) lookup.",
  "Two Pointers": "Two indices moving under a rule that provably discards possibilities.",
  "Fast & Slow Pointers": "One pointer moves twice as fast \u2014 finds middles, cycles and offsets.",
  "Sliding Window": "A range that slides or grows across the data, reusing the previous answer.",
  "Prefix Sum": "Precompute cumulative totals so range questions become subtraction.",
  "Running State": "Carry one or two variables that summarise everything seen so far.",
  Stack: "Last in, first out \u2014 nesting, undo, deferred operands.",
  Heap: "Keep the smallest or largest item reachable in O(1).",
  "Binary Search": "Halve the search space with every comparison.",
  BFS: "Explore level by level with a queue \u2014 finds the fewest steps.",
  DFS: "Follow one branch to its end before backtracking.",
  Backtracking: "Build a candidate, undo the last choice, try the next.",
  Greedy: "Take the locally best option, once you can prove it is safe.",
  "Dynamic Programming": "Solve each overlapping subproblem once and remember the answer.",
  Sorting: "Impose an order so the rest of the work becomes easy.",
  "Union-Find": "Track which items belong to the same group, near-instantly.",
  Trie: "A tree keyed by character \u2014 shared prefixes stored once.",
  "Bit Manipulation": "Treat a number as a row of switches.",
  Matrix: "Reason about a grid by its rows, columns and neighbours.",
  Intervals: "Sort by start, then merge or count overlaps.",
  Simulation: "Carefully do exactly what the problem describes.",
  Math: "Use a numeric property instead of scanning.",
  Design: "Combine structures so every operation hits its complexity target."
};
var PATTERN_NAMES = Object.keys(PATTERNS);

// source.config.ts
var docs = defineDocs({
  dir: "content/docs",
  docs: {
    schema: frontmatterSchema.extend({
      difficulty: z.enum(["easy", "medium", "hard"]).optional(),
      pattern: z.enum(PATTERN_NAMES).optional(),
      /** Nuance within a pattern, e.g. "converging". Free text by design. */
      variant: z.string().optional(),
      tags: z.array(z.string()).default([]),
      leetcode: z.string().url().optional(),
      problemNumber: z.number().int().positive().optional(),
      /** Concepts a reader should meet first, as doc slugs. */
      prereq: z.array(z.string()).default([])
    })
  }
});
var source_config_default = defineConfig();
export {
  source_config_default as default,
  docs
};
