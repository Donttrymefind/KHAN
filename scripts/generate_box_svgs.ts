import fs from 'fs';
import path from 'path';

const boxes = [
  { id: 'mb_starter', name: 'Starter Box', color1: '#10b981', color2: '#059669', glow: '#34d399', icon: '⚡' },
  { id: 'mb_mini', name: 'Mini Box', color1: '#06b6d4', color2: '#0891b2', glow: '#22d3ee', icon: '🔹' },
  { id: 'mb_lucky', name: 'Lucky Box', color1: '#84cc16', color2: '#65a30d', glow: '#a3e635', icon: '🍀' },
  { id: 'mb_bronze', name: 'Bronze Box', color1: '#d97706', color2: '#b45309', glow: '#f59e0b', icon: '🥉' },
  { id: 'mb_silver', name: 'Silver Box', color1: '#94a3b8', color2: '#64748b', glow: '#cbd5e1', icon: '🥈' },
  { id: 'mb_gold', name: 'Gold Box', color1: '#f59e0b', color2: '#d97706', glow: '#fbbf24', icon: '🥇' },
  { id: 'mb_diamond', name: 'Diamond Box', color1: '#3b82f6', color2: '#1d4ed8', glow: '#60a5fa', icon: '💎' },
  { id: 'mb_premium', name: 'Premium Box', color1: '#8b5cf6', color2: '#6d28d9', glow: '#a78bfa', icon: '🔮' },
  { id: 'mb_royal', name: 'Royal Box', color1: '#ec4899', color2: '#be185d', glow: '#f472b6', icon: '👑' },
  { id: 'mb_elite', name: 'Elite Box', color1: '#0284c7', color2: '#0369a1', glow: '#38bdf8', icon: '🎖️' },
  { id: 'mb_special', name: 'Special Box', color1: '#f97316', color2: '#ea580c', glow: '#fb923c', icon: '🔥' },
  { id: 'mb_ultra', name: 'Ultra Box', color1: '#6366f1', color2: '#4338ca', glow: '#818cf8', icon: '⚡' },
  { id: 'mb_mega', name: 'Mega Box', color1: '#a855f7', color2: '#7e22ce', glow: '#c084fc', icon: '🚀' },
  { id: 'mb_legendary', name: 'Legendary Box', color1: '#ef4444', color2: '#b91c1c', glow: '#f87171', icon: '🐉' },
  { id: 'mb_ultimate', name: 'Ultimate Mystery Box', color1: '#eab308', color2: '#ca8a04', glow: '#fde047', icon: '🏆' },
];

const dir = path.join(process.cwd(), 'public/assets/branding');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

for (const b of boxes) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 320" width="100%" height="100%">
  <defs>
    <radialGradient id="bgGlow_${b.id}" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${b.glow}" stop-opacity="0.5"/>
      <stop offset="60%" stop-color="${b.color1}" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="${b.color2}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="lidGrad_${b.id}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${b.glow}"/>
      <stop offset="50%" stop-color="${b.color1}"/>
      <stop offset="100%" stop-color="${b.color2}"/>
    </linearGradient>
    <linearGradient id="bodyGrad_${b.id}" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="${b.color1}"/>
      <stop offset="100%" stop-color="#0a0518"/>
    </linearGradient>
    <linearGradient id="goldBand" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#fde047"/>
      <stop offset="50%" stop-color="#eab308"/>
      <stop offset="100%" stop-color="#ca8a04"/>
    </linearGradient>
    <filter id="glowFilter_${b.id}" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="8" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>

  <!-- Background Aura Glow -->
  <circle cx="160" cy="160" r="140" fill="url(#bgGlow_${b.id})"/>

  <!-- Chest Body (Isometric 3D) -->
  <g filter="url(#glowFilter_${b.id})">
    <!-- Bottom Shadow -->
    <ellipse cx="160" cy="275" rx="100" ry="25" fill="#000000" opacity="0.6"/>

    <!-- Main Front Face -->
    <path d="M 70 160 L 250 160 L 240 255 L 80 255 Z" fill="url(#bodyGrad_${b.id})" stroke="${b.glow}" stroke-width="3" stroke-linejoin="round"/>

    <!-- Left & Right Reinforced Metal Edges -->
    <path d="M 70 160 L 95 160 L 100 255 L 80 255 Z" fill="${b.color2}" opacity="0.8"/>
    <path d="M 225 160 L 250 160 L 240 255 L 220 255 Z" fill="${b.color2}" opacity="0.8"/>

    <!-- Center Vertical Gold Ribbon -->
    <rect x="145" y="160" width="30" height="95" fill="url(#goldBand)" opacity="0.95"/>

    <!-- Chest Lid / Top (Trapezoid 3D) -->
    <path d="M 50 160 L 75 110 L 245 110 L 270 160 Z" fill="url(#lidGrad_${b.id})" stroke="#fbbf24" stroke-width="3.5" stroke-linejoin="round"/>
    <!-- Lid Top Face -->
    <path d="M 75 110 L 115 80 L 205 80 L 245 110 Z" fill="${b.glow}" opacity="0.75" stroke="#fef08a" stroke-width="2"/>

    <!-- Golden Lock Emblem -->
    <circle cx="160" cy="160" r="24" fill="url(#goldBand)" stroke="#fef08a" stroke-width="2.5"/>
    <circle cx="160" cy="160" r="18" fill="#1e1035"/>
    <!-- Keyhole -->
    <circle cx="160" cy="156" r="5" fill="#fbbf24"/>
    <polygon points="158,158 162,158 164,168 156,168" fill="#fbbf24"/>

    <!-- Glowing Corner Rivets -->
    <circle cx="85" cy="175" r="3.5" fill="#fef08a"/>
    <circle cx="235" cy="175" r="3.5" fill="#fef08a"/>
    <circle cx="92" cy="242" r="3.5" fill="#fef08a"/>
    <circle cx="228" cy="242" r="3.5" fill="#fef08a"/>

    <!-- Light Sparks -->
    <polygon points="160,55 163,65 173,68 163,71 160,81 157,71 147,68 157,65" fill="#fef08a"/>
    <polygon points="65,95 67,102 74,104 67,106 65,113 63,106 56,104 63,102" fill="${b.glow}"/>
    <polygon points="255,95 257,102 264,104 257,106 255,113 253,106 246,104 253,102" fill="${b.glow}"/>
  </g>
</svg>`;

  fs.writeFileSync(path.join(dir, `${b.id}.svg`), svg, 'utf-8');
}

console.log('Created 15 3D Mystery Box SVGs successfully!');
