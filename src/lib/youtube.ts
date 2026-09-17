/**
 * Convierte cualquier formato de URL de YouTube (watch, youtu.be, shorts, embed)
 * al formato embed estándar optimizado para reproducción en la tienda.
 */
export function formatYouTubeEmbed(url?: string | null): string {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (!trimmed) return '';

  // Detectar ID de 11 caracteres de YouTube
  const match = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/);
  if (match && match[1]) {
    const id = match[1];
    return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&controls=0&rel=0&showinfo=0`;
  }

  return trimmed;
}
