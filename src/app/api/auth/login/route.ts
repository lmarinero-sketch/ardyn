import { NextRequest, NextResponse } from 'next/server';
import { createToken, COOKIE_NAME, UserRole, AuthUser } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { email, password } = body;

  if (!email || !password) {
    return NextResponse.json(
      { error: 'Email y contraseña son requeridos' },
      { status: 400 }
    );
  }

  let authenticatedUser: AuthUser | null = null;

  // 1. Try finding user in admin_users table
  try {
    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', email.toLowerCase().trim())
      .eq('activo', true)
      .maybeSingle();

    if (adminUser) {
      const valid = await bcrypt.compare(password, adminUser.password_hash);
      if (valid) {
        authenticatedUser = {
          id: adminUser.id,
          email: adminUser.email,
          nombre: adminUser.nombre,
          rol: (adminUser.rol as UserRole) || 'administrador',
        };
        await supabase
          .from('admin_users')
          .update({ last_login: new Date().toISOString() })
          .eq('id', adminUser.id);
      }
    }
  } catch {
    // admin_users table might not exist in this database
  }

  // 2. Fallback: try staff_users table
  if (!authenticatedUser) {
    try {
      const { data: staffUser } = await supabase
        .from('staff_users')
        .select('*')
        .eq('email', email.toLowerCase().trim())
        .eq('status', 'active')
        .maybeSingle();

      if (staffUser) {
        const isPlainMatch = password === staffUser.password;
        const isHashMatch = staffUser.password?.startsWith('$2')
          ? await bcrypt.compare(password, staffUser.password)
          : false;

        if (isPlainMatch || isHashMatch) {
          authenticatedUser = {
            id: staffUser.id,
            email: staffUser.email,
            nombre: staffUser.name || staffUser.nombre || 'Administrador',
            rol: (staffUser.role === 'admin' ? 'superadmin' : staffUser.role === 'vendedor' ? 'vendedor' : 'administrador') as UserRole,
          };
        }
      }
    } catch {
      // staff_users failed
    }
  }

  if (!authenticatedUser) {
    return NextResponse.json(
      { error: 'Credenciales incorrectas' },
      { status: 401 }
    );
  }

  // Create JWT with user info and role
  const token = await createToken({
    id: authenticatedUser.id,
    email: authenticatedUser.email,
    nombre: authenticatedUser.nombre,
    rol: authenticatedUser.rol,
  });

  const response = NextResponse.json({
    success: true,
    user: authenticatedUser,
  });

  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
  });

  return response;
}
