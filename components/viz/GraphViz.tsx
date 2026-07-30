'use client';

import { cn } from '@/lib/utils';
import { cellStateStroke, type CellState } from './palette';
import { useStepper } from './useStepper';
import { Vars } from './ArrayViz';
import { VizShell } from './VizShell';

export interface GraphNode {
  id: string | number;
  /** Normalised 0–1 coordinates. Omit to fall back to a circular layout. */
  x?: number;
  y?: number;
}

export interface GraphEdge {
  from: string | number;
  to: string | number;
  label?: string;
  highlight?: boolean;
}

export interface GraphFrame {
  edges: GraphEdge[];
  /** Node id → state. Ids not listed render as `idle`. */
  states?: Record<string, CellState>;
  vars?: Record<string, string | number>;
  note?: string;
}

interface GraphVizProps {
  nodes: GraphNode[];
  frames: GraphFrame[];
  directed?: boolean;
  title?: string;
  caption?: string;
  intervalMs?: number;
}

const RADIUS = 20;
const WIDTH = 460;
const HEIGHT = 260;

export function GraphViz({
  nodes,
  frames,
  directed = false,
  title,
  caption,
  intervalMs = 1200,
}: GraphVizProps) {
  const stepper = useStepper({ total: frames.length, intervalMs });
  const frame = frames[Math.min(stepper.index, frames.length - 1)];

  if (!frame) return null;

  const placed = new Map(
    nodes.map((node, index) => {
      const angle = (index / nodes.length) * Math.PI * 2 - Math.PI / 2;
      const x =
        node.x !== undefined
          ? node.x * (WIDTH - RADIUS * 4) + RADIUS * 2
          : WIDTH / 2 + Math.cos(angle) * (WIDTH / 2 - RADIUS * 3);
      const y =
        node.y !== undefined
          ? node.y * (HEIGHT - RADIUS * 4) + RADIUS * 2
          : HEIGHT / 2 + Math.sin(angle) * (HEIGHT / 2 - RADIUS * 2);
      return [String(node.id), { x, y }];
    })
  );

  return (
    <VizShell
      title={title}
      caption={caption}
      note={frame.note}
      stepper={frames.length > 1 ? stepper : undefined}
    >
      <svg
        width={WIDTH}
        height={HEIGHT}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="max-w-full"
        role="img"
      >
        <defs>
          <marker
            id="graph-arrow"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" className="fill-fd-muted-foreground" />
          </marker>
        </defs>

        {frame.edges.map((edge, index) => {
          const from = placed.get(String(edge.from));
          const to = placed.get(String(edge.to));
          if (!from || !to) return null;

          // Stop the line at the circle's edge so arrowheads stay visible.
          const dx = to.x - from.x;
          const dy = to.y - from.y;
          const length = Math.hypot(dx, dy) || 1;
          const x2 = to.x - (dx / length) * (RADIUS + 4);
          const y2 = to.y - (dy / length) * (RADIUS + 4);
          const x1 = from.x + (dx / length) * RADIUS;
          const y1 = from.y + (dy / length) * RADIUS;

          return (
            <g key={`edge-${index}`}>
              <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                strokeWidth={edge.highlight ? 2.5 : 1.5}
                className={
                  edge.highlight ? 'stroke-blue-500' : 'stroke-fd-border'
                }
                markerEnd={directed ? 'url(#graph-arrow)' : undefined}
              />
              {edge.label ? (
                <text
                  x={(x1 + x2) / 2}
                  y={(y1 + y2) / 2 - 5}
                  textAnchor="middle"
                  className="fill-fd-muted-foreground font-mono text-[10px]"
                >
                  {edge.label}
                </text>
              ) : null}
            </g>
          );
        })}

        {nodes.map((node) => {
          const position = placed.get(String(node.id))!;
          const state = frame.states?.[String(node.id)] ?? 'idle';

          return (
            <g key={String(node.id)}>
              <circle
                cx={position.x}
                cy={position.y}
                r={RADIUS}
                strokeWidth={2}
                className={cn(cellStateStroke[state], 'transition-all duration-300')}
              />
              <text
                x={position.x}
                y={position.y}
                textAnchor="middle"
                dominantBaseline="central"
                className="fill-fd-foreground font-mono text-xs font-semibold"
              >
                {node.id}
              </text>
            </g>
          );
        })}
      </svg>

      <Vars vars={frame.vars} />
    </VizShell>
  );
}
