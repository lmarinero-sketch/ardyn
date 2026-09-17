'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Store, Type, MessageCircle, MapPin, HelpCircle, Image as ImageIcon, Video, Save, RotateCcw, Check, Loader2, ChevronDown, Plus, Trash2, GripVertical, BookOpen, ChevronLeft, ChevronRight, X, Lightbulb, ExternalLink, Sparkles, Send, AlertTriangle, Palette, Pencil } from 'lucide-react';
import { STORE_DEFAULTS, StoreConfigKey } from '@/hooks/useStoreConfig';
import { formatYouTubeEmbed } from '@/lib/youtube';
import GrowyMascot from '@/components/GrowyMascot';

type TabKey = 'identidad' | 'colores' | 'hero_mayorista' | 'hero_minorista' | 'footer' | 'whatsapp' | 'faqs_mayorista' | 'faqs_minorista';

const TABS: { key: TabKey; label: string; icon: React.ReactNode; configKey: StoreConfigKey }[] = [
  { key: 'identidad', label: 'Identidad', icon: <Store size={16} />, configKey: 'tienda_identidad' },
  { key: 'colores', label: 'Colores & Estilo', icon: <Palette size={16} />, configKey: 'tienda_colores' },
  { key: 'hero_mayorista', label: 'Hero Mayorista', icon: <ImageIcon size={16} />, configKey: 'tienda_hero_mayorista' },
  { key: 'hero_minorista', label: 'Hero Minorista', icon: <ImageIcon size={16} />, configKey: 'tienda_hero_minorista' },
  { key: 'footer', label: 'Direcciones & Footer', icon: <MapPin size={16} />, configKey: 'tienda_footer' },
  { key: 'whatsapp', label: 'WhatsApp & Teléfonos', icon: <MessageCircle size={16} />, configKey: 'tienda_whatsapp' },
  { key: 'faqs_mayorista', label: 'FAQs Mayorista', icon: <HelpCircle size={16} />, configKey: 'tienda_faqs_mayorista' },
  { key: 'faqs_minorista', label: 'FAQs Minorista', icon: <HelpCircle size={16} />, configKey: 'tienda_faqs_minorista' },
];

// ═══════════════════════════════════════════════════════════
// TUTORIAL GUIADO — Definición de pasos
// ═══════════════════════════════════════════════════════════
interface TutorialStep {
  title: string;
  content: string;
  tip?: string;
  navigateTo?: TabKey;        // Auto-navega a esta tab al mostrar el paso
  highlightArea?: string;     // ID del área a resaltar
}

const TUTORIAL_STEPS: TutorialStep[] = [
  {
    title: '¡Bienvenido al Editor de Tienda! 🎨',
    content: 'Este editor te permite personalizar completamente la apariencia de tu tienda mayorista y minorista. Cada cambio que hagas acá se refleja en tiempo real en las tiendas públicas.',
    tip: 'Siempre podés volver a los valores originales con el botón "Predeterminado".',
  },
  {
    title: 'Navegación por secciones',
    content: 'A la izquierda tenés el menú con todas las secciones configurables. Hacé clic en cada una para editarla. En celular, tocá el selector desplegable arriba del formulario.',
    tip: 'Cada sección se guarda de forma independiente. Podés editar y guardar una sin afectar las demás.',
    highlightArea: 'tabs-sidebar',
  },
  {
    title: '🏪 Identidad de Marca',
    content: 'Acá definís lo fundamental: el nombre de tu marca que aparece en el header, el logo y los subtítulos que diferencian la tienda mayorista de la minorista. El "Nombre completo" se muestra en el footer.',
    tip: 'Para el logo, subí la imagen a tu hosting y pegá la URL acá. Recomendamos formato cuadrado (ej: 200x200px).',
    navigateTo: 'identidad',
    highlightArea: 'content-area',
  },
  {
    title: '🖼️ Hero Mayorista',
    content: 'El Hero es el banner principal que ven tus clientes al entrar a la tienda mayorista. Personalizá el título, la descripción y la imagen de fondo. También podés agregar o quitar el video de portada.',
    tip: 'Para el video, usá URLs de YouTube en formato embed: "https://www.youtube.com/embed/TU_VIDEO_ID?autoplay=1&mute=1&loop=1"',
    navigateTo: 'hero_mayorista',
    highlightArea: 'content-area',
  },
  {
    title: '🖼️ Hero Minorista',
    content: 'Igual que el anterior, pero para la tienda minorista. Podés usar textos y multimedia diferentes para cada tienda, lo que te permite comunicar mensajes distintos a cada público.',
    tip: 'Usá un tono más cercano y "retail" para minorista, y más profesional/B2B para mayorista.',
    navigateTo: 'hero_minorista',
  },
  {
    title: '📍 Footer (Pie de página)',
    content: 'Editá la información que aparece al final de ambas tiendas: dirección del local, teléfono, Instagram, y los créditos del desarrollador.',
    tip: 'Usá emojis como 📍 y 📱 antes de la dirección y teléfono para mejor legibilidad visual.',
    navigateTo: 'footer',
    highlightArea: 'content-area',
  },
  {
    title: '💬 WhatsApp',
    content: 'Configurá los números de WhatsApp para cada tienda. Los mensajes pre-cargados son los que se envían cuando un cliente toca el botón de WhatsApp o envía un pedido. También podés activar/desactivar el botón flotante verde.',
    tip: 'El formato del número debe ser: código de país + código de área + número, sin guiones ni espacios. Ej: 5492644193032',
    navigateTo: 'whatsapp',
    highlightArea: 'content-area',
  },
  {
    title: '❓ FAQs Mayorista',
    content: 'Las preguntas frecuentes aparecen en la página "¿Cómo comprar?" de la tienda mayorista. Podés agregar, editar o eliminar preguntas. Se muestran como acordeones expandibles.',
    tip: 'Incluí preguntas sobre medios de pago, envíos, montos mínimos y plazos de entrega. Son las dudas más comunes.',
    navigateTo: 'faqs_mayorista',
    highlightArea: 'content-area',
  },
  {
    title: '❓ FAQs Minorista',
    content: 'Igual que las FAQs mayoristas, pero para la tienda minorista. Podés tener preguntas completamente diferentes para cada público.',
    navigateTo: 'faqs_minorista',
  },
  {
    title: '💾 Guardar y Restaurar',
    content: 'Cuando terminás de editar una sección, hacé clic en <strong>"Guardar"</strong> (botón azul). Los cambios se aplican inmediatamente en la tienda. Si algo sale mal, usá <strong>"Predeterminado"</strong> para volver a los valores originales.',
    tip: '¡Importante! Cada sección se guarda por separado. Asegurate de guardar antes de cambiar de sección.',
    highlightArea: 'save-buttons',
  },
  {
    title: '🎉 ¡Todo listo!',
    content: 'Ya sabés cómo personalizar tu tienda completamente. Podés cambiar textos, imágenes, videos, números de WhatsApp y preguntas frecuentes sin tocar código. ¡Hacé tu tienda única!',
    tip: 'Podés volver a activar este tutorial en cualquier momento con el botón "Modo Tutorial".',
  },
];

