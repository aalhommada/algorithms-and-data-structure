import { Clock, HardDrive } from 'lucide-react';

interface ComplexityProps {
  time: string;
  space: string;
}

export function Complexity({ time, space }: ComplexityProps) {
  return (
    <div className="not-prose my-6 flex flex-wrap gap-4">
      <div className="flex items-center gap-3 rounded-lg border bg-fd-card px-4 py-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10">
          <Clock className="h-5 w-5 text-blue-500" />
        </div>
        <div>
          <p className="text-xs font-medium text-fd-muted-foreground">
            Time Complexity
          </p>
          <p className="font-mono text-lg font-semibold">{time}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 rounded-lg border bg-fd-card px-4 py-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500/10">
          <HardDrive className="h-5 w-5 text-purple-500" />
        </div>
        <div>
          <p className="text-xs font-medium text-fd-muted-foreground">
            Space Complexity
          </p>
          <p className="font-mono text-lg font-semibold">{space}</p>
        </div>
      </div>
    </div>
  );
}
