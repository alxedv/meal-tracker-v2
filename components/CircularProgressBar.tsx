import React from 'react';

interface CircularProgressBarProps {
  value: number;
  max: number;
  label: string;
  unit?: string;
  size: number;
  strokeWidth: number;
  primaryColor?: string;
  dangerColor?: string;
}

const CircularProgressBar: React.FC<CircularProgressBarProps> = ({
  value,
  max,
  label,
  unit = '',
  size,
  strokeWidth,
  primaryColor = 'hsl(var(--primary))',
  dangerColor = 'hsl(var(--destructive))',
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = max > 0 ? Math.min(value / max, 1) : 0;
  const offset = circumference - percentage * circumference;
  const isOverGoal = value > max && max > 0;
  const strokeColor = isOverGoal ? dangerColor : primaryColor;

  return (
    <div className="flex flex-col items-center justify-center gap-1">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
          <circle
            className="text-secondary"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
          <circle
            className="transition-all duration-500 ease-out"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
            style={{ strokeDasharray: circumference, strokeDashoffset: offset }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className={`font-bold text-card-foreground ${size > 100 ? 'text-2xl' : 'text-lg'}`}>
              {value.toFixed(0)}
            </span>
            <span className="text-xs text-muted-foreground">/ {max}{unit}</span>
        </div>
      </div>
      <span className="font-semibold text-sm text-card-foreground">{label}</span>
    </div>
  );
};

export default CircularProgressBar;
