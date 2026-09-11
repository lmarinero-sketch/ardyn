'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  HeartPulse,
  ShieldCheck,
  Award,
  CheckCircle2,
  FileText,
  Info,
  ShoppingCart,
  Plus,
  Search,
  MessageCircle,
  HelpCircle,
  Activity,
  X,
  Send,
  Star,
} from 'lucide-react';
import ModelSwitcher from '@/components/bocetos/ModelSwitcher';
import { useStoreConfig } from '@/hooks/useStoreConfig';

interface ClinicalProduct {
  id: string;
  name: string;
  category: string;
  scientificName: string;
  seal: string;
  price: number;
  image: string;
  dosage: string;
  servingSize: string;
  keyBenefits: string[];
  anmatCode: string;
  nutritionFacts: { component: string; perServing: string; dailyValue: string }[];
}

const CLINICAL_PRODUCTS: ClinicalProduct[] = [
  {
    id: 'c1',
    name: 'ARDYN Omega 3 Ultra Pure 1000mg',
    category: 'Salud Cardiovascular & Cerebral',
    scientificName: 'Concentrado de Ácidos Grasos EPA 400mg / DHA 300mg',
    seal: '100% Grado Farmacéutico',
    price: 18500,
    image: '/productos/omega3.png',
    dosage: '2 cápsulas blandas al día con las comidas principales',
    servingSize: '2 cápsulas (2000mg)',
    keyBenefits: [
      'Apoyo a la salud cardiovascular y reducción de triglicéridos',
      'Función cognitiva óptima y neuroprotección',
      'Destilado molecularmente libre de metales pesados',
    ],
    anmatCode: 'RNPA: 02-589312',
    nutritionFacts: [
      { component: 'Aceite de Pescado Salvaje', perServing: '2000 mg', dailyValue: '-' },
      { component: 'EPA (Ácido Eicosapentaenoico)', perServing: '800 mg', dailyValue: '-' },
      { component: 'DHA (Ácido Docosahexaenoico)', perServing: '600 mg', dailyValue: '-' },
      { component: 'Vitamina E Natural', perServing: '10 mg', dailyValue: '100%' },
    ],
  },
  {
    id: 'c2',
    name: 'ARDYN Multivitamínico Mineral Complex',
    category: 'Inmunidad & Vitalidad Celular',
    scientificName: 'Fórmula Balanceada con 24 Micronutrientes Quelatados',
    seal: 'Biodisponibilidad Máxima',
    price: 16900,
    image: '/productos/multivitaminico.png',
    dosage: '1 comprimido diario por la mañana con abundante agua',
    servingSize: '1 comprimido recubierto',
    keyBenefits: [
      'Refuerzo integral del sistema inmunitario',
      'Metabolismo energético normal sin estimulantes',
      'Minerales en forma de quelato para absorción sin malestar gástrico',
    ],
    anmatCode: 'RNPA: 02-612409',
    nutritionFacts: [
      { component: 'Vitamina C (Ácido Ascórbico)', perServing: '250 mg', dailyValue: '555%' },
      { component: 'Vitamina D3 (Colecalciferol)', perServing: '2000 UI', dailyValue: '500%' },
      { component: 'Zinc Quelatado (Bisglicinato)', perServing: '15 mg', dailyValue: '214%' },
      { component: 'Magnesio Citrato', perServing: '100 mg', dailyValue: '38%' },
    ],
  },
  {
    id: 'c3',
    name: 'ARDYN L-Glutamina Pura 100% 300g',
    category: 'Integridad Intestinal & Recuperación',
    scientificName: 'L-Glutamina Fermentada de Origen Vegetal (Kyowa Quality)',
    seal: 'Pureza Analítica 99.8%',
    price: 21900,
    image: '/productos/glutamina.png',
    dosage: '5g diarios disueltos en 200ml de agua o infusión tibia',
    servingSize: '1 scoop (5g)',
    keyBenefits: [
      'Reparación y mantenimiento de la barrera mucosa intestinal',
      'Recuperación muscular en periodos de alto estrés metabólico',
      'Micronizada para disolución instantánea sin saborizantes',
    ],
    anmatCode: 'RNPA: 02-710423',
    nutritionFacts: [
      { component: 'L-Glutamina Ultra-Pura', perServing: '5000 mg', dailyValue: '-' },
      { component: 'Azúcares Añadidos', perServing: '0 g', dailyValue: '0%' },
      { component: 'Sodio', perServing: '0 mg', dailyValue: '0%' },
    ],
  },
  {
    id: 'c4',
    name: 'ARDYN Proteína Vegetal Clean 1KG',
    category: 'Nutrición Basada en Plantas',
    scientificName: 'Aislado de Proteína de Arveja & Arroz Integral Orgánico',
    seal: 'Sin TACC // 100% Vegana',
    price: 29500,
    image: '/productos/proteina-vegana.png',
    dosage: '1 porción (30g) post-actividad o en desayunos',
    servingSize: '1 scoop colmado (30g)',
    keyBenefits: [
      'Perfil completo de aminoácidos con 24g de proteína neta',
      'Digestión ultraligera, libre de lactosa y alérgenos comunes',
      'Enriquecida con enzimas digestivas y Vitamina B12 activa',
    ],
    anmatCode: 'RNPA: 02-832104',
    nutritionFacts: [
      { component: 'Proteína Neta', perServing: '24 g', dailyValue: '48%' },
      { component: 'Carbohidratos Netos', perServing: '1.5 g', dailyValue: '1%' },
      { component: 'Vitamina B12 (Metilcobalamina)', perServing: '5 mcg', dailyValue: '208%' },
    ],
  },
];

