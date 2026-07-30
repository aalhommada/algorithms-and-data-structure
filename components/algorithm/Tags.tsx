interface TagsProps {
  items: string[];
}

export function Tags({ items }: TagsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center rounded-md bg-fd-secondary px-2.5 py-1 text-xs font-medium text-fd-secondary-foreground"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}
