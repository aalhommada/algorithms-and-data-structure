'use client';

import { useState, ReactNode, Children, isValidElement } from 'react';
import { cn } from '@/lib/utils';

interface TabProps {
  label: string;
  children: ReactNode;
}

export function Tab({ children }: TabProps) {
  return <>{children}</>;
}

interface CodeTabsProps {
  children: ReactNode;
}

export function CodeTabs({ children }: CodeTabsProps) {
  // Identify tabs by their `label` prop, NOT by `child.type === Tab`.
  // MDX renders these across the server/client boundary, where `Tab` arrives as
  // a client-reference proxy whose identity does not match the imported
  // function — an identity check silently matches nothing and renders null.
  const tabs = Children.toArray(children).filter(
    (child): child is React.ReactElement<TabProps> =>
      isValidElement(child) &&
      typeof (child.props as Partial<TabProps>)?.label === 'string'
  );

  const [activeTab, setActiveTab] = useState(0);

  if (tabs.length === 0) {
    return null;
  }

  return (
    <div className="not-prose my-6 overflow-hidden rounded-lg border bg-fd-card">
      {/* Tab Headers */}
      <div className="flex border-b bg-fd-secondary/50">
        {tabs.map((tab, index) => (
          <button
            key={tab.props.label}
            onClick={() => setActiveTab(index)}
            className={cn(
              'px-4 py-2.5 text-sm font-medium transition-colors',
              activeTab === index
                ? 'border-b-2 border-fd-primary bg-fd-background text-fd-foreground'
                : 'text-fd-muted-foreground hover:bg-fd-secondary hover:text-fd-foreground'
            )}
          >
            {tab.props.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="[&_pre]:my-0 [&_pre]:rounded-none [&_pre]:border-0">
        {tabs[activeTab]}
      </div>
    </div>
  );
}
