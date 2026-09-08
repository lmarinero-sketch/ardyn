import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dtjmckbrofevgfqbkzli.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false }
});

const existingOtherTables = [
  'salus_visitas',
  'pacientes',
  'nutri_profiles'
];

const ardynTables = [
  'users',
  'sales',
  'expenses',
  'coin_transactions',
  'debt_transactions',
  'rubros',
  'categorias',
  'marcas',
  'productos',
  'listas_precios',
  'lista_precio_escalones',
  'producto_promociones',
  'pedidos',
  'pedido_items',
  'compras',
  'compra_items',
  'configuraciones'
];

async function verify() {
  console.log('=== VERIFICACIÓN DE INTEGRIDAD DE BASE DE DATOS ===\n');
  console.log('URL:', supabaseUrl);

  console.log('\n--- 1. Verificando tablas preexistentes (Integridad / No borrado) ---');
  for (const table of existingOtherTables) {
    const { data, error, count } = await supabase.from(table).select('*', { count: 'exact', head: true });
    if (error) {
      console.log(`[PREEXISTENTE] ${table}: No accesible o no existe (${error.message})`);
    } else {
      console.log(`[PREEXISTENTE OK] ${table}: Intacta (registros: ${count})`);
    }
  }

  console.log('\n--- 2. Verificando tablas del sistema Ardyn ---');
  let missing = [];
  let existing = [];
  for (const table of ardynTables) {
    const { data, error } = await supabase.from(table).select('*').limit(1);
    if (error) {
      console.log(`[FALTA] ${table}: ${error.code} - ${error.message}`);
      missing.push(table);
    } else {
      console.log(`[OK] ${table}: Presente y operativa`);
      existing.push(table);
    }
  }

  console.log('\n--- RESUMEN ---');
  console.log(`Tablas Ardyn existentes: ${existing.length}/${ardynTables.length}`);
  console.log(`Tablas Ardyn pendientes: ${missing.length}/${ardynTables.length}`);

  if (missing.length === 0) {
    console.log('\n¡TODAS LAS MIGRACIONES DE ARDYN ESTÁN COMPLETAS Y ACTIVAS!');
  } else {
    console.log(`\nFalta aplicar la migración para: ${missing.join(', ')}`);
  }
}

verify().catch(console.error);
