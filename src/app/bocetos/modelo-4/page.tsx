'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Flame,
  Sparkles,
  Search,
  ShoppingCart,
  Plus,
  Minus,
  Star,
  Coins,
  Check,
  X,
  Send,
  SlidersHorizontal,
  ChevronRight,
  Clock,
  ShieldCheck,
  Truck,
  CreditCard,
  Heart,
  Eye,
  Store,
} from 'lucide-react';
import ModelSwitcher from '@/components/bocetos/ModelSwitcher';
import { useStoreConfig } from '@/hooks/useStoreConfig';

interface ProductItem {
  id: string;
  name: string;
  rubro: 'Hombre' | 'Mujer' | 'Streetwear';
  category: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  isOffer?: boolean;
  isFeatured?: boolean;
  coinsEarned: number;
  stock: number;
}

const PRODUCTS_DATA: ProductItem[] = [
  {
    id: 'm4-1',
    name: 'Remera Oversize Heavyweight Noir (Hombre)',
    rubro: 'Hombre',
    category: 'Remeras & Tees',
    price: 28900,
    oldPrice: 34900,
    rating: 4.9,
    reviews: 142,
    image: '/productos/remera-oversize.jpg',
    isOffer: true,
    isFeatured: true,
    coinsEarned: 290,
    stock: 45,
  },
  {
    id: 'm4-2',
    name: 'Calza High-Waist Seamless Pro (Mujer)',
    rubro: 'Mujer',
    category: 'Calzas & Leggings',
    price: 38500,
    oldPrice: 44000,
    rating: 5.0,
    reviews: 118,
    image: '/productos/calza-seamless.jpg',
    isOffer: true,
    isFeatured: true,
    coinsEarned: 385,
    stock: 35,
  },
  {
    id: 'm4-3',
    name: 'Hoodie Oversize Heavy Fleece 460G (Unisex)',
    rubro: 'Streetwear',
    category: 'Buzos & Hoodies',
    price: 56900,
    oldPrice: 65000,
    rating: 4.9,
    reviews: 95,
    image: '/productos/hoodie-oversize.jpg',
    isFeatured: true,
    coinsEarned: 570,
    stock: 28,
  },
  {
    id: 'm4-4',
    name: 'Top Deportivo High-Impact Racerback (Mujer)',
    rubro: 'Mujer',
    category: 'Tops & Bras',
    price: 24900,
    oldPrice: 29900,
    rating: 4.8,
    reviews: 74,
    image: '/productos/top-deportivo.jpg',
    isOffer: true,
    coinsEarned: 250,
    stock: 40,
  },
  {
    id: 'm4-5',
    name: 'Short 2-in-1 Training Liner Pro (Hombre)',
    rubro: 'Hombre',
    category: 'Shorts & Bermudas',
    price: 32500,
    rating: 4.9,
    reviews: 63,
    image: '/productos/short-pro.jpg',
    isFeatured: true,
    coinsEarned: 325,
    stock: 50,
  },
  {
    id: 'm4-6',
    name: 'Jogger Tech Cargo Tactical (Unisex)',
    rubro: 'Streetwear',
    category: 'Pantalones & Joggers',
    price: 49900,
    oldPrice: 58000,
    rating: 4.9,
    reviews: 52,
    image: '/productos/jogger-cargo.jpg',
    isOffer: true,
    coinsEarned: 500,
    stock: 22,
  },
  {
    id: 'm4-7',
    name: 'Conjunto 2-Piece Ribbed Seamless (Mujer)',
    rubro: 'Mujer',
    category: 'Conjuntos Deportivos',
    price: 52000,
    oldPrice: 59000,
    rating: 5.0,
    reviews: 86,
    image: '/productos/conjunto-seamless.jpg',
    isFeatured: true,
    coinsEarned: 520,
    stock: 18,
  },
  {
    id: 'm4-8',
    name: 'Remera Dry-Fit Training Pro Black (Hombre)',
    rubro: 'Hombre',
    category: 'Remeras Deportivas',
    price: 22500,
    rating: 4.8,
    reviews: 48,
    image: '/productos/camiseta.png',
    coinsEarned: 225,
    stock: 65,
  },
];

