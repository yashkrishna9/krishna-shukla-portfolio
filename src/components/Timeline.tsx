import type { JourneyStatus, TimelineItem } from "@content/profile";

const label: Record<JourneyStatus, string> = { planned: "Planned", "in-progress": "In progress", completed: "Completed" };
const dot: Record<JourneyStatus, string> = {
  planned: "border-line-strong bg-bg",
  "in-progress": "border-cyan bg-cyan/30",
  completed: "border-accent bg-accent",
};
const text: Record<JourneyStatus, string> = { planned: "text-muted", "in-progress": "text-cyan", completed: "text-accent" };

/** A vertical timeline. The status uses text as well as colour so it is not colour-only. */
export function Timeline({ items }: { items: TimelineItem[] }) {
  return (
    <ol className="relative ml-2 border-l border-line-strong">
      {items.map((it) => (
        <li key={it.title} className="relative pb-9 pl-8 last:pb-0">
          <span className={`absolute -left-[7px] top-1.5 size-3.5 rounded-full border-2 ${dot[it.status]}`} aria-hidden />
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h3 className="display text-2xl leading-snug">{it.title}</h3>
            <span className={`text-sm ${text[it.status]}`}>{label[it.status]}</span>
          </div>
          <p className="mt-1 text-sm text-muted">{it.when}</p>
          <p className="mt-2 max-w-xl leading-relaxed text-muted">{it.detail}</p>
        </li>
      ))}
    </ol>
  );
}
