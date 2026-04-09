import clsx from "clsx";

type StatusBadgeProps = {
  value: string;
};

export function StatusBadge({ value }: StatusBadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize",
        value === "active" && "bg-emerald-100 text-emerald-700",
        value === "review" && "bg-amber-100 text-amber-700",
        value !== "active" && value !== "review" && "bg-slate-100 text-slate-700",
      )}
    >
      {value}
    </span>
  );
}
