export default function Badge({ children, variant = 'neutral', className = '' }) {
  const variants = {
    neutral: 'bg-surface-hover text-text-muted border-border',
    primary: 'bg-primary-50 text-primary-700 border-primary-200',
    success: 'bg-success-bg text-success border-green-200',
    warning: 'bg-warning-bg text-warning border-amber-200',
    danger:  'bg-danger-bg text-danger border-red-200',
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  )
}
