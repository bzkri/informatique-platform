import type { SupabaseClient } from '@supabase/supabase-js';
import type { Domain, Teacher, Unit } from './types';

export async function loadCurriculum(client: SupabaseClient) {
  const [domainsResult, unitsResult] = await Promise.all([
    client.from('domains').select('*').order('year').order('term').order('name'),
    client.from('units').select('*').order('name')
  ]);
  if (domainsResult.error) throw domainsResult.error;
  if (unitsResult.error) throw unitsResult.error;
  return {
    domains: (domainsResult.data ?? []).map((row) => ({
      id: row.id,
      name: row.name,
      year: row.year,
      branch: row.branch,
      term: row.term,
      teacherId: row.teacher_id ?? undefined
    } satisfies Domain)),
    units: (unitsResult.data ?? []).map((row) => ({
      id: row.id,
      domainId: row.domain_id,
      name: row.name,
      teacherId: row.teacher_id ?? undefined
    } satisfies Unit))
  };
}

export async function loadTeachers(client: SupabaseClient) {
  const { data, error } = await client.from('profiles').select('id,name,role,active,email').order('name');
  if (error) throw error;
  return (data ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    email: row.email ?? '',
    role: row.role,
    active: row.active
  } satisfies Teacher));
}

export async function invokeAdminUserAction(
  client: SupabaseClient,
  payload: { action: 'create' | 'delete' | 'password'; userId?: string; email?: string; password?: string; name?: string; role?: Teacher['role']; active?: boolean }
) {
  const { data, error } = await client.functions.invoke('admin-users', { body: payload });
  if (error) throw error;
  if (data?.error) throw new Error(data.error);
  return data;
}
