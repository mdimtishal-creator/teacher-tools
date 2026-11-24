export default function Input({
  label,
  error,
  helper,
  className = '',
  id,
  ...props
}) {
  const inputId = id || props.name

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-dark mb-1.5">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`w-full px-4 py-2.5 bg-white border rounded-lg text-dark placeholder-text-subtle focus:outline-none focus:ring-2 transition ${
          error
            ? 'border-danger focus:ring-danger/20 focus:border-danger'
            : 'border-border focus:ring-primary-500/20 focus:border-primary-500'
        } ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
      {helper && !error && <p className="mt-1 text-xs text-text-muted">{helper}</p>}
    </div>
  )
}
