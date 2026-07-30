import { Difficulty } from './Difficulty';
import { LeetCodeLink } from './LeetCodeLink';
import { Tags } from './Tags';

interface ProblemMetaProps {
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  leetcode?: string;
  problemNumber?: number;
  /** The named technique this problem teaches, e.g. "Two Pointers". */
  pattern?: string;
}

/**
 * The header strip every problem page opens with. Keeps badges, tags and the
 * LeetCode button identical across all pages.
 */
export function ProblemMeta({
  difficulty,
  tags,
  leetcode,
  problemNumber,
  pattern,
}: ProblemMetaProps) {
  return (
    <div className="not-prose mb-8 flex flex-col gap-3 rounded-xl border bg-fd-card p-4">
      <div className="flex flex-wrap items-center gap-2">
        <Difficulty level={difficulty} />
        {pattern ? (
          <span className="inline-flex items-center rounded-md border border-blue-500/20 bg-blue-500/10 px-2.5 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400">
            {pattern}
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
