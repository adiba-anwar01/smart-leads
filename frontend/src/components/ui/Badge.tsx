type Variant = 'default' | 'info' | 'success' | 'warning' | 'purple' | 'danger';

interface BadgeProps {
  label: string;
  variant?: Variant;
  dot?: boolean;
  className?: string;
}

const variantStyles: Record<Variant, { bg: string; text: string; dot: string }> = {
  default:  { bg: 'bg-slate-100',   text: 'text-slate-600',   dot: 'bg-slate-400' },
  info:     { bg: 'bg-blue-50',     text: 'text-blue-700',    dot: 'bg-blue-500' },
  success:  { bg: 'bg-emerald-50',  text: 'text-emerald-700', dot: 'bg-emerald-500' },
  warning:  { bg: 'bg-amber-50',    text: 'text-amber-700',   dot: 'bg-amber-500' },
  purple:   { bg: 'bg-purple-50',   text: 'text-purple-700',  dot: 'bg-purple-500' },
  danger:   { bg: 'bg-red-50',      text: 'text-red-700',     dot: 'bg-red-500' },
};

export function Badge({ label, variant = 'default', dot = false, className = '' }: BadgeProps): React.JSX.Element {
  const styles = variantStyles[variant];
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full
        text-[11.5px] font-medium whitespace-nowrap
        ${styles.bg} ${styles.text} ${className}
      `}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${styles.dot}`} />}
      {label}
    </span>
  );
}
