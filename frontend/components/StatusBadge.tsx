// Status badge with dot indicator

const STATUS_CONFIG: Record<string, { bg: string; text: string; dot: string }> = {
  pending: { bg: "bg-neutral-100", text: "text-neutral-600", dot: "bg-neutral-400" },
  in_progress: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-400 animate-pulse" },
  completed: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-400" },
  failed: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-400" },
};

export default function StatusBadge({ status }: { status: string }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {status.replace("_", " ")}
    </span>
  );
}
