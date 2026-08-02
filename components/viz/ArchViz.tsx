'use client';

import { cn } from '@/lib/utils';
import { useStepper } from './useStepper';
import { Vars } from './ArrayViz';
import { VizShell } from './VizShell';

/** Broad category of a box, which decides its colour and shape hint. */
export type NodeKind =
  | 'client'
  | 'edge'
  | 'service'
  | 'cache'
  | 'database'
  | 'queue'
  | 'storage'
  | 'external';

export interface ArchNode {
  id: string;
  label: string;
  /** Second line inside the box, e.g. "Redis" or "×3 replicas". */
  sublabel?: string;
  kind?: NodeKind;
  /** Normalised 0–1 grid position. */
  x: number;
  y: number;
}

export interface ArchEdge {
  from: string;
  to: string;
  label?: string;
  /** Dashed lines read as asynchronous or background work. */
  dashed?: boolean;
  /** Highlighted edges show the path being described in this frame. */
  active?: boolean;
}

export interface ArchFrame {
  edges: ArchEdge[];
  /** Node id → whether it is participating in this step. */
  active?: string[];
  /** Node id → whether it is faded out (e.g. failed, or not yet built). */
  dimmed?: string[];
  vars?: Record<string, string | number>;
  note?: string;
}

interface ArchVizProps {
  nodes: ArchNode[];
  frames: ArchFrame[];
  title?: string;
  caption?: string;
  intervalMs?: number;
  /** Canvas height in pixels. Widen rows by raising this. */
  height?: number;
}

const WIDTH = 720;
const BOX_W = 116;
const BOX_H = 52;

const kindClass: Record<NodeKind, string> = {
  client: 'fill-slate-500/10 stroke-slate-500',
  edge: 'fill-sky-500/10 stroke-sky-500',
  service: 'fill-blue-500/10 stroke-blue-500',
  cache: 'fill-amber-500/10 stroke-amber-500',
  database: 'fill-green-500/10 stroke-green-500',
  queue: 'fill-purple-500/10 stroke-purple-500',
  storage: 'fill-teal-500/10 stroke-teal-500',
  external: 'fill-fd-muted stroke-fd-border',
};

const kindLabel: Record<NodeKind, string> = {
  client: 'Client',
  edge: 'Edge',
  service: 'Service',
  cache: 'Cache',
  database: 'Database',
  queue: 'Queue',
  storage: 'Storage',
  external: 'External',
};

/**
 * Boxes-and-arrows diagrams for system design pages.
 *
 * Deliberately not a general graph renderer: positions are given explicitly so
 * a diagram reads left-to-right like the request it describes. Colour encodes
 * the *kind* of component, so a green box means "durable store" on every page.
 */
