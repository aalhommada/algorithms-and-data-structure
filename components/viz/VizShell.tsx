'use client';

import type { ReactNode } from 'react';
import { Pause, Play, RotateCcw, SkipBack, SkipForward } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Stepper } from './useStepper';

interface VizShellProps {
  title?: string;
  caption?: string;
  note?: ReactNode;
  stepper?: Stepper;
  children: ReactNode;
}

/**
 * Shared chrome for every visualization: framed canvas, playback controls and
 * the per-frame narration line. Individual visualizations only draw their shape.
 */
export function VizShell({
  title,
  caption,
  note,
  stepper,
  children,
}: VizShellProps) {
  return (
    <figure className="not-prose my-6 overflow-hidden rounded-xl border bg-fd-card">
      {title ? (
        <div className="border-b bg-fd-secondary/40 px-4 py-2.5 text-sm font-semibold">
          {title}
        </div>
      ) : null}

      <div className="overflow-x-auto px-4 py-6">
        <div className="min-w-fit">{children}</div>
      </div>

      {note ? (
        <div className="border-t bg-fd-secondary/30 px-4 py-3 text-sm text-fd-muted-foreground">
          {note}
        </div>
      ) : null}

      {stepper ? <VizControls stepper={stepper} /> : null}

      {caption ? (
        <figcaption className="border-t px-4 py-2.5 text-xs text-fd-muted-foreground">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

function VizControls({ stepper }: { stepper: Stepper }) {
  const { index, total, isPlaying, next, prev, reset, toggle, goTo } = stepper;

  return (
    <div className="flex flex-wrap items-center gap-3 border-t bg-fd-secondary/40 px-4 py-3">
      <div className="flex items-center gap-1">
        <ControlButton label="Reset" onClick={reset}>
          <RotateCcw className="h-4 w-4" />
        </ControlButton>
        <ControlButton label="Previous step" onClick={prev} disabled={index === 0}>
          <SkipBack className="h-4 w-4" />
        </ControlButton>
        <ControlButton
          label={isPlaying ? 'Pause' : 'Play'}
          onClick={toggle}
          variant="primary"
        >
          {isPlaying ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
        </ControlButton>
        <ControlButton
          label="Next step"
          onClick={next}
          disabled={index >= total - 1}
        >
          <SkipForward className="h-4 w-4" />
        </ControlButton>
      </div>

      <div className="flex flex-1 items-center gap-1.5">
        {Array.from({ length: total }, (_, step) => (
          <button
            key={step}
            type="button"
            aria-label={`Go to step ${step + 1}`}
            aria-current={step === index}
            onClick={() => goTo(step)}
            className={cn(
              'h-1.5 flex-1 rounded-full transition-colors',
              step <= index ? 'bg-fd-primary' : 'bg-fd-muted'
            )}
          />
        ))}
      </div>

      <span className="font-mono text-xs tabular-nums text-fd-muted-foreground">
        {index + 1} / {total}
      </span>
    </div>
  );
}

function ControlButton({
  label,
  onClick,
  disabled,
  variant = 'ghost',
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: 'ghost' | 'primary';
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors disabled:opacity-40',
        variant === 'primary'
          ? 'bg-fd-primary text-fd-primary-foreground hover:bg-fd-primary/90'
          : 'text-fd-muted-foreground hover:bg-fd-accent hover:text-fd-accent-foreground'
      )}
    >
      {children}
    </button>
  );
}
