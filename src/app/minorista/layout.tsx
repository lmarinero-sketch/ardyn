'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

import { ShoppingCart, Search, Menu, X, ChevronRight, Package, HelpCircle, MapPin, Phone, Mail, Instagram } from 'lucide-react';
import { useCart } from '@/lib/cart';
import MarqueeBar from '@/components/tienda/MarqueeBar';
import MegaMenu from '@/components/tienda/MegaMenu';
import { useStoreConfig } from '@/hooks/useStoreConfig';
import GrowLabsBadge from '@/components/GrowLabsBadge';

export default function TiendaLayout({ children }: { children: React.ReactNode }) {
  const { getItemCount, isLoaded } = useCart();
  const [cartCount, setCartCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // ═══ Configuraciones dinámicas con fallback a defaults ═══
  const { config: identidad } = useStoreConfig('tienda_identidad');
  const { config: footer } = useStoreConfig('tienda_footer');
  const { config: whatsapp } = useStoreConfig('tienda_whatsapp');

  useEffect(() => {
    if (isLoaded) setCartCount(getItemCount());

    const handler = () => {
      const stored = localStorage.getItem('ardyn_cart');
      if (stored) {
        const items = JSON.parse(stored);
        setCartCount(items.reduce((s: number, i: { cantidad: number }) => s + i.cantidad, 0));
      }
    };
    window.addEventListener('cart-updated', handler);
    return () => window.removeEventListener('cart-updated', handler);
  }, [isLoaded, getItemCount]);

  const waLink = `https://api.whatsapp.com/send/?phone=${whatsapp.numero_minorista}&text=${encodeURIComponent(whatsapp.mensaje_minorista)}`;

  return (
    <div style={{ minHeight: '100vh', background: 'transparent' }}>
      {/* ===== MARQUEE ===== */}
      <MarqueeBar storeType="minorista" />

      {/* ===== HEADER ===== */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(10, 10, 12, 0.92)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0.75rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
        }}>
          {/* Left: Logo */}
          <Link href="/minorista" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
            <img
              src={identidad.logo_url || "/logo-ardyn.png"}
              alt={identidad.nombre_marca || "Ardyn"}
              width={42}
              height={42}
              style={{
                borderRadius: 10,
                objectFit: 'contain',
                background: '#000000',
                border: '1px solid rgba(254, 166, 4, 0.35)',
                boxShadow: '0 0 12px rgba(254, 166, 4, 0.2)',
              }}
            />
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.125rem', lineHeight: 1.2, letterSpacing: '-0.02em', color: '#FFFFFF' }}>{identidad.nombre_marca}</div>
              <div style={{ fontSize: '0.6875rem', color: 'var(--brand-gold)', fontWeight: 600, letterSpacing: '0.02em' }}>{identidad.subtitulo_minorista}</div>
            </div>
          </Link>

          {/* Center: Desktop Nav */}
          <nav style={{ display: 'none', gap: '0.25rem', alignItems: 'center' }} className="desktop-nav">
            <Link href="/minorista">
              <button className="btn-ghost" style={{ fontSize: '0.875rem', color: '#FFFFFF' }}>Inicio</button>
            </Link>
            <MegaMenu baseUrl="/minorista" />
            <a href={waLink} target="_blank" rel="noopener noreferrer">
              <button className="btn-ghost" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Whatsapp</button>
            </a>
            <a href={whatsapp.url_sucursal} target="_blank" rel="noopener noreferrer" className="btn-ghost" style={{ fontSize: '0.875rem', textDecoration: 'none', color: 'var(--text-secondary)' }}>
              Visita Nuestra Sucursal
            </a>
            <Link href="/minorista/como-comprar">
              <button className="btn-ghost" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>¿Cómo comprar?</button>
            </Link>
          </nav>

          {/* Right: Cart + Mobile menu */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Link href="/minorista/carrito">
              <button className="btn-ghost" style={{ position: 'relative', padding: '0.625rem', color: '#FFFFFF' }}>
                <ShoppingCart size={22} />
                {cartCount > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: 2,
                    right: 2,
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    background: 'var(--brand-gradient)',
                    color: '#000000',
                    fontSize: '0.6875rem',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 8px rgba(254, 166, 4, 0.4)',
                  }}>
                    {cartCount}
                  </span>
                )}
              </button>
            </Link>

            {/* Mobile hamburger */}
            <button
              className="btn-ghost mobile-only"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{ padding: '0.625rem' }}
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div style={{
            padding: '0.5rem 1.5rem 1rem',
            borderTop: '1px solid var(--border-light)',
            background: 'var(--bg-color)',
            animation: 'slideUp 0.2s ease-out',
          }}>
            <Link href="/minorista" onClick={() => setMobileMenuOpen(false)}>
              <div style={{
                padding: '0.875rem 0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid var(--border-light)',
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 600 }}>
                  <Package size={18} /> Catálogo
                </span>
                <ChevronRight size={16} color="var(--text-light)" />
              </div>
            </Link>
            <Link href="/minorista/carrito" onClick={() => setMobileMenuOpen(false)}>
              <div style={{
                padding: '0.875rem 0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 600 }}>
                  <ShoppingCart size={18} /> Mi Pedido
                  {cartCount > 0 && <span className="badge badge-blue">{cartCount}</span>}
                </span>
                <ChevronRight size={16} color="var(--text-light)" />
              </div>
            </Link>
            <Link href="/minorista/como-comprar" onClick={() => setMobileMenuOpen(false)}>
              <div style={{
                padding: '0.875rem 0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 600 }}>
                  <HelpCircle size={18} /> ¿Cómo comprar?
                </span>
                <ChevronRight size={16} color="var(--text-light)" />
              </div>
            </Link>
          </div>
        )}
      </header>

      {/* ===== MAIN CONTENT ===== */}
      <main>
        {children}
      </main>

      {/* ===== FOOTER ===== */}
      <footer style={{
        background: 'var(--bg-color)',
        borderTop: '1px solid var(--border-color)',
        padding: '3rem 1.5rem 2rem',
        marginTop: '3.5rem',
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          {/* Main Footer Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '2.5rem',
            paddingBottom: '2.5rem',
            borderBottom: '1px solid var(--border-light)',
            textAlign: 'left',
          }}>
            {/* Column 1: Brand & Presentation */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <img
                  src={identidad.logo_url || "/logo-ardyn.png"}
                  alt={identidad.nombre_marca || "Ardyn"}
                  width={40}
                  height={40}
                  style={{
                    borderRadius: 10,
                    objectFit: 'contain',
                    background: '#000000',
                    border: '1px solid rgba(254, 166, 4, 0.35)',
                    boxShadow: '0 0 12px rgba(254, 166, 4, 0.2)',
                  }}
                />
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1.125rem', color: '#FFFFFF' }}>{identidad.nombre_marca}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--brand-gold)', fontWeight: 600 }}>{identidad.subtitulo_minorista}</div>
                </div>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1rem' }}>
                {identidad.nombre_completo}. Indumentaria deportiva y urbana oficial, suplementación y accesorios para entrenamiento de alto rendimiento.
              </p>
            </div>

            {/* Column 2: Sucursales y Direcciones */}
            <div>
              <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={16} style={{ color: 'var(--brand-gold)' }} /> Sucursales & Ubicación
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.85rem' }}>
                <div>
                  <div style={{ fontWeight: 600, color: '#FFFFFF' }}>Sucursal Central</div>
                  <div style={{ color: 'var(--text-muted)' }}>{footer.direccion}</div>
                  {whatsapp.url_sucursal && (
                    <a href={whatsapp.url_sucursal} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', color: 'var(--brand-gold)', fontSize: '0.75rem', marginTop: '3px', textDecoration: 'none' }}>
                      📍 Ver en Google Maps →
                    </a>
                  )}
                </div>

                {footer.direccion_secundaria && (
                  <div>
                    <div style={{ fontWeight: 600, color: '#FFFFFF' }}>Segunda Sucursal</div>
                    <div style={{ color: 'var(--text-muted)' }}>{footer.direccion_secundaria}</div>
                    {whatsapp.url_sucursal_rawson && (
                      <a href={whatsapp.url_sucursal_rawson} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', color: 'var(--brand-gold)', fontSize: '0.75rem', marginTop: '3px', textDecoration: 'none' }}>
                        📍 Ver en Google Maps →
                      </a>
                    )}
                  </div>
                )}

                {footer.horarios && (
                  <div>
                    <div style={{ fontWeight: 600, color: '#FFFFFF' }}>Horarios de Atención</div>
                    <div style={{ color: 'var(--text-muted)' }}>{footer.horarios}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Column 3: Contacto & Teléfonos */}
            <div>
              <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Phone size={16} style={{ color: 'var(--brand-gold)' }} /> Atención & Pedidos
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
                <a href={waLink} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#25D366', textDecoration: 'none', fontWeight: 600 }}>
                  <span>💬 WhatsApp Minorista:</span> {whatsapp.numero_minorista}
                </a>

                {footer.telefono && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                    <Phone size={14} /> {footer.telefono}
                  </div>
                )}

                {footer.telefono_fijo && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                    <span>☎️</span> {footer.telefono_fijo}
                  </div>
                )}

                {footer.email_contacto && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                    <Mail size={14} /> {footer.email_contacto}
                  </div>
                )}

                {/* Redes Sociales */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                  {footer.instagram && (
                    <a href={`https://instagram.com/${footer.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" style={{
                      display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                      padding: '0.35rem 0.65rem', borderRadius: '6px',
                      background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                      color: 'var(--text-main)', fontSize: '0.75rem', textDecoration: 'none',
                    }}>
                      <Instagram size={13} /> {footer.instagram}
                    </a>
                  )}
                  {footer.facebook && (
                    <a href={footer.facebook.startsWith('http') ? footer.facebook : `https://facebook.com/${footer.facebook}`} target="_blank" rel="noopener noreferrer" style={{
                      display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                      padding: '0.35rem 0.65rem', borderRadius: '6px',
                      background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                      color: 'var(--text-main)', fontSize: '0.75rem', textDecoration: 'none',
                    }}>
                      Facebook
                    </a>
                  )}
                  {footer.tiktok && (
                    <a href={footer.tiktok.startsWith('http') ? footer.tiktok : `https://tiktok.com/@${footer.tiktok.replace('@', '')}`} target="_blank" rel="noopener noreferrer" style={{
                      display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                      padding: '0.35rem 0.65rem', borderRadius: '6px',
                      background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                      color: 'var(--text-main)', fontSize: '0.75rem', textDecoration: 'none',
                    }}>
                      TikTok
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar: Copyright & GROW LABS BADGE */}
          <div style={{
            paddingTop: '1.75rem',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
          }}>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              © {new Date().getFullYear()} {identidad.nombre_marca} · Todos los derechos reservados.
            </div>

            {/* Grow Labs Credit Badge */}
            <GrowLabsBadge />
          </div>
        </div>
      </footer>

      {/* ===== RESPONSIVE STYLES ===== */}
      <style jsx>{`
        .desktop-nav {
          display: none !important;
        }
        .mobile-only {
          display: flex !important;
        }
        @media (min-width: 768px) {
          .desktop-nav {
            display: flex !important;
          }
          .mobile-only {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
