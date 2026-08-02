import {
  defineDocs,
  defineConfig,
  frontmatterSchema,
} from 'fumadocs-mdx/config';
import { z } from 'zod';

import { PATTERN_NAMES } from './lib/patterns';

/**
 * Problem metadata lives in frontmatter, not in the page body.
 *
 * It used to be props on a `<ProblemMeta>` tag inside the MDX, which meant the
 * site itself could not read it — no filtering, no sidebar badges, no search
 * facets, and the `---Easy---` separators in every meta.json were maintained by
 * hand with nothing checking they matched. Frontmatter is parsed by the loader,
 * so `page.data.difficulty` is available anywhere a page is.
 */
export const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    schema: frontmatterSchema.extend({
      difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
      pattern: z.enum(PATTERN_NAMES as [string, ...string[]]).optional(),
      /** Nuance within a pattern, e.g. "converging". Free text by design. */
      variant: z.string().optional(),
      tags: z.array(z.string()).default([]),
      leetcode: z.string().url().optional(),
      problemNumber: z.number().int().positive().optional(),
    }),
  },
});

export default defineConfig();
