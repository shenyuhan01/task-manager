-- =====================================================
-- 智能任务管理系统 - tasks 表建表 SQL（新结构）
-- 执行位置：Supabase 控制台 → SQL Editor → New query → 粘贴 → Run
-- =====================================================

-- 1) 创建 tasks 表（id bigint 自增主键、completed 字段）
create table tasks (
  id bigint generated always as identity primary key,
  title text not null,
  priority text not null check (priority in ('高','中','低')),
  completed boolean default false,
  created_at timestamptz default now()
);

-- 2) 开启行级安全（RLS）
alter table tasks enable row level security;

-- 3) 允许匿名读写（课程/学习项目使用）
create policy "允许读写" on tasks for all using (true);
