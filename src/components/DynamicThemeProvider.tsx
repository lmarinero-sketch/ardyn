'use client';

import { useStoreConfig } from '@/hooks/useStoreConfig';

export default function DynamicThemeProvider() {
  const { config: colores } = useStoreConfig('tienda_colores');

  if (!colores) return null;

  const {
    color_primario = '#FEA604',
    color_secundario = '#FD8209',
    color_acento = '#FEA604',
    color_fondo = '#000000',
    color_tarjeta = '#0d0d0f',
    color_texto = '#FFFFFF',
    color_texto_secundario = '#A1A1AA',
  } = colores;

  const accentColor = color_primario || color_acento || '#FEA604';

  return (
    <style dangerouslySetInnerHTML={{
      __html: `
        :root {
          --brand-gold: ${color_primario} !important;
          --brand-orange: ${color_secundario} !important;
          --brand-gradient: linear-gradient(135deg, ${color_primario} 0%, ${color_secundario} 100%) !important;
          --brand-glow: 0 0 20px ${color_primario}40 !important;
          --brand-subtle: ${color_primario}20 !important;
          --bg-color: ${color_fondo} !important;
          --card-bg: ${color_tarjeta} !important;
          --text-main: ${color_texto} !important;
          --text-secondary: ${color_texto_secundario} !important;
          --accent: ${accentColor} !important;
          --accent-hover: ${color_secundario || '#FD8209'} !important;
          --accent-light: ${accentColor}26 !important;
          --accent-green: ${accentColor} !important;
          --accent-green-light: ${accentColor}26 !important;
        }
      `
    }} />
  );
}
