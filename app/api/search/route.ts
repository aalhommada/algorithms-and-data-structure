import { source } from '@/lib/source';
import { createFromSource } from 'fumadocs-core/search/server';

/**
 * Fumadocs enables the search UI by default, but the dialog is inert without a
 * backing route — every query 404s. This builds the index straight from the
 * same loader the sidebar uses, so search and navigation can never drift apart.
 *
 * `tag` carries the problem's difficulty, letting the client filter results.
 */
export const { GET } = createFromSource(source, {
  buildIndex(page) {
    return {
      title: page.data.title,
      description: page.data.description,
      url: page.url,
      id: page.url,
      structuredData: page.data.structuredData,
      tag: page.data.difficulty ?? 'guide',
    };
  },
});
