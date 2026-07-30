'use client';

import { cn } from '@/lib/utils';
import { cellStateClass, type CellState } from './palette';
import { useStepper } from './useStepper';
import { Vars } from './ArrayViz';
import { VizShell } from './VizShell';

export interface StackItem {
  value: string | number;
  state?: CellState;
  /** Secondary line inside the slot, e.g. the running minimum in Min Stack. */
  hint?: string | number;
}

export interface StackFrame {
  /** Bottom-to-top for a stack, front-to-back for a queue. */
  items: StackItem[];
  /** What is being consumed while this frame runs. */
  input?: { values: (string | number)[]; cursor?: number };
  vars?: Record<string, string | number>;
  note?: string;
}

interface StackVizProps {
  frames: StackFrame[];
  kind?: 'stack' | 'queue';
  title?: string;
  caption?: string;
  intervalMs?: number;
}

export function StackViz({
  frames,
  kind = 'stack',
  title,
  caption,
  intervalMs = 1200,
}: StackVizProps) {
  const stepper = useStepper({ total: frames.length, intervalMs });
  const frame = frames[Math.min(stepper.index, frames.length - 1)];

  if (!frame) return null;

  return (
    <VizShell
      title={title}
      caption={caption}
      note={frame.note}
      stepper={frames.length > 1 ? stepper : undefined}
    >
      <div className="flex flex-wrap items-end gap-8">
        {frame.input ? <InputStrip input={frame.input} /> : null}
        {kind === 'stack' ? (
          <StackColumn items={frame.items} />
        ) : (
          <QueueRow items={frame.items} />
        )}
      </div>

      <Vars vars={frame.vars} />
    </VizShell>
  );
}

function InputStrip({
  input,
}: {
  input: { values: (string | number)[]; cursor?: number };
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[10px] font-semibold uppercase tracking-wide text-fd-muted-foreground">
        Input
      </span>
      <div className="flex gap-1">
        {input.values.map((value, index) => (
          <div
            key={index}
            className={cn(
              'flex h-9 min-w-9 items-center justify-center rounded-md border px-1.5 font-mono text-xs font-semibold transition-all duration-300',
              index === input.cursor
                ? cellStateClass.active
                : index < (input.cursor ?? -1)
                  ? cellStateClass.discard
                  : cellStateClass.idle
            )}
          >
            {value}
          </div>
        ))}
      </div>
    </div>
  );
}

function StackColumn({ items }: { items: StackItem[] }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[10px] font-semibold uppercase tracking-wide text-fd-muted-foreground">
        Stack (top first)
      </span>
      <div className="flex w-32 flex-col-reverse gap-1 rounded-md border-x-2 border-b-2 border-fd-border p-1.5">
        {items.length === 0 ? (
          <span className="py-3 text-center text-xs text-fd-muted-foreground">
            empty
          </span>
        ) : (
          items.map((item, index) => <Slot key={index} item={item} />)
        )}
      </div>
    </div>
  );
}

function QueueRow({ items }: { items: StackItem[] }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[10px] font-semibold uppercase tracking-wide text-fd-muted-foreground">
        Queue (front → back)
      </span>
      <div className="flex gap-1 rounded-md border-y-2 border-fd-border p-1.5">
        {items.length === 0 ? (
          <span className="px-6 py-3 text-center text-xs text-fd-muted-foreground">
            empty
          </span>
        ) : (
          items.map((item, index) => <Slot key={index} item={item} />)
        )}
      </div>
    </div>
  );
}

function Slot({ item }: { item: StackItem }) {
  return (
    <div
      className={cn(
        'flex min-h-9 min-w-9 flex-col items-center justify-center rounded-md border px-2 py-1 font-mono text-sm font-semibold transition-all duration-300',
        cellStateClass[item.state ?? 'idle']
      )}
    >
      {item.value}
      {item.hint !== undefined ? (
        <span className="text-[10px] font-normal opacity-70">{item.hint}</span>
      ) : null}
    </div>
  );
}
