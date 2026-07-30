'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

interface StepperOptions {
  total: number;
  intervalMs?: number;
}

export interface Stepper {
  index: number;
  total: number;
  isPlaying: boolean;
  next: () => void;
  prev: () => void;
  reset: () => void;
  toggle: () => void;
  goTo: (index: number) => void;
}

/**
 * Drives every animated visualization: a bounded cursor over a list of frames
 * plus autoplay that stops on the last frame.
 */
export function useStepper({ total, intervalMs = 1200 }: StepperOptions): Stepper {
  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const clamp = useCallback(
    (value: number) => Math.min(Math.max(value, 0), Math.max(total - 1, 0)),
    [total]
  );

  useEffect(() => {
    if (!isPlaying) return;

    timer.current = setInterval(() => {
      setIndex((current) => {
        if (current >= total - 1) {
          setIsPlaying(false);
          return current;
        }
        return current + 1;
      });
    }, intervalMs);

    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [isPlaying, intervalMs, total]);

  const next = useCallback(() => {
    setIsPlaying(false);
    setIndex((current) => clamp(current + 1));
  }, [clamp]);

  const prev = useCallback(() => {
    setIsPlaying(false);
    setIndex((current) => clamp(current - 1));
  }, [clamp]);

  const reset = useCallback(() => {
    setIsPlaying(false);
    setIndex(0);
  }, []);

  const goTo = useCallback(
    (value: number) => {
      setIsPlaying(false);
      setIndex(clamp(value));
    },
    [clamp]
  );

  const toggle = useCallback(() => {
    setIsPlaying((playing) => {
      // Restarting from the end should replay rather than sit still.
      if (!playing && index >= total - 1) setIndex(0);
      return !playing;
    });
  }, [index, total]);

  return { index, total, isPlaying, next, prev, reset, toggle, goTo };
}
