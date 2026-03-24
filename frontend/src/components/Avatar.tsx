interface AvatarProps {
  initials: string;
  size: 'sm' | 'md' | 'lg';
  className?: string;
}

const AVATAR_COLORS = [
  'bg-blue-500',
  'bg-green-500',
  'bg-purple-500',
  'bg-red-500',
  'bg-yellow-500',
  'bg-pink-500',
  'bg-indigo-500',
  'bg-teal-500',
];

function getColorFromInitials(initials: string): string {
  let hash = 0;
  for (let i = 0; i < initials.length; i++) {
    hash = initials.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

const SIZE_CLASSES = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-20 w-20 text-2xl',
};

export default function Avatar({ initials, size, className = '' }: AvatarProps) {
  const colorClass = getColorFromInitials(initials);
  const sizeClass = SIZE_CLASSES[size];

  return (
    <div className={`${colorClass} ${sizeClass} rounded-full flex items-center justify-center text-white font-bold ${className}`}>
      {initials}
    </div>
  );
}
