-- Curriculum and secure teacher-management upgrade. Run once in Supabase SQL Editor.

alter table public.profiles add column if not exists email text;

update public.profiles p
set email = u.email
from auth.users u
where u.id = p.id and p.email is distinct from u.email;

create unique index if not exists profiles_email_unique
  on public.profiles (lower(email)) where email is not null;
create unique index if not exists domains_scope_name_unique
  on public.domains (year, branch, term, lower(name));
create unique index if not exists units_domain_name_unique
  on public.units (domain_id, lower(name));

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path=public
as $$
begin
  insert into public.profiles(id,name,email)
  values(new.id,coalesce(nullif(new.raw_user_meta_data->>'name',''),new.email,'أستاذ'),new.email)
  on conflict(id) do update set email=excluded.email;
  return new;
end;
$$;

create or replace function public.is_active_teacher()
returns boolean
language sql
stable
security definer
set search_path=public
as $$
  select exists(select 1 from public.profiles where id=auth.uid() and active and role in ('admin','teacher'));
$$;

alter table public.profiles enable row level security;
alter table public.domains enable row level security;
alter table public.units enable row level security;

drop policy if exists "قراءة الملفات الشخصية للمسجلين" on public.profiles;
drop policy if exists "الأدمن يدير الأساتذة" on public.profiles;
drop policy if exists "المستخدم يقرأ ملفه" on public.profiles;
drop policy if exists "الأدمن يقرأ الأساتذة" on public.profiles;
drop policy if exists "المستخدم يعدل اسمه" on public.profiles;
drop policy if exists "الأدمن يدير الملفات" on public.profiles;
create policy "المستخدم يقرأ ملفه" on public.profiles for select to authenticated using(id=auth.uid());
create policy "الأدمن يقرأ الأساتذة" on public.profiles for select to authenticated using(public.is_admin());
create policy "المستخدم يعدل اسمه" on public.profiles for update to authenticated
  using(id=auth.uid()) with check(id=auth.uid());
create policy "الأدمن يدير الملفات" on public.profiles for all to authenticated
  using(public.is_admin()) with check(public.is_admin());

-- Prevent a non-admin from changing protected profile fields even if a client sends them.
create or replace function public.protect_profile_fields()
returns trigger
language plpgsql
security definer
set search_path=public
as $$
begin
  if auth.uid()=old.id and not public.is_admin() then
    new.role := old.role;
    new.active := old.active;
    new.email := old.email;
  end if;
  return new;
end;
$$;
drop trigger if exists protect_profile_fields_trigger on public.profiles;
create trigger protect_profile_fields_trigger before update on public.profiles
for each row execute function public.protect_profile_fields();

drop policy if exists "الأساتذة يديرون مجالاتهم" on public.domains;
drop policy if exists "الأساتذة يديرون وحداتهم" on public.units;
create policy "الأساتذة يديرون مجالاتهم" on public.domains for all to authenticated
  using(public.is_active_teacher() and (teacher_id=auth.uid() or public.is_admin()))
  with check(public.is_active_teacher() and (teacher_id=auth.uid() or public.is_admin()));
create policy "الأساتذة يديرون وحداتهم" on public.units for all to authenticated
  using(public.is_active_teacher() and (teacher_id=auth.uid() or public.is_admin()))
  with check(public.is_active_teacher() and (teacher_id=auth.uid() or public.is_admin()));

-- Seed curriculum rows from existing lessons without duplicating scoped names.
insert into public.domains(name,year,branch,term,teacher_id)
select distinct r.domain,r.year,r.branch,r.term,r.teacher_id
from public.resources r
where nullif(trim(r.domain),'') is not null
on conflict do nothing;

insert into public.units(domain_id,name,teacher_id)
select distinct d.id,r.unit,r.teacher_id
from public.resources r
join public.domains d on d.name=r.domain and d.year=r.year and d.branch=r.branch and d.term=r.term
where nullif(trim(r.unit),'') is not null
on conflict do nothing;
