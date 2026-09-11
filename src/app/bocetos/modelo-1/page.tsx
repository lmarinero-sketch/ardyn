'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Flame,
  Zap,
  ShoppingCart,
  Star,
  Plus,
  Minus,
  Check,
  Search,
  ChevronRight,
  ShieldAlert,
  Clock,
  Coins,
  X,
  Send,
  SlidersHorizontal,
} from 'lucide-react';
import ModelSwitcher from '@/components/bocetos/ModelSwitcher';
import { useStoreConfig } from '@/hooks/useStoreConfig';

interface MockProduct {
  id: string;
  name: string;
  category: string;
  tag: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  sizes: string[];
  coins: number;
  gender: 'hombre' | 'mujer' | 'unisex';
}

const PRODUCTS: MockProduct[] = [
  {
    id: '1',
    name: 'Remera Oversize Heavyweight Noir (Hombre)',
    category: 'Hombre / Streetwear',
    tag: '🔥 TOP SELLER',
    price: 28900,
    oldPrice: 34900,
    rating: 4.9,
    reviews: 142,
    image: '/productos/remera-oversize.jpg',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    coins: 290,
    gender: 'hombre',
  },
  {
    id: '2',
    name: 'Calza High-Waist Seamless Pro (Mujer)',
    category: 'Mujer / Activewear',
    tag: '⚡ COMPRESIÓN TOTAL',
    price: 38500,
    oldPrice: 44000,
    rating: 5.0,
    reviews: 118,
    image: '/productos/calza-seamless.jpg',
    sizes: ['XS', 'S', 'M', 'L'],
    coins: 385,
    gender: 'mujer',
  },
  {
    id: '3',
    name: 'Hoodie Oversize Heavy Fleece Unisex',
    category: 'Unisex / Streetwear',
    tag: '🔥 BOX FIT 420G',
    price: 56900,
    rating: 4.9,
    reviews: 87,
    image: '/productos/hoodie-oversize.jpg',
    sizes: ['S', 'M', 'L', 'XL'],
    coins: 570,
    gender: 'unisex',
  },
  {
    id: '4',
    name: 'Top Deportivo High-Impact Racerback (Mujer)',
    category: 'Mujer / Fitness',
    tag: '🛡️ SOPORTE MÁXIMO',
    price: 24900,
    oldPrice: 29900,
    rating: 4.8,
    reviews: 74,
    image: '/productos/top-deportivo.jpg',
    sizes: ['S', 'M', 'L'],
    coins: 250,
    gender: 'mujer',
  },
  {
    id: '5',
    name: 'Short 2-in-1 Training Liner Pro (Hombre)',
    category: 'Hombre / Training',
    tag: '⚡ CALZA INTERNA',
    price: 32500,
    rating: 4.9,
    reviews: 63,
    image: '/productos/short-pro.jpg',
    sizes: ['S', 'M', 'L', 'XL'],
    coins: 325,
    gender: 'hombre',
  },
  {
    id: '6',
    name: 'Jogger Tech Cargo Tactical Unisex',
    category: 'Unisex / Techwear',
    tag: '🔒 TECH FABRIC',
    price: 49900,
    oldPrice: 58000,
    rating: 4.9,
    reviews: 52,
    image: '/productos/jogger-cargo.jpg',
    sizes: ['S', 'M', 'L', 'XL'],
    coins: 500,
    gender: 'unisex',
  },
];

