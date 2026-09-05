import { createClient } from '@supabase/supabase-js';

const rawUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

function getSupabaseUrl(value?: string): string | null {
  if (!value) return null;
  try {
    const parsed = new URL(value.trim());
    if (parsed.protocol !== 'https:' || !parsed.hostname.endsWith('.supabase.co')) return null;
    return parsed.origin;
  } catch {
    return null;
  }
}

export const supabaseUrl = getSupabaseUrl(rawUrl);
export const supabaseConfigError = rawUrl && !supabaseUrl
  ? 'رابط Supabase غير صالح. يجب أن تكون VITE_SUPABASE_URL بالشكل https://PROJECT_REF.supabase.co من دون مسار إضافي.'
  : !rawUrl || !key
    ? 'إعدادات Supabase غير مكتملة. تحقّق من VITE_SUPABASE_URL وVITE_SUPABASE_ANON_KEY ثم أعد بناء الموقع.'
    : null;

export const demoMode = !rawUrl || !key;
export const supabase = supabaseConfigError ? null : createClient(supabaseUrl!, key!);
