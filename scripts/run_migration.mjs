/**
 * Run SQL migrations against Supabase
 * Usage: node scripts/run_migration.mjs <migration_file>
 */
import { readFileSync } from 'fs';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ophbmcprxcnpkpndusbe.supabase.co';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;

const file = process.argv[2];
if (!file) { console.error('Usage: node run_migration.mjs <file.sql>'); process.exit(1); }

const sql = readFileSync(file, 'utf-8');
console.log(`Running migration: ${file}`);
console.log(`SQL length: ${sql.length} chars`);

const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
  method: 'POST',
  headers: {
    'apikey': SERVICE_ROLE_KEY,
    'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ sql }),
});

if (!res.ok) {
  // Try pg_meta endpoint instead
  console.log('RPC not available, trying SQL endpoint...');
  
  const pgRes = await fetch(`${SUPABASE_URL}/pg/query`, {
    method: 'POST',
    headers: {
      'apikey': SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
      'x-connection-encrypted': 'true',
    },
    body: JSON.stringify({ query: sql }),
  });

  if (!pgRes.ok) {
    // Use the management API
    console.log('Trying management API...');
    const ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN;
    const PROJECT_REF = process.env.SUPABASE_PROJECT_REF || 'ophbmcprxcnpkpndusbe';
    
    const mgmtRes = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: sql }),
    });

    const result = await mgmtRes.text();
    console.log(`Status: ${mgmtRes.status}`);
    console.log(`Result: ${result.substring(0, 500)}`);
  } else {
    const result = await pgRes.text();
    console.log(`Status: ${pgRes.status}`);
    console.log(`Result: ${result.substring(0, 500)}`);
  }
} else {
  console.log('✅ Migration executed successfully');
}