export default function Modelo2Page() {
  const { config: identidad } = useStoreConfig('tienda_identidad');
  const { config: footer } = useStoreConfig('tienda_footer');
  const [selectedProduct, setSelectedProduct] = useState<ClinicalProduct | null>(null);
  const [cart, setCart] = useState<{ product: ClinicalProduct; qty: number }[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = CLINICAL_PRODUCTS.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.scientificName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addToCart = (product: ClinicalProduct) => {
    setCart((prev) => {
      const exists = prev.find((i) => i.product.id === product.id);
      if (exists) {
        return prev.map((i) => (i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, { product, qty: 1 }];
    });
    setIsCartOpen(true);
  };

  const totalItems = cart.reduce((s, i) => s + i.qty, 0);
  const totalPrice = cart.reduce((s, i) => s + i.product.price * i.qty, 0);

  return (
    <div style={{ minHeight: '100vh', background: '#FFFFFF', color: '#1E293B', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Top Universal Model Switcher */}
      <ModelSwitcher current="2" />

      {/* Clinical Certifications Bar */}
      <div
        style={{
          background: '#F0F9FF',
          borderBottom: '1px solid #E0F2FE',
          padding: '0.45rem 1rem',
          fontSize: '0.78rem',
          color: '#0369A1',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '2rem',
          flexWrap: 'wrap',
          fontWeight: 600,
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <ShieldCheck size={15} color="#0284C7" />
          Fórmulas Certificadas bajo Estándares de Laboratorio
        </span>
        <span style={{ opacity: 0.4 }}>|</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Award size={15} color="#0284C7" />
          Materias Primas de Grado Clínico & Trazabilidad Completa
        </span>
        <span style={{ opacity: 0.4 }}>|</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Activity size={15} color="#059669" />
          Asesoramiento Nutricional Directo
        </span>
      </div>

      {/* Medical Header */}
      <header
        style={{
          padding: '1.25rem 2rem',
          borderBottom: '1px solid #E2E8F0',
          background: '#FFFFFF',
          position: 'sticky',
          top: '49px',
          zIndex: 100,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
        }}
      >
        <div
          style={{
            maxWidth: '1360px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.5rem',
          }}
        >
          {/* Brand */}
          <Link href="/bocetos/modelo-2" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: '10px',
                background: '#000000',
                border: '1px solid rgba(254, 166, 4, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                padding: '4px',
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.1)',
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
              <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.01em' }}>
                {identidad.nombre_marca || 'ARDYN'} <span style={{ color: '#FEA604' }}>CLINICAL</span>
              </div>
              <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 700 }}>
                {identidad.subtitulo_minorista || 'Nutrición Celular & Medicina Preventiva'}
              </div>
            </div>
          </Link>

          {/* Search bar */}
          <div style={{ flex: 1, maxWidth: '500px', position: 'relative' }}>
            <input
              type="text"
              placeholder="Buscar por nutriente, patología o principio activo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                background: '#F8FAFC',
                border: '1px solid #CBD5E1',
                padding: '0.65rem 1rem 0.65rem 2.6rem',
                borderRadius: '10px',
                color: '#0F172A',
                fontSize: '0.875rem',
                outline: 'none',
              }}
            />
            <Search size={16} color="#64748B" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <a
              href="https://wa.me/5492646796509?text=Hola%20Ardyn%20Clinical,%20deseo%20hacer%20una%20consulta%20nutricional."
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: '#F1F5F9',
                border: '1px solid #CBD5E1',
                padding: '0.55rem 0.9rem',
                borderRadius: '8px',
                color: '#334155',
                fontSize: '0.8rem',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              <MessageCircle size={15} color="#0284C7" />
              <span>Consultar Especialista</span>
            </a>

            <button
              onClick={() => setIsCartOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: '#0284C7',
                border: 'none',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: '0.85rem',
                padding: '0.55rem 1.1rem',
                borderRadius: '8px',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(2, 132, 199, 0.25)',
              }}
            >
              <ShoppingCart size={17} />
              <span>Mi Pedido ({totalItems})</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Presentation */}
      <section
        style={{
          background: 'linear-gradient(180deg, #F0F9FF 0%, #FFFFFF 100%)',
          padding: '3.5rem 1.5rem 3rem',
          borderBottom: '1px solid #E2E8F0',
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
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
                background: '#E0F2FE',
                color: '#0369A1',
                fontSize: '0.75rem',
                fontWeight: 700,
                padding: '0.3rem 0.75rem',
                borderRadius: '999px',
                marginBottom: '1rem',
              }}
            >
              <ShieldCheck size={14} />
              <span>Desarrollado con Criterio Farmacéutico</span>
            </div>

            <h1
              style={{
                fontSize: 'clamp(2rem, 5vw, 3.25rem)',
                fontWeight: 900,
                color: '#0F172A',
                lineHeight: 1.15,
                marginBottom: '1.25rem',
              }}
            >
              Nutrición de Precisión para la <span style={{ color: '#FEA604' }}>Salud y Longevidad</span>
            </h1>

            <p style={{ fontSize: '1.05rem', color: '#475569', lineHeight: 1.6, marginBottom: '2rem', maxWidth: '560px' }}>
              Suplementos puros formulados para respaldar la función celular, desinflamación y rendimiento biológico. Fórmulas limpias, sin rellenos innecesarios ni azúcares ocultos.
            </p>

            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              {[
                { label: 'Aprobación Sanitaria', val: 'ANMAT Vigente' },
                { label: 'Pureza Garantizada', val: 'Control de Lote' },
                { label: 'Asesoría Clínica', val: 'Sin Costo Adicional' },
              ].map((pill, i) => (
                <div key={i} style={{ borderLeft: '3px solid #0284C7', paddingLeft: '0.75rem' }}>
                  <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{pill.label}</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0F172A' }}>{pill.val}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Image */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: '360px',
                aspectRatio: '1',
                borderRadius: '24px',
                background: '#FFFFFF',
                boxShadow: '0 20px 50px rgba(2, 132, 199, 0.12)',
                border: '1px solid #E2E8F0',
                padding: '2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Image src="/productos/omega3.png" alt="Clinical Nutrition" fill style={{ objectFit: 'contain' }} priority />
            </div>
          </div>
        </div>
      </section>

      {/* Clinical Products Section */}
      <section style={{ maxWidth: '1360px', margin: '0 auto', padding: '3rem 1.5rem 5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
          <div>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0284C7', letterSpacing: '0.05em' }}>
              CATÁLOGO TERAPÉUTICO
            </span>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0F172A' }}>
              Fórmulas y Principios Activos
            </h2>
          </div>

          <div style={{ fontSize: '0.85rem', color: '#64748B' }}>
            {filtered.length} principios disponibles
          </div>
        </div>

        {/* Clinical Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
          {filtered.map((item) => (
            <div
              key={item.id}
              style={{
                background: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s, box-shadow 0.2s, border-color 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.borderColor = '#0284C7';
                e.currentTarget.style.boxShadow = '0 16px 32px rgba(2, 132, 199, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = '#E2E8F0';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.04)';
              }}
            >
              {/* Product Header Badge */}
              <div
                style={{
                  padding: '0.75rem 1.25rem',
                  background: '#F8FAFC',
                  borderBottom: '1px solid #F1F5F9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.75rem',
                }}
              >
                <span style={{ color: '#D97706', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <ShieldCheck size={14} color="#FEA604" />
                  {item.seal}
                </span>
                <span style={{ color: '#94A3B8', fontFamily: 'var(--font-mono)' }}>{item.anmatCode}</span>
              </div>

              {/* Product Photo */}
              <div
                style={{
                  height: '210px',
                  position: 'relative',
                  padding: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#FFFFFF',
                }}
              >
                <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                  <Image src={item.image} alt={item.name} fill style={{ objectFit: 'contain' }} />
                </div>
              </div>

              {/* Body */}
              <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>{item.category}</div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', lineHeight: 1.3 }}>{item.name}</h3>
                <div style={{ fontSize: '0.8rem', color: '#0284C7', fontStyle: 'italic' }}>{item.scientificName}</div>

                {/* Key Benefits */}
                <div style={{ background: '#F8FAFC', padding: '0.75rem', borderRadius: '8px', marginTop: '0.5rem' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                    Acción Terapéutica:
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                    {item.keyBenefits.map((b, idx) => (
                      <li key={idx} style={{ fontSize: '0.78rem', color: '#475569', display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
                        <CheckCircle2 size={13} color="#059669" style={{ marginTop: '2px', flexShrink: 0 }} />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Posology Note */}
                <div style={{ fontSize: '0.78rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.25rem' }}>
                  <Info size={14} color="#0284C7" />
                  <span>Dosis sugerida: <strong>{item.dosage}</strong></span>
                </div>

                {/* Price & Action */}
                <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: '#64748B' }}>Precio Farmacéutico</div>
                    <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0F172A' }}>
                      ${item.price.toLocaleString('es-AR')}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => setSelectedProduct(item)}
                      style={{
                        background: '#F1F5F9',
                        border: '1px solid #CBD5E1',
                        color: '#334155',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        padding: '0.55rem 0.75rem',
                        borderRadius: '8px',
                        cursor: 'pointer',
                      }}
                      title="Ver Información Nutricional Completa"
                    >
                      Ver Tabla
                    </button>

                    <button
                      onClick={() => addToCart(item)}
                      style={{
                        background: 'linear-gradient(135deg, #FEA604 0%, #FD8209 100%)',
                        border: 'none',
                        color: '#000000',
                        fontWeight: 900,
                        fontSize: '0.85rem',
                        padding: '0.55rem 1rem',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        boxShadow: '0 3px 10px rgba(254, 166, 4, 0.3)',
                      }}
                    >
                      <Plus size={16} strokeWidth={3} />
                      <span>Adquirir</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Clinical Info Modal */}
      {selectedProduct && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(4px)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
          }}
          onClick={() => setSelectedProduct(null)}
        >
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              maxWidth: '560px',
              width: '100%',
              padding: '2rem',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              position: 'relative',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0284C7' }}>FICHA TÉCNICA CLÍNICA</span>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0F172A' }}>{selectedProduct.name}</h3>
                <div style={{ fontSize: '0.85rem', color: '#64748B' }}>Porción de referencia: {selectedProduct.servingSize}</div>
              </div>
              <button
                onClick={() => setSelectedProduct(null)}
                style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Nutrition Table */}
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '2px solid #E2E8F0', color: '#334155', textAlign: 'left' }}>
                  <th style={{ padding: '0.6rem' }}>Componente Activo</th>
                  <th style={{ padding: '0.6rem' }}>Por Porción</th>
                  <th style={{ padding: '0.6rem' }}>% VD*</th>
                </tr>
              </thead>
              <tbody>
                {selectedProduct.nutritionFacts.map((row, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '0.6rem', fontWeight: 600, color: '#1E293B' }}>{row.component}</td>
                    <td style={{ padding: '0.6rem', color: '#475569' }}>{row.perServing}</td>
                    <td style={{ padding: '0.6rem', color: '#0284C7', fontWeight: 700 }}>{row.dailyValue}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ background: '#F0F9FF', padding: '1rem', borderRadius: '10px', fontSize: '0.8rem', color: '#0369A1', marginBottom: '1.5rem' }}>
              <strong>Recomendación Profesional:</strong> Mantener en lugar fresco y seco, lejos del alcance de los niños. Suplemento dietario que no reemplaza una alimentación equilibrada.
            </div>

            <button
              onClick={() => {
                addToCart(selectedProduct);
                setSelectedProduct(null);
              }}
              style={{
                width: '100%',
                background: '#0284C7',
                color: '#FFFFFF',
                fontWeight: 800,
                border: 'none',
                padding: '0.85rem',
                borderRadius: '10px',
                cursor: 'pointer',
              }}
            >
              Agregar al Pedido (${selectedProduct.price.toLocaleString('es-AR')})
            </button>
          </div>
        </div>
      )}

      {/* Clinical Footer */}
      <footer
        style={{
          borderTop: '1px solid #E2E8F0',
          background: '#FFFFFF',
          padding: '3.5rem 2rem 2.5rem',
          color: '#64748B',
          fontSize: '0.85rem',
          marginTop: '5rem',
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
                background: '#0F172A',
                border: '1px solid rgba(254, 166, 4, 0.35)',
                boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
              }}
            />
            <div>
              <div style={{ color: '#0F172A', fontWeight: 800, fontSize: '1rem' }}>
                {identidad.nombre_marca || 'ARDYN'} · CLINICAL NUTRITION
              </div>
              <div style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '2px' }}>{footer.direccion}</div>
              <div style={{ fontSize: '0.75rem', color: '#0284C7', fontWeight: 600 }}>Trazabilidad Médica y Calidad QOAG</div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ color: '#0F172A', fontWeight: 700, fontSize: '0.85rem' }}>
              Atención Profesional: {footer.horarios}
            </div>
            <div style={{ color: '#94A3B8', fontSize: '0.75rem', marginTop: '4px' }}>
              {footer.texto_creditos || 'Hecho por Grow Labs'}
            </div>
          </div>
        </div>
      </footer>

      {/* Clinical Cart Drawer */}
      {isCartOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.4)',
            backdropFilter: 'blur(4px)',
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
              background: '#FFFFFF',
              padding: '1.75rem',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '-10px 0 40px rgba(0,0,0,0.1)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0284C7' }}>
                <ShoppingCart size={20} />
                <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A' }}>Resumen de Compra</h2>
              </div>
              <button onClick={() => setIsCartOpen(false)} style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem 0' }}>
              {cart.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#94A3B8' }}>
                  <HeartPulse size={40} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
                  <p>No has agregado fórmulas a tu pedido.</p>
                </div>
              ) : (
                cart.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '0.75rem', padding: '0.75rem', background: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                    <div style={{ width: 50, height: 50, position: 'relative', flexShrink: 0 }}>
                      <Image src={item.product.image} alt={item.product.name} fill style={{ objectFit: 'contain' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0F172A' }}>{item.product.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#0284C7' }}>x{item.qty} un.</div>
                      <div style={{ fontWeight: 800, marginTop: '0.25rem', fontSize: '0.9rem', color: '#0F172A' }}>
                        ${(item.product.price * item.qty).toLocaleString('es-AR')}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div style={{ paddingTop: '1rem', borderTop: '1px solid #E2E8F0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '1.15rem', fontWeight: 800 }}>
                  <span>Total a Pagar:</span>
                  <span style={{ color: '#0284C7' }}>${totalPrice.toLocaleString('es-AR')}</span>
                </div>

                <a
                  href={`https://wa.me/5492646796509?text=${encodeURIComponent(
                    `Hola Ardyn Clinical! Deseo realizar este pedido terapéutico (Boceto 2):\n${cart
                      .map((i) => `• ${i.qty}x ${i.product.name}`)
                      .join('\n')}\nTotal: $${totalPrice.toLocaleString('es-AR')}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    width: '100%',
                    background: '#0284C7',
                    color: '#FFFFFF',
                    fontWeight: 800,
                    padding: '0.9rem',
                    borderRadius: '10px',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    fontSize: '0.95rem',
                  }}
                >
                  <Send size={18} />
                  <span>Enviar Pedido a Farmacia / Depósito</span>
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
