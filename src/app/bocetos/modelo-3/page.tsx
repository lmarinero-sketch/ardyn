'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Sparkles,
  ShoppingBag,
  Heart,
  ChevronDown,
  Layers,
  ArrowUpRight,
  Plus,
  Check,
  X,
  Send,
  SlidersHorizontal,
} from 'lucide-react';
import ModelSwitcher from '@/components/bocetos/ModelSwitcher';
import { useStoreConfig } from '@/hooks/useStoreConfig';

interface ApparelProduct {
  id: string;
  name: string;
  collection: string;
  tag?: string;
  price: number;
  image: string;
  colors: { name: string; hex: string }[];
  sizes: string[];
  composition: string;
  fit: string;
}

const APPAREL_PRODUCTS: ApparelProduct[] = [
  {
    id: 'a1',
    name: 'Remera Heavyweight Oversized Dry-Fit',
    collection: 'Drop 01: Core Architecture',
    tag: 'LIMITED DROP',
    price: 24500,
    image: '/productos/camiseta.png',
    colors: [
      { name: 'Onyx Black', hex: '#0a0a0c' },
      { name: 'Washed Carbon', hex: '#27272a' },
      { name: 'Desert Sand', hex: '#d4b996' },
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    composition: '95% Algodón Peinado 260 GSM + 5% Elastano',
    fit: 'Oversized Boxy Fit con caída estructurada',
  },
  {
    id: 'a2',
    name: 'Shaker Matte Steel Pro Black 750ml',
    collection: 'Hardware Series',
    tag: 'HOT HARDWARE',
    price: 14800,
    image: '/productos/shaker.png',
    colors: [
      { name: 'Matte Stealth', hex: '#18181b' },
      { name: 'Brushed Titanium', hex: '#71717a' },
    ],
    sizes: ['750ml'],
    composition: 'Doble pared acero inoxidable 18/8 con aislamiento al vacío',
    fit: 'Tapa hermética magnetizada antigoteo',
  },
  {
    id: 'a3',
    name: 'Toalla Microfibra Compact Luxury',
    collection: 'Lifestyle Essentials',
    price: 9800,
    image: '/productos/toalla.png',
    colors: [
      { name: 'Carbon Grey', hex: '#18181b' },
      { name: 'Sage Green', hex: '#4b5563' },
    ],
    sizes: ['80x40 cm'],
    composition: 'Microfibra técnica ultra-absorbente y antibacteriana',
    fit: 'Secado 3x más rápido que el algodón tradicional',
  },
  {
    id: 'a4',
    name: 'Guantes de Agarre Ergonómico Pro-Grip',
    collection: 'Hardware Series',
    tag: 'NEW RELEASE',
    price: 16200,
    image: '/productos/guantes.png',
    colors: [
      { name: 'Stealth Black', hex: '#0f0f11' },
      { name: 'Chalk White', hex: '#e4e4e7' },
    ],
    sizes: ['M', 'L', 'XL'],
    composition: 'Cuero genuino tratado + Neopreno ventilado',
    fit: 'Muñequera elástica reforzada de doble vuelta',
  },
  {
    id: 'a5',
    name: 'Cinturón Powerlifting de Cuero Crudo 10mm',
    collection: 'Drop 01: Core Architecture',
    tag: 'HANDCRAFTED',
    price: 46000,
    image: '/productos/cinturon.png',
    colors: [
      { name: 'Midnight Black', hex: '#09090b' },
      { name: 'Vintage Saddle', hex: '#78350f' },
    ],
    sizes: ['S (70-85cm)', 'M (80-95cm)', 'L (90-105cm)'],
    composition: '100% Cuero bovino seleccionado de 10mm con palanca de acero',
    fit: 'Calibración milimétrica para soporte intra-abdominal',
  },
  {
    id: 'a6',
    name: 'Barras Proteicas Gourmet x12 Pack',
    collection: 'Fuel Bar',
    price: 24000,
    image: '/productos/barras-proteicas.png',
    colors: [
      { name: 'Dark Cacao Crunch', hex: '#3f1d0b' },
      { name: 'Salted Peanut Caramel', hex: '#92400e' },
    ],
    sizes: ['12 x 60g'],
    composition: '20g Proteína Aislada por barra • 0g Azúcares añadidos',
    fit: 'Textura suave horneada artesanalmente',
  },
];

export default function Modelo3Page() {
  const { config: identidad } = useStoreConfig('tienda_identidad');
  const { config: footer } = useStoreConfig('tienda_footer');
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({
    a1: 'L',
    a2: '750ml',
    a3: '80x40 cm',
    a4: 'L',
    a5: 'M (80-95cm)',
    a6: '12 x 60g',
  });
  const [selectedColors, setSelectedColors] = useState<Record<string, string>>({
    a1: 'Onyx Black',
    a2: 'Matte Stealth',
    a3: 'Carbon Grey',
    a4: 'Stealth Black',
    a5: 'Midnight Black',
    a6: 'Dark Cacao Crunch',
  });
  const [cart, setCart] = useState<{ product: ApparelProduct; size: string; color: string; qty: number }[]>([]);
  const [isBagOpen, setIsBagOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const addToBag = (product: ApparelProduct) => {
    const size = selectedSizes[product.id] || product.sizes[0];
    const color = selectedColors[product.id] || product.colors[0].name;

    setCart((prev) => {
      const exists = prev.find((i) => i.product.id === product.id && i.size === size && i.color === color);
      if (exists) {
        return prev.map((i) =>
          i.product.id === product.id && i.size === size && i.color === color ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { product, size, color, qty: 1 }];
    });

    setNotification(`Añadido a la bolsa: ${product.name}`);
    setTimeout(() => setNotification(null), 2500);
  };

  const totalItems = cart.reduce((s, i) => s + i.qty, 0);
  const totalPrice = cart.reduce((s, i) => s + i.product.price * i.qty, 0);

  return (
    <div style={{ minHeight: '100vh', background: '#0E0F12', color: '#F4F4F5', fontFamily: "'Syne', sans-serif" }}>
      {/* Universal Model Switcher */}
      <ModelSwitcher current="3" />

      {/* Editorial Navigation */}
      <header
        style={{
          padding: '1.25rem 2.5rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'rgba(14, 15, 18, 0.95)',
          position: 'sticky',
          top: '49px',
          zIndex: 100,
          backdropFilter: 'blur(12px)',
        }}
      >
        <div
          style={{
            maxWidth: '1440px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
            <Link href="/bocetos/modelo-3" style={{ textDecoration: 'none', color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: '10px',
                  background: '#000000',
                  border: '1px solid rgba(254, 166, 4, 0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  padding: '4px',
                  boxShadow: '0 0 16px rgba(254, 166, 4, 0.25)',
                }}
              >
                <Image
                  src={identidad.logo_url || '/logo-ardyn.png'}
                  alt={identidad.nombre_marca || 'ARDYN'}
                  width={34}
                  height={34}
                  style={{ objectFit: 'contain' }}
                />
              </div>
              <div>
                <div style={{ fontSize: '1.45rem', fontWeight: 900, letterSpacing: '0.15em', textTransform: 'uppercase', lineHeight: 1.1 }}>
                  {identidad.nombre_marca || 'ARDYN'}
                </div>
                <div style={{ fontSize: '0.62rem', letterSpacing: '0.35em', color: '#FEA604', textTransform: 'uppercase', fontWeight: 800 }}>
                  {identidad.subtitulo_minorista || 'HAUTE ACTIVEWEAR'}
                </div>
              </div>
            </Link>

            <nav style={{ display: 'flex', gap: '1.75rem', fontSize: '0.85rem', letterSpacing: '0.05em', color: '#A1A1AA' }}>
              <span style={{ color: '#FFFFFF', fontWeight: 600, cursor: 'pointer' }}>Drop 01</span>
              <span style={{ cursor: 'pointer' }}>Oversized</span>
              <span style={{ cursor: 'pointer' }}>Hardware</span>
              <span style={{ cursor: 'pointer' }}>Essentials</span>
            </nav>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <button
              onClick={() => setIsBagOpen(true)}
              style={{
                background: 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#FFFFFF',
                padding: '0.5rem 1rem',
                borderRadius: '999px',
                fontSize: '0.8rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
              }}
            >
              <ShoppingBag size={16} />
              <span>Bolsa ({totalItems})</span>
            </button>
          </div>
        </div>
      </header>

      {/* Editorial Hero Banner */}
      <section
        style={{
          position: 'relative',
          padding: '5rem 2rem 4rem',
          maxWidth: '1440px',
          margin: '0 auto',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <div style={{ maxWidth: '800px' }}>
          <div
            style={{
              display: 'inline-block',
              fontSize: '0.75rem',
              fontWeight: 800,
              letterSpacing: '0.25em',
              color: '#FEA604',
              textTransform: 'uppercase',
              marginBottom: '1rem',
            }}
          >
            CAPSULE COLLECTION 2026
          </div>

          <h1
            style={{
              fontSize: 'clamp(2.5rem, 6.5vw, 4.75rem)',
              fontWeight: 900,
              lineHeight: 0.98,
              letterSpacing: '-0.02em',
              textTransform: 'uppercase',
              marginBottom: '1.5rem',
            }}
          >
            THE ARCHITECTURE<br />
            OF MOVEMENT.
          </h1>

          <p
            style={{
              fontSize: '1.1rem',
              color: '#A1A1AA',
              lineHeight: 1.7,
              maxWidth: '540px',
              marginBottom: '2rem',
              letterSpacing: '0.01em',
            }}
          >
            Prendas y accesorios deportivos de gramaje pesado, confeccionados para tolerar las cargas más intensas conservando una silueta estructurada y moderna.
          </p>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <a
              href="#coleccion"
              style={{
                background: '#FFFFFF',
                color: '#000000',
                padding: '0.85rem 2rem',
                borderRadius: '999px',
                fontSize: '0.85rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                textDecoration: 'none',
              }}
            >
              Comprar la Colección
            </a>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: '#71717A',
                fontSize: '0.8rem',
                padding: '0.85rem 1rem',
              }}
            >
              <span>Edición limitada • Hecho en Argentina</span>
            </div>
          </div>
        </div>
      </section>

      {/* Lookbook / Bundle Banner: "Completá tu outfit" */}
      <section
        style={{
          maxWidth: '1440px',
          margin: '3rem auto 0',
          padding: '0 2rem',
        }}
      >
        <div
          style={{
            background: 'linear-gradient(135deg, #18191F 0%, #121318 100%)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '24px',
            padding: '2rem 2.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '2rem',
          }}
        >
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.15em', color: '#FEA604', textTransform: 'uppercase' }}>
              LOOK COMPLETO // BUNDLE EXCLUSIVO
            </span>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.3rem', textTransform: 'uppercase' }}>
              Gym Pack: Remera Oversized + Shaker Steel + Toalla
            </h2>
            <p style={{ color: '#A1A1AA', fontSize: '0.9rem', maxWidth: '520px', marginTop: '0.4rem' }}>
              Ahorrá un 20% llevando el combo completo de entrenamiento para la temporada.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.85rem', color: '#71717A', textDecoration: 'line-through' }}>$49.100</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#FFFFFF' }}>$39.280</div>
            </div>

            <button
              onClick={() => {
                addToBag(APPAREL_PRODUCTS[0]);
                addToBag(APPAREL_PRODUCTS[1]);
                addToBag(APPAREL_PRODUCTS[2]);
              }}
              style={{
                background: 'linear-gradient(135deg, #FEA604 0%, #FD8209 100%)',
                color: '#000000',
                border: 'none',
                fontWeight: 900,
                fontSize: '0.85rem',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                padding: '0.9rem 1.75rem',
                borderRadius: '999px',
                cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(254, 166, 4, 0.4)',
              }}
            >
              Llevar Bundle (3 items)
            </button>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section
        id="coleccion"
        style={{
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '4rem 2rem 6rem',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '2.5rem' }}>
          <div>
            <span style={{ fontSize: '0.75rem', letterSpacing: '0.2em', color: '#71717A', textTransform: 'uppercase' }}>
              CATÁLOGO MINORISTA
            </span>
            <h2 style={{ fontSize: '2rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.01em' }}>
              All Pieces & Hardware
            </h2>
          </div>
          <div style={{ fontSize: '0.85rem', color: '#71717A' }}>{APPAREL_PRODUCTS.length} artículos exclusivos</div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '2.5rem',
          }}
        >
          {APPAREL_PRODUCTS.map((prod) => {
            const activeSize = selectedSizes[prod.id] || prod.sizes[0];
            const activeColor = selectedColors[prod.id] || prod.colors[0].name;

            return (
              <div
                key={prod.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  background: '#131418',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  transition: 'all 0.25s ease',
                }}
              >
                {/* Photo frame */}
                <div
                  style={{
                    height: '320px',
                    position: 'relative',
                    background: '#18191F',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '2rem',
                  }}
                >
                  {prod.tag && (
                    <span
                      style={{
                        position: 'absolute',
                        top: 14,
                        left: 14,
                        background: 'rgba(0,0,0,0.8)',
                        color: '#EC4899',
                        border: '1px solid rgba(236, 72, 153, 0.4)',
                        fontSize: '0.65rem',
                        fontWeight: 800,
                        letterSpacing: '0.1em',
                        padding: '0.25rem 0.6rem',
                        borderRadius: '999px',
                        backdropFilter: 'blur(6px)',
                      }}
                    >
                      {prod.tag}
                    </span>
                  )}

                  <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                    <Image src={prod.image} alt={prod.name} fill style={{ objectFit: 'contain' }} />
                  </div>
                </div>

                {/* Body */}
                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ fontSize: '0.7rem', color: '#71717A', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    {prod.collection}
                  </div>

                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, lineHeight: 1.3 }}>{prod.name}</h3>

                  <div style={{ fontSize: '0.8rem', color: '#A1A1AA' }}>{prod.composition}</div>

                  {/* Color Swatches */}
                  <div style={{ marginTop: '0.25rem' }}>
                    <div style={{ fontSize: '0.72rem', color: '#71717A', marginBottom: '0.4rem' }}>
                      COLOR: <strong style={{ color: '#FFFFFF' }}>{activeColor}</strong>
                    </div>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      {prod.colors.map((c) => (
                        <button
                          key={c.name}
                          onClick={() => setSelectedColors((prev) => ({ ...prev, [prod.id]: c.name }))}
                          style={{
                            width: 24,
                            height: 24,
                            borderRadius: '999px',
                            background: c.hex,
                            border: activeColor === c.name ? '2px solid #EC4899' : '1px solid rgba(255,255,255,0.2)',
                            cursor: 'pointer',
                            outline: activeColor === c.name ? '2px solid rgba(236,72,153,0.3)' : 'none',
                          }}
                          title={c.name}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Size Selector */}
                  <div style={{ marginTop: '0.25rem' }}>
                    <div style={{ fontSize: '0.72rem', color: '#71717A', marginBottom: '0.4rem' }}>
                      TALLES DISPONIBLES:
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                      {prod.sizes.map((s) => (
                        <button
                          key={s}
                          onClick={() => setSelectedSizes((prev) => ({ ...prev, [prod.id]: s }))}
                          style={{
                            background: activeSize === s ? '#FFFFFF' : 'rgba(255, 255, 255, 0.05)',
                            color: activeSize === s ? '#000000' : '#A1A1AA',
                            border: 'none',
                            padding: '0.35rem 0.75rem',
                            borderRadius: '6px',
                            fontSize: '0.75rem',
                            fontWeight: activeSize === s ? 800 : 500,
                            cursor: 'pointer',
                          }}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price & Add */}
                  <div style={{ marginTop: 'auto', paddingTop: '1.25rem', borderTop: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ fontSize: '1.4rem', fontWeight: 900 }}>
                      ${prod.price.toLocaleString('es-AR')}
                    </div>

                    <button
                      onClick={() => addToBag(prod)}
                      style={{
                        background: '#FFFFFF',
                        color: '#000000',
                        border: 'none',
                        fontWeight: 800,
                        fontSize: '0.8rem',
                        letterSpacing: '0.05em',
                        textTransform: 'uppercase',
                        padding: '0.65rem 1.25rem',
                        borderRadius: '999px',
                        cursor: 'pointer',
                      }}
                    >
                      Añadir a la Bolsa
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Floating Notification Toast */}
      {notification && (
        <div
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            background: '#FFFFFF',
            color: '#000000',
            fontWeight: 800,
            padding: '0.85rem 1.5rem',
            borderRadius: '999px',
            boxShadow: '0 12px 40px rgba(0,0,0,0.8)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.88rem',
          }}
        >
          <Check size={16} strokeWidth={3} />
          <span>{notification}</span>
        </div>
      )}

      {/* Luxury Activewear Footer */}
      <footer
        style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          background: '#0a0b0e',
          padding: '3.5rem 2rem',
          color: '#71717A',
          fontSize: '0.85rem',
          marginTop: '5rem',
        }}
      >
        <div
          style={{
            maxWidth: '1360px',
            margin: '0 auto',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '2rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Image
              src={identidad.logo_url || '/logo-ardyn.png'}
              alt={identidad.nombre_marca || 'Ardyn'}
              width={46}
              height={46}
              style={{
                borderRadius: '8px',
                objectFit: 'contain',
                background: '#000000',
                border: '1px solid rgba(254, 166, 4, 0.4)',
                boxShadow: '0 0 15px rgba(254, 166, 4, 0.15)',
              }}
            />
            <div>
              <div
                style={{
                  color: '#FFFFFF',
                  fontWeight: 900,
                  fontSize: '1.05rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                }}
              >
                {identidad.nombre_marca || 'ARDYN'} · ACTIVEWEAR
              </div>
              <div style={{ color: '#A1A1AA', fontSize: '0.8rem', marginTop: '2px' }}>{footer.direccion}</div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ color: '#FEA604', fontWeight: 600, fontSize: '0.85rem', letterSpacing: '0.04em' }}>
              Instagram: {footer.instagram}
            </div>
            <div style={{ color: '#52525B', fontSize: '0.75rem', marginTop: '4px' }}>
              {footer.texto_creditos || 'Hecho por Grow Labs'}
            </div>
          </div>
        </div>
      </footer>

      {/* Shopping Bag Drawer */}
      {isBagOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(8px)',
            zIndex: 99999,
            display: 'flex',
            justifyContent: 'flex-end',
          }}
          onClick={() => setIsBagOpen(false)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '440px',
              height: '100%',
              background: '#121317',
              borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '2rem',
              display: 'flex',
              flexDirection: 'column',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '1rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Tu Bolsa ({totalItems})
              </div>
              <button onClick={() => setIsBagOpen(false)} style={{ background: 'transparent', border: 'none', color: '#71717A', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.5rem 0' }}>
              {cart.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#71717A' }}>
                  <p>Tu bolsa de compras está vacía.</p>
                </div>
              ) : (
                cart.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '1rem', padding: '0.85rem', background: '#181920', borderRadius: '12px' }}>
                    <div style={{ width: 60, height: 60, position: 'relative', flexShrink: 0 }}>
                      <Image src={item.product.image} alt={item.product.name} fill style={{ objectFit: 'contain' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>{item.product.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#EC4899', marginTop: '0.2rem' }}>
                        Talle: {item.size} • Color: {item.color}
                      </div>
                      <div style={{ fontWeight: 800, marginTop: '0.4rem', fontSize: '0.95rem' }}>
                        ${(item.product.price * item.qty).toLocaleString('es-AR')}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div style={{ paddingTop: '1.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem', fontSize: '1.2rem', fontWeight: 900 }}>
                  <span>Subtotal:</span>
                  <span>${totalPrice.toLocaleString('es-AR')}</span>
                </div>

                <a
                  href={`https://wa.me/5492646796509?text=${encodeURIComponent(
                    `Hola Ardyn! Deseo confirmar la compra de estas prendas/hardware (Boceto 3 - Lifestyle):\n${cart
                      .map((i) => `• ${i.qty}x ${i.product.name} [Talle: ${i.size}, Color: ${i.color}]`)
                      .join('\n')}\nTotal: $${totalPrice.toLocaleString('es-AR')}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    width: '100%',
                    background: '#FFFFFF',
                    color: '#000000',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    padding: '1rem',
                    borderRadius: '999px',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    fontSize: '0.9rem',
                  }}
                >
                  <Send size={18} />
                  <span>Comprar por WhatsApp Concierge</span>
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
