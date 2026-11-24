export default function Card({ children, className = '', hover = false, padding = 'md' }) {
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  }

  return (
    <div
      className={`bg-white border border-border rounded-card shadow-card ${
        hover ? 'hover:shadow-card-hover transition-shadow' : ''
      } ${paddings[padding]} ${className}`}
    >
      {children}
    </div>
  )
}
