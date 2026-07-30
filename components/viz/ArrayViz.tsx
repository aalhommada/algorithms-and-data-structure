'use client';

import { cn } from '@/lib/utils';
import { cellStateClass, pointerColor, type CellState } from './palette';
import { useStepper } from './useStepper';
import { VizShell } from './VizShell';

export interface ArrayPointer {
  /** Index the pointer sits under. Use -1 to hide it for this frame. */
  index: number;
  label: string;
}

export interface ArrayFrame {
  values: (string | number)[];
  /** Per-cell state, aligned with `values`. Missing entries fall back to `idle`. */
  states?: CellState[];
  pointers?: ArrayPointer[];
  /** Extra height drawn on top of a bar, e.g. trapped water. Bars variant only. */
  overlay?: number[];
  /** Named values worth watching while the algorithm runs. */
  vars?: Record<string, string | number>;
  note?: string;
}

interface ArrayVizProps {
  frames: ArrayFrame[];
  title?: string;
  caption?: string;
  showIndices?: boolean;
  variant?: 'cells' | 'bars';
  intervalMs?: number;
}

export function ArrayViz({
  frames,
  title,
  caption,
  showIndices = true,
  variant = 'cells',
  intervalMs = 1200,
}: ArrayVizProps) {
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
      {variant === 'bars' ? (
        <Bars frame={frame} showIndices={showIndices} />
      ) : (
        <Cells frame={frame} showIndices={showIndices} />
      )}
      <Vars vars={frame.vars} />
    </VizShell>
  );
}

/** Single static picture — same visual language, no playback controls. */
export function ArrayDiagram(props: ArrayFrame & { title?: string; caption?: string; variant?: 'cells' | 'bars'; showIndices?: boolean }) {
  const { title, caption, variant, showIndices, ...frame } = props;
  return (
    <ArrayViz
      frames={[frame]}
      title={title}
      caption={caption}
      variant={variant}
      showIndices={showIndices}
    />
  );
}

function Cells({
  frame,
  showIndices,
}: {
  frame: ArrayFrame;
  showIndices: boolean;
}) {
  const pointers = frame.pointers ?? [];

  return (
    <div className="flex gap-1.5">
      {frame.values.map((value, index) => {
        const state = frame.states?.[index] ?? 'idle';
        const attached = pointers.filter((pointer) => pointer.index === index);

        return (
          <div key={index} className="flex flex-col items-center gap-1">
            {showIndices ? (
              <span className="font-mono text-[10px] text-fd-muted-foreground">
                {index}
              </span>
            ) : null}

            <div
              className={cn(
                'flex h-12 min-w-12 items-center justify-center rounded-md border px-2 font-mono text-sm font-semibold transition-all duration-300',
                cellStateClass[state]
              )}
            >
              {value}
            </div>

            <div className="flex min-h-4 flex-col items-center gap-0.5">
              {attached.map((pointer) => (
                <span
                  key={pointer.label}
                  className={cn(
                    'font-mono text-[10px] font-bold leading-tight',
                    pointerColor(pointers.indexOf(pointer))
                  )}
                >
                  ▲{pointer.label}
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Bars({
  frame,
  showIndices,
}: {
  frame: ArrayFrame;
  showIndices: boolean;
}) {
  const numbers = frame.values.map((value) => Number(value) || 0);
  const overlay = frame.overlay ?? [];
  const max = Math.max(1, ...numbers.map((value, i) => value + (overlay[i] ?? 0)));
  const pointers = frame.pointers ?? [];

  return (
    <div className="flex items-end gap-1.5" style={{ height: 180 }}>
      {numbers.map((value, index) => {
        const state = frame.states?.[index] ?? 'idle';
        const attached = pointers.filter((pointer) => pointer.index === index);
        const water = overlay[index] ?? 0;

        return (
          <div
            key={index}
            className="flex h-full min-w-8 flex-col items-center justify-end gap-1"
          >
            {water > 0 ? (
              <div
                className="w-full rounded-t-sm border border-b-0 border-sky-400/60 bg-sky-400/30 transition-all duration-300"
                style={{ height: `${(water / max) * 130}px` }}
              />
            ) : null}

            <div
              className={cn(
                'flex w-full items-start justify-center rounded-t-sm border pt-1 font-mono text-[10px] font-semibold transition-all duration-300',
                cellStateClass[state]
              )}
              style={{ height: `${Math.max((value / max) * 130, 4)}px` }}
            >
              {value > 0 ? value : null}
            </div>

            {showIndices ? (
              <span className="font-mono text-[10px] text-fd-muted-foreground">
                {index}
              </span>
            ) : null}

            <div className="flex min-h-4 flex-col items-center">
              {attached.map((pointer) => (
                <span
                  key={pointer.label}
                  className={cn(
                    'font-mono text-[10px] font-bold leading-tight',
                    pointerColor(pointers.indexOf(pointer))
                  )}
                >
                  ▲{pointer.label}
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function Vars({ vars }: { vars?: Record<string, string | number> }) {
  const entries = Object.entries(vars ?? {});
  if (entries.length === 0) return null;

  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {entries.map(([key, value]) => (
        <span
          key={key}
          className="inline-flex items-center gap-1.5 rounded-md border bg-fd-secondary/60 px-2 py-1 font-mono text-xs"
        >
          <span className="text-fd-muted-foreground">{key}</span>
          <span className="font-semibold">{value}</span>
        </span>
      ))}
    </div>
  );
}
