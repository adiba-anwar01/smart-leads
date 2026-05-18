type SpinnerSize = 'sm' | 'md' | 'lg';
type SpinnerColor = 'primary' | 'white' | 'gray';

interface SpinnerProps {
  size?: SpinnerSize;
  color?: SpinnerColor;
  className?: string;
}

const sizeMap: Record<SpinnerSize, number> = {
  sm: 16,
  md: 24,
  lg: 40,
};

const colorStyles: Record<SpinnerColor, string> = {
  primary: 'text-primary-500',
  white: 'text-white',
  gray: 'text-gray-400',
};

export function Spinner({ size = 'md', color = 'primary', className = '' }: SpinnerProps): React.JSX.Element {
  const px = sizeMap[size];

  return (
    <svg
      className={`animate-spin-slow ${colorStyles[color]} ${className}`}
      width={px}
      height={px}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.25" />
      <path
        d="M12 2a10 10 0 0 1 10 10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
