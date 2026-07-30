'use client';

import { cn } from '@/lib/utils';
import { cellStateClass, pointerColor, type CellState } from './palette';
import { useStepper } from './useStepper';
import { Vars } from './ArrayViz';
import { VizShell } from './VizShell';

export interface ListNode {
  value: string | number;
  state?: CellState;
  /** Labels drawn above the node, e.g. `head`, `slow`, `fast`. */
  pointers?: string[];
}

export interface ListFrame {
  nodes: ListNode[];
  /** Draw a back-edge from the last node to this index to show a cycle. */
  cycleTo?: number;
  /** `null` tail marker. Defaults to true when there is no cycle. */
  showNull?: boolean;
  /** Flip every arrow — used by reversal problems. */
  reversed?: boolean;
  vars?: Record<string, string | number>;
  note?: string;
}

interface LinkedListVizProps {
  frames: ListFrame[];
  title?: string;
  caption?: string;
  intervalMs?: number;
}

export function LinkedListViz({
  frames,
  title,
  caption,
  intervalMs = 1300,
}: LinkedListVizProps) {
  const stepper = useStepper({ total: frames.length, intervalMs });
  const frame = frames[Math.min(stepper.index, frames.length - 1)];

  if (!frame) return null;

  const hasCycle = typeof frame.cycleTo === 'number';
  const showNull = frame.showNull ?? !hasCycle;
  const arrow = frame.reversed ? '←' : '→';

  return (
    <VizShell
      title={title}
      caption={caption}
      note={frame.note}
      stepper={frames.length > 1 ? stepper : undefined}
    >
      <div className="relative pb-6">
        <div className="flex items-center gap-1">
          {frame.nodes.map((node, index) => (
            <div key={index} className="flex items-center gap-1">
              <div className="flex flex-col items-center gap-1">
                <div className="flex min-h-4 flex-col items-center gap-0.5">
                  {(node.pointers ?? []).map((label, pointerIndex) => (
                    <span
                      key={label}
                      className={cn(
                        'font-mono text-[10px] font-bold leading-tight',
                        pointerColor(pointerIndex)
                      )}
                    >
                      {label}▼
                    </span>
                  ))}
                </div>

                <div
                  className={cn(
                    'flex h-12 min-w-14 items-center justify-center rounded-full border px-3 font-mono text-sm font-semibold transition-all duration-300',
                    cellStateClass[node.state ?? 'idle']
                  )}
                >
                  {node.value}
                </div>
              </div>

              {index < frame.nodes.length - 1 ? (
                <span className="mt-4 text-lg text-fd-muted-foreground">
                  {arrow}
                </span>
              ) : null}
            </div>
          ))}

          {showNull ? (
            <>
              <span className="mt-4 text-lg text-fd-muted-foreground">
                {arrow}
              </span>
              <span className="mt-4 font-mono text-xs text-fd-muted-foreground">
                null
              </span>
            </>
          ) : null}
        </div>

        {hasCycle ? (
          <div className="mt-2 flex items-center gap-2 text-xs text-rose-500">
            <span className="font-mono">↺</span>
            <span>
              last node points back to index {frame.cycleTo} (value{' '}
              <code className="font-mono">
                {frame.nodes[frame.cycleTo!]?.value}
              </code>
              )
            </span>
          </div>
        ) : null}
      </div>

      <Vars vars={frame.vars} />
    </VizShell>
  );
}

export function LinkedListDiagram(
  props: ListFrame & { title?: string; caption?: string }
) {
  const { title, caption, ...frame } = props;
  return <LinkedListViz frames={[frame]} title={title} caption={caption} />;
}
