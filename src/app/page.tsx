
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { LayoutDashboard, TrendingUp, ShoppingCart, BarChart2, ShieldCheck, GraduationCap, BookOpen, ArrowRight } from 'lucide-react';

export default function HomePage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'var(--bg-color)' }}>
      <main className="page-container">

        {/* Header Hero */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div className="animate-float" style={{
            display: 'inline-block',
            marginBottom: '1.5rem',
            padding: '6px',
            borderRadius: 22,
            background: 'rgba(0, 0, 0, 0.8)',
            border: '1px solid rgba(254, 166, 4, 0.4)',
            boxShadow: '0 0 30px rgba(254, 166, 4, 0.25)',
          }}>
            <Image src="/logo-ardyn.png" alt="Ardyn" width={84} height={84} style={{ borderRadius: 16, objectFit: 'contain' }} priority />
          </div>

          <h1 style={{ marginBottom: '0.5rem', fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-main)' }}>
            ARDYN LABS
          </h1>

          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '0.5rem 1rem', borderRadius: '50px',
            background: 'var(--bg-tertiary)', border: '1px solid rgba(254, 166, 4, 0.25)',
          }}>
            <ShieldCheck size={16} style={{ color: 'var(--brand-gold)' }} />
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.03em' }}>
              ADMINISTRACIÓN CENTRALIZADA & ECOMMERCE
            </span>
          </div>
        </div>

        {/* Main Navigation Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', maxWidth: '1100px', margin: '0 auto', gap: '1.5rem' }}>

          {/* Module 1: Tienda Mayorista */}
          <Link href="/tienda">
            <div className="glass-card" style={{
              height: '100%', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2.5rem 1.75rem',
              background: 'linear-gradient(135deg, #0d0d10, #17171d)',
              color: 'white', border: '1px solid rgba(254, 166, 4, 0.25)',
            }}>
              <div style={{
                width: 56, height: 56, borderRadius: 14,
                background: 'rgba(254, 166, 4, 0.15)',
                border: '1px solid rgba(254, 166, 4, 0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '1rem',
                color: 'var(--brand-gold)',
              }}>
                <ShoppingCart size={28} />
              </div>
              <h2 style={{ fontSize: '1.35rem', marginBottom: '0.75rem', color: 'white' }}>Tienda Mayorista</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: '1.6', fontSize: '0.875rem' }}>
                Catálogo de productos con precios mayoristas y escalonados.
              </p>
              <button className="btn-brand" style={{ width: '100%', marginTop: 'auto' }}>
                VER MAYORISTA <ArrowRight size={16} />
              </button>
            </div>
          </Link>

          {/* Module 2: Tienda Minorista */}
          <Link href="/minorista">
            <div className="glass-card" style={{
              height: '100%', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2.5rem 1.75rem',
              background: 'linear-gradient(135deg, #0d0d10, #15151a)',
              color: 'white', border: '1px solid var(--border-color)',
            }}>
              <div style={{
                width: 56, height: 56, borderRadius: 14,
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '1rem',
                color: '#FFFFFF',
              }}>
                <ShoppingCart size={28} />
              </div>
              <h2 style={{ fontSize: '1.35rem', marginBottom: '0.75rem', color: 'white' }}>Tienda Minorista</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: '1.6', fontSize: '0.875rem' }}>
                Venta directa al público, promociones y combos especiales.
              </p>
              <button style={{ width: '100%', marginTop: 'auto', background: '#FFFFFF', color: '#000000', fontWeight: 700 }}>
                VER TIENDA OFICIAL <ArrowRight size={16} />
              </button>
            </div>
          </Link>

          {/* Module 3: Admin Panel */}
          <Link href="/admin">
            <div className="glass-card" style={{ height: '100%', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2.5rem 1.75rem' }}>
              <div className="glow-icon-container">
                <TrendingUp size={28} />
              </div>
              <h2 style={{ fontSize: '1.35rem', marginBottom: '0.75rem' }}>Panel Operativo</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: '1.6', fontSize: '0.875rem' }}>
                Gestión diaria de ventas, egresos, caja y clientes.
              </p>
              <button className="secondary" style={{ width: '100%', marginTop: 'auto' }}>
                INGRESAR AL PANEL
              </button>
            </div>
          </Link>

          {/* Module 4: BI Analytics */}
          <Link href="/admin/bi">
            <div className="glass-card" style={{ height: '100%', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2.5rem 1.75rem' }}>
              <div className="glow-icon-container" style={{ background: 'var(--accent-green-light)', color: 'var(--accent-green)' }}>
                <BarChart2 size={28} />
              </div>
              <h2 style={{ fontSize: '1.35rem', marginBottom: '0.75rem' }}>Business Intelligence</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: '1.6', fontSize: '0.875rem' }}>
                Análisis avanzado de datos, métricas y rendimiento financiero.
              </p>
              <button className="secondary" style={{ width: '100%', marginTop: 'auto' }}>
                VER ANALÍTICAS
              </button>
            </div>
          </Link>

        </div>

      </main>
    </div>
  );
}
