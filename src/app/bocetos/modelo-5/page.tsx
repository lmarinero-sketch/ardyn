'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Search,
  ShoppingCart,
  Plus,
  Minus,
  Star,
  Check,
  X,
  Send,
  SlidersHorizontal,
  ChevronDown,
  MapPin,
  HelpCircle,
  MessageCircle,
  ExternalLink,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import ModelSwitcher from '@/components/bocetos/ModelSwitcher';
import { useStoreConfig } from '@/hooks/useStoreConfig';

interface ProductItem {
  id: string;
  name: string;
  rubro: 'Suplementos' | 'Indumentaria' | 'Accesorios';
  category: string;
  brand: string;
  price: number;
  oldPrice?: number;
  rating: number;
  image: string;
  isOffer?: boolean;
  isFeatured?: boolean;
  stock: number;
}

const PRODUCTS_DATA: ProductItem[] = [
  {
    id: 'm5-1',
    name: 'ARDYN Whey Protein 100% Ultrafiltrada 1KG',
    rubro: 'Suplementos',
    category: 'Proteínas',
    brand: 'ARDYN NUTRITION',
    price: 32000,
    oldPrice: 38500,
    rating: 4.9,
    image: '/productos/whey-protein.png',
    isOffer: true,
    isFeatured: true,
    stock: 42,
  },
  {
    id: 'm5-2',
    name: 'ARDYN Creatina Micronizada 100% Pura 300g',
    rubro: 'Suplementos',
    category: 'Fuerza',
    brand: 'ARDYN LABS',
    price: 24500,
    oldPrice: 29000,
    rating: 5.0,
    image: '/productos/creatina.png',
    isOffer: true,
    isFeatured: true,
    stock: 28,
  },
  {
    id: 'm5-3',
    name: 'Remera Dry-Fit Training Pro Black Edition',
    rubro: 'Indumentaria',
    category: 'Remeras',
    brand: 'ARDYN WEAR',
    price: 18900,
    oldPrice: 22000,
    rating: 4.8,
    image: '/productos/camiseta.png',
    isOffer: true,
    stock: 19,
  },
  {
    id: 'm5-4',
    name: 'Pre-Entreno Nitro Shock Ardyn X-Plode 300g',
    rubro: 'Suplementos',
    category: 'Energía',
    brand: 'ARDYN NUTRITION',
    price: 26800,
    rating: 4.9,
    image: '/productos/preentreno.png',
    isFeatured: true,
    stock: 15,
  },
  {
    id: 'm5-5',
    name: 'BCAA 2:1:1 + Glutamina Recovery Matrix 300g',
    rubro: 'Suplementos',
    category: 'Recuperación',
    brand: 'ARDYN LABS',
    price: 21500,
    rating: 4.7,
    image: '/productos/bcaa.png',
    stock: 22,
  },
  {
    id: 'm5-6',
    name: 'Shaker Pro Ardyn Hermético Anti-Grumos 700ml',
    rubro: 'Accesorios',
    category: 'Botellas',
    brand: 'ARDYN GEAR',
    price: 7500,
    rating: 4.8,
    image: '/productos/shaker.png',
    stock: 54,
  },
];

