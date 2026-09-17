'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, Plus, Search, Trash2, PackagePlus, Check, X, Loader2,
  ChevronDown, ChevronUp, FileText, Calendar, Truck, AlertCircle
} from 'lucide-react';
import { Compra, Producto, Categoria, Marca } from '@/types/ecommerce';

interface CompraFormItem {
  producto_id: string;
  producto_nombre: string;
  cantidad: string;
  precio_unitario: string;
  precio_anterior: number;
}

export default function ComprasAdminPage() {
  const [compras, setCompras] = useState<Compra[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  // Form state
  const [proveedor, setProveedor] = useState('');
  const [numeroFactura, setNumeroFactura] = useState('');
  const [notas, setNotas] = useState('');
  const [items, setItems] = useState<CompraFormItem[]>([{ producto_id: '', producto_nombre: '', cantidad: '1', precio_unitario: '', precio_anterior: 0 }]);

  // Product search & catalogue state
  const [allProductos, setAllProductos] = useState<Producto[]>([]);
  const [productSearch, setProductSearch] = useState('');
  const [activeSearchIdx, setActiveSearchIdx] = useState<number | null>(null);

  // Quick product create modal
  const [showQuickCreate, setShowQuickCreate] = useState(false);
  const [quickTargetIdx, setQuickTargetIdx] = useState<number>(0);
  const [quickNombre, setQuickNombre] = useState('');
  const [quickCategoriaId, setQuickCategoriaId] = useState('');
  const [quickMarcaId, setQuickMarcaId] = useState('');
  const [quickPrecioCosto, setQuickPrecioCosto] = useState('');
  const [quickPrecioVenta, setQuickPrecioVenta] = useState('');
  const [quickCreating, setQuickCreating] = useState(false);
  const [quickError, setQuickError] = useState<string | null>(null);

  // Categories & Brands
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [marcas, setMarcas] = useState<Marca[]>([]);

  const fetchCompras = useCallback(async () => {
    const res = await fetch('/api/ecommerce/compras');
    const data = await res.json();
    setCompras(data.compras || []);
    setLoading(false);
  }, []);

  const fetchAllProductos = useCallback(async () => {
    try {
      const res = await fetch('/api/ecommerce/productos?all=true&limit=250');
      const data = await res.json();
      setAllProductos(data.productos || []);
    } catch (e) {
      console.error('Error al cargar productos:', e);
    }
  }, []);

  const fetchFilters = useCallback(async () => {
    try {
      const [catRes, marcaRes] = await Promise.all([
        fetch('/api/ecommerce/categorias'),
        fetch('/api/ecommerce/marcas'),
      ]);
      const [catData, marcaData] = await Promise.all([catRes.json(), marcaRes.json()]);
      setCategorias(catData.categorias || []);
      setMarcas(marcaData.marcas || []);
    } catch (e) {
      console.error('Error al cargar categorías/marcas:', e);
    }
  }, []);

  useEffect(() => {
    fetchCompras();
    fetchAllProductos();
    fetchFilters();
  }, [fetchCompras, fetchAllProductos, fetchFilters]);

  // Si abren el modal de nueva compra, recargamos productos para asegurar catálogo actualizado
  useEffect(() => {
    if (showForm) {
      fetchAllProductos();
      fetchFilters();
    }
  }, [showForm, fetchAllProductos, fetchFilters]);

  const addItem = () => {
    setItems([...items, { producto_id: '', producto_nombre: '', cantidad: '1', precio_unitario: '', precio_anterior: 0 }]);
  };

  const removeItem = (idx: number) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== idx));
  };

  const updateItem = (idx: number, field: keyof CompraFormItem, value: string) => {
    setItems(items.map((item, i) => i === idx ? { ...item, [field]: value } : item));
  };

  const selectProduct = (idx: number, prod: Producto) => {
    setItems(items.map((item, i) => i === idx ? {
      ...item,
      producto_id: prod.id,
      producto_nombre: prod.nombre,
      precio_unitario: prod.precio_costo ? String(prod.precio_costo) : (item.precio_unitario || ''),
      precio_anterior: prod.precio_costo || 0,
    } : item));
    setActiveSearchIdx(null);
    setProductSearch('');
  };

  const openQuickCreate = (targetIdx: number, initialName = '') => {
    setQuickTargetIdx(targetIdx);
    setQuickNombre(initialName.trim());
    setQuickCategoriaId(categorias[0]?.id || '');
    setQuickMarcaId(marcas[0]?.id || '');
    setQuickPrecioCosto(items[targetIdx]?.precio_unitario || '');
    setQuickPrecioVenta('');
    setQuickError(null);
    setShowQuickCreate(true);
  };

  const handleCreateQuickProduct = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!quickNombre.trim()) {
      setQuickError('El nombre del producto es obligatorio');
      return;
    }

    setQuickCreating(true);
    setQuickError(null);

    try {
      const costo = parseFloat(quickPrecioCosto) || 0;
      const venta = parseFloat(quickPrecioVenta) || (costo > 0 ? Math.round(costo * 1.3) : 0);

      const res = await fetch('/api/ecommerce/productos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: quickNombre.trim(),
          categoria_id: quickCategoriaId || null,
          marca_id: quickMarcaId || null,
          precio_costo: costo,
          precio_unitario: venta,
          precio_mayorista: venta,
          stock: 0,
          activo: true,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Error al crear producto');
      }

      const created: Producto = data.producto;

      // Actualizar lista local de productos
      setAllProductos(prev => [created, ...prev]);

      // Seleccionar automáticamente en la línea de compra activa
      selectProduct(quickTargetIdx, created);

      setShowQuickCreate(false);
    } catch (err: any) {
      setQuickError(err.message || 'Error al crear el producto');
    } finally {
      setQuickCreating(false);
    }
  };

  const calcTotal = () => {
    return items.reduce((sum, item) => {
      return sum + (parseInt(item.cantidad) || 0) * (parseFloat(item.precio_unitario) || 0);
    }, 0);
  };

  const handleSave = async (confirmar: boolean) => {
    const validItems = items.filter(i => i.producto_id && i.cantidad && i.precio_unitario);
    if (validItems.length === 0) return;
    setSaving(true);

    try {
      await fetch('/api/ecommerce/compras', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          proveedor,
          numero_factura: numeroFactura,
          notas,
          confirmar,
          items: validItems.map(i => ({
            producto_id: i.producto_id,
            producto_nombre: i.producto_nombre,
            cantidad: parseInt(i.cantidad),
            precio_unitario: parseFloat(i.precio_unitario),
            precio_anterior: i.precio_anterior,
          })),
        }),
      });
      setShowForm(false);
      resetForm();
      fetchCompras();
      fetchAllProductos();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleConfirm = async (id: string) => {
    setConfirmingId(id);
    try {
      await fetch(`/api/ecommerce/compras/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confirmar: true }),
      });
      fetchCompras();
      fetchAllProductos();
    } catch (err) {
      console.error(err);
    } finally {
      setConfirmingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar esta compra?')) return;
    await fetch(`/api/ecommerce/compras/${id}`, { method: 'DELETE' });
    fetchCompras();
  };

  const resetForm = () => {
    setProveedor('');
    setNumeroFactura('');
    setNotas('');
    setItems([{ producto_id: '', producto_nombre: '', cantidad: '1', precio_unitario: '', precio_anterior: 0 }]);
    setActiveSearchIdx(null);
    setProductSearch('');
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 }).format(price);

  const estadoConfig: Record<string, { badge: string; label: string }> = {
    pendiente: { badge: 'badge-amber', label: '⏳ Pendiente' },
    confirmada: { badge: 'badge-green', label: '✅ Confirmada' },
    cancelada: { badge: 'badge-red', label: '❌ Cancelada' },
  };

  // Filtrado reactivo de productos
  const filteredProducts = productSearch.trim()
    ? allProductos.filter(p => {
        const q = productSearch.toLowerCase();
        return (
          p.nombre.toLowerCase().includes(q) ||
          (p.sku && p.sku.toLowerCase().includes(q)) ||
          (p.categoria?.nombre && p.categoria.nombre.toLowerCase().includes(q)) ||
          (p.marca?.nombre && p.marca.nombre.toLowerCase().includes(q))
        );
      })
    : allProductos;

  return (
    <div className="page-container">
      <Link href="/admin/ecommerce">
        <button className="btn-ghost" style={{ marginBottom: '1rem', fontSize: '0.875rem' }}>
          <ArrowLeft size={16} /> Ecommerce
        </button>
      </Link>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ marginBottom: '0.25rem' }}>Compras</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Registrá ingresos de mercadería · Actualizá stock y costos</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="btn-brand">
          <Plus size={18} /> Nueva Compra
        </button>
      </div>

      {/* ══════ NEW PURCHASE MODAL ══════ */}
      {showForm && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.6)', zIndex: 100,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '1rem', backdropFilter: 'blur(3px)',
        }}>
          <div className="glass-card animate-scaleIn" style={{
            width: '100%', maxWidth: 740, maxHeight: '90vh', overflowY: 'auto',
            background: '#0e0e11', border: '1px solid #27272a',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                <PackagePlus size={20} color="#FEA604" />
                Nueva Compra
              </h3>
              <button 
                className="btn-ghost" 
                onClick={() => setShowForm(false)} 
                style={{ padding: '0.25rem', minHeight: 'auto', color: 'var(--text-muted)' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Header fields */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
              <div>
                <label>Proveedor</label>
                <input value={proveedor} onChange={e => setProveedor(e.target.value)} placeholder="Nombre del proveedor" />
              </div>
              <div>
                <label>N° Factura</label>
                <input value={numeroFactura} onChange={e => setNumeroFactura(e.target.value)} placeholder="Ej: FC-00123" />
              </div>
            </div>

            {/* Items */}
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <label style={{ margin: 0, fontWeight: 700, fontSize: '0.9375rem' }}>Productos</label>
                <button className="btn-ghost" onClick={addItem} style={{ fontSize: '0.8125rem', color: 'var(--brand-gold)', padding: '0.25rem 0.5rem', fontWeight: 600 }}>
                  <Plus size={14} /> Agregar línea
                </button>
              </div>

              {items.map((item, idx) => (
                <div key={idx} style={{
                  display: 'grid', gridTemplateColumns: '1fr 100px 130px 36px',
                  gap: '0.5rem', alignItems: 'end', marginBottom: '0.625rem',
                  padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: 12,
                  border: '1px solid #1f1f23',
                }}>
                  {/* Product selector */}
                  <div style={{ position: 'relative' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <label style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', margin: 0 }}>Producto</label>
                      <button
                        type="button"
                        onClick={() => openQuickCreate(idx, activeSearchIdx === idx ? productSearch : '')}
                        style={{
                          background: 'none', border: 'none', color: 'var(--brand-gold)',
                          fontSize: '0.6875rem', fontWeight: 700, cursor: 'pointer', padding: 0,
                          display: 'flex', alignItems: 'center', gap: 2, minHeight: 'auto',
                        }}
                      >
                        <Plus size={11} /> Nuevo
                      </button>
                    </div>

                    {item.producto_nombre ? (
                      <div style={{
                        padding: '0.75rem 1rem', background: 'var(--bg-color)', border: '1px solid var(--brand-gold)',
                        borderRadius: 12, fontSize: '0.875rem', fontWeight: 600, marginTop: '0.375rem',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      }}>
                        <span style={{ color: '#ffffff' }}>{item.producto_nombre}</span>
                        <button className="btn-ghost" onClick={() => updateItem(idx, 'producto_id', '')} style={{ padding: 2, fontSize: 0, minHeight: 'auto', color: 'var(--text-muted)' }}>
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <input
                          placeholder="Buscar o seleccionar producto..."
                          value={activeSearchIdx === idx ? productSearch : ''}
                          onFocus={() => {
                            setActiveSearchIdx(idx);
                            setProductSearch('');
                          }}
                          onChange={e => {
                            setProductSearch(e.target.value);
                            setActiveSearchIdx(idx);
                          }}
                          style={{ marginBottom: 0 }}
                        />

                        {/* Dropdown Menu */}
                        {activeSearchIdx === idx && (
                          <>
                            {/* Backdrop para cerrar al hacer clic afuera */}
                            <div
                              style={{ position: 'fixed', inset: 0, zIndex: 48 }}
                              onClick={() => setActiveSearchIdx(null)}
                            />

                            <div style={{
                              position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, zIndex: 50,
                              background: '#121216', border: '1px solid #3f3f46',
                              borderRadius: 12, maxHeight: 260, overflowY: 'auto',
                              boxShadow: '0 12px 35px rgba(0,0,0,0.85)',
                            }}>
                              {/* Botón destacado para crear nuevo producto */}
                              <div
                                onClick={() => openQuickCreate(idx, productSearch)}
                                style={{
                                  padding: '0.625rem 0.875rem', cursor: 'pointer',
                                  background: 'rgba(254, 166, 4, 0.12)', borderBottom: '1px solid #27272a',
                                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                                  color: '#FEA604', fontWeight: 700, fontSize: '0.8125rem',
                                  position: 'sticky', top: 0, zIndex: 2,
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = 'rgba(254, 166, 4, 0.22)'}
                                onMouseLeave={e => e.currentTarget.style.background = 'rgba(254, 166, 4, 0.12)'}
                              >
                                <Plus size={15} />
                                <span>
                                  {productSearch.trim()
                                    ? `+ Crear "${productSearch.trim()}" como nuevo producto`
                                    : '+ Crear nuevo producto...'}
                                </span>
                              </div>

                              {/* Lista de productos filtrados o todos */}
                              {filteredProducts.length > 0 ? (
                                filteredProducts.map(p => (
                                  <div
                                    key={p.id}
                                    onClick={() => selectProduct(idx, p)}
                                    style={{
                                      padding: '0.625rem 0.875rem', cursor: 'pointer',
                                      fontSize: '0.8125rem', borderBottom: '1px solid #27272a',
                                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                      transition: 'background 0.15s',
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.background = '#1e1e24'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                  >
                                    <div>
                                      <div style={{ fontWeight: 600, color: '#fff' }}>{p.nombre}</div>
                                      <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: 2 }}>
                                        {p.categoria?.nombre ? `${p.categoria.nombre}` : 'Sin categoría'}
                                        {p.marca?.nombre ? ` · ${p.marca.nombre}` : ''}
                                      </div>
                                    </div>
                                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                      <div style={{ color: 'var(--brand-gold)', fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', fontWeight: 700 }}>
                                        {formatPrice(p.precio_costo || 0)}
                                      </div>
                                      <div style={{ color: p.stock > 0 ? '#10b981' : '#ef4444', fontSize: '0.6875rem' }}>
                                        Stock: {p.stock}
                                      </div>
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <div style={{ padding: '1rem', fontSize: '0.8125rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                                  No hay productos que coincidan con &quot;{productSearch}&quot;. Podés crearlo arriba.
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </>
                    )}
                  </div>

                  {/* Quantity */}
                  <div>
                    <label style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Cant.</label>
                    <input
                      type="number" min="1" value={item.cantidad}
                      onChange={e => updateItem(idx, 'cantidad', e.target.value)}
                      style={{ marginBottom: 0, textAlign: 'center' }}
                    />
                  </div>

                  {/* Unit price */}
                  <div>
                    <label style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                      Costo Unit.
                      {item.producto_id && item.precio_unitario && parseFloat(item.precio_unitario) !== item.precio_anterior && (
                        <span style={{ 
                          color: parseFloat(item.precio_unitario) > item.precio_anterior ? 'var(--accent-red)' : 'var(--brand-gold)',
                          fontWeight: 700 
                        }}>
                          {parseFloat(item.precio_unitario) > item.precio_anterior ? '⬆️' : '⬇️'} {Math.abs(100 * (parseFloat(item.precio_unitario) - item.precio_anterior) / (item.precio_anterior || 1)).toFixed(1)}%
                        </span>
                      )}
                    </label>
                    <input
                      type="number" min="0" step="0.01" value={item.precio_unitario}
                      onChange={e => updateItem(idx, 'precio_unitario', e.target.value)}
                      style={{ marginBottom: 0, borderColor: item.producto_id && item.precio_unitario && parseFloat(item.precio_unitario) !== item.precio_anterior ? (parseFloat(item.precio_unitario) > item.precio_anterior ? 'var(--accent-red)' : 'var(--brand-gold)') : undefined }}
                      placeholder="$0"
                    />
                  </div>

                  {/* Remove */}
                  <button className="btn-ghost" onClick={() => removeItem(idx)}
                    disabled={items.length <= 1}
                    style={{ padding: '0.375rem', color: 'var(--accent-red)', marginBottom: '0.375rem', minHeight: 'auto' }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            {/* Notes */}
            <div>
              <label>Notas</label>
              <textarea value={notas} onChange={e => setNotas(e.target.value)} rows={2} placeholder="Notas adicionales..." />
            </div>

            {/* Total & Actions */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '1rem 1.25rem', background: 'var(--bg-tertiary)', borderRadius: 12,
              marginBottom: '1rem',
            }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)' }}>Total</span>
              <span style={{ fontSize: '1.5rem', fontWeight: 900, fontFamily: 'var(--font-mono)', color: 'var(--brand-gold)' }}>{formatPrice(calcTotal())}</span>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={() => handleSave(true)} disabled={saving || !items.some(i => i.producto_id)} style={{ flex: 1 }} className="btn-brand">
                {saving ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Guardando...</> : <><Check size={16} /> Confirmar y Actualizar Stock</>}
              </button>
              <button onClick={() => handleSave(false)} disabled={saving || !items.some(i => i.producto_id)} className="secondary" style={{ fontSize: '0.8125rem' }}>
                Guardar Pendiente
              </button>
              <button className="secondary" onClick={() => setShowForm(false)} style={{ fontSize: '0.8125rem' }}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════ MODAL CREAR PRODUCTO RÁPIDO ══════ */}
      {showQuickCreate && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.75)', zIndex: 120,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '1rem', backdropFilter: 'blur(4px)',
        }}>
          <div className="glass-card animate-scaleIn" style={{
            width: '100%', maxWidth: 480, background: '#121216', border: '1px solid #3f3f46',
            boxShadow: '0 20px 60px rgba(0,0,0,0.85)', padding: '1.5rem',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 8, background: 'rgba(254, 166, 4, 0.15)',
                  border: '1px solid rgba(254, 166, 4, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <PackagePlus size={18} color="#FEA604" />
                </div>
                <h3 style={{ margin: 0, fontSize: '1.125rem' }}>Nuevo Producto Rápido</h3>
              </div>
              <button
                className="btn-ghost"
                onClick={() => setShowQuickCreate(false)}
                style={{ padding: 4, minHeight: 'auto', color: 'var(--text-muted)' }}
              >
                <X size={18} />
              </button>
            </div>

            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              Completá los datos básicos para registrarlo en el catálogo y seleccionarlo automáticamente en esta compra.
            </p>

            {quickError && (
              <div style={{
                padding: '0.625rem 0.875rem', background: 'rgba(239,68,68,0.12)',
                border: '1px solid var(--accent-red)', borderRadius: 8, color: 'var(--accent-red)',
                fontSize: '0.8125rem', marginBottom: '1rem',
              }}>
                {quickError}
              </div>
            )}

            <form onSubmit={handleCreateQuickProduct}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Nombre del Producto *</label>
                <input
                  required
                  autoFocus
                  value={quickNombre}
                  onChange={e => setQuickNombre(e.target.value)}
                  placeholder="Ej: Creatina Micronizada 300g"
                  style={{ marginTop: 4 }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 0.75rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Categoría</label>
                  <select
                    value={quickCategoriaId}
                    onChange={e => setQuickCategoriaId(e.target.value)}
                    style={{ marginTop: 4 }}
                  >
                    <option value="">Sin categoría</option>
                    {categorias.map(c => (
                      <option key={c.id} value={c.id}>{c.nombre}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Marca</label>
                  <select
                    value={quickMarcaId}
                    onChange={e => setQuickMarcaId(e.target.value)}
                    style={{ marginTop: 4 }}
                  >
                    <option value="">Sin marca</option>
                    {marcas.map(m => (
                      <option key={m.id} value={m.id}>{m.nombre}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 0.75rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Precio de Costo ($)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={quickPrecioCosto}
                    onChange={e => setQuickPrecioCosto(e.target.value)}
                    placeholder="$0"
                    style={{ marginTop: 4 }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Precio Minorista ($)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={quickPrecioVenta}
                    onChange={e => setQuickPrecioVenta(e.target.value)}
                    placeholder="$0 (opcional)"
                    style={{ marginTop: 4 }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  type="submit"
                  disabled={quickCreating || !quickNombre.trim()}
                  className="btn-brand"
                  style={{ flex: 1, padding: '0.75rem' }}
                >
                  {quickCreating ? (
                    <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Creando...</>
                  ) : (
                    <><Check size={16} /> Crear y Seleccionar</>
                  )}
                </button>
                <button
                  type="button"
                  className="secondary"
                  onClick={() => setShowQuickCreate(false)}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══════ PURCHASES LIST ══════ */}
      {loading ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
          <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', color: 'var(--text-light)', marginBottom: '0.5rem' }} />
          <p style={{ color: 'var(--text-muted)' }}>Cargando compras...</p>
        </div>
      ) : compras.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
          <PackagePlus size={48} style={{ color: 'var(--text-light)', marginBottom: '1rem' }} />
          <h3 style={{ marginBottom: '0.5rem' }}>No hay compras registradas</h3>
          <p style={{ color: 'var(--text-muted)' }}>Registrá tu primera compra para actualizar stock y costos.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {compras.map(compra => {
            const isExpanded = expandedId === compra.id;
            const itemsCount = compra.items?.length || 0;
            const totalUnits = compra.items?.reduce((s, i) => s + i.cantidad, 0) || 0;

            return (
              <div key={compra.id} className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
                {/* Row Header */}
                <div
                  onClick={() => setExpandedId(isExpanded ? null : compra.id)}
                  style={{
                    padding: '1.25rem 1.5rem', cursor: 'pointer',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    flexWrap: 'wrap', gap: '1rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                      width: 42, height: 42, borderRadius: 10,
                      background: compra.estado === 'confirmada' ? 'rgba(254, 166, 4, 0.15)' : 'rgba(245, 158, 11, 0.1)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: compra.estado === 'confirmada' ? 'var(--brand-gold)' : 'var(--accent-amber)',
                    }}>
                      <Truck size={20} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9375rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span>{compra.proveedor || 'Sin proveedor'}</span>
                        {compra.numero_factura && (
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                            #{compra.numero_factura}
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', gap: '1rem', marginTop: 2 }}>
                        <span><Calendar size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />{new Date(compra.created_at).toLocaleDateString('es-AR')}</span>
                        <span>{itemsCount} {itemsCount === 1 ? 'producto' : 'productos'} ({totalUnits} u.)</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <span className={`badge ${estadoConfig[compra.estado]?.badge || 'badge-gray'}`}>
                      {estadoConfig[compra.estado]?.label || compra.estado}
                    </span>
                    <span style={{ fontWeight: 800, fontSize: '1.125rem', fontFamily: 'var(--font-mono)' }}>
                      {formatPrice(compra.total)}
                    </span>
                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>
                </div>

                {/* Expanded Detail */}
                {isExpanded && (
                  <div style={{ padding: '0 1.5rem 1.5rem', borderTop: '1px solid var(--border-light)' }}>
                    {compra.notas && (
                      <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', margin: '1rem 0 0.5rem', fontStyle: 'italic' }}>
                        &ldquo;{compra.notas}&rdquo;
                      </p>
                    )}

                    <div style={{ overflowX: 'auto', marginTop: '1rem' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
                        <thead>
                          <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left', color: 'var(--text-muted)' }}>
                            <th style={{ padding: '0.5rem 0' }}>Producto</th>
                            <th style={{ padding: '0.5rem', textAlign: 'center' }}>Cantidad</th>
                            <th style={{ padding: '0.5rem', textAlign: 'right' }}>Costo Unit.</th>
                            <th style={{ padding: '0.5rem', textAlign: 'right' }}>Subtotal</th>
                            <th style={{ padding: '0.5rem', textAlign: 'center' }}>Variación</th>
                          </tr>
                        </thead>
                        <tbody>
                          {compra.items?.map(item => {
                            const diff = item.precio_anterior ? item.precio_unitario - item.precio_anterior : 0;
                            const pct = item.precio_anterior ? (diff / item.precio_anterior) * 100 : 0;

                            return (
                              <tr key={item.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                                <td style={{ padding: '0.625rem 0', fontWeight: 600 }}>{item.producto_nombre}</td>
                                <td style={{ padding: '0.625rem', textAlign: 'center' }}>{item.cantidad}</td>
                                <td style={{ padding: '0.625rem', textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
                                  {formatPrice(item.precio_unitario)}
                                </td>
                                <td style={{ padding: '0.625rem', textAlign: 'right', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                                  {formatPrice(item.subtotal)}
                                </td>
                                <td style={{ padding: '0.625rem', textAlign: 'center', fontSize: '0.75rem', fontWeight: 600 }}>
                                  {item.precio_anterior && diff !== 0 ? (
                                    <span style={{ color: diff > 0 ? 'var(--accent-red)' : 'var(--brand-gold)' }}>
                                      {diff > 0 ? '⬆️ +' : '⬇️ '}{pct.toFixed(1)}%
                                    </span>
                                  ) : (
                                    <span style={{ color: 'var(--text-light)' }}>—</span>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
                      {compra.estado === 'pendiente' && (
                        <button
                          onClick={() => handleConfirm(compra.id)}
                          disabled={confirmingId === compra.id}
                          className="btn-brand"
                          style={{ fontSize: '0.8125rem', padding: '0.5rem 1rem' }}
                        >
                          {confirmingId === compra.id ? (
                            <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> Confirmando...</>
                          ) : (
                            <><Check size={14} /> Confirmar Ingreso (Actualizar Stock)</>
                          )}
                        </button>
                      )}
                      <button
                        className="btn-ghost"
                        onClick={() => handleDelete(compra.id)}
                        style={{ fontSize: '0.8125rem', color: 'var(--accent-red)', padding: '0.5rem 0.75rem' }}
                      >
                        <Trash2 size={14} /> Eliminar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
