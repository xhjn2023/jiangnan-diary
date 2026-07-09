-- 江南 · 日记 —— Supabase 数据表与行级安全（RLS）策略
-- 在 Supabase 控制台 → SQL Editor 中粘贴执行本文件即可

create table if not exists public.diaries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date text not null,
  title text not null default '',
  content text not null default '',
  mood text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists diaries_user_id_idx on public.diaries(user_id);
create index if not exists diaries_date_idx on public.diaries(date desc);

alter table public.diaries enable row level security;

-- 仅本人可读
drop policy if exists "diaries_select_own" on public.diaries;
create policy "diaries_select_own" on public.diaries
  for select using (auth.uid() = user_id);

-- 仅本人可插入，且 user_id 必须为自己
drop policy if exists "diaries_insert_own" on public.diaries;
create policy "diaries_insert_own" on public.diaries
  for insert with check (auth.uid() = user_id);

-- 仅本人可更新
drop policy if exists "diaries_update_own" on public.diaries;
create policy "diaries_update_own" on public.diaries
  for update using (auth.uid() = user_id);

-- 仅本人可删除
drop policy if exists "diaries_delete_own" on public.diaries;
create policy "diaries_delete_own" on public.diaries
  for delete using (auth.uid() = user_id);
