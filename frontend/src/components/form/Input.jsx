export default function Input({
  label,
  id,
  required,
  icon,
  trailing,
  className = '',
  ...inputProps
}) {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-[#6B6580]">
          {label}
          {required && <span className="ml-0.5 text-red-500">*</span>}
        </label>
      )}
      <div className="relative flex items-center">
        {icon && (
          <span className="pointer-events-none absolute left-3.5 flex items-center text-[#9891AC]">
            {icon}
          </span>
        )}
        <input
          id={id}
          required={required}
          className={`w-full rounded-xl border border-[#E2DDF4] bg-white py-3 text-sm text-[#1A1523] placeholder:text-[#A79FBD] outline-none transition-colors focus:border-[#6C5CE7] focus:ring-4 focus:ring-[#6C5CE7]/15 ${
            icon ? 'pl-11' : 'pl-4'
          } ${trailing ? 'pr-11' : 'pr-4'}`}
          {...inputProps}
        />
        {trailing && (
          <span className="absolute right-3.5 flex items-center text-[#9891AC]">
            {trailing}
          </span>
        )}
      </div>
    </div>
  )
}
