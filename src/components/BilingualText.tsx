import { cn } from "@/utils/cn";
import type { Bilingual } from "@/types";

interface Props {
  value: Bilingual;
  className?: string;
  hiClassName?: string;
  enClassName?: string;
  /** When true, renders as a single inline-flow block. Default stacks Hindi on top. */
  inline?: boolean;
}

export default function BilingualText({
  value,
  className,
  hiClassName,
  enClassName,
  inline = false,
}: Props) {
  if (inline) {
    return (
      <span className={cn("inline-flex flex-wrap items-baseline gap-2", className)}>
        <span lang="hi" className={cn("font-hindi", hiClassName)}>
          {value.hi}
        </span>
        <span className="text-muted-foreground">•</span>
        <span lang="en" className={enClassName}>
          {value.en}
        </span>
      </span>
    );
  }
  return (
    <span className={cn("flex flex-col gap-1", className)}>
      <span lang="hi" className={cn("font-hindi leading-snug", hiClassName)}>
        {value.hi}
      </span>
      <span lang="en" className={cn("leading-snug", enClassName)}>
        {value.en}
      </span>
    </span>
  );
}
