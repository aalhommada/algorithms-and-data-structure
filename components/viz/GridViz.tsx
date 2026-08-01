'use client';

import { cn } from '@/lib/utils';
import { cellStateClass, type CellState } from './palette';
import { useStepper } from './useStepper';
import { Vars } from './ArrayViz';
import { VizShell } from './VizShell';

export interface GridFrame {
  /** Row-major cell contents. Every row should be the same length. */
  cells: (string | number)[][];
  /** Per-cell state, same shape as `cells`. Missing entries fall back to `idle`. */
  states?: (CellState | undefined)[][];
  /** The cell currently being examined, drawn with a ring. */
  cursor?: { row: number; col: number };
  /** Values collected so far, e.g. a traversal order or an answer list. */
  output?: (string | number)[];
  vars?: Record<string, string | number>;
  note?: string;
}

interface GridVizProps {
  frames: GridFrame[];
  title?: string;
  caption?: string;
  /** Show row and column numbers around the edge. */
  showIndices?: boolean;
  intervalMs?: number;
}

/**
 * A 2D companion to `ArrayViz`, for matrix and grid problems.
 *
 * Shares the same colour vocabulary and playback chrome as every other
 * visualization, so a green cell means the same thing here as it does in an
 * array or a tree.
 */
export function GridViz({
  frames,
  title,
  caption,
  showIndices = true,
  intervalMs = 900,
}: GridVizProps) {
  const stepper = useStepper({ total: frames.length, intervalMs });
  const frame = frames[Math.min(stepper.index, frames.length - 1)];

  if (!frame) return null;

  const columns = frame.cells[0]?.length ?? 0;

  return (
    <VizShell
      title={title}
      caption={caption}
      note={frame.note}
      stepper={frames.length > 1 ? stepper : undefined}
    >
      <div className="inline-flex flex-col gap-1">
        {showIndices && columns > 0 ? (
          <div className="flex gap-1 pl-6">
            {Array.from({ length: columns }, (_, col) => (
              <span
                key={col}
                className="w-10 text-center font-mono text-[10px] text-fd-muted-foreground"
              >
                {col}
              </span>
            ))}
          </div>
        ) : null}

        {frame.cells.map((row, rowIndex) => (
          <div key={rowIndex} className="flex items-center gap-1">
            {showIndices ? (
              <span className="w-5 text-right font-mono text-[10px] text-fd-muted-foreground">
                {rowIndex}
              </span>
            ) : null}

            {row.map((value, colIndex) => {
              const state = frame.states?.[rowIndex]?.[colIndex] ?? 'idle';
              const isCursor =
                frame.cursor?.row === rowIndex && frame.cursor?.col === colIndex;

              return (
                <div
                  key={colIndex}
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-md border font-mono text-sm font-semibold transition-all duration-300',
                    cellStateClass[state],
                    isCursor && 'ring-2 ring-fd-primary ring-offset-1 ring-offset-fd-card'
                  )}
                >
                  {value}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {frame.output ? (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-wide text-fd-muted-foreground">
            Output
          </span>
          <code className="rounded-md bg-fd-secondary px-2 py-1 font-mono text-xs">
            [{frame.output.join(', ')}]
          </code>
        </div>
      ) : null}

      <Vars vars={frame.vars} />
    </VizShell>
  );
}

/** Single static picture — same visual language, no playback controls. */
export function GridDiagram(
  props: GridFrame & { title?: string; caption?: string; showIndices?: boolean }
) {
  const { title, caption, showIndices, ...frame } = props;
  return (
    <GridViz
      frames={[frame]}
      title={title}
      caption={caption}
      showIndices={showIndices}
    />
  );
}
