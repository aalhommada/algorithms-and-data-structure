/**
 * The canonical pattern vocabulary.
 *
 * Problems used to carry free-text pattern names, which drifted into 46
 * distinct strings across 56 pages — eight of them near-identical spellings of
 * "hash map". That defeats the point of a guide built around *recognising* a
 * pattern, so the list below is closed: a page picks one of these, and any
 * extra nuance goes in `variant` (rendered as "Two Pointers · converging").
 *
 * Adding a pattern is a deliberate act. Prefer a new `variant` first.
 */
export const PATTERNS = {
  'Hash Map': 'Trade memory for time — turn an O(n) search into an O(1) lookup.',
  'Two Pointers':
    'Two indices moving under a rule that provably discards possibilities.',
  'Fast & Slow Pointers':
    'One pointer moves twice as fast — finds middles, cycles and offsets.',
  'Sliding Window':
    'A range that slides or grows across the data, reusing the previous answer.',
  'Prefix Sum':
    'Precompute cumulative totals so range questions become subtraction.',
  'Running State':
    'Carry one or two variables that summarise everything seen so far.',
  Stack: 'Last in, first out — nesting, undo, deferred operands.',
  Heap: 'Keep the smallest or largest item reachable in O(1).',
  'Binary Search': 'Halve the search space with every comparison.',
  BFS: 'Explore level by level with a queue — finds the fewest steps.',
  DFS: 'Follow one branch to its end before backtracking.',
  Backtracking: 'Build a candidate, undo the last choice, try the next.',
  Greedy: 'Take the locally best option, once you can prove it is safe.',
  'Dynamic Programming':
    'Solve each overlapping subproblem once and remember the answer.',
  Sorting: 'Impose an order so the rest of the work becomes easy.',
  'Union-Find': 'Track which items belong to the same group, near-instantly.',
  Trie: 'A tree keyed by character — shared prefixes stored once.',
  'Bit Manipulation': 'Treat a number as a row of switches.',
  Matrix: 'Reason about a grid by its rows, columns and neighbours.',
  Intervals: 'Sort by start, then merge or count overlaps.',
  Simulation: 'Carefully do exactly what the problem describes.',
  Math: 'Use a numeric property instead of scanning.',
  Design: 'Combine structures so every operation hits its complexity target.',
} as const;

export type PatternName = keyof typeof PATTERNS;

export const PATTERN_NAMES = Object.keys(PATTERNS) as PatternName[];

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export const DIFFICULTY_ORDER: Record<DifficultyLevel, number> = {
  easy: 0,
  medium: 1,
  hard: 2,
};
