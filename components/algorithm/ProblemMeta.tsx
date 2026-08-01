import { Difficulty } from './Difficulty';
import { LeetCodeLink } from './LeetCodeLink';
import { Tags } from './Tags';
import type { DifficultyLevel } from '@/lib/patterns';

interface ProblemMetaProps {
  difficulty?: DifficultyLevel;
  tags?: string[];
  leetcode?: string;
  problemNumber?: number;
  /** Canonical technique from `lib/patterns.ts`, e.g. "Two Pointers". */
  pattern?: string;
  /** Nuance within the pattern, e.g. "converging". */
  variant?: string;
}

/**
 * The header strip every problem page opens with.
 *
 * Rendered by the page template from frontmatter, not written into each MDX
 * file — that keeps the badge row identical everywhere and lets the rest of the
 * site read the same values for filtering, sidebar badges and search.
 */
export function ProblemMeta({
  difficulty,
  tags = [],
  leetcode,
  problemNumber,
  pattern,
  variant,
}: ProblemMetaProps) {
  if (!difficulty && !pattern && tags.length === 0 && !leetcode) return null;

  return (
    <div className="not-prose mb-8 flex flex-col gap-3 rounded-xl border bg-fd-card p-4">
      <div className="flex flex-wrap items-center gap-2">
        {difficulty ? <Difficulty level={difficulty} /> : null}
        {pattern ? (
          <span className="inline-flex items-center gap-1.5 rounded-md border border-blue-500/20 bg-blue-500/10 px-2.5 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400">
            {pattern}
            {variant ? (
              <span className="font-normal opacity-70">· {variant}</span>
            ) : null}
          </span>
        ) : null}
        <Tags items={tags} />
      </div>

      {leetcode ? (
        <div>
          <LeetCodeLink url={leetcode} problemNumber={problemNumber} />
        </div>
      ) : null}
    </div>
  );
}
