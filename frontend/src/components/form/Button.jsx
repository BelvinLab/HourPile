export default function Button({
  children,
  type = 'button',
  icon,
  className = '',
  disabled,
  ...buttonProps
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`flex w-full items-center justify-center gap-2 rounded-xl bg-[#1A1523] px-4 py-3 text-sm font-semibold text-white transition-colors outline-none hover:bg-[#6C5CE7] focus-visible:ring-2 focus-visible:ring-[#6C5CE7]/40 ${className}`}
      {...buttonProps}
    >
      {icon}
      {children}
      
    </button>
  )
}
