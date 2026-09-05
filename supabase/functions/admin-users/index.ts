import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!supabaseUrl || !anonKey || !serviceRoleKey) throw new Error('Missing Supabase server secrets');

    const authorization = request.headers.get('Authorization');
    if (!authorization) return json({ error: 'Unauthorized' }, 401);

    const callerClient = createClient(supabaseUrl, anonKey, { global: { headers: { Authorization: authorization } } });
    const { data: { user }, error: userError } = await callerClient.auth.getUser();
    if (userError || !user) return json({ error: 'Unauthorized' }, 401);

    const adminClient = createClient(supabaseUrl, serviceRoleKey, { auth: { autoRefreshToken: false, persistSession: false } });
    const { data: profile } = await adminClient.from('profiles').select('role,active').eq('id', user.id).single();
    if (!profile?.active || profile.role !== 'admin') return json({ error: 'Admin access required' }, 403);

    const body = await request.json();
    if (body.action === 'create') {
      if (!body.email || !body.password || body.password.length < 8 || !body.name) return json({ error: 'Invalid user data' }, 400);
      const { data, error } = await adminClient.auth.admin.createUser({
        email: body.email,
        password: body.password,
        email_confirm: true,
        user_metadata: { name: body.name }
      });
      if (error) throw error;
      const { error: profileError } = await adminClient.from('profiles').upsert({
        id: data.user.id,
        name: body.name,
        email: body.email,
        role: body.role === 'admin' ? 'admin' : 'teacher',
        active: body.active !== false
      });
      if (profileError) throw profileError;
      return json({ userId: data.user.id });
    }

    if (!body.userId) return json({ error: 'userId is required' }, 400);
    if (body.userId === user.id && body.action === 'delete') return json({ error: 'You cannot delete your own admin account' }, 400);

    if (body.action === 'password') {
      if (!body.password || body.password.length < 8) return json({ error: 'Password must be at least 8 characters' }, 400);
      const { error } = await adminClient.auth.admin.updateUserById(body.userId, { password: body.password });
      if (error) throw error;
      return json({ ok: true });
    }
    if (body.action === 'update') {
      const updates: Record<string, unknown> = {};
      if (typeof body.name === 'string' && body.name.trim()) updates.name = body.name.trim();
      if (body.role === 'admin' || body.role === 'teacher') updates.role = body.role;
      if (typeof body.active === 'boolean') updates.active = body.active;
      if (!Object.keys(updates).length) return json({ error: 'No valid updates provided' }, 400);
      const { error } = await adminClient.from('profiles').update(updates).eq('id', body.userId);
      if (error) throw error;
      return json({ ok: true });
    }
    if (body.action === 'delete') {
      const { error } = await adminClient.auth.admin.deleteUser(body.userId);
      if (error) throw error;
      return json({ ok: true });
    }
    return json({ error: 'Unsupported action' }, 400);
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : 'Unexpected error' }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
}
