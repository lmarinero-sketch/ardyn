import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dtjmckbrofevgfqbkzli.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0am1ja2Jyb2ZldmdmcWJremxpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDcxNDExOCwiZXhwIjoyMDg2MjkwMTE4fQ.mths9S8UlKJOlyylkiTVMxnzjauY_tBdKEZDR7xsXMk';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

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
    console.error('Error al obtener key en generar-descripcion:', err);
  }

  return null;
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { nombre, categoria, marca } = body;

  if (!nombre) {
    return NextResponse.json({ error: 'Nombre del producto requerido' }, { status: 400 });
  }

  const apiKey = await getOpenAiApiKey();

  // Fallback si no hay OpenAI
  const fallbackDescription = `${nombre}${marca ? ` de ${marca}` : ''}. Producto de alta calidad para entrenamiento y rendimiento deportivo${categoria ? ` dentro de la línea de ${categoria}` : ''}. Presentación pensada para satisfacer la demanda de atletas, gimnasios y revendedores.`;

  if (!apiKey) {
    return NextResponse.json({ descripcion: fallbackDescription });
  }

  const prompt = `Sos un copywriter experto en suplementos deportivos y productos fitness para un ecommerce B2B mayorista argentino llamado "Ardyn Suplementos". 

Generá una descripción de producto atractiva, profesional y concisa (máximo 3 oraciones) para el siguiente producto:

Producto: ${nombre}
${categoria ? `Categoría: ${categoria}` : ''}
${marca ? `Marca: ${marca}` : ''}

Reglas:
- Usá español rioplatense (vos, sos, etc.)
- Mencioná beneficios clave del producto
- Orientá al comprador mayorista (revendedores, gimnasios, dietéticas)
- No uses emojis
- Sé directo y profesional`;

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 200,
        temperature: 0.7,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error?.message || 'Error de OpenAI');
    }

    const description = data.choices?.[0]?.message?.content?.trim() || fallbackDescription;

    return NextResponse.json({ descripcion: description });
  } catch (error: unknown) {
    console.warn('Fallo en OpenAI generar-descripcion, usando fallback:', error);
    return NextResponse.json({ descripcion: fallbackDescription });
  }
}
