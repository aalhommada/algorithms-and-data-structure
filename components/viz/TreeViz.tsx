'use client';

import { cn } from '@/lib/utils';
import { cellStateStroke, type CellState } from './palette';
import { useStepper } from './useStepper';
import { Vars } from './ArrayViz';
import { VizShell } from './VizShell';

export interface TreeFrame {
  /**
   * Level-order (LeetCode style) node values. Use `null` for a missing child.
   * Index i has children at 2i+1 and 2i+2.
   */
  nodes: (string | number | null)[];
  /** Per-index state, aligned with `nodes`. */
  states?: (CellState | undefined)[];
  /** Values collected so far, e.g. the traversal output. */
  output?: (string | number)[];
  vars?: Record<string, string | number>;
  note?: string;
}

interface TreeVizProps {
  frames: TreeFrame[];
  title?: string;
  caption?: string;
  intervalMs?: number;
}

const NODE_RADIUS = 18;
const LEVEL_HEIGHT = 72;

export function TreeViz({
  frames,
  title,
  caption,
  intervalMs = 1200,
}: TreeVizProps) {
  const stepper = useStepper({ total: frames.length, intervalMs });
  const frame = frames[Math.min(stepper.index, frames.length - 1)];

  if (!frame) return null;

  const depth = Math.max(1, Math.ceil(Math.log2(frame.nodes.length + 1)));
  const width = Math.max(320, 2 ** (depth - 1) * 72);
  const height = depth * LEVEL_HEIGHT;

  const positionOf = (index: number) => {
    const level = Math.floor(Math.log2(index + 1));
    const offset = index - (2 ** level - 1);
    const slots = 2 ** level;
    return {
      x: ((offset + 0.5) / slots) * width,
      y: level * LEVEL_HEIGHT + NODE_RADIUS + 6,
    };
  };

  return (
    <VizShell
      title={title}
      caption={caption}
      note={frame.note}
      stepper={frames.length > 1 ? stepper : undefined}
    >
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="max-w-full"
        role="img"
      >
        {frame.nodes.map((value, index) => {
          if (value === null || value === undefined) return null;
          const parent = Math.floor((index - 1) / 2);
          if (index === 0 || frame.nodes[parent] == null) return null;

          const from = positionOf(parent);
          const to = positionOf(index);
          return (
            <line
              key={`edge-${index}`}
              x1={from.x}
              y1={from.y + NODE_RADIUS}
              x2={to.x}
              y2={to.y - NODE_RADIUS}
              className="stroke-fd-border"
              strokeWidth={1.5}
            />
          );
        })}

        {frame.nodes.map((value, index) => {
          if (value === null || value === undefined) return null;
          const { x, y } = positionOf(index);
          const state = frame.states?.[index] ?? 'idle';

          return (
            <g key={`node-${index}`} className="transition-all duration-300">
              <circle
                cx={x}
                cy={y}
                r={NODE_RADIUS}
                className={cn(cellStateStroke[state], 'transition-all duration-300')}
                strokeWidth={2}
              />
              <text
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="central"
                className="fill-fd-foreground font-mono text-xs font-semibold"
              >
                {value}
              </text>
            </g>
          );
        })}
      </svg>

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

export function TreeDiagram(
  props: TreeFrame & { title?: string; caption?: string }
) {
  const { title, caption, ...frame } = props;
  return <TreeViz frames={[frame]} title={title} caption={caption} />;
}