export default function Modelo5ClassicPage() {
  const { config: identidad } = useStoreConfig('tienda_identidad');
  const { config: heroConfig } = useStoreConfig('tienda_hero_minorista');
  const { config: colores } = useStoreConfig('tienda_colores');
  const { config: whatsapp } = useStoreConfig('tienda_whatsapp');
  const { config: footer } = useStoreConfig('tienda_footer');

  const [selectedRubro, setSelectedRubro] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<{ product: ProductItem; qty: number }[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showFaqModal, setShowFaqModal] = useState(false);
  const [showBranchModal, setShowBranchModal] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const filtered = PRODUCTS_DATA.filter((p) => {
    const matchRubro = selectedRubro === 'Todos' || p.rubro === selectedRubro;
    const matchSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase());
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

  const updateQty = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === id) {
            const newQty = item.qty + delta;
            return newQty > 0 ? { ...item, qty: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as { product: ProductItem; qty: number }[]
    );
  };

  const totalItems = cart.reduce((s, i) => s + i.qty, 0);
  const totalPrice = cart.reduce((s, i) => s + i.product.price * i.qty, 0);

  const formatPrice = (val: number) =>
    new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0,
    }).format(val);

  const handleCheckoutWhatsApp = () => {
    if (cart.length === 0) return;
    const itemsList = cart
      .map((item) => `• ${item.qty}x ${item.product.name} - ${formatPrice(item.product.price * item.qty)}`)
      .join('\n');
    const msg = `*Hola ${identidad.nombre_marca}!* 👋\nQuiero confirmar mi pedido desde la tienda:\n\n${itemsList}\n\n*Total estimado:* ${formatPrice(
      totalPrice
    )}\n\n¿Tienen disponibilidad para coordinar la entrega o retiro en sucursal?`;
    window.open(`https://wa.me/${whatsapp.numero_minorista}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0a0a0c',
        backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
        color: '#FFFFFF',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      {/* Selector de Bocetos Superior */}
      <ModelSwitcher current="5" />

      {/* Header Clásico Ardyn (Exacto al de la foto) */}
      <header
        style={{
          background: 'rgba(10, 10, 12, 0.96)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          position: 'sticky',
          top: '49px',
          zIndex: 100,
          backdropFilter: 'blur(16px)',
          padding: '0.85rem 1.5rem',
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.5rem',
          }}
        >
          {/* Logo Brand + Badge */}
          <Link
            href="/bocetos/modelo-5"
            style={{
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: '8px',
                background: '#000000',
                border: '1px solid rgba(254, 166, 4, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                padding: '4px',
                boxShadow: '0 4px 14px rgba(0,0,0,0.5)',
              }}
            >
              <Image
                src={identidad.logo_url || '/logo-ardyn.png'}
                alt={identidad.nombre_marca}
                width={36}
                height={36}
                style={{ objectFit: 'contain' }}
              />
            </div>
            <div>
              <div
                style={{
                  fontSize: '1.15rem',
                  fontWeight: 900,
                  color: '#FFFFFF',
                  letterSpacing: '0.08em',
                  lineHeight: 1.1,
                }}
              >
                {identidad.nombre_marca || 'ARDYN'}
              </div>
              <span
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  color: colores.color_primario || '#FEA604',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                }}
              >
                {identidad.subtitulo_minorista || 'Tienda Oficial'}
              </span>
            </div>
          </Link>

          {/* Center Navigation Links (Inicio, Productos, Whatsapp, Visita Nuestra Sucursal, ¿Cómo comprar?) */}
          <nav
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.5rem',
            }}
            className="hide-mobile"
          >
            <Link
              href="#catalogo"
              style={{
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: '0.875rem',
                textDecoration: 'none',
                transition: 'color 0.15s',
              }}
            >
              Inicio
            </Link>

            {/* Dropdown Productos */}
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <button
                onClick={() => setSelectedRubro('Todos')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#D4D4D8',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: 0,
                  minHeight: 'auto',
                  boxShadow: 'none',
                }}
              >
                Productos <ChevronDown size={14} />
              </button>
            </div>

            <a
              href={`https://wa.me/${whatsapp.numero_minorista}?text=${encodeURIComponent(whatsapp.mensaje_minorista)}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: '#D4D4D8',
                fontWeight: 500,
                fontSize: '0.875rem',
                textDecoration: 'none',
                transition: 'color 0.15s',
              }}
            >
              Whatsapp
            </a>

            <button
              onClick={() => setShowBranchModal(true)}
              style={{
                background: 'none',
                border: 'none',
                color: '#D4D4D8',
                fontSize: '0.875rem',
                fontWeight: 500,
                cursor: 'pointer',
                padding: 0,
                minHeight: 'auto',
                boxShadow: 'none',
              }}
            >
              Visita Nuestra Sucursal
            </button>

            <button
              onClick={() => setShowFaqModal(true)}
              style={{
                background: 'none',
                border: 'none',
                color: '#D4D4D8',
                fontSize: '0.875rem',
                fontWeight: 500,
                cursor: 'pointer',
                padding: 0,
                minHeight: 'auto',
                boxShadow: 'none',
              }}
            >
              ¿Cómo comprar?
            </button>
          </nav>

          {/* Right: Cart Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '10px',
              padding: '0.6rem 0.9rem',
              color: '#FFFFFF',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.55rem',
              position: 'relative',
              transition: 'all 0.2s ease',
              minHeight: 'auto',
              boxShadow: 'none',
            }}
          >
            <ShoppingCart size={18} />
            {totalItems > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: -6,
                  right: -6,
                  background: 'linear-gradient(135deg, #FEA604, #FD8209)',
                  color: '#000000',
                  fontWeight: 900,
                  fontSize: '0.72rem',
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(254, 166, 4, 0.6)',
                }}
              >
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '1.5rem 1.5rem 4rem' }}>
        {/* ===== 1. VIDEO DE PORTADA (Exacto a la foto adjunta) ===== */}
        {heroConfig.video_activo && heroConfig.video_url && (
          <div
            style={{
              width: '100%',
              aspectRatio: '16/9',
              maxHeight: '520px',
              marginBottom: '1.75rem',
              borderRadius: 16,
              overflow: 'hidden',
              background: '#000000',
              boxShadow: '0 16px 40px rgba(0, 0, 0, 0.75)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              position: 'relative',
            }}
          >
            <iframe
              width="100%"
              height="100%"
              src={heroConfig.video_url}
              title="Ardyn Suplementos & Entrenamiento"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ display: 'block', border: 'none' }}
            />
          </div>
        )}

        {/* ===== 2. HERO BANNER DE ATLETAS DUALES (hero-sportswear-v2.webp) ===== */}
        <section
          style={{
            borderRadius: 16,
            padding: '3rem 2.25rem',
            marginBottom: '2rem',
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
            minHeight: '270px',
            display: 'flex',
            alignItems: 'center',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            boxShadow: '0 12px 36px rgba(0, 0, 0, 0.6)',
          }}
        >
          {/* Background image de los dos atletas */}
          <Image
            src={heroConfig.imagen_fondo_url || '/hero-sportswear-v2.webp'}
            alt="Ardyn Urban & Sportswear"
            fill
            style={{ objectFit: 'cover', objectPosition: 'right 15%' }}
            priority
          />

          {/* Degradado oscuro para máxima legibilidad */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(90deg, rgba(0,0,0,0.96) 0%, rgba(0,0,0,0.85) 45%, rgba(0,0,0,0.3) 78%, rgba(0,0,0,0.08) 100%)',
              zIndex: 1,
            }}
          />

          {/* Contenido Hero */}
          <div style={{ position: 'relative', zIndex: 2, maxWidth: '580px' }}>
            <h1
              style={{
                color: '#FFFFFF',
                fontSize: '2.2rem',
                marginBottom: '0.6rem',
                fontWeight: 900,
                letterSpacing: '-0.02em',
                lineHeight: 1.15,
              }}
            >
              {heroConfig.titulo || 'Catálogo Minorista 🛒'}
            </h1>
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '0.975rem',
                marginBottom: '0.6rem',
                lineHeight: 1.5,
              }}
            >
              {heroConfig.descripcion ||
                'Armá tu pedido con precios exclusivos. Suplementos, indumentaria y accesorios deportivos.'}
            </p>
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.5)',
                fontSize: '0.78rem',
                marginBottom: '1.4rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <span>📦</span>
              <span>{heroConfig.subtexto || 'Solo se muestran productos con stock disponible'}</span>
            </p>

            {/* Input Buscar Productos */}
            <div style={{ position: 'relative', maxWidth: '440px' }}>
              <Search
                size={18}
                style={{
                  position: 'absolute',
                  left: 14,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'rgba(255, 255, 255, 0.45)',
                }}
              />
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem 0.75rem 2.6rem',
                  background: 'rgba(255, 255, 255, 0.12)',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  borderRadius: 100,
                  color: '#FFFFFF',
                  fontSize: '0.875rem',
                  outline: 'none',
                  backdropFilter: 'blur(8px)',
                  transition: 'border-color 0.2s',
                }}
              />
            </div>
          </div>
        </section>

        {/* ===== 3. FILTROS RÁPIDOS POR RUBRO ===== */}
        <section
          id="catalogo"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {['Todos', 'Suplementos', 'Indumentaria', 'Accesorios'].map((rubro) => {
              const isSelected = selectedRubro === rubro;
              return (
                <button
                  key={rubro}
                  onClick={() => setSelectedRubro(rubro)}
                  style={{
                    padding: '0.45rem 1rem',
                    borderRadius: 100,
                    fontSize: '0.8125rem',
                    fontWeight: isSelected ? 800 : 500,
                    color: isSelected ? '#000000' : '#D4D4D8',
                    background: isSelected
                      ? 'linear-gradient(135deg, #FEA604 0%, #FD8209 100%)'
                      : 'rgba(255, 255, 255, 0.05)',
                    border: isSelected ? '1px solid #FEA604' : '1px solid rgba(255, 255, 255, 0.1)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    minHeight: 'auto',
                    boxShadow: isSelected ? '0 4px 12px rgba(254, 166, 4, 0.3)' : 'none',
                  }}
                >
                  {rubro}
                </button>
              );
            })}
          </div>

          <span style={{ fontSize: '0.8125rem', color: '#71717A' }}>
            Mostrando <strong>{filtered.length}</strong> productos disponibles
          </span>
        </section>

        {/* ===== 4. GRILLA DE PRODUCTOS ESTANDARIZADA ===== */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {filtered.map((prod) => {
            const inCart = cart.find((i) => i.product.id === prod.id);
            const discountPercent = prod.oldPrice
              ? Math.round((1 - prod.price / prod.oldPrice) * 100)
              : 0;

            return (
              <div
                key={prod.id}
                style={{
                  background: '#111216',
                  borderRadius: 14,
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s, border-color 0.2s',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(254, 166, 4, 0.4)';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.7)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255, 255, 255, 0.08)';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.4)';
                }}
              >
                {/* Imagen del Producto */}
                <div
                  style={{
                    aspectRatio: '1',
                    background: '#18191E',
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '1.25rem',
                  }}
                >
                  <Image
                    src={prod.image}
                    alt={prod.name}
                    width={180}
                    height={180}
                    style={{ objectFit: 'contain' }}
                  />

                  {/* Badges superiores */}
                  <div
                    style={{
                      position: 'absolute',
                      top: 10,
                      left: 10,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                    }}
                  >
                    {prod.isFeatured && (
                      <span
                        style={{
                          background: '#FEA604',
                          color: '#000000',
                          padding: '0.2rem 0.5rem',
                          borderRadius: 6,
                          fontSize: '0.65rem',
                          fontWeight: 800,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 3,
                        }}
                      >
                        <Star size={10} fill="#000" /> DESTACADO
                      </span>
                    )}
                    {prod.isOffer && discountPercent > 0 && (
                      <span
                        style={{
                          background: '#EF4444',
                          color: '#FFFFFF',
                          padding: '0.2rem 0.5rem',
                          borderRadius: 6,
                          fontSize: '0.65rem',
                          fontWeight: 800,
                        }}
                      >
                        -{discountPercent}% OFF
                      </span>
                    )}
                  </div>
                </div>

                {/* Info Card */}
                <div
                  style={{
                    padding: '1rem',
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.6875rem',
                      fontWeight: 700,
                      color: '#FEA604',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      marginBottom: '0.25rem',
                    }}
                  >
                    {prod.brand}
                  </span>

                  <h3
                    style={{
                      fontSize: '0.9375rem',
                      fontWeight: 700,
                      color: '#FFFFFF',
                      marginBottom: '0.6rem',
                      lineHeight: 1.35,
                      minHeight: '2.7rem',
                    }}
                  >
                    {prod.name}
                  </h3>

                  {/* Precios */}
                  <div style={{ marginTop: 'auto', marginBottom: '0.85rem' }}>
                    {prod.oldPrice && (
                      <span
                        style={{
                          fontSize: '0.78rem',
                          color: '#71717A',
                          textDecoration: 'line-through',
                          marginRight: '0.4rem',
                        }}
                      >
                        {formatPrice(prod.oldPrice)}
                      </span>
                    )}
                    <div
                      style={{
                        fontSize: '1.25rem',
                        fontWeight: 900,
                        color: '#FFFFFF',
                      }}
                    >
                      {formatPrice(prod.price)}
                    </div>
                  </div>

                  {/* Botón de Agregar / Cantidad */}
                  {inCart ? (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: 'rgba(254, 166, 4, 0.15)',
                        border: '1px solid #FEA604',
                        borderRadius: 8,
                        padding: '0.35rem 0.6rem',
                      }}
                    >
                      <button
                        onClick={() => updateQty(prod.id, -1)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#FEA604',
                          cursor: 'pointer',
                          padding: 4,
                          minHeight: 'auto',
                          boxShadow: 'none',
                        }}
                      >
                        <Minus size={15} />
                      </button>
                      <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#FFFFFF' }}>
                        {inCart.qty} en carrito
                      </span>
                      <button
                        onClick={() => updateQty(prod.id, 1)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#FEA604',
                          cursor: 'pointer',
                          padding: 4,
                          minHeight: 'auto',
                          boxShadow: 'none',
                        }}
                      >
                        <Plus size={15} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => addToCart(prod)}
                      style={{
                        width: '100%',
                        padding: '0.65rem',
                        borderRadius: 8,
                        background: 'linear-gradient(135deg, #FEA604 0%, #FD8209 100%)',
                        color: '#000000',
                        fontWeight: 800,
                        fontSize: '0.8125rem',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.4rem',
                        boxShadow: '0 2px 8px rgba(254, 166, 4, 0.3)',
                        transition: 'transform 0.15s ease',
                      }}
                    >
                      <Plus size={16} /> Agregar al Carrito
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* ===== DRAWER DEL CARRITO ===== */}
      {isCartOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            display: 'flex',
            justifyContent: 'flex-end',
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(8px)',
          }}
          onClick={() => setIsCartOpen(false)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '440px',
              background: '#0D0E12',
              borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              padding: '1.5rem',
              height: '100%',
              boxShadow: '-8px 0 30px rgba(0,0,0,0.8)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Carrito */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                paddingBottom: '1rem',
                marginBottom: '1rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShoppingCart size={20} color="#FEA604" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                  Tu Pedido ({totalItems})
                </h3>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#A1A1AA',
                  cursor: 'pointer',
                  padding: 4,
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Items */}
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
              }}
            >
              {cart.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#71717A' }}>
                  <ShoppingCart size={44} style={{ opacity: 0.3, margin: '0 auto 0.75rem' }} />
                  <p style={{ fontWeight: 600 }}>El carrito está vacío</p>
                  <p style={{ fontSize: '0.8rem' }}>Agregá productos para coordinar tu compra directa.</p>
                </div>
              ) : (
                cart.map(({ product, qty }) => (
                  <div
                    key={product.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: 10,
                      padding: '0.75rem',
                    }}
                  >
                    <div
                      style={{
                        width: 50,
                        height: 50,
                        background: '#1A1B20',
                        borderRadius: 8,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={40}
                        height={40}
                        style={{ objectFit: 'contain' }}
                      />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h4
                        style={{
                          fontSize: '0.8125rem',
                          fontWeight: 700,
                          color: '#FFFFFF',
                          margin: '0 0 2px',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {product.name}
                      </h4>
                      <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#FEA604' }}>
                        {formatPrice(product.price * qty)}
                      </span>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        background: 'rgba(255,255,255,0.06)',
                        borderRadius: 6,
                        padding: '2px 4px',
                      }}
                    >
                      <button
                        onClick={() => updateQty(product.id, -1)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#fff',
                          cursor: 'pointer',
                          padding: 2,
                        }}
                      >
                        <Minus size={13} />
                      </button>
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, minWidth: 16, textAlign: 'center' }}>
                        {qty}
                      </span>
                      <button
                        onClick={() => updateQty(product.id, 1)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#fff',
                          cursor: 'pointer',
                          padding: 2,
                        }}
                      >
                        <Plus size={13} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Carrito */}
            {cart.length > 0 && (
              <div
                style={{
                  borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                  paddingTop: '1rem',
                  marginTop: '1rem',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '1rem',
                  }}
                >
                  <span style={{ color: '#A1A1AA', fontSize: '0.9rem' }}>Subtotal estimado:</span>
                  <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#FEA604' }}>
                    {formatPrice(totalPrice)}
                  </span>
                </div>

                <button
                  onClick={handleCheckoutWhatsApp}
                  style={{
                    width: '100%',
                    padding: '0.85rem',
                    borderRadius: 10,
                    background: '#25D366',
                    color: '#000000',
                    fontWeight: 900,
                    fontSize: '0.9375rem',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 4px 15px rgba(37, 211, 102, 0.4)',
                  }}
                >
                  <Send size={18} /> Finalizar Pedido por WhatsApp
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===== MODAL SUCURSALES ===== */}
      {showBranchModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            background: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
          }}
          onClick={() => setShowBranchModal(false)}
        >
          <div
            style={{
              background: '#121318',
              border: '1px solid rgba(254, 166, 4, 0.3)',
              borderRadius: 16,
              maxWidth: '500px',
              width: '100%',
              padding: '1.5rem',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem',
              }}
            >
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FEA604', margin: 0 }}>
                Nuestras Sucursales Ardyn
              </h3>
              <button
                onClick={() => setShowBranchModal(false)}
                style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  padding: '1rem',
                  borderRadius: 10,
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <div style={{ fontWeight: 800, color: '#fff', marginBottom: 4 }}>Casa Central Rivadavia</div>
                <div style={{ fontSize: '0.85rem', color: '#A1A1AA', marginBottom: 8 }}>{footer.direccion}</div>
                <a
                  href={whatsapp.url_sucursal}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: '#FEA604',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  Abrir en Google Maps <ExternalLink size={12} />
                </a>
              </div>

              {footer.direccion_secundaria && (
                <div
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    padding: '1rem',
                    borderRadius: 10,
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  <div style={{ fontWeight: 800, color: '#fff', marginBottom: 4 }}>Sede Rawson</div>
                  <div style={{ fontSize: '0.85rem', color: '#A1A1AA', marginBottom: 8 }}>
                    {footer.direccion_secundaria}
                  </div>
                  <a
                    href={whatsapp.url_sucursal_rawson}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: '#FEA604',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    Abrir en Google Maps <ExternalLink size={12} />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ===== MODAL FAQs (¿Cómo comprar?) ===== */}
      {showFaqModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            background: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
          }}
          onClick={() => setShowFaqModal(false)}
        >
          <div
            style={{
              background: '#121318',
              border: '1px solid rgba(254, 166, 4, 0.3)',
              borderRadius: 16,
              maxWidth: '540px',
              width: '100%',
              padding: '1.5rem',
              maxHeight: '80vh',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem',
              }}
            >
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FEA604', margin: 0 }}>
                ¿Cómo comprar en Ardyn?
              </h3>
              <button
                onClick={() => setShowFaqModal(false)}
                style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.04)', padding: '0.85rem', borderRadius: 8 }}>
                <strong style={{ color: '#fff', display: 'block', marginBottom: 4 }}>
                  1. Seleccioná tus productos
                </strong>
                <p style={{ color: '#A1A1AA', margin: 0 }}>
                  Elegí los suplementos o prendas que deseás y agregalos a tu carrito con un clic.
                </p>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.04)', padding: '0.85rem', borderRadius: 8 }}>
                <strong style={{ color: '#fff', display: 'block', marginBottom: 4 }}>
                  2. Enviá tu pedido a WhatsApp
                </strong>
                <p style={{ color: '#A1A1AA', margin: 0 }}>
                  Tocá "Finalizar Pedido" y se enviará el resumen exacto a nuestro equipo de ventas.
                </p>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.04)', padding: '0.85rem', borderRadius: 8 }}>
                <strong style={{ color: '#fff', display: 'block', marginBottom: 4 }}>
                  3. Medios de pago y entrega
                </strong>
                <p style={{ color: '#A1A1AA', margin: 0 }}>
                  Aceptamos efectivo, transferencia con descuento y tarjetas de crédito en cuotas. Retirá en el día o
                  recibí a domicilio.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating WhatsApp Button */}
      {whatsapp.boton_flotante_activo && (
        <a
          href={`https://wa.me/${whatsapp.numero_minorista}?text=${encodeURIComponent(whatsapp.mensaje_minorista)}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: '#25D366',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 6px 24px rgba(37, 211, 102, 0.5)',
            zIndex: 999,
            transition: 'transform 0.2s',
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.transform = 'scale(1.08)')}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.transform = 'scale(1)')}
        >
          <MessageCircle size={30} />
        </a>
      )}

      {/* Toast Notification */}
      {toastMsg && (
        <div
          style={{
            position: 'fixed',
            bottom: '30px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'linear-gradient(135deg, #FEA604, #FD8209)',
            color: '#000000',
            fontWeight: 800,
            fontSize: '0.85rem',
            padding: '0.65rem 1.25rem',
            borderRadius: 100,
            boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <Check size={16} />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Footer Oficial */}
      <footer
        style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          background: '#070709',
          padding: '2.5rem 1.5rem',
          color: '#71717A',
          fontSize: '0.8125rem',
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
              width={44}
              height={44}
              style={{
                borderRadius: '9px',
                objectFit: 'contain',
                background: '#000000',
                border: '1px solid rgba(254, 166, 4, 0.35)',
                boxShadow: '0 0 12px rgba(254, 166, 4, 0.15)',
              }}
            />
            <div>
              <div style={{ color: '#FFFFFF', fontWeight: 800, fontSize: '0.95rem', marginBottom: 4 }}>
                {identidad.nombre_completo || 'ARDYN INDUMENTARIA & SUPLEMENTOS'}
              </div>
              <div>{footer.direccion}</div>
              <div>{footer.horarios}</div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ color: '#A1A1AA', marginBottom: 4 }}>
              Instagram: <strong style={{ color: '#FEA604' }}>{footer.instagram}</strong>
            </div>
            <div>
              <a
                href={footer.url_creditos}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#71717A', textDecoration: 'none' }}
              >
                {footer.texto_creditos || 'Hecho por Grow Labs'}
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