export default function Modelo4Page() {
  const { config: identidad } = useStoreConfig('tienda_identidad');
  const { config: footer } = useStoreConfig('tienda_footer');
  const [selectedRubro, setSelectedRubro] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<{ product: ProductItem; qty: number }[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const filtered = PRODUCTS_DATA.filter((p) => {
    const matchRubro = selectedRubro === 'Todos' || p.rubro === selectedRubro;
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchRubro && matchSearch;
  });

  const addToCart = (product: ProductItem) => {
    setCart((prev) => {
      const exists = prev.find((i) => i.product.id === product.id);
      if (exists) {
        return prev.map((i) => (i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, { product, qty: 1 }];
    });
    setToastMsg(`Agregado: ${product.name}`);
    setTimeout(() => setToastMsg(null), 2500);
  };

  const totalItems = cart.reduce((s, i) => s + i.qty, 0);
  const totalPrice = cart.reduce((s, i) => s + i.product.price * i.qty, 0);
  const totalCoins = cart.reduce((s, i) => s + i.product.coinsEarned * i.qty, 0);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0a0a0c',
        color: '#FFFFFF',
        fontFamily: "'Outfit', 'Sora', sans-serif",
      }}
    >
      {/* Universal Model Switcher */}
      <ModelSwitcher current="4" />

      {/* Modern Top Promotional Bar */}
      <div
        style={{
          background: 'linear-gradient(90deg, #FEA604 0%, #FD8209 100%)',
          color: '#000000',
          fontSize: '0.8rem',
          fontWeight: 800,
          letterSpacing: '0.04em',
          padding: '0.45rem 1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1.5rem',
          flexWrap: 'wrap',
          boxShadow: '0 2px 10px rgba(254, 166, 4, 0.3)',
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <Truck size={14} /> Envíos gratis a todo San Juan desde $50.000
        </span>
        <span style={{ opacity: 0.5 }}>•</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <Coins size={14} /> Sumá Ardyn Coins y canjealas por descuentos directos
        </span>
        <span style={{ opacity: 0.5 }}>•</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <CreditCard size={14} /> 3 Cuotas sin interés con todas las tarjetas
        </span>
      </div>

      {/* Main Header */}
      <header
        style={{
          padding: '1.25rem 2rem',
          background: 'rgba(13, 13, 16, 0.95)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          position: 'sticky',
          top: '49px',
          zIndex: 100,
          backdropFilter: 'blur(16px)',
        }}
      >
        <div
          style={{
            maxWidth: '1440px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.5rem',
          }}
        >
          {/* Logo Brand */}
          <Link href="/bocetos/modelo-4" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: '12px',
                background: '#000000',
                border: '1px solid rgba(254, 166, 4, 0.4)',
                boxShadow: '0 4px 20px rgba(254, 166, 4, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                padding: '4px',
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
              <div style={{ fontSize: '1.4rem', fontWeight: 900, letterSpacing: '0.04em', color: '#FFFFFF' }}>
                {identidad.nombre_marca || 'ARDYN'} <span style={{ color: '#FEA604' }}>TIENDA</span>
              </div>
              <div style={{ fontSize: '0.7rem', color: '#A1A1AA', fontWeight: 600, letterSpacing: '0.08em' }}>
                {identidad.subtitulo_minorista || 'SUPLEMENTOS & INDUMENTARIA OFICIAL'}
              </div>
            </div>
          </Link>

          {/* Search Input */}
          <div style={{ flex: 1, maxWidth: '520px', position: 'relative' }}>
            <input
              type="text"
              placeholder="Buscar en el catálogo oficial (proteínas, creatinas, remeras...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                background: '#181920',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                padding: '0.7rem 1rem 0.7rem 2.7rem',
                borderRadius: '12px',
                color: '#FFFFFF',
                fontSize: '0.9rem',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = '#FEA604')}
              onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)')}
            />
            <Search size={17} color="#71717A" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={() => setIsCartOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                background: 'linear-gradient(135deg, #FEA604 0%, #FD8209 100%)',
                border: 'none',
                color: '#000000',
                fontWeight: 900,
                fontSize: '0.9rem',
                padding: '0.65rem 1.3rem',
                borderRadius: '12px',
                cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(254, 166, 4, 0.4)',
                transition: 'transform 0.15s ease',
              }}
            >
              <ShoppingCart size={18} />
              <span>Carrito ({totalItems})</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Showcase Banner */}
      <section
        style={{
          position: 'relative',
          padding: '4rem 2rem 3rem',
          maxWidth: '1440px',
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
              background: 'rgba(254, 166, 4, 0.12)',
              border: '1px solid rgba(254, 166, 4, 0.3)',
              color: '#FEA604',
              padding: '0.35rem 0.85rem',
              borderRadius: '999px',
              fontSize: '0.8rem',
              fontWeight: 800,
              marginBottom: '1rem',
            }}
          >
            <Sparkles size={14} />
            <span>MODELO 4: EVOLUCIÓN OFICIAL DEL ECOMMERCE ACTUAL</span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(2.5rem, 5.5vw, 4.25rem)',
              fontWeight: 900,
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
              marginBottom: '1.25rem',
            }}
          >
            Tu Tienda Oficial <span style={{ color: '#FEA604' }}>ARDYN</span> en San Juan.
          </h1>

          <p style={{ fontSize: '1.15rem', color: '#A1A1AA', lineHeight: 1.6, maxWidth: '560px', marginBottom: '2rem' }}>
            Indumentaria deportiva técnica, calzas seamless, hoodies oversize y conjuntos urbanos para hombres y mujeres. Sumá Ardyn Coins con cada compra y ahorrá en tu próximo pedido.
          </p>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <a
              href="#productos"
              style={{
                background: 'linear-gradient(135deg, #FEA604 0%, #FD8209 100%)',
                color: '#000000',
                padding: '0.85rem 1.75rem',
                borderRadius: '12px',
                fontWeight: 800,
                fontSize: '0.95rem',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 8px 24px rgba(254, 166, 4, 0.4)',
              }}
            >
              <span>Explorar Catálogo</span>
              <ChevronRight size={18} />
            </a>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                background: '#14151B',
                padding: '0.75rem 1.25rem',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                fontSize: '0.85rem',
              }}
            >
              <Coins size={18} color="#FEA604" />
              <span>
                <strong>100% de Puntos</strong> en tu cuenta corriente
              </span>
            </div>
          </div>
        </div>

        {/* Hero Image Showcase with Badge */}
        <div style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
          <div
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '420px',
              aspectRatio: '1',
              borderRadius: '24px',
              background: 'radial-gradient(circle at center, rgba(254, 166, 4, 0.2) 0%, rgba(13, 13, 16, 0.8) 70%)',
              border: '1px solid rgba(254, 166, 4, 0.3)',
              padding: '2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8)',
            }}
          >
            <Image src="/productos/hoodie-oversize.jpg" alt="Ardyn Streetwear Hoodie" fill style={{ objectFit: 'contain', borderRadius: '16px' }} priority />
          </div>
        </div>
      </section>

      {/* Rubros & Category Navigation Bar */}
      <section
        id="productos"
        style={{
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '2rem 2rem 1rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {['Todos', 'Hombre', 'Mujer', 'Streetwear'].map((rubro) => (
              <button
                key={rubro}
                onClick={() => setSelectedRubro(rubro)}
                style={{
                  background: selectedRubro === rubro
                    ? 'linear-gradient(135deg, #FEA604 0%, #FD8209 100%)'
                    : '#14151B',
                  color: selectedRubro === rubro ? '#000000' : '#A1A1AA',
                  border: selectedRubro === rubro ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
                  padding: '0.6rem 1.25rem',
                  borderRadius: '10px',
                  fontWeight: 800,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  boxShadow: selectedRubro === rubro ? '0 4px 16px rgba(254, 166, 4, 0.3)' : 'none',
                  transition: 'all 0.15s ease',
                }}
              >
                {rubro}
              </button>
            ))}
          </div>

          <div style={{ color: '#71717A', fontSize: '0.9rem' }}>
            Mostrando <strong>{filtered.length}</strong> artículos disponibles
          </div>
        </div>
      </section>

      {/* Enhanced Product Cards Grid */}
      <section
        style={{
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '2rem 2rem 6rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
          gap: '2rem',
        }}
      >
        {filtered.map((product) => (
          <div
            key={product.id}
            style={{
              background: '#111217',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)',
              transition: 'transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
              position: 'relative',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-6px)';
              e.currentTarget.style.borderColor = '#FEA604';
              e.currentTarget.style.boxShadow = '0 16px 40px rgba(0, 0, 0, 0.8), 0 0 25px rgba(254, 166, 4, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
              e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.4)';
            }}
          >
            {/* Top Badges */}
            <div style={{ position: 'absolute', top: 12, left: 12, zIndex: 2, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {product.isOffer && (
                <span
                  style={{
                    background: '#EF4444',
                    color: '#FFFFFF',
                    fontWeight: 900,
                    fontSize: '0.7rem',
                    padding: '0.25rem 0.6rem',
                    borderRadius: '6px',
                    letterSpacing: '0.04em',
                  }}
                >
                  🔥 OFERTA
                </span>
              )}
              {product.isFeatured && (
                <span
                  style={{
                    background: '#FEA604',
                    color: '#000000',
                    fontWeight: 900,
                    fontSize: '0.7rem',
                    padding: '0.25rem 0.6rem',
                    borderRadius: '6px',
                  }}
                >
                  ⭐ DESTACADO
                </span>
              )}
            </div>

            {/* Coins Badge */}
            <div
              style={{
                position: 'absolute',
                top: 12,
                right: 12,
                zIndex: 2,
                background: 'rgba(0,0,0,0.85)',
                border: '1px solid rgba(254, 166, 4, 0.4)',
                color: '#FEA604',
                fontSize: '0.7rem',
                fontWeight: 800,
                padding: '0.25rem 0.55rem',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                backdropFilter: 'blur(6px)',
              }}
            >
              <Coins size={12} />
              <span>+{product.coinsEarned} Coins</span>
            </div>

            {/* Product Image Frame */}
            <div
              style={{
                height: '240px',
                position: 'relative',
                background: 'radial-gradient(circle at center, #1c1d26 0%, #111217 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1.75rem',
              }}
            >
              <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                <Image src={product.image} alt={product.name} fill style={{ objectFit: 'contain' }} />
              </div>
            </div>

            {/* Product Body */}
            <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <div style={{ fontSize: '0.75rem', color: '#FEA604', fontWeight: 800, textTransform: 'uppercase' }}>
                {product.rubro} • {product.category}
              </div>

              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, lineHeight: 1.3, color: '#FFFFFF' }}>
                {product.name}
              </h3>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: '#FEA604' }}>
                <Star size={14} fill="#FEA604" color="#FEA604" />
                <span style={{ fontWeight: 800, color: '#FFFFFF' }}>{product.rating}</span>
                <span style={{ color: '#71717A' }}>({product.reviews} compras)</span>
              </div>

              {/* Price & Installments */}
              <div style={{ marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                  <span style={{ fontSize: '1.45rem', fontWeight: 900, color: '#FFFFFF' }}>
                    ${product.price.toLocaleString('es-AR')}
                  </span>
                  {product.oldPrice && (
                    <span style={{ fontSize: '0.85rem', color: '#71717A', textDecoration: 'line-through' }}>
                      ${product.oldPrice.toLocaleString('es-AR')}
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#34D399', fontWeight: 700, marginTop: '0.2rem' }}>
                  3 cuotas sin interés de ${(product.price / 3).toFixed(0)}
                </div>
              </div>

              {/* Add to cart */}
              <button
                onClick={() => addToCart(product)}
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #FEA604 0%, #FD8209 100%)',
                  border: 'none',
                  color: '#000000',
                  fontWeight: 900,
                  fontSize: '0.9rem',
                  padding: '0.75rem',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  marginTop: '0.25rem',
                  boxShadow: '0 4px 14px rgba(254, 166, 4, 0.3)',
                }}
              >
                <Plus size={16} strokeWidth={3} />
                <span>Agregar al Carrito</span>
              </button>
            </div>
          </div>
        ))}
      </section>

      {/* Floating Notification */}
      {toastMsg && (
        <div
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            background: 'linear-gradient(135deg, #FEA604 0%, #FD8209 100%)',
            color: '#000000',
            fontWeight: 900,
            padding: '0.85rem 1.4rem',
            borderRadius: '12px',
            boxShadow: '0 12px 30px rgba(0,0,0,0.8), 0 0 20px rgba(254, 166, 4, 0.5)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <Check size={18} strokeWidth={3} />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Footer Minorista Oficial */}
      <footer
        style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          background: '#07080a',
          padding: '3rem 1.5rem 2.5rem',
          color: '#71717A',
          fontSize: '0.85rem',
          marginTop: '4rem',
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <Image
              src={identidad.logo_url || '/logo-ardyn.png'}
              alt={identidad.nombre_marca || 'Ardyn'}
              width={46}
              height={46}
              style={{
                borderRadius: '10px',
                objectFit: 'contain',
                background: '#000000',
                border: '1px solid rgba(254, 166, 4, 0.35)',
                boxShadow: '0 0 14px rgba(254, 166, 4, 0.2)',
              }}
            />
            <div>
              <div style={{ color: '#FFFFFF', fontWeight: 900, fontSize: '1rem', letterSpacing: '-0.01em' }}>
                {identidad.nombre_marca || 'ARDYN'} · {identidad.subtitulo_minorista || 'Tienda Oficial'}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#A1A1AA', marginTop: '2px' }}>{footer.direccion}</div>
              <div style={{ fontSize: '0.75rem', color: '#71717A' }}>{footer.horarios}</div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ color: '#FEA604', fontWeight: 700, fontSize: '0.85rem' }}>
              Instagram: {footer.instagram}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#52525B', marginTop: '4px' }}>
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
            background: 'rgba(0, 0, 0, 0.8)',
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
              background: '#0e0f14',
              borderLeft: '1px solid rgba(254, 166, 4, 0.25)',
              padding: '1.75rem',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '-15px 0 50px rgba(0,0,0,0.9)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '1rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShoppingCart size={20} color="#FEA604" />
                <h2 style={{ fontSize: '1.25rem', fontWeight: 900 }}>Tu Carrito Ardyn</h2>
              </div>
              <button onClick={() => setIsCartOpen(false)} style={{ background: 'transparent', border: 'none', color: '#71717A', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            {/* Coins notification */}
            <div
              style={{
                margin: '1rem 0',
                padding: '0.85rem',
                background: 'rgba(254, 166, 4, 0.12)',
                border: '1px solid rgba(254, 166, 4, 0.35)',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                color: '#FEA604',
                fontSize: '0.85rem',
                fontWeight: 800,
              }}
            >
              <Coins size={18} />
              <span>Con este pedido acumulás <strong>+{totalCoins} Ardyn Coins</strong></span>
            </div>

            {/* List */}
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', padding: '0.5rem 0' }}>
              {cart.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#71717A' }}>
                  <Store size={40} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
                  <p>Aún no has agregado productos a tu carrito.</p>
                </div>
              ) : (
                cart.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '0.75rem', padding: '0.75rem', background: '#16171f', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <div style={{ width: 50, height: 50, position: 'relative', flexShrink: 0 }}>
                      <Image src={item.product.image} alt={item.product.name} fill style={{ objectFit: 'contain' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 800, fontSize: '0.85rem' }}>{item.product.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#FEA604' }}>{item.product.category}</div>
                      <div style={{ fontWeight: 900, marginTop: '0.25rem', fontSize: '0.92rem' }}>
                        ${(item.product.price * item.qty).toLocaleString('es-AR')}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 900 }}>x{item.qty}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Subtotal & Checkout */}
            {cart.length > 0 && (
              <div style={{ paddingTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '1.2rem', fontWeight: 900 }}>
                  <span>Total Pedido:</span>
                  <span style={{ color: '#FEA604' }}>${totalPrice.toLocaleString('es-AR')}</span>
                </div>

                <a
                  href={`https://wa.me/5492646796509?text=${encodeURIComponent(
                    `Hola Ardyn! Quiero confirmar este pedido minorista (Boceto 4 - Actual Evolucionado):\n${cart
                      .map((i) => `• ${i.qty}x ${i.product.name}`)
                      .join('\n')}\nTotal: $${totalPrice.toLocaleString('es-AR')}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    width: '100%',
                    background: '#25D366',
                    color: '#000000',
                    fontWeight: 900,
                    padding: '0.95rem',
                    borderRadius: '12px',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    fontSize: '0.95rem',
                    boxShadow: '0 4px 18px rgba(37, 211, 102, 0.35)',
                  }}
                >
                  <Send size={18} />
                  <span>Confirmar Pedido por WhatsApp</span>
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
