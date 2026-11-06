type ChartAction = 'reset' | 'focus' | 'grid' | 'help'

export function ChartActionIcon({ action }: { action: ChartAction }) {
  return <svg aria-hidden="true" className="chart-action-icon" fill="none" focusable="false" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
    {action === 'reset' && <>
      <path d="M3 10a9 9 0 1 1 2 8" />
      <path d="M3 3v7h7" />
    </>}
    {action === 'focus' && <path d="M4 20 20 4M5 4h15v15" />}
    {action === 'grid' && <>
      <rect height="18" rx="1" width="18" x="3" y="3" />
      <path d="M12 3v18M3 12h18" />
    </>}
    {action === 'help' && <>
      <path d="M7.5 7.5a4.5 4.5 0 0 1 9 0c0 3-4.5 3-4.5 6v1" />
      <circle cx="12" cy="20" fill="currentColor" r="1.25" stroke="none" />
    </>}
  </svg>
}
