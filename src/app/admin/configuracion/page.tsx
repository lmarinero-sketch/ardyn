'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Paintbrush, ArrowRight } from 'lucide-react';

export default function ConfiguracionRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin/ecommerce/personalizacion');
  }, [router]);

  return (
    <div style={{ flex: 1, padding: '3rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <div className="glass-card" style={{ maxWidth: 500, width: '100%', padding: '2.5rem', textAlign: 'center' }}>
        <div style={{
          width: 56,
          height: 56,
          borderRadius: 16,
          background: 'rgba(254, 166, 4, 0.12)',
          color: 'var(--brand-gold)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem',
        }}>
          <Paintbrush size={28} />
        </div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', marginBottom: '0.75rem' }}>
          Configuración integrada
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
          La gestión de la marquesina y personalizaciones de la tienda se trasladó a la sección de <strong>Personalización</strong>. Redirigiendo...
        </p>
        <Link
          href="/admin/ecommerce/personalizacion"
          className="btn-primary"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.5rem',
            borderRadius: 12,
            textDecoration: 'none',
            fontSize: '0.875rem',
            fontWeight: 600,
          }}
        >
          Ir a Personalización <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
