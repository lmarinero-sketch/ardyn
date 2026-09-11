'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Zap, HeartPulse, Sparkles, LayoutGrid, Eye, Flame, Store, Video } from 'lucide-react';

export default function ModelSwitcher({ current }: { current?: 'hub' | '1' | '2' | '3' | '4' | '5' }) {
  const pathname = usePathname();

  const models = [
    {
      id: '1',
      path: '/bocetos/modelo-1',
      title: 'Mod. 1',
      subtitle: 'Cyber Athletic',
      fontName: 'Bebas Neue',
      icon: <Zap size={14} color="#FEA604" />,
      color: '#FEA604',
    },
    {
      id: '2',
      path: '/bocetos/modelo-2',
      title: 'Mod. 2',
      subtitle: 'Clinical Health',
      fontName: 'Jakarta Sans',
      icon: <HeartPulse size={14} color="#FEA604" />,
      color: '#FEA604',
    },
    {
      id: '3',
      path: '/bocetos/modelo-3',
      title: 'Mod. 3',
      subtitle: 'Urban Luxury',
      fontName: 'Syne / Luxe',
      icon: <Sparkles size={14} color="#FEA604" />,
      color: '#FEA604',
    },
    {
      id: '4',
      path: '/bocetos/modelo-4',
      title: 'Mod. 4',
      subtitle: 'Neo-Retail Pro',
      fontName: 'Outfit / Sora',
      icon: <Store size={14} color="#FD8209" />,
      color: '#FD8209',
    },
    {
      id: '5',
      path: '/bocetos/modelo-5',
      title: 'Mod. 5',
      subtitle: 'Ardyn Classic',
      fontName: 'Inter / Video',
      icon: <Video size={14} color="#FEA604" />,
      color: '#FEA604',
    },
  ];

  return (
    <aside
      aria-label="Selector de bocetos visuales de ecommerce"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 9999,
        background: 'rgba(8, 9, 12, 0.94)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(254, 166, 4, 0.25)',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.7)',
        padding: '0.45rem 1rem',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: '1440px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.6rem',
        }}
      >
        {/* Brand Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.25rem 0.65rem',
              background: 'linear-gradient(135deg, rgba(254, 166, 4, 0.25), rgba(253, 130, 9, 0.25))',
              border: '1px solid rgba(254, 166, 4, 0.5)',
              borderRadius: '8px',
              color: '#FEA604',
              fontWeight: 900,
              fontSize: '0.78rem',
              letterSpacing: '0.06em',
            }}
          >
            <Eye size={13} />
            <span>ARDYN SHOWCASE // 5 MODELOS</span>
          </div>
          <span style={{ color: '#71717A', fontSize: '0.72rem' }} className="hide-mobile">
            Paleta Oficial Ardyn (#FEA604 • #FD8209)
          </span>
        </div>

        {/* Switcher Navigation */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(255, 255, 255, 0.04)',
            padding: '3px',
            borderRadius: '10px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            gap: '3px',
            overflowX: 'auto',
          }}
        >
          {/* Hub */}
          <Link
            href="/bocetos"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.4rem 0.7rem',
              borderRadius: '7px',
              fontSize: '0.75rem',
              fontWeight: pathname === '/bocetos' ? 800 : 500,
              color: pathname === '/bocetos' ? '#FFFFFF' : '#A1A1AA',
              background: pathname === '/bocetos' ? 'rgba(254, 166, 4, 0.2)' : 'transparent',
              border: pathname === '/bocetos' ? '1px solid rgba(254, 166, 4, 0.4)' : '1px solid transparent',
              textDecoration: 'none',
              transition: 'all 0.15s ease',
              whiteSpace: 'nowrap',
            }}
          >
            <LayoutGrid size={13} />
            <span>Panel General</span>
          </Link>

          {/* 4 Models */}
          {models.map((m) => {
            const isActive = pathname === m.path || current === m.id;
            return (
              <Link
                key={m.id}
                href={m.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.4rem 0.75rem',
                  borderRadius: '7px',
                  fontSize: '0.75rem',
                  fontWeight: isActive ? 800 : 500,
                  color: isActive ? '#FFFFFF' : '#D4D4D8',
                  background: isActive
                    ? 'linear-gradient(135deg, rgba(254, 166, 4, 0.35), rgba(253, 130, 9, 0.2))'
                    : 'transparent',
                  border: isActive ? '1px solid #FEA604' : '1px solid transparent',
                  boxShadow: isActive ? '0 0 14px rgba(254, 166, 4, 0.25)' : 'none',
                  textDecoration: 'none',
                  transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap',
                }}
              >
                {m.icon}
                <span><strong>{m.title}:</strong> {m.subtitle}</span>
                <span
                  style={{
                    fontSize: '0.62rem',
                    opacity: 0.7,
                    padding: '1px 4px',
                    borderRadius: '4px',
                    background: 'rgba(255,255,255,0.08)',
                    marginLeft: '2px',
                  }}
                >
                  {m.fontName}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Back Link */}
        <Link
          href="/minorista"
          style={{
            fontSize: '0.72rem',
            color: '#A1A1AA',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
            padding: '0.3rem 0.6rem',
            borderRadius: '6px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <span>Tienda Actual ↗</span>
        </Link>
      </div>
    </aside>
  );
}
