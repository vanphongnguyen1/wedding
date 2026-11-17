import { cn } from "@/lib/utils";

interface JustifiedRowsProps<T> {
  items: T[];
  getKey: (item: T) => string;
  /** width / height */
  getRatio: (item: T) => number;
  renderItem: (item: T) => React.ReactNode;
  className?: string;
}

/**
 * Google-Photos-style justified rows in pure CSS (SSR-safe, no measuring):
 * each tile grows in proportion to its aspect ratio, so tiles in a row share one height
 * and rows are flush on both edges. Nothing is cropped. The trailing spacer stops the last,
 * incomplete row from stretching. Row height is set with the `--row-h` CSS variable.
 */
export function JustifiedRows<T>({ items, getKey, getRatio, renderItem, className }: JustifiedRowsProps<T>) {
  return (
    <div
      className={cn(
        "flex flex-wrap gap-1.5 sm:gap-2 [--row-h:120px] sm:[--row-h:170px] lg:[--row-h:210px]",
        "after:content-[''] after:grow-[999]",
        className,
      )}
    >
      {items.map((item) => {
        const ratio = getRatio(item);
        return (
          <div
            key={getKey(item)}
            className="relative min-w-0"
            style={{ flexGrow: ratio, flexBasis: `calc(var(--row-h) * ${ratio})`, aspectRatio: ratio }}
          >
            {renderItem(item)}
          </div>
        );
      })}
    </div>
  );
}
