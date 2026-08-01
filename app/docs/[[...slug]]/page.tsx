import { source } from '@/lib/source';
import {
  DocsPage,
  DocsBody,
  DocsDescription,
  DocsTitle,
} from 'fumadocs-ui/page';
import { notFound } from 'next/navigation';
import { getMDXComponents } from '@/mdx-components';
import { ProblemMeta } from '@/components/algorithm/ProblemMeta';
import type { DifficultyLevel } from '@/lib/patterns';
import type { MDXContent } from 'mdx/types';

interface PageData {
  title: string;
  description?: string;
  body: MDXContent;
  toc: Array<{ depth: number; url: string; title: string }>;
  difficulty?: DifficultyLevel;
  pattern?: string;
  variant?: string;
  tags?: string[];
  leetcode?: string;
  problemNumber?: number;
}

export default async function Page(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const pageData = page.data as unknown as PageData;
  const MDX = pageData.body;

  return (
    <DocsPage toc={pageData.toc}>
      <DocsTitle>{pageData.title}</DocsTitle>
      <DocsDescription>{pageData.description}</DocsDescription>
      <DocsBody>
        {/* Renders only on pages whose frontmatter carries problem metadata. */}
        <ProblemMeta
          difficulty={pageData.difficulty}
          pattern={pageData.pattern}
          variant={pageData.variant}
          tags={pageData.tags}
          leetcode={pageData.leetcode}
          problemNumber={pageData.problemNumber}
        />
        <MDX components={getMDXComponents()} />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const pageData = page.data as unknown as PageData;

  // Without per-page Open Graph tags every shared link would preview with the
  // generic site-wide text from the root layout. `page.url` is root-relative;
  // `metadataBase` there resolves it to an absolute URL.
  return {
    title: pageData.title,
    description: pageData.description,
    alternates: { canonical: page.url },
    // Next replaces `openGraph` wholesale rather than deep-merging it, so
    // siteName and locale have to be repeated here or they vanish on every
    // page that sets its own Open Graph tags.
    openGraph: {
      type: 'article',
      url: page.url,
      title: pageData.title,
      description: pageData.description,
      siteName: 'DSA Guide',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary',
      title: pageData.title,
      description: pageData.description,
    },
  };
}