export default function Modelo1Page() {
  const { config: identidad } = useStoreConfig('tienda_identidad');
  const { config: footer } = useStoreConfig('tienda_footer');
  const [selectedGender, setSelectedGender] = useState<string>('todos');
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({
    '1': 'L',
    '2': 'M',
    '3': 'L',
    '4': 'M',
    '5': 'L',
    '6': 'L',
  });
  const [cart, setCart] = useState<{ product: MockProduct; size: string; qty: number }[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const filtered = selectedGender === 'todos'
    ? PRODUCTS
    : PRODUCTS.filter((p) => p.gender === selectedGender);

  const addToCart = (product: MockProduct) => {
    const size = selectedSizes[product.id] || product.sizes[0] || 'L';
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id && item.size === size);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id && item.size === size
            ? { ...item, qty: item.qty + 1 }
            : item
        );
      }
      return [...prev, { product, size, qty: 1 }];
    });

    setNotification(`¡${product.name} (Talle ${size}) agregado al carrito!`);
    setTimeout(() => setNotification(null), 2500);
  };

  const totalItems = cart.reduce((s, i) => s + i.qty, 0);
  const totalPrice = cart.reduce((s, i) => s + i.product.price * i.qty, 0);
  const totalCoins = cart.reduce((s, i) => s + i.product.coins * i.qty, 0);

  return (
    <div style={{ minHeight: '100vh', background: '#08090C', color: '#FFFFFF', fontFamily: 'var(--font-main)' }}>
      {/* Universal Model Switcher */}
      <ModelSwitcher current="1" />

      {/* Marquee Banner */}
      <div
        style={{
          background: 'linear-gradient(90deg, #FEA604 0%, #FD8209 100%)',
          color: '#000000',
          fontWeight: 900,
          fontSize: '0.78rem',
          letterSpacing: '0.08em',
          padding: '0.45rem 1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '2rem',
          overflow: 'hidden',
          textTransform: 'uppercase',
        }}
      >
        <span>⚡ ENVÍO EXPRESS GRATIS EN PEDIDOS SUPERIORES A $50.000</span>
        <span style={{ opacity: 0.5 }}>•</span>
        <span>🪙 DUPLICA TUS ARDYN COINS EN CADA COMPRA ESTE MES</span>
        <span style={{ opacity: 0.5 }}>•</span>
        <span>🔥 CALIDAD DEPORTIVA DE ALTO IMPACTO</span>
      </div>

      {/* Cyber Header */}
      <header
        style={{
          padding: '1rem 2rem',
          borderBottom: '1px solid rgba(254, 166, 4, 0.15)',
          background: 'rgba(10, 11, 16, 0.95)',
          position: 'sticky',
          top: '49px',
          zIndex: 100,
          backdropFilter: 'blur(10px)',
        }}
      >
        <div
          style={{
            maxWidth: '1360px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
          }}
        >
          {/* Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link href="/bocetos/modelo-1" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '10px',
                  background: '#000000',
                  border: '1px solid rgba(254, 166, 4, 0.45)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  padding: '4px',
                  boxShadow: '0 0 16px rgba(254, 166, 4, 0.35)',
                }}
              >
                <Image
                  src={identidad.logo_url || '/logo-ardyn.png'}
                  alt={identidad.nombre_marca || 'ARDYN'}
                  width={36}
                  height={36}
                  style={{ objectFit: 'contain' }}
                />
              </div>
              <div>
                <span style={{ fontSize: '1.25rem', fontWeight: 900, letterSpacing: '0.08em', color: '#FFFFFF' }}>
                  {identidad.nombre_marca || 'ARDYN'}
                </span>
                <span style={{ fontSize: '0.65rem', display: 'block', color: '#FEA604', fontWeight: 700, letterSpacing: '0.15em' }}>
                  {identidad.subtitulo_minorista || 'PERFORMANCE LABS'}
                </span>
              </div>
            </Link>
          </div>

          {/* Search bar */}
          <div
            style={{
              flex: 1,
              maxWidth: '460px',
              position: 'relative',
              display: 'none',
            }}
            className="show-desktop"
          >
            <input
              type="text"
              placeholder="Buscar proteína, creatina, pre-workout..."
              style={{
                width: '100%',
                background: '#13151D',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '0.6rem 1rem 0.6rem 2.5rem',
                borderRadius: '8px',
                color: '#FFFFFF',
                fontSize: '0.85rem',
                outline: 'none',
              }}
            />
            <Search size={16} color="#71717A" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }} />
          </div>

          {/* User & Cart Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: 'rgba(254, 166, 4, 0.1)',
                border: '1px solid rgba(254, 166, 4, 0.3)',
                padding: '0.4rem 0.75rem',
                borderRadius: '8px',
                color: '#FEA604',
                fontSize: '0.8rem',
                fontWeight: 700,
              }}
            >
              <Coins size={15} />
              <span>Gana Coins en tu compra</span>
            </div>

            <button
              onClick={() => setIsCartOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: '#FEA604',
                border: 'none',
                color: '#000000',
                fontWeight: 800,
                fontSize: '0.85rem',
                padding: '0.55rem 1.1rem',
                borderRadius: '8px',
                cursor: 'pointer',
                boxShadow: '0 0 20px rgba(254, 166, 4, 0.35)',
              }}
            >
              <ShoppingCart size={17} />
              <span>Carrito ({totalItems})</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section
        style={{
          position: 'relative',
          padding: '3.5rem 1.5rem 3rem',
          maxWidth: '1360px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          alignItems: 'center',
          gap: '3rem',
        }}
      >
        <div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(255, 0, 85, 0.12)',
              border: '1px solid rgba(255, 0, 85, 0.4)',
              color: '#FF2E63',
              fontSize: '0.75rem',
              fontWeight: 800,
              padding: '0.3rem 0.75rem',
              borderRadius: '6px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '1rem',
            }}
          >
            <Flame size={14} />
            <span>Colección Activewear & Streetwear 2026</span>
          </div>

          <h1
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 'clamp(3.5rem, 8.5vw, 6rem)',
              fontWeight: 400,
              lineHeight: 0.95,
              textTransform: 'uppercase',
              letterSpacing: '0.03em',
              marginBottom: '1.25rem',
            }}
          >
            ALTO <span style={{ color: '#FEA604', textShadow: '0 0 30px rgba(254, 166, 4, 0.4)' }}>RENDIMIENTO</span>.<br />
            ESTILO URBANO.
          </h1>

          <p style={{ fontSize: '1.1rem', color: '#A1A1AA', lineHeight: 1.6, marginBottom: '2rem', maxWidth: '520px' }}>
            Indumentaria deportiva técnica y streetwear pesado de corte boxy fit para hombres y mujeres que no se conforman con el promedio.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            <a
              href="#catalogo"
              style={{
                background: '#FEA604',
                color: '#000000',
                fontWeight: 900,
                fontSize: '0.95rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                padding: '0.9rem 1.75rem',
                borderRadius: '8px',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 0 25px rgba(254, 166, 4, 0.4)',
              }}
            >
              <span>Ver Catálogo</span>
              <ChevronRight size={18} />
            </a>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.5rem 1rem',
                background: '#13151D',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                fontSize: '0.8rem',
                color: '#A1A1AA',
              }}
            >
              <Clock size={16} color="#FEA604" />
              <div>
                <strong style={{ color: '#FFFFFF', display: 'block' }}>Despachos en 24hs</strong>
                Envíos a todo San Juan y el país
              </div>
            </div>
          </div>
        </div>

        {/* Hero Product Highlight */}
        <div
          style={{
            background: 'radial-gradient(circle at center, rgba(254, 166, 4, 0.15) 0%, transparent 70%)',
            padding: '2rem',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '380px',
              aspectRatio: '1',
              filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.8))',
            }}
          >
            <Image
              src="/productos/hoodie-oversize.jpg"
              alt="ARDYN Hoodie Streetwear"
              fill
              style={{ objectFit: 'contain', borderRadius: '16px' }}
              priority
            />
          </div>
        </div>
      </section>

      {/* Gender & Category Filters Filter Bar */}
      <section
        id="catalogo"
        style={{
          maxWidth: '1360px',
          margin: '0 auto',
          padding: '1.5rem 1.5rem 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.8rem', color: '#71717A', fontWeight: 700, marginRight: '0.5rem' }}>
            FILTRAR POR COLECCIÓN:
          </span>
          {[
            { id: 'todos', label: '⚡ Toda la Ropa' },
            { id: 'hombre', label: '💪 Hombre / Men' },
            { id: 'mujer', label: '✨ Mujer / Women' },
            { id: 'unisex', label: '🖤 Streetwear Unisex' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedGender(tab.id)}
              style={{
                background: selectedGender === tab.id ? '#FEA604' : '#13151D',
                color: selectedGender === tab.id ? '#000000' : '#A1A1AA',
                border: selectedGender === tab.id ? '1px solid #FEA604' : '1px solid rgba(255, 255, 255, 0.08)',
                padding: '0.5rem 0.9rem',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: selectedGender === tab.id ? 800 : 500,
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div style={{ fontSize: '0.85rem', color: '#71717A' }}>
          Mostrando <strong>{filtered.length}</strong> prendas
        </div>
      </section>

      {/* Cyber Grid */}
      <section
        style={{
          maxWidth: '1360px',
          margin: '0 auto',
          padding: '2rem 1.5rem 6rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {filtered.map((product) => {
          const activeSize = selectedSizes[product.id] || product.sizes[0] || 'L';

          return (
            <div
              key={product.id}
              style={{
                background: '#0e1017',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '16px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
                position: 'relative',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.borderColor = '#FEA604';
                e.currentTarget.style.boxShadow = '0 16px 32px rgba(0,0,0,0.6), 0 0 20px rgba(254, 166, 4, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Product Badge */}
              <div
                style={{
                  position: 'absolute',
                  top: 12,
                  left: 12,
                  zIndex: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6,
                }}
              >
                <span
                  style={{
                    background: '#FEA604',
                    color: '#000000',
                    fontSize: '0.68rem',
                    fontWeight: 900,
                    padding: '0.25rem 0.55rem',
                    borderRadius: '4px',
                    letterSpacing: '0.05em',
                  }}
                >
                  {product.tag}
                </span>

                <span
                  style={{
                    background: 'rgba(0, 0, 0, 0.75)',
                    color: '#FEA604',
                    border: '1px solid rgba(254, 166, 4, 0.4)',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    padding: '0.2rem 0.5rem',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    backdropFilter: 'blur(6px)',
                  }}
                >
                  <Coins size={11} />
                  <span>+{product.coins} Coins</span>
                </span>
              </div>

              {/* Product Image */}
              <div
                style={{
                  height: '240px',
                  background: 'linear-gradient(180deg, #151822 0%, #0e1017 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  padding: '1.5rem',
                }}
              >
                <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    style={{ objectFit: 'contain', borderRadius: '8px' }}
                  />
                </div>
              </div>

              {/* Body */}
              <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ fontSize: '0.75rem', color: '#71717A', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {product.category}
                </div>

                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, lineHeight: 1.3 }}>
                  {product.name}
                </h3>

                {/* Stars */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', color: '#FEA604' }}>
                  <Star size={14} fill="#FEA604" color="#FEA604" />
                  <span style={{ fontWeight: 800, color: '#FFFFFF' }}>{product.rating}</span>
                  <span style={{ color: '#71717A' }}>({product.reviews} opiniones)</span>
                </div>

                {/* Size Selector Chips */}
                {product.sizes && product.sizes.length > 0 && (
                  <div style={{ marginTop: '0.25rem' }}>
                    <div style={{ fontSize: '0.7rem', color: '#A1A1AA', marginBottom: '0.3rem' }}>
                      TALLE DISPONIBLE: <strong style={{ color: '#FEA604' }}>{activeSize}</strong>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                      {product.sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSizes((prev) => ({ ...prev, [product.id]: size }))}
                          style={{
                            background: activeSize === size ? '#FEA604' : '#181b24',
                            color: activeSize === size ? '#000000' : '#A1A1AA',
                            border: activeSize === size ? '1px solid #FEA604' : '1px solid rgba(255, 255, 255, 0.08)',
                            padding: '0.25rem 0.6rem',
                            borderRadius: '5px',
                            fontSize: '0.68rem',
                            fontWeight: activeSize === size ? 800 : 500,
                            cursor: 'pointer',
                          }}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Price Box */}
                <div style={{ marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#FFFFFF' }}>
                      ${product.price.toLocaleString('es-AR')}
                    </span>
                    {product.oldPrice && (
                      <span style={{ fontSize: '0.85rem', color: '#71717A', textDecoration: 'line-through' }}>
                        ${product.oldPrice.toLocaleString('es-AR')}
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#00FF88', fontWeight: 600 }}>
                    3 cuotas fijas de ${(product.price / 3).toFixed(0)}
                  </div>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={() => addToCart(product)}
                  style={{
                    width: '100%',
                    background: '#FEA604',
                    border: 'none',
                    color: '#000000',
                    fontWeight: 900,
                    fontSize: '0.88rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                    transition: 'opacity 0.15s, transform 0.15s',
                  }}
                >
                  <Plus size={16} strokeWidth={3} />
                  <span>Agregar al Carrito</span>
                </button>
              </div>
            </div>
          );
        })}
      </section>

      {/* Floating Notification Toast */}
      {notification && (
        <div
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            background: '#FEA604',
            color: '#000000',
            fontWeight: 800,
            padding: '0.8rem 1.25rem',
            borderRadius: '10px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.8), 0 0 20px rgba(254, 166, 4, 0.5)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.9rem',
          }}
        >
          <Check size={18} strokeWidth={3} />
          <span>{notification}</span>
        </div>
      )}

      {/* Cyber Athletic Footer */}
      <footer
        style={{
          borderTop: '1px solid rgba(254, 166, 4, 0.2)',
          background: '#07080a',
          padding: '3.5rem 1.5rem 2.5rem',
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
              width={48}
              height={48}
              style={{
                borderRadius: '8px',
                objectFit: 'contain',
                background: '#000000',
                border: '1px solid rgba(254, 166, 4, 0.4)',
                boxShadow: '0 0 16px rgba(254, 166, 4, 0.25)',
              }}
            />
            <div>
              <div
                style={{
                  color: '#FFFFFF',
                  fontWeight: 900,
                  fontSize: '1.2rem',
                  letterSpacing: '0.05em',
                  fontFamily: "'Bebas Neue', sans-serif",
                }}
              >
                {identidad.nombre_marca || 'ARDYN'} PERFORMANCE LABS
              </div>
              <div style={{ fontSize: '0.8rem', color: '#A1A1AA', marginTop: '2px' }}>{footer.direccion}</div>
              <div style={{ fontSize: '0.75rem', color: '#FEA604', fontWeight: 700 }}>HIGH IMPACT SPORT NUTRITION</div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ color: '#FEA604', fontWeight: 800, fontSize: '0.85rem' }}>
              Instagram: {footer.instagram}
            </div>
            <div style={{ color: '#52525B', fontSize: '0.75rem', marginTop: '4px' }}>
              {footer.texto_creditos || 'Hecho por Grow Labs'}
            </div>
          </div>
        </div>
      </footer>

      {/* Cart Drawer */}
      {isCartOpen && (
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
          onClick={() => setIsCartOpen(false)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '440px',
              height: '100%',
              background: '#0E1017',
              borderLeft: '1px solid rgba(254, 166, 4, 0.2)',
              padding: '1.75rem',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '-10px 0 40px rgba(0,0,0,0.9)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '1rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShoppingCart size={20} color="#FEA604" />
                <h2 style={{ fontSize: '1.2rem', fontWeight: 900 }}>Tu Carrito Ardyn</h2>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                style={{ background: 'transparent', border: 'none', color: '#71717A', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Coins Earned Alert */}
            <div
              style={{
                margin: '1rem 0',
                padding: '0.75rem',
                background: 'rgba(254, 166, 4, 0.1)',
                border: '1px solid rgba(254, 166, 4, 0.3)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                color: '#FEA604',
                fontSize: '0.825rem',
                fontWeight: 700,
              }}
            >
              <Coins size={18} />
              <span>Con este pedido sumas <strong>+{totalCoins} Ardyn Coins</strong></span>
            </div>

            {/* Cart Items */}
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', paddingRight: '0.25rem' }}>
              {cart.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#71717A' }}>
                  <ShoppingCart size={40} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
                  <p>Tu carrito está vacío.</p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    style={{
                      marginTop: '1rem',
                      background: '#181b24',
                      color: '#FEA604',
                      border: '1px solid #FEA604',
                      padding: '0.5rem 1rem',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                    }}
                  >
                    Ver Colección de Ropa
                  </button>
                </div>
              ) : (
                cart.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      gap: '0.75rem',
                      padding: '0.75rem',
                      background: '#151822',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                    }}
                  >
                    <div style={{ width: 50, height: 50, position: 'relative', flexShrink: 0 }}>
                      <Image src={item.product.image} alt={item.product.name} fill style={{ objectFit: 'contain', borderRadius: '4px' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{item.product.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#FEA604' }}>Talle: {item.size}</div>
                      <div style={{ fontWeight: 800, marginTop: '0.25rem', fontSize: '0.9rem' }}>
                        ${(item.product.price * item.qty).toLocaleString('es-AR')}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 800 }}>x{item.qty}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Checkout */}
            {cart.length > 0 && (
              <div style={{ paddingTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '1.1rem', fontWeight: 900 }}>
                  <span>Total:</span>
                  <span style={{ color: '#FEA604' }}>${totalPrice.toLocaleString('es-AR')}</span>
                </div>

                <a
                  href={`https://wa.me/5492646796509?text=${encodeURIComponent(
                    `Hola Ardyn! Quiero confirmar este pedido de ropa (Boceto 1 - Cyber Athletic):\n${cart
                      .map((i) => `• ${i.qty}x ${i.product.name} [Talle: ${i.size}]`)
                      .join('\n')}\nTotal: $${totalPrice.toLocaleString('es-AR')}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    width: '100%',
                    background: '#25D366',
                    color: '#000000',
                    fontWeight: 900,
                    padding: '0.9rem',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    fontSize: '0.95rem',
                  }}
                >
                  <Send size={18} />
                  <span>Finalizar Pedido por WhatsApp</span>
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
