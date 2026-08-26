-- ترقية المحتوى: نفّذ هذا الملف مرة واحدة في Supabase SQL Editor
alter table public.resources add column if not exists view_url text;
alter table public.resources add column if not exists pdf_url text;
alter table public.resources add column if not exists ppt_url text;
alter table public.resources add column if not exists doc_url text;
alter table public.resources add column if not exists icon text not null default 'book' check (icon in ('globe','code','message','mail','book'));

create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('تطبيق','واجب','تصحيح واجب')),
  title text not null,
  description text not null default '',
  url text,
  year smallint check (year between 1 and 3),
  branch text,
  term smallint check (term between 1 and 3),
  teacher text,
  teacher_id uuid references public.profiles(id),
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.announcements enable row level security;
drop policy if exists "الإعلانات المنشورة عامة" on public.announcements;
drop policy if exists "الأساتذة يديرون إعلاناتهم" on public.announcements;
create policy "الإعلانات المنشورة عامة" on public.announcements for select using (published or teacher_id=auth.uid() or public.is_admin());
create policy "الأساتذة يديرون إعلاناتهم" on public.announcements for all to authenticated using (teacher_id=auth.uid() or public.is_admin()) with check (teacher_id=auth.uid() or public.is_admin());

insert into public.announcements(type,title,description,year,branch,term,teacher,published)
select 'واجب','واجب تقنيات الويب','أنشئ صفحة ويب بسيطة تتضمن عنوانًا وفقرة ورابطًا.',1,'جذع مشترك علوم وتكنولوجيا',1,'الأستاذ محمد',true
where not exists (select 1 from public.announcements where title='واجب تقنيات الويب');
