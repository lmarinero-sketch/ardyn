'use client';

import React from 'react';

interface GrowyMascotProps {
  size?: number;
  animate?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * GrowyMascot: Personaje fitness levantando una barra con pesas.
 * Diseñado con vectores SVG nítidos, detalles musculares y animación de levantamiento.
 */
export default function GrowyMascot({
  size = 40,
  animate = true,
  className = '',
  style = {},
}: GrowyMascotProps) {
  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        flexShrink: 0,
        ...style,
      }}
    >
      <svg
        viewBox="0 0 100 100"
        width="100%"
        height="100%"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          overflow: 'visible',
          filter: 'drop-shadow(0 4px 10px rgba(254, 166, 4, 0.35))',
        }}
      >
        <defs>
          {/* Gradiente de las pesas (discos dorados) */}
          <linearGradient id="plateGold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FCD34D" />
            <stop offset="50%" stopColor="#FEA604" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>

          {/* Gradiente discos interiores oscuros */}
          <linearGradient id="plateDark" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#374151" />
            <stop offset="100%" stopColor="#1F2937" />
          </linearGradient>

          {/* Gradiente de la barra de acero */}
          <linearGradient id="barSteel" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#E5E7EB" />
            <stop offset="50%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#9CA3AF" />
          </linearGradient>

          {/* Gradiente musculosa / ropa deportiva */}
          <linearGradient id="tankTop" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#6366F1" />
          </linearGradient>

          {/* Gradiente piel bronceada atlética */}
          <linearGradient id="skin" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FDE68A" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>

          {/* Gradiente cinta de pelo / vincha */}
          <linearGradient id="headband" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#FEA604" />
            <stop offset="100%" stopColor="#EF4444" />
          </linearGradient>
        </defs>

        {/* ═══ CUERPO, CABEZA Y BRAZOS (BASE) ═══ */}
        {/* Torso atlético / musculosa */}
        <path
          d="M34 62 L32 88 C32 90 35 92 40 92 L60 92 C65 92 68 90 68 88 L66 62 Z"
          fill="url(#tankTop)"
          stroke="#4C1D95"
          strokeWidth="1.5"
        />

        {/* Detalles de la musculosa (cuello en V deportivo) */}
        <path
          d="M42 62 L50 72 L58 62"
          fill="none"
          stroke="#C4B5FD"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        {/* Logo minimalista en el pecho */}
        <circle cx="50" cy="78" r="3" fill="#FEA604" />

        {/* Cinturón de pesas / faja de levantamiento */}
        <rect x="33" y="85" width="34" height="7" rx="2" fill="#18181B" stroke="#FEA604" strokeWidth="1" />
        <rect x="47" y="86" width="6" height="5" rx="1" fill="#FEA604" />

        {/* Cuello atlético */}
        <rect x="44" y="52" width="12" height="12" rx="3" fill="url(#skin)" />

        {/* Cabeza */}
        <circle cx="50" cy="42" r="14" fill="url(#skin)" stroke="#D97706" strokeWidth="1" />

        {/* Pelo corto deportivo / estilo atlético */}
        <path
          d="M36 38 C35 30 40 24 50 24 C60 24 65 30 64 38 C62 33 58 31 50 31 C42 31 38 33 36 38 Z"
          fill="#1E1B4B"
        />

        {/* Vincha / Cinta deportiva frontal */}
        <path
          d="M36 36 Q50 34 64 36 L64 40 Q50 38 36 40 Z"
          fill="url(#headband)"
          stroke="#B45309"
          strokeWidth="0.8"
        />

        {/* Ojos determinados y sonrientes */}
        <ellipse cx="44" cy="42" rx="2" ry="2.5" fill="#1E1B4B" />
        <ellipse cx="56" cy="42" rx="2" ry="2.5" fill="#1E1B4B" />
        <circle cx="44.5" cy="41.5" r="0.8" fill="#FFFFFF" />
        <circle cx="56.5" cy="41.5" r="0.8" fill="#FFFFFF" />

        {/* Cejas motivadas / en ángulo de fuerza */}
        <path d="M41 38 L47 39" stroke="#1E1B4B" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M59 38 L53 39" stroke="#1E1B4B" strokeWidth="1.2" strokeLinecap="round" />

        {/* Sonrisa ganadora */}
        <path
          d="M45 47 Q50 51 55 47"
          fill="none"
          stroke="#1E1B4B"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Mejillas sonrojadas por el esfuerzo */}
        <circle cx="41" cy="45" r="2" fill="#F87171" opacity="0.6" />
        <circle cx="59" cy="45" r="2" fill="#F87171" opacity="0.6" />

        {/* ═══ GRUPO LEVANTAMIENTO (BARRA + PESAS + BRAZOS FLEXIONADOS) ═══ */}
        <g className={animate ? 'growy-lifting-group' : ''}>
          {/* Brazo izquierdo: Bíceps marcado levantando la barra */}
          {/* Deltoides */}
          <circle cx="30" cy="62" r="6" fill="url(#skin)" stroke="#D97706" strokeWidth="0.8" />
          {/* Bíceps flexionado en V hacia arriba */}
          <path
            d="M27 62 C22 52 18 36 24 24 C28 24 32 30 32 38 C32 46 32 54 31 62 Z"
            fill="url(#skin)"
            stroke="#D97706"
            strokeWidth="1"
          />
          {/* Muñequera izquierda */}
          <rect x="20" y="21" width="8" height="4" rx="1.5" fill="#FEA604" stroke="#D97706" strokeWidth="0.5" />
          {/* Mano izquierda agarrando firmemente la barra */}
          <ellipse cx="24" cy="19" rx="4" ry="3.5" fill="url(#skin)" stroke="#D97706" strokeWidth="0.8" />

          {/* Brazo derecho: Bíceps marcado levantando la barra */}
          {/* Deltoides */}
          <circle cx="70" cy="62" r="6" fill="url(#skin)" stroke="#D97706" strokeWidth="0.8" />
          {/* Bíceps flexionado en V hacia arriba */}
          <path
            d="M73 62 C78 52 82 36 76 24 C72 24 68 30 68 38 C68 46 68 54 69 62 Z"
            fill="url(#skin)"
            stroke="#D97706"
            strokeWidth="1"
          />
          {/* Muñequera derecha */}
          <rect x="72" y="21" width="8" height="4" rx="1.5" fill="#FEA604" stroke="#D97706" strokeWidth="0.5" />
          {/* Mano derecha agarrando firmemente la barra */}
          <ellipse cx="76" cy="19" rx="4" ry="3.5" fill="url(#skin)" stroke="#D97706" strokeWidth="0.8" />

          {/* ═══ LA BARRA DE PESAS (BARBELL OLÍMPICA) ═══ */}
          {/* Barra central de acero */}
          <rect
            x="4"
            y="17"
            width="92"
            height="4"
            rx="2"
            fill="url(#barSteel)"
            stroke="#4B5563"
            strokeWidth="0.8"
          />

          {/* Topes / collares de seguridad en la barra */}
          <rect x="28" y="16" width="3" height="6" rx="1" fill="#1F2937" />
          <rect x="69" y="16" width="3" height="6" rx="1" fill="#1F2937" />

          {/* PESAS LADO IZQUIERDO */}
          {/* Disco interno grande (gris carbón / 20kg) */}
          <rect x="13" y="10" width="5" height="18" rx="2" fill="url(#plateDark)" stroke="#111827" strokeWidth="0.8" />
          {/* Disco externo grande (Dorado Ardyn / olímpico) */}
          <rect x="6" y="6" width="6" height="26" rx="2.5" fill="url(#plateGold)" stroke="#B45309" strokeWidth="1" />
          {/* Ranura central del disco dorado */}
          <line x1="9" y1="9" x2="9" y2="29" stroke="#FDE68A" strokeWidth="1" opacity="0.8" />

          {/* PESAS LADO DERECHO */}
          {/* Disco interno grande (gris carbón) */}
          <rect x="82" y="10" width="5" height="18" rx="2" fill="url(#plateDark)" stroke="#111827" strokeWidth="0.8" />
          {/* Disco externo grande (Dorado Ardyn / olímpico) */}
          <rect x="88" y="6" width="6" height="26" rx="2.5" fill="url(#plateGold)" stroke="#B45309" strokeWidth="1" />
          {/* Ranura central del disco dorado */}
          <line x1="91" y1="9" x2="91" y2="29" stroke="#FDE68A" strokeWidth="1" opacity="0.8" />

          {/* Chispas de fuerza / destello en la barra */}
          <path d="M50 8 L51 12 L53 13 L51 14 L50 18 L49 14 L47 13 L49 12 Z" fill="#FCD34D" opacity="0.9" />
          <circle cx="8" cy="5" r="1.5" fill="#FEA604" />
          <circle cx="92" cy="5" r="1.5" fill="#FEA604" />
        </g>
      </svg>

      <style jsx>{`
        .growy-lifting-group {
          transform-origin: 50% 60%;
          animation: growyBenchLift 2.4s ease-in-out infinite;
        }

        @keyframes growyBenchLift {
          0%, 100% {
            transform: translateY(0) scale(1);
          }
          30% {
            transform: translateY(-4px) scale(1.02);
          }
          45% {
            transform: translateY(-5px) scale(1.03);
          }
          70% {
            transform: translateY(-1px) scale(1);
          }
        }
      `}</style>
    </div>
  );
}
