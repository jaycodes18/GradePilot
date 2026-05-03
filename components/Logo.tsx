export function GradePilotLogo({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gpGrad" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#d946ef" />
        </linearGradient>
      </defs>
      {/* Rounded square bg */}
      <rect width="36" height="36" rx="10" fill="url(#gpGrad)" />
      {/* Upward trend line */}
      <polyline points="6,26 13,18 20,21 30,10" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.5" />
      {/* Graduation cap */}
      <polygon points="18,8 28,13 18,18 8,13" fill="white" opacity="0.95" />
      <line x1="28" y1="13" x2="28" y2="20" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.9" />
      <path d="M12 16.5 V21 Q18 24 24 21 V16.5" fill="white" opacity="0.8" />
    </svg>
  );
}
