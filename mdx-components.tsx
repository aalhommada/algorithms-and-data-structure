import defaultMdxComponents from 'fumadocs-ui/mdx';
import { Callout } from 'fumadocs-ui/components/callout';
import { Card, Cards } from 'fumadocs-ui/components/card';
import { Step, Steps } from 'fumadocs-ui/components/steps';
import { Accordion, Accordions } from 'fumadocs-ui/components/accordion';
import type { MDXComponents } from 'mdx/types';

import { CodeTabs, Tab } from '@/components/algorithm/CodeTabs';
import { Complexity } from '@/components/algorithm/Complexity';
import { Difficulty } from '@/components/algorithm/Difficulty';
import { LeetCodeLink } from '@/components/algorithm/LeetCodeLink';
import { ProblemMeta } from '@/components/algorithm/ProblemMeta';
import { Tags } from '@/components/algorithm/Tags';
import { ArrayDiagram, ArrayViz } from '@/components/viz/ArrayViz';
import { GraphViz } from '@/components/viz/GraphViz';
import { HashMapViz } from '@/components/viz/HashMapViz';
import { LinkedListDiagram, LinkedListViz } from '@/components/viz/LinkedListViz';
import { StackViz } from '@/components/viz/StackViz';
import { TreeDiagram, TreeViz } from '@/components/viz/TreeViz';

/**
 * Every component here is available in all MDX files without an import, so
 * content pages stay focused on the explanation.
 */
export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    Callout,
    Card,
    Cards,
    Step,
    Steps,
    Accordion,
    Accordions,
    ProblemMeta,
    Difficulty,
    Tags,
    LeetCodeLink,
    Complexity,
    CodeTabs,
    Tab,
    ArrayViz,
    ArrayDiagram,
    LinkedListViz,
    LinkedListDiagram,
    TreeViz,
    TreeDiagram,
    GraphViz,
    HashMapViz,
    StackViz,
    ...components,
  };
}
