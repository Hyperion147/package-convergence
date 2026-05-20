import React from "react";

export function ConvergenceMark({
  size = 22,
}: {
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="convergence-roller-body" x1="98" y1="70" x2="410" y2="360">
          <stop offset="0" stopColor="#86EFAC" />
          <stop offset="0.45" stopColor="#34D399" />
          <stop offset="1" stopColor="#0F766E" />
        </linearGradient>
        <linearGradient id="convergence-roller-head" x1="175" y1="8" x2="446" y2="118">
          <stop offset="0" stopColor="#ECFDF5" />
          <stop offset="0.35" stopColor="#A7F3D0" />
          <stop offset="1" stopColor="#34D399" />
        </linearGradient>
        <linearGradient id="convergence-handle" x1="218" y1="390" x2="263" y2="512">
          <stop offset="0" stopColor="#E5E7EB" />
          <stop offset="0.4" stopColor="#94A3B8" />
          <stop offset="1" stopColor="#334155" />
        </linearGradient>
      </defs>

      <path
        d="M249 297.82c0-31.312-23.952-56.82-55.265-56.82h-57.783C108.485 241 85 218.686 85 191.22v-79.701c0-26.645 19.797-48.565 45.404-50.647.327.143.596.267.596.375V69h24V34h-24v6.859c-16 .755-33.499 8.113-46.028 20.93C71.851 75.211 65 92.872 65 111.519v79.701C65 229.673 97.499 261 135.952 261h57.783C214.061 261 229 277.494 229 297.82V338h-11v52h45v-52h-14v-40.18Z"
        fill="url(#convergence-roller-body)"
      />
      <rect x="240" y="2" width="141" height="99" rx="18" fill="url(#convergence-roller-head)" />
      <path
        d="M194.467 101H220V2h-25.533C184.512 2 175 10.029 175 19.985v62.5C175 92.44 184.512 101 194.467 101Z"
        fill="url(#convergence-roller-body)"
      />
      <path
        d="M429.381 2H400v99h29.381C439.337 101 446 92.44 446 82.485v-62.5C446 10.029 439.337 2 429.381 2Z"
        fill="url(#convergence-roller-body)"
      />
      <path
        d="M387.628 121H304v59.545c0 9.361 8.256 16.977 17.595 16.977 9.339 0 17.266-7.616 17.266-16.977 0-5.502 4.068-9.963 9.57-9.963 5.502 0 9.57 4.46 9.57 9.963v32.328c0 9.361 7.161 16.977 16.5 16.977s16.5-7.616 16.5-16.977v-91.442c0 .033.334.318-.002.318-1.57 0-2.052.251-3.372.251Z"
        fill="#10B981"
      />
      <path
        d="M218 487.658c0 12.333 10.168 22.365 22.499 22.365 12.333 0 22.501-10.033 22.501-22.365V410h-45v77.658Z"
        fill="url(#convergence-handle)"
      />
      <path
        d="M193 42c20-13 41-19 66-19h152"
        stroke="rgba(255,255,255,0.55)"
        strokeWidth="16"
        strokeLinecap="round"
      />
      <circle cx="365" cy="63" r="18" fill="rgba(255,255,255,0.33)" />
    </svg>
  );
}
