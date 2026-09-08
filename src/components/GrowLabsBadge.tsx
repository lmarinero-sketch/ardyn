'use client';

import React from 'react';

interface GrowLabsBadgeProps {
  className?: string;
  style?: React.CSSProperties;
}

export default function GrowLabsBadge({ className, style }: GrowLabsBadgeProps) {
  return (
    <a
      href="https://www.growlabs.lat"
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.625rem',
        textDecoration: 'none',
        padding: '0.45rem 0.95rem',
        borderRadius: '9999px',
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        color: '#FFFFFF',
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        backdropFilter: 'blur(8px)',
        cursor: 'pointer',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.4)',
        ...style,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
        e.currentTarget.style.borderColor = 'rgba(254, 166, 4, 0.4)';
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 6px 20px rgba(254, 166, 4, 0.25)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.4)';
      }}
    >
      <span style={{ fontSize: '0.8125rem', color: '#D4D4D8', fontWeight: 500 }}>
        Hecho por
      </span>
      <img
        src="/logogrow.png"
        alt="Grow Labs"
        width={22}
        height={22}
        style={{
          objectFit: 'contain',
          display: 'block',
          filter: 'drop-shadow(0 0 6px rgba(255, 255, 255, 0.3))'
        }}
      />
      <span style={{
        fontWeight: 800,
        fontSize: '0.875rem',
        letterSpacing: '0.02em',
        background: 'linear-gradient(135deg, #FFFFFF 0%, #FEA604 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}>
        Grow Labs
      </span>
    </a>
  );
}
