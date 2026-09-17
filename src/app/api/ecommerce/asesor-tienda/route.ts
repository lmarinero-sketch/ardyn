import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Cliente Supabase seguro para leer configuraciones
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dtjmckbrofevgfqbkzli.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0am1ja2Jyb2ZldmdmcWJremxpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDcxNDExOCwiZXhwIjoyMDg2MjkwMTE4fQ.mths9S8UlKJOlyylkiTVMxnzjauY_tBdKEZDR7xsXMk';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Obtiene la API Key de OpenAI desde process.env o desde la tabla configuraciones en Supabase
 */
async function getOpenAiApiKey(): Promise<string | null> {
  if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.trim() !== '') {
    return process.env.OPENAI_API_KEY.trim();
  }

  try {
    const { data } = await supabase
      .from('configuraciones')
      .select('valor')
      .eq('clave', 'ai_config')
      .maybeSingle();

    if (data?.valor?.openai_key) {
      return String(data.valor.openai_key).trim();
    }
  } catch (err) {
    console.error('Error al leer ai_config de Supabase:', err);
  }

  return null;
}

/**
 * Motor local inteligente de respuestas de Growy (Fallback garantizado 100% de uptime)
 */
function generateGrowyFallback(userText: string, nombreAsesor = 'Growy'): string {
  const clean = userText
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();

  // 1. Preguntas sobre cómo editar la tienda
  if (
    clean.includes('edit') ||
    clean.includes('modific') ||
    clean.includes('como hago') ||
    clean.includes('leitnda') ||
    clean.includes('tienda') ||
    clean.includes('personaliz') ||
    clean.includes('empezar')
  ) {
    return `¡Qué hacés fiera! 💪🏋️‍♂️ Acá ${nombreAsesor}. Para editar la tienda tenés las siguientes secciones clave en el menú izquierdo:

1. **Identidad de Marca**: Nombre de tu tienda, logo oficial y mi nombre de asesor virtual.
2. **Hero Mayorista & Minorista**: Títulos principales, fotos de portada y videos de YouTube.
3. **Colores & Estilo**: Paleta negra, dorada (#FEA604) y acentos deportivos.
4. **Direcciones & Footer**: Información de sucursales y contacto (¡podés ocultarlas con los botones si aún no tenés los datos definitivos!).
5. **WhatsApp & Teléfonos**: Números de pedidos y mensajes automáticos.
6. **FAQs**: Preguntas y respuestas frecuentes para tus compradores.

💡 **Paso clave**: Cuando hagas cualquier cambio, tocá el botón azul **"Guardar"** arriba a la derecha para que se aplique en vivo.`;
  }

  // 2. Video de YouTube / Hero / Portada
  if (
    clean.includes('video') ||
    clean.includes('youtube') ||
    clean.includes('portada') ||
    clean.includes('reproduc') ||
    clean.includes('link')
  ) {
    return `¡A full con el contenido multimedia! 🎬🏋️‍♂️

Para poner o cambiar un video de portada:
1. Andá a la pestaña **Hero Mayorista** o **Hero Minorista**.
2. En el campo **"Video de portada (YouTube)"**, pegá cualquier link de YouTube (ej: *https://www.youtube.com/watch?v=...* o *https://youtu.be/...*).
3. El sistema lo convierte automáticamente al formato embed con reproducción continua y silenciada.
4. Podés previsualizarlo en vivo y asegurarte de tener el interruptor **"Video activo"** encendido.
5. ¡Hacé clic en **"Guardar"** arriba a la derecha y listo!`;
  }

  // 3. Footer / Ocultar sucursales o contacto / Direcciones
  if (
    clean.includes('footer') ||
    clean.includes('pie') ||
    clean.includes('sucursal') ||
    clean.includes('direccion') ||
    clean.includes('ubicacion') ||
    clean.includes('ocultar') ||
    clean.includes('mostrar') ||
    clean.includes('telefono') ||
    clean.includes('contacto') ||
    clean.includes('maps')
  ) {
    return `¡Buena pregunta! 📍💪

En la pestaña **"Direcciones & Footer"** podés controlar todo:
- Tenés dos interruptores clave:
  • **"Mostrar Sucursales en Footer"**: Si la info actual no es correcta, desactivalo para que no se vea ninguna dirección en la tienda.
  • **"Mostrar Contacto & Teléfonos en Footer"**: Desactivalo si no querés que aparezcan los teléfonos viejos.
- También podés editar la dirección central, sede Rawson, teléfonos, Instagram y horarios.
- Cuando tengas la información definitiva, volvés a activar los botones y tocás **"Guardar"** arriba a la derecha.`;
  }

  // 4. Logo e imágenes
  if (clean.includes('logo') || clean.includes('foto') || clean.includes('imagen') || clean.includes('banner')) {
    return `¡La imagen de marca es todo en el fitness! 🎨🏋️‍♂️

Para cambiar el logo de la tienda:
1. Andá a **Identidad**.
2. En **"Logo de la tienda"**, arrastrá tu imagen o hacé clic para subirla (se convierte automáticamente a WebP optimizado).
3. También podés pegar una URL directa.
4. Tamaño recomendado: cuadrado (mínimo 200×200px) con fondo transparente o negro.
5. Dale a **"Guardar"** arriba a la derecha para verla reflejada.`;
  }

  // 5. Productos / Precios / Subir fotos
  if (
    clean.includes('producto') ||
    clean.includes('articulo') ||
    clean.includes('foto') ||
    clean.includes('precio') ||
    clean.includes('stock') ||
    clean.includes('lista')
  ) {
    return `¡A meterle volumen al catálogo! 📦💪

Para gestionar tus productos:
1. En el menú lateral izquierdo (sidebar), hacé clic en **Productos**.
2. Tocá el botón **"+ Nuevo Producto"** arriba a la derecha.
3. Ingresá el nombre, categoría, marca y precio de costo.
4. En **"Fotos del Producto"**, arrastrá las fotos: se optimizan solas a WebP y se suben al almacenamiento seguro.
5. En **Listas de Precios** podés definir los márgenes para venta mayorista y minorista con un clic.`;
  }

  // 6. Colores & Estilo
  if (clean.includes('color') || clean.includes('estilo') || clean.includes('paleta') || clean.includes('fondo')) {
    return `¡Dale tu identidad deportiva! 🎨🔥

En la pestaña **"Colores & Estilo"** podés elegir:
- **Color Primario**: El dorado representativo de Ardyn (#FEA604).
- **Color Secundario**: Naranja intenso (#FD8209).
- **Color de Acento**: Verde flúor deportivo (#00FF88).
- **Color de Fondo y Tarjetas**: Fondos oscuros elegantes para resaltar las fotos de tus suplementos.
¡Tocá **"Guardar"** para ver el cambio inmediato en la tienda pública!`;
  }

  // 7. Nombre de Growy / Personalización del Asesor
  if (
    clean.includes('growy') ||
    clean.includes('nombre') ||
    clean.includes('quien sos') ||
    clean.includes('pesas') ||
    clean.includes('pesa') ||
    clean.includes('entren')
  ) {
    return `¡Soy ${nombreAsesor}! 💪🏋️‍♂️ Tu asesor fitness y compañero de entrenamiento para tu ecommerce.

¿Querés cambiar mi nombre?
- Podés hacerlo desde la pestaña **Identidad** en el campo **"Nombre del Asesor Virtual"**.
- O haciendo clic en el botón de edición ✏️ al lado de mi nombre en la barra superior de este chat.

¡Estoy acá para levantar todo el peso técnico por vos! ¿Qué sección querés ajustar ahora?`;
  }

  // 8. Saludos
  if (clean.includes('hola') || clean.includes('buenas') || clean.includes('buen dia') || clean.includes('que tal')) {
    return `¡Qué hacés campeón! 💪🏋️‍♂️ Soy ${nombreAsesor}, tu asesor fitness del Editor de Tienda.

Estoy listo para darte una mano con:
- Cómo editar textos, logo y colores.
- Configurar el video de YouTube en el Hero.
- Ocultar o mostrar sucursales y teléfonos en el footer.
- Configurar WhatsApp y preguntas frecuentes.

¿Qué querés personalizar primero?`;
  }

  // 9. Respuesta general proactiva
  return `¡Entendido fiera! 💪🏋️‍♂️ Como tu asesor ${nombreAsesor}, te ayudo a poner a punto tu tienda:

• **Para editar la tienda**: Elegí la pestaña en el menú izquierdo (Identidad, Hero, Footer, WhatsApp, FAQs) y al terminar tocá el botón azul **"Guardar"**.
• **Para el video de portada**: Pegá el link de YouTube en *Hero Mayorista* o *Hero Minorista*.
• **Para ocultar las sucursales o teléfonos**: Andá a *Direcciones & Footer* y apagá los interruptores correspondientes.
• **Para cargar productos con fotos**: Andá a la sección *Productos* en el menú lateral principal.

Decime qué parte específica querés cambiar y te tiro la posta paso a paso. 🏋️‍♂️`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, nombreAsesor = 'Growy' } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Mensajes requeridos' }, { status: 400 });
    }

    const lastUserMessage = [...messages].reverse().find(m => m.role === 'user')?.content || '';

    // Buscamos API Key de OpenAI (sea de process.env o de la base de datos Supabase)
    const apiKey = await getOpenAiApiKey();

    if (apiKey) {
      const SYSTEM_PROMPT = `Sos ${nombreAsesor}, el Asesor Fitness y Asistente Virtual del Editor de Tienda de Ardyn Labs. 
Tu personaje es un motivador y coach de entrenamiento que sabe todo sobre cómo personalizar el ecommerce deportivo y mayorista.

PERSONALIDAD:
- Sos enérgico, cercano y positivo. Usás jerga de gimnasio y fitness amigable ("fiera", "campeón", "a meterle peso", "💪", "🏋️‍♂️").
- Usás español rioplatense (argentino: vos, sos, podés, tenés, etc.).
- Respuestas claras, concisas (2 a 4 párrafos cortos o viñetas), directas al grano.

CONOCIMIENTO DEL EDITOR (/admin/ecommerce/personalizacion):
1. IDENTIDAD DE MARCA: Nombre de marca, subtítulos mayorista y minorista, logo cuadrado (PNG/JPG/WebP) y el nombre del Asesor Virtual ("${nombreAsesor}").
2. HERO MAYORISTA & MINORISTA: Título, descripción, subtexto, imagen de fondo y campo "Video de portada (YouTube)" que acepta cualquier link de YouTube y se reproduce automático. Toggle de "Video activo".
3. COLORES & ESTILO: Color primario (#FEA604), fondo negro, tarjetas y acentos.
4. DIRECCIONES & FOOTER: Dirección central, sede Rawson, teléfonos, Instagram, y dos interruptores clave: "Mostrar Sucursales en Footer" y "Mostrar Contacto & Teléfonos en Footer" para ocultar la información incorrecta hasta que se cargue la definitiva.
5. WHATSAPP & TELÉFONOS: Números mayoristas y minoristas (código país + código área + número sin guiones), mensajes de pedidos pre-cargados y botón flotante verde.
6. FAQS: Preguntas frecuentes para la página /como-comprar.
7. PRODUCTOS & PRECIOS: En el sidebar principal > Productos y Listas de Precios.
8. GUARDADO: Siempre recordar tocar el botón azul "Guardar" arriba a la derecha.`;

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout para respuesta rápida

        const res = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: SYSTEM_PROMPT },
              ...messages.slice(-10),
            ],
            max_tokens: 450,
            temperature: 0.6,
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (res.ok) {
          const data = await res.json();
          const reply = data.choices?.[0]?.message?.content?.trim();
          if (reply) {
            return NextResponse.json({ reply });
          }
        }
      } catch (err) {
        console.warn('OpenAI no disponible o timeout, ejecutando fallback local inteligente:', err);
      }
    }

    // Si no hay API key o OpenAI falló, ejecutamos el motor local garantizado
    const localReply = generateGrowyFallback(lastUserMessage, nombreAsesor);
    return NextResponse.json({ reply: localReply });
  } catch (error: unknown) {
    console.error('Error en /api/ecommerce/asesor-tienda:', error);
    // Incluso en caso de error inesperado, entregamos una respuesta útil de Growy en lugar de fallar
    const fallback = generateGrowyFallback('ayuda', 'Growy');
    return NextResponse.json({ reply: fallback });
  }
}
