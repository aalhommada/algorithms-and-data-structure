import { cn } from '@/lib/utils';

interface DifficultyProps {
  level: 'easy' | 'medium' | 'hard';
}

const difficultyConfig = {
  easy: {
    label: 'Easy',
    className: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
  },
  medium: {
    label: 'Medium',
    className: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20',
  },
  hard: {
    label: 'Hard',
    className: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
  },
};

export function Difficulty({ level }: DifficultyProps) {
  const config = difficultyConfig[level];

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-semibold',
        config.className
      )}
    >
      {config.label}
    </span>
  );
}
