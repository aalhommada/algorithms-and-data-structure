'use client';

import { cn } from '@/lib/utils';
import { cellStateClass, type CellState } from './palette';
import { useStepper } from './useStepper';
import { Vars } from './ArrayViz';
import { VizShell } from './VizShell';

export interface MapEntry {
  key: string | number;
  value: string | number;
  state?: CellState;
}

export interface MapFrame {
  entries: MapEntry[];
  /** Optional companion array showing what the loop is scanning. */
  scan?: { values: (string | number)[]; cursor?: number };
  vars?: Record<string, string | number>;
  note?: string;
}

interface HashMapVizProps {
  frames: MapFrame[];
  title?: string;
  caption?: string;
  label?: string;
  intervalMs?: number;
}

export function HashMapViz({
  frames,
  title,
  caption,
  label = 'Hash map',
  intervalMs = 1200,
}: HashMapVizProps) {
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
      <div className="flex flex-wrap items-start gap-8">
        {frame.scan ? (
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-wide text-fd-muted-foreground">
              Scanning
            </span>
            <div className="flex gap-1">
              {frame.scan.values.map((value, index) => (
                <div
                  key={index}
                  className={cn(
                    'flex h-10 min-w-10 items-center justify-center rounded-md border px-1.5 font-mono text-xs font-semibold transition-all duration-300',
                    index === frame.scan!.cursor
                      ? cellStateClass.active
                      : index < (frame.scan!.cursor ?? -1)
                        ? cellStateClass.done
                        : cellStateClass.idle
                  )}
                >
                  {value}
                </div>
              ))}
            </div>
          </div>
        ) : null}

        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-semibold uppercase tracking-wide text-fd-muted-foreground">
            {label}
          </span>
          <div className="min-w-40 overflow-hidden rounded-md border">
            <div className="grid grid-cols-2 border-b bg-fd-secondary/50 text-[10px] font-semibold uppercase tracking-wide text-fd-muted-foreground">
              <span className="px-3 py-1.5">Key</span>
              <span className="border-l px-3 py-1.5">Value</span>
            </div>
            {frame.entries.length === 0 ? (
              <p className="px-3 py-3 text-center text-xs text-fd-muted-foreground">
                empty
              </p>
            ) : (
              frame.entries.map((entry) => (
                <div
                  key={String(entry.key)}
                  className={cn(
                    'grid grid-cols-2 border-b font-mono text-xs transition-all duration-300 last:border-b-0',
                    cellStateClass[entry.state ?? 'idle']
                  )}
                >
                  <span className="px-3 py-1.5">{entry.key}</span>
                  <span className="border-l px-3 py-1.5">{entry.value}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <Vars vars={frame.vars} />
    </VizShell>
  );
}