// ═══════════════════════════════════════════════════════════
// COMPONENTE TUTORIAL OVERLAY
// ═══════════════════════════════════════════════════════════
function TutorialOverlay({ step, total, currentStep, onNext, onPrev, onClose }: {
  step: TutorialStep;
  total: number;
  currentStep: number;
  onNext: () => void;
  onPrev: () => void;
  onClose: () => void;
}) {
  const progress = ((currentStep + 1) / total) * 100;
  const isLast = currentStep === total - 1;
  const isFirst = currentStep === 0;

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Enter') onNext();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onNext, onPrev, onClose]);

  return (
    <>
      {/* Overlay backdrop */}
      <div style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
        zIndex: 9998, backdropFilter: 'blur(2px)',
      }} onClick={onClose} />

      {/* Tutorial card */}
      <div style={{
        position: 'fixed',
        bottom: '2rem',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'min(520px, calc(100vw - 2rem))',
        background: '#121216',
        borderRadius: 16,
        border: '1px solid #27272a',
        boxShadow: '0 20px 60px rgba(0,0,0,0.8), 0 0 20px rgba(254, 166, 4, 0.1)',
        zIndex: 9999,
        overflow: 'hidden',
        animation: 'tutorialSlideUp 0.3s ease-out',
      }}>
        {/* Progress bar */}
        <div style={{ height: 3, background: '#27272a' }}>
          <div style={{
            height: '100%', background: 'var(--brand-gradient)',
            width: `${progress}%`, transition: 'width 0.4s ease',
            borderRadius: '0 2px 2px 0',
          }} />
        </div>

        {/* Header */}
        <div style={{ padding: '1.25rem 1.25rem 0', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: 'var(--brand-gradient)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#000', fontSize: '0.75rem', fontWeight: 800,
            }}>
              {currentStep + 1}
            </div>
            <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Paso {currentStep + 1} de {total}
            </span>
          </div>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', cursor: 'pointer', padding: 4,
            color: 'var(--text-muted)', borderRadius: 6,
          }}>
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '0.75rem 1.25rem 1rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.5rem', color: '#FFFFFF' }}>
            {step.title}
          </h3>
          <p
            style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: step.tip ? '0.75rem' : 0 }}
            dangerouslySetInnerHTML={{ __html: step.content }}
          />

          {/* Tip */}
          {step.tip && (
            <div style={{
              display: 'flex', gap: '0.625rem', padding: '0.75rem',
              background: 'rgba(254, 166, 4, 0.1)', border: '1px solid rgba(254, 166, 4, 0.25)',
              borderRadius: 10, fontSize: '0.8125rem', color: '#fef08a', lineHeight: 1.5,
            }}>
              <Lightbulb size={16} style={{ flexShrink: 0, marginTop: 2, color: 'var(--brand-gold)' }} />
              <span>{step.tip}</span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div style={{
          padding: '0.75rem 1.25rem', borderTop: '1px solid #27272a',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#18181c',
        }}>
          <button
            onClick={onPrev}
            disabled={isFirst}
            style={{
              display: 'flex', alignItems: 'center', gap: 4,
              padding: '0.5rem 0.875rem', borderRadius: 8,
              background: '#27272a', border: '1px solid #3f3f46',
              color: isFirst ? '#52525b' : '#f4f4f5',
              cursor: isFirst ? 'not-allowed' : 'pointer',
              fontSize: '0.8125rem', fontWeight: 500,
              minHeight: 'auto', boxShadow: 'none', letterSpacing: 'normal', textTransform: 'none' as const,
            }}
          >
            <ChevronLeft size={14} /> Anterior
          </button>

          <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>← → o ESC</span>

          <button
            onClick={onNext}
            style={{
              display: 'flex', alignItems: 'center', gap: 4,
              padding: '0.5rem 0.875rem', borderRadius: 8,
              background: isLast ? '#10b981' : 'var(--brand-gradient)',
              border: 'none', color: isLast ? '#fff' : '#000',
              cursor: 'pointer', fontSize: '0.8125rem', fontWeight: 700,
              minHeight: 'auto', boxShadow: '0 2px 8px rgba(254,166,4,0.3)', letterSpacing: 'normal', textTransform: 'none' as const,
            }}
          >
            {isLast ? 'Completar ✓' : 'Siguiente'} <ChevronRight size={14} />
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes tutorialSlideUp {
          from { transform: translateX(-50%) translateY(20px); opacity: 0; }
          to { transform: translateX(-50%) translateY(0); opacity: 1; }
        }
      `}</style>
    </>
  );
}

// ═══════════════════════════════════════════════════════════
// ASESOR VIRTUAL — Chat con IA
// ═══════════════════════════════════════════════════════════
interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const QUICK_QUESTIONS = [
  '¿Cómo edito la tienda?',
  '¿Cómo cambio el video de YouTube?',
  '¿Cómo oculto las sucursales del footer?',
  '¿Cómo agrego un producto y fotos?',
  '¿Cómo cambio tu nombre?',
];

function AsesorChat({
  isOpen,
  onClose,
  asesorNombre = 'Growy',
  onUpdateAsesorNombre,
}: {
  isOpen: boolean;
  onClose: () => void;
  asesorNombre?: string;
  onUpdateAsesorNombre?: (nuevoNombre: string) => void;
}) {
  const currentName = asesorNombre || 'Growy';
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(currentName);

  useEffect(() => {
    setNameInput(asesorNombre || 'Growy');
  }, [asesorNombre]);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: `¡Qué hacés, campeón! 💪🏋️‍♂️ Soy ${currentName}, tu asesor fitness del Editor de Tienda.\n\nPreguntame lo que necesites sobre cómo personalizar tu ecommerce: cambiar logo, video de portada de YouTube, ocultar sucursales o contacto del footer, WhatsApp, FAQs y productos.`,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSaveName = () => {
    const trimmed = nameInput.trim() || 'Growy';
    setNameInput(trimmed);
    setEditingName(false);
    onUpdateAsesorNombre?.(trimmed);
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMsg: ChatMessage = { role: 'user', content: text.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ecommerce/asesor-tienda', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          nombreAsesor: nameInput || currentName,
        }),
      });

      const data = await res.json();

      if (data.reply) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
      } else {
        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            content: `¡A meterle fuerza fiera! 💪🏋️‍♂️ Acá ${currentName}. Decime qué sección del editor querés modificar (Identidad, Hero, Footer, WhatsApp o FAQs) y te explico el paso a paso.`,
          },
        ]);
      }
    } catch {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: `¡A meterle garra campeón! 💪🏋️‍♂️ Acá ${currentName}. Podés consultarme sobre cómo cambiar el video de portada, ocultar sucursales en el footer o editar los datos de tu tienda.`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9990, backdropFilter: 'blur(3px)' }}
        onClick={onClose}
      />

      {/* Chat Panel */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        right: 0,
        width: 'min(440px, 100vw)',
        height: 'min(620px, calc(100vh - 1.5rem))',
        background: '#ffffff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 0,
        boxShadow: '-10px 0 50px rgba(0,0,0,0.3)',
        zIndex: 9991,
        display: 'flex',
        flexDirection: 'column',
        animation: 'asesorSlideIn 0.3s ease-out',
        borderLeft: '1px solid #e5e7eb',
      }}>
        {/* Header */}
        <div style={{
          padding: '0.875rem 1.25rem',
          background: 'linear-gradient(135deg, #18181b 0%, #27272a 100%)',
          borderBottom: '2px solid #fea604',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTopLeftRadius: 20,
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: 44, height: 44, borderRadius: '50%',
              background: 'rgba(254, 166, 4, 0.15)',
              border: '2px solid #fea604',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 16px rgba(254, 166, 4, 0.35)',
              overflow: 'hidden',
            }}>
              <GrowyMascot size={38} animate={true} />
            </div>
            <div>
              {editingName ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <input
                    value={nameInput}
                    onChange={e => setNameInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') handleSaveName();
                    }}
                    autoFocus
                    placeholder="Nombre"
                    style={{
                      padding: '3px 8px',
                      fontSize: '0.875rem',
                      fontWeight: 700,
                      borderRadius: 6,
                      border: '1px solid #fea604',
                      background: '#09090b',
                      color: '#ffffff',
                      width: 120,
                    }}
                  />
                  <button
                    onClick={handleSaveName}
                    style={{
                      background: '#fea604',
                      color: '#000000',
                      border: 'none',
                      borderRadius: 6,
                      padding: '3px 8px',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      minHeight: 'auto',
                    }}
                  >
                    Guardar
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontWeight: 800, fontSize: '1.0625rem', color: '#FEA604', letterSpacing: '-0.01em' }}>
                    {currentName}
                  </span>
                  <button
                    onClick={() => setEditingName(true)}
                    title="Editar nombre del asesor"
                    style={{
                      background: 'rgba(255,255,255,0.1)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      borderRadius: 5,
                      padding: '2px 6px',
                      color: '#d4d4d8',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 3,
                      fontSize: '0.6875rem',
                      fontWeight: 600,
                      minHeight: 'auto',
                    }}
                  >
                    <Pencil size={10} />
                    <span>Renombrar</span>
                  </button>
                </div>
              )}
              <div style={{ fontSize: '0.6875rem', color: '#a1a1aa', marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                <span>🏋️‍♂️ Asesor Fitness de Tienda</span>
                <span>•</span>
                <span style={{ color: '#34d399', fontWeight: 600 }}>Siempre activo</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} style={{
            background: 'rgba(255,255,255,0.12)', border: 'none', cursor: 'pointer',
            width: 32, height: 32, borderRadius: 8, color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            minHeight: 'auto', padding: 0, boxShadow: 'none',
          }}>
            <X size={16} />
          </button>
        </div>

        {/* Messages */}
        <div style={{
          flex: 1, overflowY: 'auto', padding: '1rem',
          display: 'flex', flexDirection: 'column', gap: '0.875rem',
          background: '#f8fafc',
        }}>
          {messages.map((msg, i) => (
            <div key={i} style={{
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              alignItems: 'flex-start',
              gap: '0.5rem',
            }}>
              {msg.role === 'assistant' && (
                <div style={{
                  width: 30, height: 30, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #18181b, #27272a)',
                  border: '1.5px solid #fea604',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: '0 2px 8px rgba(254, 166, 4, 0.25)',
                  overflow: 'hidden',
                  marginTop: 2,
                }}>
                  <GrowyMascot size={24} animate={false} />
                </div>
              )}
              <div style={{
                maxWidth: '84%',
                padding: '0.75rem 1rem',
                borderRadius: msg.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                background: msg.role === 'user'
                  ? 'linear-gradient(135deg, #18181b, #27272a)'
                  : '#ffffff',
                border: msg.role === 'user' ? '1px solid #3f3f46' : '1px solid #e2e8f0',
                color: msg.role === 'user' ? '#ffffff' : '#1e293b',
                fontSize: '0.875rem',
                lineHeight: 1.55,
                whiteSpace: 'pre-wrap',
                boxShadow: msg.role === 'user'
                  ? '0 4px 14px rgba(0, 0, 0, 0.25)'
                  : '0 2px 8px rgba(0, 0, 0, 0.04)',
              }}>
                {msg.content}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {loading && (
            <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{
                width: 30, height: 30, borderRadius: '50%',
                background: 'linear-gradient(135deg, #18181b, #27272a)',
                border: '1.5px solid #fea604',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
                overflow: 'hidden',
              }}>
                <GrowyMascot size={24} animate={true} />
              </div>
              <div style={{
                padding: '0.75rem 1rem', borderRadius: '14px 14px 14px 4px',
                background: '#ffffff', border: '1px solid #e2e8f0', display: 'flex', gap: 5, alignItems: 'center',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
              }}>
                <span className="typing-dot" style={{ animationDelay: '0s' }} />
                <span className="typing-dot" style={{ animationDelay: '0.15s' }} />
                <span className="typing-dot" style={{ animationDelay: '0.3s' }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick questions (only when few messages) */}
        {messages.length <= 2 && !loading && (
          <div style={{
            padding: '0.5rem 1rem',
            display: 'flex', flexWrap: 'wrap', gap: '0.375rem',
            background: '#ffffff',
            borderTop: '1px solid #f1f5f9',
          }}>
            {QUICK_QUESTIONS.map((q, i) => (
              <button
                key={i}
                onClick={() => sendMessage(q)}
                style={{
                  padding: '0.375rem 0.75rem', borderRadius: 100,
                  background: '#f8fafc', border: '1px solid #e2e8f0',
                  fontSize: '0.75rem', color: '#475569', cursor: 'pointer',
                  fontWeight: 600, transition: 'all 0.15s',
                  minHeight: 'auto', boxShadow: 'none', letterSpacing: 'normal', textTransform: 'none' as const,
                }}
                onMouseEnter={e => {
                  (e.currentTarget).style.background = '#fffbeb';
                  (e.currentTarget).style.borderColor = '#f59e0b';
                  (e.currentTarget).style.color = '#b45309';
                }}
                onMouseLeave={e => {
                  (e.currentTarget).style.background = '#f8fafc';
                  (e.currentTarget).style.borderColor = '#e2e8f0';
                  (e.currentTarget).style.color = '#475569';
                }}
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div style={{
          padding: '0.75rem 1rem', borderTop: '1px solid #e2e8f0',
          display: 'flex', gap: '0.5rem', flexShrink: 0, background: '#ffffff',
        }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); } }}
            placeholder={`Preguntale a ${currentName}...`}
            disabled={loading}
            style={{
              flex: 1, padding: '0.625rem 0.875rem', borderRadius: 10,
              border: '1px solid #cbd5e1', fontSize: '0.875rem',
              outline: 'none', background: '#f8fafc', color: '#0f172a',
            }}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={loading || !input.trim()}
            style={{
              width: 42, height: 42, borderRadius: 10,
              background: loading || !input.trim() ? '#cbd5e1' : 'linear-gradient(135deg, #fea604, #d97706)',
              border: 'none', color: '#000', cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              minHeight: 'auto', padding: 0, boxShadow: '0 2px 8px rgba(254, 166, 4, 0.3)', flexShrink: 0,
            }}
          >
            <Send size={16} />
          </button>
        </div>

        <style jsx>{`
          @keyframes asesorSlideIn {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
          }
          .typing-dot {
            width: 7px; height: 7px; border-radius: 50%;
            background: #fea604; display: inline-block;
            animation: typingBounce 1s infinite;
          }
          @keyframes typingBounce {
            0%, 60%, 100% { transform: translateY(0); }
            30% { transform: translateY(-4px); }
          }
        `}</style>
      </div>
    </>
  );
}

function ColorPickerField({ label, value, onChange, description, presets }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  description?: string;
  presets?: string[];
}) {
  return (
    <div style={{ marginBottom: '1.25rem' }}>
      <label style={{ display: 'block', marginBottom: 4, fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
        {label}
      </label>
      {description && (
        <p style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginBottom: 8, lineHeight: 1.4 }}>{description}</p>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{
          position: 'relative',
          width: 44,
          height: 40,
          borderRadius: 8,
          border: '1px solid var(--border-color)',
          overflow: 'hidden',
          background: value || '#000000',
          boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
          cursor: 'pointer',
          flexShrink: 0
        }}>
          <input
            type="color"
            value={value && value.startsWith('#') && value.length === 7 ? value : '#FEA604'}
            onChange={e => onChange(e.target.value)}
            style={{
              position: 'absolute',
              inset: -8,
              width: 60,
              height: 60,
              opacity: 0,
              cursor: 'pointer'
            }}
          />
        </div>
        <input
          type="text"
          value={value || ''}
          onChange={e => onChange(e.target.value)}
          placeholder="#FEA604"
          style={{ flex: 1, fontFamily: 'var(--font-mono)', fontSize: '0.9rem' }}
        />
      </div>
      {presets && presets.length > 0 && (
        <div style={{ display: 'flex', gap: '0.375rem', marginTop: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Sugerencias:</span>
          {presets.map(c => (
            <button
              key={c}
              type="button"
              onClick={() => onChange(c)}
              style={{
                width: 22,
                height: 22,
                borderRadius: '50%',
                background: c,
                border: value === c ? '2px solid #FFFFFF' : '1px solid rgba(255,255,255,0.2)',
                cursor: 'pointer',
                padding: 0,
                minHeight: 'auto',
                boxShadow: value === c ? '0 0 8px ' + c : 'none'
              }}
              title={c}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function TextField({ label, value, onChange, placeholder, multiline, hint }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; multiline?: boolean; hint?: string;
}) {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <label style={{ display: 'block', marginBottom: 4, fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</label>
      {hint && <p style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginBottom: 6 }}>{hint}</p>}
      {multiline ? (
        <textarea rows={3} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
      ) : (
        <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
      )}
    </div>
  );
}

function ImageField({ label, value, onChange, hint, onError }: {
  label: string; value: string; onChange: (v: string) => void; hint?: string; onError?: (msg: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('files', file);
      const res = await fetch('/api/ecommerce/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.urls?.[0]) onChange(data.urls[0]);
      else if (onError) onError('Error al subir la imagen'); else alert('Error al subir la imagen');
    } catch { if (onError) onError('Error de conexión'); else alert('Error de conexión'); }
    finally { setUploading(false); }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleUpload(file);
  };

  return (
    <div style={{ marginBottom: '1.25rem' }}>
      <label style={{ display: 'block', marginBottom: 6, fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</label>
      {hint && <p style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginBottom: 8 }}>{hint}</p>}

      {/* Preview + Upload zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        style={{
          border: `2px dashed ${dragOver ? 'var(--accent-blue)' : 'var(--border-color)'}`,
          borderRadius: 12, padding: '1.25rem', cursor: 'pointer',
          background: dragOver ? 'var(--accent-blue-light)' : 'var(--bg-secondary)',
          transition: 'all 0.2s', textAlign: 'center',
        }}
      >
        {value ? (
          <div>
            <img
              src={value} alt="Preview"
              style={{ maxWidth: '100%', maxHeight: 180, borderRadius: 8, objectFit: 'contain', margin: '0 auto', display: 'block' }}
              onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>
              Hacé clic o arrastrá una imagen para reemplazar
            </p>
          </div>
        ) : (
          <div>
            <ImageIcon size={32} style={{ color: 'var(--text-light)', margin: '0 auto 0.5rem' }} />
            <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              {uploading ? 'Subiendo...' : 'Arrastrá una imagen acá o hacé clic'}
            </p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: 4 }}>
              PNG, JPG o WebP · Se convierte automáticamente a WebP
            </p>
          </div>
        )}
        <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) handleUpload(f); }} />
      </div>

      {/* Manual URL fallback */}
      <div style={{ marginTop: 8 }}>
        <details>
          <summary style={{ fontSize: '0.75rem', color: 'var(--text-light)', cursor: 'pointer' }}>O ingresá una URL manualmente</summary>
          <input value={value} onChange={e => onChange(e.target.value)} placeholder="/bg-hero.webp" style={{ marginTop: 6 }} />
        </details>
      </div>
    </div>
  );
}

function VideoField({ label, value, onChange }: {
  label: string; value: string; onChange: (v: string) => void;
}) {
  const handleInputChange = (rawUrl: string) => {
    // Si pega un link de YouTube común, lo convertimos automáticamente al formato embed para que funcione
    const formatted = formatYouTubeEmbed(rawUrl);
    onChange(formatted || rawUrl);
  };

  const previewUrl = formatYouTubeEmbed(value) || value;
  const isEmbeddable = previewUrl && previewUrl.includes('youtube.com/embed');

  return (
    <div style={{ marginBottom: '1.25rem' }}>
      <label style={{ display: 'block', marginBottom: 6, fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</label>

      <div style={{ background: 'rgba(254, 166, 4, 0.08)', border: '1px solid rgba(254, 166, 4, 0.25)', borderRadius: 10, padding: '0.75rem 1rem', marginBottom: 10 }}>
        <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--brand-gold)', marginBottom: 2 }}>🎬 Pegá cualquier link de YouTube</p>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>
          Podés pegar el link normal del navegador (ej: <code>https://www.youtube.com/watch?v=...</code> o <code>https://youtu.be/...</code>). Se adapta automáticamente para reproducirse de portada.
        </p>
      </div>

      <input 
        value={value} 
        onChange={e => handleInputChange(e.target.value)} 
        placeholder="https://www.youtube.com/watch?v=tu-video" 
      />

      {/* Live preview */}
      {isEmbeddable ? (
        <div style={{ marginTop: 10 }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent-green)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
            ✓ Vista previa del video (YouTube conectado)
          </div>
          <div style={{ borderRadius: 10, overflow: 'hidden', border: '1px solid var(--border-color)', aspectRatio: '16/9', maxHeight: 240, background: '#000' }}>
            <iframe 
              src={previewUrl} 
              style={{ width: '100%', height: '100%', border: 'none' }} 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen 
              title="Preview del video de portada" 
            />
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 6, fontStyle: 'italic' }}>
            💡 Recordá hacer clic en el botón azul <strong>"Guardar"</strong> arriba a la derecha para que el video se guarde en la tienda.
          </p>
        </div>
      ) : value ? (
        <div style={{ marginTop: 6, fontSize: '0.75rem', color: 'var(--brand-gold)' }}>
          ⚠️ Verificá que sea un enlace válido de YouTube.
        </div>
      ) : null}
    </div>
  );
}

function ToggleField({ label, value, onChange, description }: {
  label: string; value: boolean; onChange: (v: boolean) => void; description?: string;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--border-light)' }}>
      <div>
        <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{label}</div>
        {description && <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>{description}</div>}
      </div>
      <button
        onClick={() => onChange(!value)}
        style={{
          width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer',
          background: value ? '#10b981' : '#d1d5db', position: 'relative', transition: 'background 0.2s',
        }}
      >
        <div style={{
          width: 18, height: 18, borderRadius: '50%', background: '#fff', position: 'absolute',
          top: 3, left: value ? 23 : 3, transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        }} />
      </button>
    </div>
  );
}

export default function PersonalizacionPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('identidad');
  const [configs, setConfigs] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [mobileTabOpen, setMobileTabOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // ═══ Asesor virtual state ═══
  const [asesorOpen, setAsesorOpen] = useState(false);

  // ═══ Tutorial state ═══
  const [tutorialActive, setTutorialActive] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);

  const startTutorial = useCallback(() => {
    setTutorialActive(true);
    setTutorialStep(0);
  }, []);

  const closeTutorial = useCallback(() => {
    setTutorialActive(false);
    setTutorialStep(0);
  }, []);

  const nextTutorialStep = useCallback(() => {
    if (tutorialStep < TUTORIAL_STEPS.length - 1) {
      setTutorialStep(prev => prev + 1);
    } else {
      closeTutorial();
    }
  }, [tutorialStep, closeTutorial]);

  const prevTutorialStep = useCallback(() => {
    if (tutorialStep > 0) setTutorialStep(prev => prev - 1);
  }, [tutorialStep]);

  // Auto-navigate to the tab when tutorial step changes
  useEffect(() => {
    if (tutorialActive && TUTORIAL_STEPS[tutorialStep]?.navigateTo) {
      setActiveTab(TUTORIAL_STEPS[tutorialStep].navigateTo!);
    }
  }, [tutorialActive, tutorialStep]);

  // Fetch all configs on mount
  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      const result: Record<string, any> = {};
      for (const tab of TABS) {
        try {
          const res = await fetch(`/api/ecommerce/configuraciones?clave=${tab.configKey}`);
          const data = await res.json();
          result[tab.configKey] = data?.valor ? { ...STORE_DEFAULTS[tab.configKey], ...data.valor } : { ...STORE_DEFAULTS[tab.configKey] };
        } catch {
          result[tab.configKey] = { ...STORE_DEFAULTS[tab.configKey] };
        }
      }
      setConfigs(result);
      setLoading(false);
    };
    fetchAll();
  }, []);

  const currentTab = TABS.find(t => t.key === activeTab)!;
  const currentConfig = configs[currentTab.configKey] || {};

  const updateField = (field: string, value: any) => {
    setConfigs(prev => ({
      ...prev,
      [currentTab.configKey]: { ...prev[currentTab.configKey], [field]: value },
    }));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/ecommerce/configuraciones', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clave: currentTab.configKey, valor: configs[currentTab.configKey] }),
      });
      if (!res.ok) throw new Error('Error al guardar');
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setErrorMessage('Error al guardar la configuración');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (!confirm('¿Restaurar los valores predeterminados para esta sección?')) return;
    setConfigs(prev => ({ ...prev, [currentTab.configKey]: { ...STORE_DEFAULTS[currentTab.configKey] } }));
    setSaved(false);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: 8 }}>
        <Loader2 size={24} style={{ color: 'var(--text-light)', animation: 'spin 1s linear infinite' }} />
        <span style={{ color: 'var(--text-muted)' }}>Cargando configuraciones...</span>
      </div>
    );
  }


  const renderIdentidad = () => (
    <>
      <TextField label="Nombre de marca" value={currentConfig.nombre_marca || ''} onChange={v => updateField('nombre_marca', v)} placeholder="ARDYN" />
      <TextField label="Nombre completo (footer)" value={currentConfig.nombre_completo || ''} onChange={v => updateField('nombre_completo', v)} placeholder="ARDYN SUPLEMENTOS" />
      <TextField label="Subtítulo Mayorista" value={currentConfig.subtitulo_mayorista || ''} onChange={v => updateField('subtitulo_mayorista', v)} placeholder="Mayorista" />
      <TextField label="Subtítulo Minorista" value={currentConfig.subtitulo_minorista || ''} onChange={v => updateField('subtitulo_minorista', v)} placeholder="Tienda Oficial" />
      <TextField 
        label="Nombre del Asesor Virtual (IA)" 
        value={currentConfig.nombre_asesor || 'Growy'} 
        onChange={v => updateField('nombre_asesor', v)} 
        placeholder="Growy" 
        hint="Personalizá el nombre de tu asistente virtual fitness (ej: Growy). Podés consultarle dudas técnicas en cualquier momento." 
      />
      <ImageField label="Logo de la tienda" value={currentConfig.logo_url || ''} onChange={v => updateField('logo_url', v)} hint="Recomendado: formato cuadrado (200×200px)" onError={setErrorMessage} />
    </>
  );

  const renderHero = (key: 'tienda_hero_mayorista' | 'tienda_hero_minorista') => {
    const c = configs[key] || {};
    const update = (f: string, v: any) => {
      setConfigs(prev => ({ ...prev, [key]: { ...prev[key], [f]: v } }));
      setSaved(false);
    };
    return (
      <>
        <TextField label="Título del Hero" value={c.titulo || ''} onChange={v => update('titulo', v)} placeholder="Catálogo Mayorista 🛒" />
        <TextField label="Descripción" value={c.descripcion || ''} onChange={v => update('descripcion', v)} placeholder="Armá tu pedido..." multiline />
        <TextField label="Subtexto" value={c.subtexto || ''} onChange={v => update('subtexto', v)} placeholder="📦 Solo se muestran..." />
        <ImageField label="Imagen de fondo" value={c.imagen_fondo_url || ''} onChange={v => update('imagen_fondo_url', v)} hint="Se usa como fondo del banner principal. Recomendado: 1920×800px" onError={setErrorMessage} />
        <VideoField label="Video de portada (YouTube)" value={c.video_url || ''} onChange={v => update('video_url', v)} />
        <ToggleField label="Video activo" value={c.video_activo ?? true} onChange={v => update('video_activo', v)} description="Mostrar/ocultar el video de portada" />
      </>
    );
  };

  const renderColores = () => (
    <>
      <div style={{ background: 'rgba(254, 166, 4, 0.08)', border: '1px solid rgba(254, 166, 4, 0.25)', borderRadius: 12, padding: '1rem', marginBottom: '1.25rem' }}>
        <p style={{ fontSize: '0.875rem', color: 'var(--brand-gold)', fontWeight: 600, margin: 0 }}>
          🎨 Personalizá la paleta de colores de toda la tienda en tiempo real. Los cambios se aplicarán automáticamente a botones, acentos, encabezados y destacados.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
        <ColorPickerField
          label="Color Primario (Acentos & Botones)"
          value={currentConfig.color_primario || '#FEA604'}
          onChange={v => updateField('color_primario', v)}
          description="Color de botones principales, pestañas activas e indicadores."
          presets={['#FEA604', '#FD8209', '#00FF88', '#3b82f6', '#ec4899', '#8b5cf6', '#ef4444']}
        />

        <ColorPickerField
          label="Color Secundario (Gradientes)"
          value={currentConfig.color_secundario || '#FD8209'}
          onChange={v => updateField('color_secundario', v)}
          description="Segundo tono para degradés en botones de compra y banners."
          presets={['#FD8209', '#FEA604', '#f97316', '#06b6d4', '#f43f5e', '#a855f7']}
        />

        <ColorPickerField
          label="Color de Éxito / Precios"
          value={currentConfig.color_acento || '#00FF88'}
          onChange={v => updateField('color_acento', v)}
          description="Etiquetas de ahorro, badges de stock y precios de oferta."
          presets={['#00FF88', '#10b981', '#22c55e', '#4ade80', '#14b8a6']}
        />

        <ColorPickerField
          label="Color de Fondo Tienda"
          value={currentConfig.color_fondo || '#000000'}
          onChange={v => updateField('color_fondo', v)}
          description="Fondo general de navegación de la tienda."
          presets={['#000000', '#0a0a0c', '#0f172a', '#18181b', '#111827']}
        />

        <ColorPickerField
          label="Color de Tarjetas"
          value={currentConfig.color_tarjeta || '#0d0d0f'}
          onChange={v => updateField('color_tarjeta', v)}
          description="Superficie de las tarjetas de producto y paneles."
          presets={['#0d0d0f', '#121216', '#1e293b', '#1f1f23', '#111827']}
        />

        <ColorPickerField
          label="Color Texto Principal"
          value={currentConfig.color_texto || '#FFFFFF'}
          onChange={v => updateField('color_texto', v)}
          description="Títulos principales y nombres de productos."
          presets={['#FFFFFF', '#F4F4F5', '#FAFAFA', '#E2E8F0']}
        />
      </div>

      {/* Vista previa en vivo del botón */}
      <div style={{
        marginTop: '1.5rem',
        padding: '1.25rem',
        borderRadius: 12,
        background: currentConfig.color_tarjeta || '#0d0d0f',
        border: '1px solid var(--border-color)',
        textAlign: 'center'
      }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.75rem' }}>
          VISTA PREVIA DEL BOTÓN PRINCIPAL
        </span>
        <button
          type="button"
          style={{
            background: `linear-gradient(135deg, ${currentConfig.color_primario || '#FEA604'} 0%, ${currentConfig.color_secundario || '#FD8209'} 100%)`,
            color: '#000000',
            fontWeight: 800,
            padding: '0.75rem 2rem',
            borderRadius: 10,
            border: 'none',
            fontSize: '0.95rem',
            boxShadow: `0 4px 16px ${(currentConfig.color_primario || '#FEA604')}44`,
            cursor: 'default',
          }}
        >
          Agregar al Carrito 🛒
        </button>
      </div>
    </>
  );

  const renderFooter = () => (
    <>
      <div style={{ background: 'rgba(59, 130, 246, 0.08)', border: '1px solid rgba(59, 130, 246, 0.25)', borderRadius: 12, padding: '1rem', marginBottom: '1.25rem' }}>
        <p style={{ fontSize: '0.875rem', color: '#60a5fa', fontWeight: 600, margin: 0 }}>
          📍 Configuración completa de direcciones de locales, horarios y datos de contacto públicos que se muestran en el pie de página de ambas tiendas.
        </p>
      </div>

      <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.75rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.35rem' }}>
        📍 Direcciones de Sucursales
      </div>
      <ToggleField 
        label="Mostrar sección de Sucursales en el pie de página" 
        value={currentConfig.mostrar_sucursales ?? false} 
        onChange={v => updateField('mostrar_sucursales', v)} 
        description="Si está desactivado, no se mostrarán las direcciones ni horarios en la tienda." 
      />
      <TextField label="Dirección Principal (Sede Rivadavia)" value={currentConfig.direccion || ''} onChange={v => updateField('direccion', v)} placeholder="📍 Av. Libertador 4858 Oeste, Rivadavia, San Juan" />
      <TextField label="Dirección Secundaria (Sede Rawson)" value={currentConfig.direccion_secundaria || ''} onChange={v => updateField('direccion_secundaria', v)} placeholder="📍 Sede Rawson: Mendoza Sur 582, Rawson, San Juan" />
      <TextField label="Horarios de Atención" value={currentConfig.horarios || ''} onChange={v => updateField('horarios', v)} placeholder="🕒 Lun a Sáb: 9:00 - 13:00 y 17:30 - 21:30 hs" />

      <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#FFFFFF', margin: '1.25rem 0 0.75rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.35rem' }}>
        📞 Teléfonos y Contacto
      </div>
      <ToggleField 
        label="Mostrar sección de Contacto y Redes en el pie de página" 
        value={currentConfig.mostrar_contacto ?? false} 
        onChange={v => updateField('mostrar_contacto', v)} 
        description="Si está desactivado, no se mostrarán los teléfonos, emails ni redes en el pie de página." 
      />
      <TextField label="Teléfono Celular / Llamadas" value={currentConfig.telefono || ''} onChange={v => updateField('telefono', v)} placeholder="📱 +54 9 264 679-6509" />
      <TextField label="Teléfono Fijo (Opcional)" value={currentConfig.telefono_fijo || ''} onChange={v => updateField('telefono_fijo', v)} placeholder="☎️ (0264) 424-1234" />
      <TextField label="Email de Contacto" value={currentConfig.email_contacto || ''} onChange={v => updateField('email_contacto', v)} placeholder="contacto@ardyn.com.ar" />

      <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#FFFFFF', margin: '1.25rem 0 0.75rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.35rem' }}>
        🌐 Redes Sociales
      </div>
      <TextField label="Instagram" value={currentConfig.instagram || ''} onChange={v => updateField('instagram', v)} placeholder="@ardyn_suplementos" />
      <TextField label="Facebook" value={currentConfig.facebook || ''} onChange={v => updateField('facebook', v)} placeholder="Ardyn Suplementos" />
      <TextField label="TikTok" value={currentConfig.tiktok || ''} onChange={v => updateField('tiktok', v)} placeholder="@ardyn_suplementos" />

      <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#FFFFFF', margin: '1.25rem 0 0.75rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.35rem' }}>
        ✨ Créditos & Marca del Creador
      </div>
      <TextField label="Texto de Créditos" value={currentConfig.texto_creditos || ''} onChange={v => updateField('texto_creditos', v)} placeholder="Hecho por Grow Labs" />
      <TextField label="URL de Créditos" value={currentConfig.url_creditos || ''} onChange={v => updateField('url_creditos', v)} placeholder="https://www.growlabs.lat" />
    </>
  );

  const renderWhatsapp = () => (
    <>
      <div style={{ background: 'var(--accent-green-light)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 12, padding: '1rem', marginBottom: '1rem' }}>
        <p style={{ fontSize: '0.875rem', color: 'var(--accent-green)', fontWeight: 600 }}>💬 Estos números y mensajes se usan en toda la tienda: header, botón flotante, checkout y como-comprar.</p>
      </div>
      <TextField label="Número WhatsApp Mayorista" value={currentConfig.numero_mayorista || ''} onChange={v => updateField('numero_mayorista', v)} placeholder="5492646796509" />
      <TextField label="Número WhatsApp Minorista" value={currentConfig.numero_minorista || ''} onChange={v => updateField('numero_minorista', v)} placeholder="5492646796509" />
      <TextField label="Número WhatsApp Consultas Generales" value={currentConfig.numero_consultas || ''} onChange={v => updateField('numero_consultas', v)} placeholder="5492646796509" />
      <TextField label="Mensaje pre-cargado Mayorista" value={currentConfig.mensaje_mayorista || ''} onChange={v => updateField('mensaje_mayorista', v)} multiline />
      <TextField label="Mensaje pre-cargado Minorista" value={currentConfig.mensaje_minorista || ''} onChange={v => updateField('mensaje_minorista', v)} multiline />
      <TextField label="Mensaje de consulta general" value={currentConfig.mensaje_consulta || ''} onChange={v => updateField('mensaje_consulta', v)} multiline />
      <ToggleField label="Botón flotante activo" value={currentConfig.boton_flotante_activo ?? true} onChange={v => updateField('boton_flotante_activo', v)} description="Mostrar el botón verde de WhatsApp en la tienda" />
      <TextField label="URL Google Maps (Sucursal Rivadavia)" value={currentConfig.url_sucursal || ''} onChange={v => updateField('url_sucursal', v)} placeholder="https://www.google.com/maps/..." multiline />
      <TextField label="URL Google Maps (Sucursal Rawson)" value={currentConfig.url_sucursal_rawson || ''} onChange={v => updateField('url_sucursal_rawson', v)} placeholder="https://www.google.com/maps/..." multiline />
    </>
  );

  const renderFaqs = (key: 'tienda_faqs_mayorista' | 'tienda_faqs_minorista') => {
    const c = configs[key] || { preguntas: [] };
    const preguntas = c.preguntas || [];
    const update = (newPreguntas: any[]) => {
      setConfigs(prev => ({ ...prev, [key]: { ...prev[key], preguntas: newPreguntas } }));
      setSaved(false);
    };
    return (
      <>
        <div style={{ background: 'var(--accent-blue-light)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 12, padding: '1rem', marginBottom: '1rem' }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--accent-blue)', fontWeight: 600 }}>❓ Estas preguntas se muestran en la página "¿Cómo comprar?"</p>
        </div>
        {preguntas.map((faq: any, i: number) => (
          <div key={i} style={{ background: 'var(--bg-secondary)', borderRadius: 12, padding: '1rem', marginBottom: '0.75rem', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>PREGUNTA {i + 1}</span>
              <button onClick={() => { const n = [...preguntas]; n.splice(i, 1); update(n); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent-red)', padding: 4, minHeight: 'auto', boxShadow: 'none' }}>
                <Trash2 size={14} />
              </button>
            </div>
            <TextField label="Pregunta" value={faq.pregunta} onChange={v => { const n = [...preguntas]; n[i] = { ...n[i], pregunta: v }; update(n); }} />
            <TextField label="Respuesta" value={faq.respuesta} onChange={v => { const n = [...preguntas]; n[i] = { ...n[i], respuesta: v }; update(n); }} multiline />
          </div>
        ))}
        <button
          onClick={() => update([...preguntas, { pregunta: '', respuesta: '' }])}
          style={{
            width: '100%', padding: '0.75rem', background: '#fff', border: '2px dashed #d1d5db',
            borderRadius: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 8, fontSize: '0.875rem', fontWeight: 600, color: '#6b7280',
          }}
        >
          <Plus size={16} /> Agregar pregunta
        </button>
      </>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'identidad': return renderIdentidad();
      case 'colores': return renderColores();
      case 'hero_mayorista': return renderHero('tienda_hero_mayorista');
      case 'hero_minorista': return renderHero('tienda_hero_minorista');
      case 'footer': return renderFooter();
      case 'whatsapp': return renderWhatsapp();
      case 'faqs_mayorista': return renderFaqs('tienda_faqs_mayorista');
      case 'faqs_minorista': return renderFaqs('tienda_faqs_minorista');
    }
  };

  return (
    <div className="page-container" style={{ maxWidth: 1100 }}>
      {/* Header */}
      <header style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ marginBottom: '0.25rem', fontSize: '1.75rem' }}>
              Editor de Tienda
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem' }}>
              Personalizá la apariencia de tu ecommerce mayorista y minorista
            </p>
          </div>
          <button
            onClick={startTutorial}
            className="secondary"
            style={{ fontSize: '0.8125rem' }}
          >
            <BookOpen size={16} /> Modo Tutorial
          </button>
        </div>
      </header>

      {/* Tab pills */}
      <div className="nav-pill-container" style={{ marginBottom: '1.5rem' }}>
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => { setActiveTab(tab.key); setMobileTabOpen(false); }}
            className={`nav-pill-button ${activeTab === tab.key ? 'active' : ''}`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Content card */}
      <div className="glass-card" style={{ padding: 0 }}>
        {/* Card header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-light)',
          flexWrap: 'wrap', gap: '0.5rem',
        }}>
          <h3 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {currentTab.icon} {currentTab.label}
          </h3>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={handleReset} className="btn-ghost" style={{ fontSize: '0.8125rem', padding: '0.5rem 0.75rem' }}>
              <RotateCcw size={14} /> Predeterminado
            </button>
            <button onClick={handleSave} disabled={saving} className="btn-blue" style={{ fontSize: '0.8125rem', padding: '0.5rem 1rem' }}>
              {saving ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : saved ? <Check size={14} /> : <Save size={14} />}
              {saving ? 'Guardando...' : saved ? '¡Guardado!' : 'Guardar'}
            </button>
          </div>
        </div>

        {/* Card body */}
        <div style={{ padding: '1.5rem' }}>
          {renderContent()}
        </div>
      </div>

      <style jsx>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>

      {/* ═══ Floating Buttons (Tutorial + Asesor) ═══ */}
      {!tutorialActive && (
        <div style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', zIndex: 40, alignItems: 'flex-end' }}>
          {/* Asesor button (Mascota fitness levantando pesas) */}
          <button
            onClick={() => setAsesorOpen(true)}
            aria-label={`Abrir asesor virtual ${configs.tienda_identidad?.nombre_asesor || 'Growy'}`}
            style={{
              height: 52,
              padding: '0 1.125rem 0 0.5rem',
              borderRadius: 26,
              background: 'linear-gradient(135deg, #18181b, #27272a)',
              border: '2px solid #fea604',
              color: '#fff',
              display: 'flex', alignItems: 'center', gap: '0.625rem',
              cursor: 'pointer',
              boxShadow: '0 6px 25px rgba(254, 166, 4, 0.4)',
              transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
              minHeight: 'auto', letterSpacing: 'normal', textTransform: 'none' as const,
            }}
            onMouseEnter={e => {
              (e.currentTarget).style.transform = 'scale(1.06) translateY(-2px)';
              (e.currentTarget).style.boxShadow = '0 10px 32px rgba(254, 166, 4, 0.6)';
            }}
            onMouseLeave={e => {
              (e.currentTarget).style.transform = 'scale(1) translateY(0)';
              (e.currentTarget).style.boxShadow = '0 6px 25px rgba(254, 166, 4, 0.4)';
            }}
          >
            <div style={{
              width: 38, height: 38, borderRadius: '50%',
              background: 'rgba(254, 166, 4, 0.15)',
              border: '1.5px solid #fea604',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              overflow: 'hidden',
              boxShadow: '0 0 12px rgba(254, 166, 4, 0.3)',
            }}>
              <GrowyMascot size={32} animate={true} />
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: '#FEA604', display: 'flex', alignItems: 'center', gap: 4 }}>
                {configs.tienda_identidad?.nombre_asesor || 'Growy'}
                <span style={{ fontSize: '0.625rem', padding: '1px 5px', borderRadius: 4, background: 'rgba(254, 166, 4, 0.2)', color: '#FEA604', fontWeight: 700 }}>IA</span>
              </div>
              <div style={{ fontSize: '0.6875rem', color: '#a1a1aa' }}>Asesor Fitness</div>
            </div>
          </button>

          {/* Tutorial button */}
          <button
            onClick={startTutorial}
            aria-label="Activar tutorial guiado"
            style={{
              width: 44, height: 44, borderRadius: '50%',
              background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
              border: 'none', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', boxShadow: '0 4px 16px rgba(99,102,241,0.35)',
              transition: 'transform 0.2s, box-shadow 0.2s',
              minHeight: 'auto', padding: 0, letterSpacing: 'normal', textTransform: 'none' as const,
            }}
            onMouseEnter={e => {
              (e.currentTarget).style.transform = 'scale(1.1)';
              (e.currentTarget).style.boxShadow = '0 6px 24px rgba(99,102,241,0.5)';
            }}
            onMouseLeave={e => {
              (e.currentTarget).style.transform = 'scale(1)';
              (e.currentTarget).style.boxShadow = '0 4px 16px rgba(99,102,241,0.35)';
            }}
          >
            <BookOpen size={18} />
          </button>
        </div>
      )}

      {/* ═══ Tutorial Overlay ═══ */}
      {tutorialActive && (
        <TutorialOverlay
          step={TUTORIAL_STEPS[tutorialStep]}
          total={TUTORIAL_STEPS.length}
          currentStep={tutorialStep}
          onNext={nextTutorialStep}
          onPrev={prevTutorialStep}
          onClose={closeTutorial}
        />
      )}

      {/* ═══ Error Modal ═══ */}
      {errorMessage && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 9999, backdropFilter: 'blur(2px)'
        }}>
          <div style={{
            background: '#121216', borderRadius: 16, padding: '2rem', width: 'min(400px, 90vw)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.7)', textAlign: 'center',
            border: '2px solid #ef4444'
          }}>
            <div style={{
              width: 56, height: 56, borderRadius: '50%', background: 'rgba(239, 68, 68, 0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem'
            }}>
              <AlertTriangle size={32} color="#ef4444" />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.5rem' }}>Error</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', marginBottom: '2rem' }}>{errorMessage}</p>
            <button onClick={() => setErrorMessage(null)} style={{
              width: '100%', padding: '0.75rem', background: '#ef4444', color: '#fff',
              borderRadius: 8, fontWeight: 600, border: 'none', cursor: 'pointer',
              fontSize: '0.9375rem'
            }}>
              Aceptar
            </button>
          </div>
        </div>
      )}

      {/* ═══ Asesor Virtual Chat ═══ */}
      <AsesorChat 
        isOpen={asesorOpen} 
        onClose={() => setAsesorOpen(false)} 
        asesorNombre={configs.tienda_identidad?.nombre_asesor || 'Growy'}
        onUpdateAsesorNombre={(nuevoNombre) => {
          updateField('nombre_asesor', nuevoNombre);
          fetch('/api/ecommerce/configuraciones', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              clave: 'tienda_identidad',
              valor: {
                ...(configs.tienda_identidad || {}),
                nombre_asesor: nuevoNombre,
              },
            }),
          }).catch(console.error);
        }}
      />
    </div>
  );
}
