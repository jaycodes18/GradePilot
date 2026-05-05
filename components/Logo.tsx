"use client";

import { useId } from "react";

/** Rounded-square mark — ascending bars + trajectory. Uses unique SVG ids for multi-instance pages. */
export function GradePilotLogo({ size = 36 }: { size?: number }) {
  const uid = useId().replace(/:/g, "");
  const gradId = `gp-grad-${uid}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden>
      <defs>
        <linearGradient id={gradId} x1="8" y1="6" x2="34" y2="36" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1e3a8a" />
          <stop offset="1" stopColor="#3730a3" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="10" fill={`url(#${gradId})`} />
      {/* Smooth trajectory */}
      <path
        d="M11 26.5c4.2-5.8 9.8-10.7 17.5-13"
        stroke="white"
        strokeOpacity={0.28}
        strokeWidth={2}
        strokeLinecap="round"
      />
      {/* Rising bars */}
      <rect x="10" y="24" width="5.5" height="8" rx="1.25" fill="white" fillOpacity={0.82} />
      <rect x="17.25" y="19" width="5.5" height="13" rx="1.25" fill="white" fillOpacity={0.92} />
      <rect x="24.5" y="12.5" width="5.5" height="19.5" rx="1.25" fill="white" />
      {/* Accent node */}
      <circle cx="29.5" cy="11.5" r="2.75" fill="#93c5fd" />
    </svg>
  );
}
