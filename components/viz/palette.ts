/**
 * One colour vocabulary shared by every visualization so a green cell always
 * means the same thing whether it is an array slot, a tree node or a stack item.
 */
export type CellState =
  | 'idle'
  | 'active'
  | 'compare'
  | 'match'
  | 'done'
  | 'discard';

export const cellStateClass: Record<CellState, string> = {
  idle: 'border-fd-border bg-fd-card text-fd-foreground',
  active:
    'border-blue-500 bg-blue-500/15 text-blue-700 dark:text-blue-300 ring-2 ring-blue-500/30',
  compare:
    'border-amber-500 bg-amber-500/15 text-amber-700 dark:text-amber-300',
  match:
    'border-green-500 bg-green-500/20 text-green-700 dark:text-green-300 ring-2 ring-green-500/30',
  done: 'border-purple-500/40 bg-purple-500/10 text-purple-700 dark:text-purple-300',
  discard: 'border-fd-border bg-fd-muted/40 text-fd-muted-foreground opacity-50',
};

export const cellStateStroke: Record<CellState, string> = {
  idle: 'stroke-fd-border fill-fd-card',
  active: 'stroke-blue-500 fill-blue-500/15',
  compare: 'stroke-amber-500 fill-amber-500/15',
  match: 'stroke-green-500 fill-green-500/20',
  done: 'stroke-purple-500/50 fill-purple-500/10',
  discard: 'stroke-fd-border fill-fd-muted/40',
};

export const pointerColorClass: Record<string, string> = {
  blue: 'text-blue-500',
  amber: 'text-amber-500',
  green: 'text-green-500',
  purple: 'text-purple-500',
  rose: 'text-rose-500',
};

export function pointerColor(index: number): string {
  const keys = Object.keys(pointerColorClass);
  return pointerColorClass[keys[index % keys.length]];
}
