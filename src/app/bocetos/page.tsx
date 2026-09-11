'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  Zap,
  HeartPulse,
  Sparkles,
  Store,
  Video,
  ArrowRight,
  CheckCircle2,
  ShoppingCart,
  ShieldCheck,
  Flame,
  Compass,
  Type,
  Palette,
} from 'lucide-react';
import ModelSwitcher from '@/components/bocetos/ModelSwitcher';
import { useStoreConfig } from '@/hooks/useStoreConfig';

export default function BocetosHubPage() {
  const { config: identidad } = useStoreConfig('tienda_identidad');
  const logoSrc = identidad.logo_url || '/logo-ardyn.png';
  const models = [
    {
      id: '1',
      title: 'Modelo 1: Dark Cyber Performance',
      badge: 'Hardcore Athletic & Pro Fitness',
      theme: 'Dark Mode High Impact',
      fontTitle: 'Bebas Neue',
      fontDesc: 'Display condensado, agresivo y de máxima escala',
      palette: ['#08090C', '#FEA604', '#FD8209', '#00FF88'],
      description:
        'Diseñado para culturistas, crossfitters y atletas de fuerza. Enfatiza récords personales, dosis de cafeína, asimilación veloz y estética de alto impacto visual.',
      highlights: [
        'Tipografía titular Bebas Neue de gran impacto',
        'Badges dinámicos de "Fuego" (Top Seller) y "+Coins"',
        'Selector de sabores instantáneo sin salir de la tarjeta',
        'Barra de progreso de envío gratis con cálculo de Ardyn Coins',
        'Paleta Ardyn Gold (#FEA604) sobre carbón profundo (#08090C)',
      ],
      link: '/bocetos/modelo-1',
      accentColor: '#FEA604',
      icon: <Zap size={24} color="#FEA604" />,
      heroImage: '/productos/whey-protein.png',
      ctaText: 'Ver Modelo 1',
    },
    {
      id: '2',
      title: 'Modelo 2: Pure Clinical Health',
      badge: 'Nutrición Médica & Longevidad',
      theme: 'Clínica Limpia QOAG / Sanatorio',
      fontTitle: 'Plus Jakarta Sans',
      fontDesc: 'Geométrica humanista, pureza y rigor científico',
      palette: ['#FFFFFF', '#F8FAFC', '#FEA604', '#0284C7'],
      description:
        'Alineado a las directrices de Sanatorio Argentino y Grow Labs. Una interfaz clínica y luminosa con sellos de trazabilidad, aprobación ANMAT y asesoría farmacéutica.',
      highlights: [
        'Tipografía limpia Plus Jakarta Sans de lectura óptima',
        'Acentos dorados oficiales Ardyn (#FEA604) combinados con azul clínico',
        'Sellos visibles: Aprobado ANMAT, Sin TACC, Libre de Azúcar',
        'Modal con Ficha Técnica y Tabla Nutricional completa',
        'Botón de consulta médica y pedido directo a farmacia/depósito',
      ],
      link: '/bocetos/modelo-2',
      accentColor: '#FEA604',
      icon: <HeartPulse size={24} color="#FEA604" />,
      heroImage: '/productos/omega3.png',
      ctaText: 'Ver Modelo 2',
    },
    {
      id: '3',
      title: 'Modelo 3: Urban Luxury Activewear',
      badge: 'Lifestyle & High-End Apparel',
      theme: 'Minimalismo Editorial & Streetwear',
      fontTitle: 'Syne',
      fontDesc: 'Tipografía de moda de vanguardia con tracking espaciado',
      palette: ['#0E0F12', '#181920', '#FEA604', '#F4F4F5'],
      description:
        'Inspirado en marcas internacionales de lujo deportivo (Alo Yoga, Represent 247). Enfatiza la indumentaria deportiva de autor, cortes boxy fit y lookbooks de temporada.',
      highlights: [
        'Tipografía titular Syne con identidad de alta costura',
        'Paleta Noir Mate con detalles en oro champagne Ardyn (#FEA604)',
        'Selector visual de paleta de colores (swatches interactivos)',
        'Selector de talles (S, M, L, XL, XXL) para indumentaria',
        'Módulo "Completá tu outfit" (Bundle con 20% de ahorro)',
      ],
      link: '/bocetos/modelo-3',
      accentColor: '#FEA604',
      icon: <Sparkles size={24} color="#FEA604" />,
      heroImage: '/productos/camiseta.png',
      ctaText: 'Ver Modelo 3',
    },
    {
      id: '4',
      title: 'Modelo 4: Ardyn Neo-Retail (Actual Evolucionado)',
      badge: 'Ecommerce Minorista Oficial',
      theme: 'Retail Moderno de Alta Conversión',
      fontTitle: 'Outfit / Sora',
      fontDesc: 'Moderna, comercial, contundente y amigable',
      palette: ['#0A0A0C', '#FEA604', '#FD8209', '#34D399'],
      description:
        'La evolución directa de la tienda actual de Ardyn llevada al estándar visual más alto. Navegación fluida por rubros (Suplementos, Indumentaria, Accesorios), ofertas y checkout rápido.',
      highlights: [
        'Tipografía comercial moderna Outfit & Sora',
        'Identidad 100% fiel al logo oficial de Ardyn (#FEA604 • #FD8209)',
        'Navegación rápida por rubros con conteo de stock disponible',
        'Badges dobles: "Oferta", "Destacado" y "+Coins Ganadas"',
        'Checkout conversacional directo a WhatsApp con carrito desplegable',
      ],
      link: '/bocetos/modelo-4',
      accentColor: '#FD8209',
      icon: <Store size={24} color="#FD8209" />,
      heroImage: '/productos/creatina.png',
      ctaText: 'Ver Modelo 4 (Actual)',
    },
    {
      id: '5',
      title: 'Modelo 5: Ardyn Classic (Original con Video)',
      badge: 'Diseño Original con Video & Atletas',
      theme: 'Classic Hero + 16:9 Video Embebido',
      fontTitle: 'Inter',
      fontDesc: 'Limpia, equilibrada y probada en producción',
      palette: ['#0A0A0C', '#FEA604', '#FD8209', '#25D366'],
      description:
        'La interfaz histórica y original solicitada por la marca. Cuenta con cabecera de video 16:9 en loop, hero banner con imagen de atletas duales y catálogo directo.',
      highlights: [
        'Reproductor de video 16:9 embebido superior con autoplay',
        'Hero banner con background oficial hero-sportswear-v2.webp',
        'Navegación institucional completa (Sucursales, FAQs, WhatsApp)',
        'Barra de búsqueda integrada sobre el degradado del Hero',
        'Checkout conversacional directo a WhatsApp con modal interactivo',
      ],
      link: '/bocetos/modelo-5',
      accentColor: '#FEA604',
      icon: <Video size={24} color="#FEA604" />,
      heroImage: '/productos/whey-protein.png',
      ctaText: 'Ver Modelo 5 (Classic)',
    },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#08090C', color: '#FFFFFF', fontFamily: "'Outfit', sans-serif" }}>
      {/* Switcher Bar */}
      <ModelSwitcher current="hub" />

      {/* Hero Presentation */}
      <section
        style={{
          padding: '4rem 1.5rem 2.5rem',
          maxWidth: '1360px',
          margin: '0 auto',
          textAlign: 'center',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
          <Image
            src={logoSrc}
            alt={identidad.nombre_marca || 'ARDYN'}
            width={72}
            height={72}
            priority
            style={{
              borderRadius: '16px',
              objectFit: 'contain',
              background: '#000000',
              border: '1.5px solid rgba(254, 166, 4, 0.45)',
              boxShadow: '0 0 25px rgba(254, 166, 4, 0.25)',
              padding: '6px',
            }}
          />
        </div>

        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 1.1rem',
            borderRadius: '999px',
            background: 'rgba(254, 166, 4, 0.12)',
            border: '1px solid rgba(254, 166, 4, 0.35)',
            color: '#FEA604',
            fontSize: '0.85rem',
            fontWeight: 800,
            marginBottom: '1.5rem',
          }}
        >
          <Compass size={16} />
          <span>SUITE DE 5 MODELOS INTERACTIVOS EN CÓDIGO</span>
        </div>

        <h1
          style={{
            fontSize: 'clamp(2.2rem, 5.5vw, 3.8rem)',
            fontWeight: 900,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            marginBottom: '1.25rem',
          }}
        >
          5 Visiones de Ecommerce para <span style={{ color: '#FEA604' }}>ARDYN Minorista</span>
        </h1>

        <p
          style={{
            fontSize: 'clamp(1rem, 2vw, 1.2rem)',
            color: '#A1A1AA',
            maxWidth: '820px',
            margin: '0 auto 2.5rem',
            lineHeight: 1.6,
          }}
        >
          Cada propuesta cuenta con su propia <strong>personalidad tipográfica</strong>, enfoque de público y experiencia de compra, compartiendo la <strong>identidad cromática oficial de Ardyn (#FEA604 • #FD8209)</strong>.
        </p>
      </section>

      {/* Model Cards Grid */}
      <section
        style={{
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '0 1.5rem 5rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2rem',
        }}
      >
        {models.map((model) => (
          <div
            key={model.id}
            style={{
              background: '#0e1017',
              borderRadius: '20px',
              border: `1px solid ${model.accentColor}33`,
              boxShadow: `0 16px 40px rgba(0, 0, 0, 0.6), 0 0 25px ${model.accentColor}11`,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              transition: 'transform 0.25s ease, border-color 0.25s ease',
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: '1.75rem',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                background: `linear-gradient(180deg, ${model.accentColor}18 0%, transparent 100%)`,
                position: 'relative',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    padding: '0.3rem 0.75rem',
                    borderRadius: '999px',
                    background: `${model.accentColor}25`,
                    color: model.accentColor,
                    border: `1px solid ${model.accentColor}55`,
                  }}
                >
                  {model.badge}
                </span>

                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  {model.icon}
                </div>
              </div>

              <h2 style={{ fontSize: '1.35rem', fontWeight: 900, marginBottom: '0.3rem' }}>
                {model.title}
              </h2>
              <p style={{ fontSize: '0.825rem', color: '#71717A' }}>{model.theme}</p>

              {/* Typography Badge */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginTop: '0.85rem',
                  padding: '0.45rem 0.75rem',
                  background: 'rgba(255, 255, 255, 0.04)',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  fontSize: '0.78rem',
                }}
              >
                <Type size={14} color={model.accentColor} />
                <span>
                  Tipografía: <strong>{model.fontTitle}</strong> <span style={{ color: '#71717A' }}>({model.fontDesc})</span>
                </span>
              </div>

              {/* Palette */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.85rem' }}>
                <span style={{ fontSize: '0.72rem', color: '#A1A1AA', marginRight: '0.25rem' }}>Colores:</span>
                {model.palette.map((color, i) => (
                  <div
                    key={i}
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: '5px',
                      background: color,
                      border: '1px solid rgba(255, 255, 255, 0.25)',
                    }}
                    title={color}
                  />
                ))}
              </div>
            </div>

            {/* Content Body */}
            <div style={{ padding: '1.75rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <p style={{ fontSize: '0.9rem', color: '#D4D4D8', lineHeight: 1.6 }}>
                {model.description}
              </p>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#A1A1AA', textTransform: 'uppercase', marginBottom: '0.65rem' }}>
                  Detalles de la propuesta:
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                  {model.highlights.map((h, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.825rem', color: '#E4E4E7' }}>
                      <CheckCircle2 size={15} color={model.accentColor} style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Product preview */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem',
                  borderRadius: '12px',
                  background: 'rgba(0, 0, 0, 0.4)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                <div style={{ width: 45, height: 45, position: 'relative', flexShrink: 0 }}>
                  <Image src={model.heroImage} alt="Preview" fill style={{ objectFit: 'contain' }} />
                </div>
                <div style={{ fontSize: '0.78rem', color: '#A1A1AA' }}>
                  <div style={{ fontWeight: 800, color: '#FFFFFF' }}>Interactividad 100% Funcional</div>
                  <div>Incluye carrito lateral y pedido por WhatsApp.</div>
                </div>
              </div>
            </div>

            {/* Action Footer */}
            <div style={{ padding: '1.25rem 1.75rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <Link
                href={model.link}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  width: '100%',
                  padding: '0.85rem 1.25rem',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #FEA604 0%, #FD8209 100%)',
                  color: '#000000',
                  fontWeight: 900,
                  fontSize: '0.95rem',
                  textDecoration: 'none',
                  boxShadow: '0 8px 20px rgba(254, 166, 4, 0.35)',
                }}
              >
                <span>{model.ctaText}</span>
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '3rem 1.5rem',
          textAlign: 'center',
          color: '#71717A',
          fontSize: '0.85rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.75rem',
        }}
      >
        <Image
          src={logoSrc}
          alt={identidad.nombre_marca || 'ARDYN'}
          width={40}
          height={40}
          style={{
            borderRadius: '10px',
            objectFit: 'contain',
            background: '#000000',
            border: '1px solid rgba(254, 166, 4, 0.35)',
            boxShadow: '0 0 14px rgba(254, 166, 4, 0.2)',
          }}
        />
        <p><strong>{identidad.nombre_marca || 'ARDYN'} LABS</strong> — Suite de 5 Modelos Visuales Minoristas.</p>
        <p style={{ marginTop: '0.2rem', maxWidth: '650px' }}>
          Todos los modelos se ejecutan en vivo sobre Next.js y utilizan la paleta oficial de marca (#FEA604 • #FD8209) con personalización centralizada.
        </p>
      </footer>
    </div>
  );
}
