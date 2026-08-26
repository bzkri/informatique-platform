-- إصلاح حسابات الأساتذة التي أُنشئت قبل trigger الخاص بإنشاء profiles
-- نفّذ هذا الملف مرة واحدة في Supabase SQL Editor
insert into public.profiles (id, name, role, active)
select
  u.id,
  coalesce(nullif(u.raw_user_meta_data->>'name',''), u.email, 'أستاذ'),
  'teacher'::public.app_role,
  true
from auth.users u
where not exists (select 1 from public.profiles p where p.id = u.id);

-- اجعل حسابك الأول أدمن. استبدل البريد أدناه ببريد حساب الأستاذ الإداري ثم نفّذ السطر.
-- update public.profiles set role='admin', active=true where id=(select id from auth.users where email='YOUR_EMAIL@example.com');