export function ArchViz({
  nodes,
  frames,
  title,
  caption,
  intervalMs = 1600,
  height = 300,
}: ArchVizProps) {
  const stepper = useStepper({ total: frames.length, intervalMs });
  const frame = frames[Math.min(stepper.index, frames.length - 1)];

  if (!frame) return null;

  const placed = new Map(
    nodes.map((node) => [
      node.id,
      {
        cx: node.x * (WIDTH - BOX_W) + BOX_W / 2,
        cy: node.y * (height - BOX_H) + BOX_H / 2,
      },
    ])
  );

  const activeSet = new Set(frame.active ?? []);
  const dimmedSet = new Set(frame.dimmed ?? []);

  /** Trim the line so it stops at the box edge rather than under it. */
  const trim = (
    from: { cx: number; cy: number },
    to: { cx: number; cy: number }
  ) => {
    const dx = to.cx - from.cx;
    const dy = to.cy - from.cy;
    // Horizontal-ish links leave from the side; vertical ones from top/bottom.
    const horizontal = Math.abs(dx) > Math.abs(dy);
    const sx = horizontal ? Math.sign(dx) * (BOX_W / 2) : 0;
    const sy = horizontal ? 0 : Math.sign(dy) * (BOX_H / 2);
    return {
      x1: from.cx + sx,
      y1: from.cy + sy,
      x2: to.cx - sx,
      y2: to.cy - sy,
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
        width={WIDTH}
        height={height}
        viewBox={`0 0 ${WIDTH} ${height}`}
        className="max-w-full"
        role="img"
      >
        <defs>
          <marker
            id="arch-arrow"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="5"
            markerHeight="5"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" className="fill-fd-muted-foreground" />
          </marker>
          <marker
            id="arch-arrow-active"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="5"
            markerHeight="5"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" className="fill-blue-500" />
          </marker>
        </defs>

        {frame.edges.map((edge, index) => {
          const from = placed.get(edge.from);
          const to = placed.get(edge.to);
          if (!from || !to) return null;

          const { x1, y1, x2, y2 } = trim(from, to);

          return (
            <g key={`edge-${index}`}>
              <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                strokeWidth={edge.active ? 2.5 : 1.5}
                strokeDasharray={edge.dashed ? '5 4' : undefined}
                className={cn(
                  'transition-all duration-300',
                  edge.active ? 'stroke-blue-500' : 'stroke-fd-border'
                )}
                markerEnd={
                  edge.active ? 'url(#arch-arrow-active)' : 'url(#arch-arrow)'
                }
              />
              {edge.label ? (
                <text
                  x={(x1 + x2) / 2}
                  y={(y1 + y2) / 2 - 6}
                  textAnchor="middle"
                  className={cn(
                    'font-mono text-[10px]',
                    edge.active
                      ? 'fill-blue-500 font-semibold'
                      : 'fill-fd-muted-foreground'
                  )}
                >
                  {edge.label}
                </text>
              ) : null}
            </g>
          );
        })}

        {nodes.map((node) => {
          const position = placed.get(node.id)!;
          const kind = node.kind ?? 'service';
          const isActive = activeSet.has(node.id);
          const isDimmed = dimmedSet.has(node.id);

          return (
            <g
              key={node.id}
              className={cn(
                'transition-opacity duration-300',
                isDimmed && 'opacity-30'
              )}
            >
              <rect
                x={position.cx - BOX_W / 2}
                y={position.cy - BOX_H / 2}
                width={BOX_W}
                height={BOX_H}
                rx={8}
                strokeWidth={isActive ? 2.5 : 1.5}
                className={cn(
                  kindClass[kind],
                  'transition-all duration-300',
                  isActive && 'stroke-blue-500'
                )}
              />
              <text
                x={position.cx}
                y={position.cy + (node.sublabel ? -5 : 0)}
                textAnchor="middle"
                dominantBaseline="central"
                className="fill-fd-foreground text-[11px] font-semibold"
              >
                {node.label}
              </text>
              {node.sublabel ? (
                <text
                  x={position.cx}
                  y={position.cy + 10}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="fill-fd-muted-foreground font-mono text-[9px]"
                >
                  {node.sublabel}
                </text>
              ) : null}
            </g>
          );
        })}
      </svg>

      <Legend nodes={nodes} />
      <Vars vars={frame.vars} />
    </VizShell>
  );
}

function Legend({ nodes }: { nodes: ArchNode[] }) {
  const kinds = Array.from(
    new Set(nodes.map((node) => node.kind ?? 'service'))
  );
  if (kinds.length <= 1) return null;

  return (
    <div className="mt-4 flex flex-wrap gap-3">
      {kinds.map((kind) => (
        <span
          key={kind}
          className="inline-flex items-center gap-1.5 text-[10px] text-fd-muted-foreground"
        >
          <svg width="12" height="12" className="shrink-0">
            <rect
              x="1"
              y="1"
              width="10"
              height="10"
              rx="2"
              strokeWidth="1.5"
              className={kindClass[kind]}
            />
          </svg>
          {kindLabel[kind]}
        </span>
      ))}
    </div>
  );
}

/** Single static diagram — no playback controls. */
export function ArchDiagram(
  props: Omit<ArchVizProps, 'frames' | 'intervalMs'> & ArchFrame
) {
  const { nodes, title, caption, height, ...frame } = props;
  return (
    <ArchViz
      nodes={nodes}
      frames={[frame]}
      title={title}
      caption={caption}
      height={height}
    />
  );
}
