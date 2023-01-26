type Color = `normal` | 'success' | 'warn' | 'error' | 'info' | 'custom';
type Size = `normal` | `small`;

const colorClasses = {
  normal: `BadgeNormal`,
  success: `BadgeSuccess`,
  warn: `BadgeWarn`,
  error: `BadgeError`,
  info: `BadgeInfo`,
  custom: '',
};

const sizeClasses = {
  normal: `BadgeNormal`,
  small: `BadgeSmall`,
};

function getColorClasses(color?: Color) {
  return colorClasses[color || `normal`];
}

function getSizeClasses(size?: Size) {
  return sizeClasses[size || `normal`];
}

const Badge: React.FCC<{
  color?: Color;
  size?: Size;
  className?: string;
}> = ({ children, color, size, className }) => {
  const colorClasses = getColorClasses(color);
  const sizeClasses = getSizeClasses(size);

  return (
    <div className={`Badge ${colorClasses} ${sizeClasses} ${className ?? ''}`}>
      {children}
    </div>
  );
};

export default Badge;
