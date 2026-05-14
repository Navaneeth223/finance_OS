export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="grid place-items-center rounded-lg border bg-card p-10 text-center">
      <svg aria-hidden="true" className="mb-5 h-28 w-28" viewBox="0 0 160 160" fill="none">
        <rect x="22" y="34" width="116" height="82" rx="18" fill="hsl(var(--muted))" />
        <path d="M44 80h72M44 98h40M44 62h32" stroke="hsl(var(--primary))" strokeWidth="8" strokeLinecap="round" />
        <circle cx="116" cy="112" r="22" fill="hsl(var(--accent))" />
        <path d="m106 112 7 7 14-18" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
