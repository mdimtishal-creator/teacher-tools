export default function Spinner({ size = 'md', className = '' }) {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-3',
  }

  return (
    <span
      className={`inline-block rounded-full border-primary-200 border-t-primary-600 animate-spin ${sizes[size]} ${className}`}
    />
  )
}
