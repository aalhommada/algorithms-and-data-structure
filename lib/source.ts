import { docs } from '@/.source/server';
import { loader } from 'fumadocs-core/source';
import { icons } from 'lucide-react';
import { createElement } from 'react';

export const source = loader({
  baseUrl: '/docs',
  // Lets `meta.json` name any Lucide icon, e.g. `"icon": "Binary"`.
  icon(icon) {
    if (!icon) return;
    if (icon in icons)
      return createElement(icons[icon as keyof typeof icons], {
        className: 'h-4 w-4',
      });
  },
  source: docs.toFumadocsSource(),
});
