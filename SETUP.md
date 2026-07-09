# 江南 · 日记 — 部署与配置记录

## 1. GitHub 仓库

| 项目 | 地址 |
|------|------|
| 远程仓库 | `git@github.com:xhjn2023/jiangnan-diary.git` |
| 公开访问 | https://github.com/xhjn2023/jiangnan-diary |
| 推送方式 | SSH（已配置密钥，沙盒走 443 端口） |

本地推送：
```bash
git push origin main
```

---

## 2. SSH 配置

沙盒环境（用于从当前终端推送代码）：

| 文件 | 作用 |
|------|------|
| `~/.ssh/id_ed25519` | 私钥（已配置） |
| `~/.ssh/config` | 配置 github.com 走 443 端口绕过防火墙 |

配置文件内容（已有的不用重复写）：
```
Host github.com
  Hostname ssh.github.com
  Port 443
```

验证连接：
```bash
ssh -T git@github.com
# 预期输出: Hi xhjn2023! You've successfully authenticated...
```

在自己电脑上使用则不需要上述配置，标准 SSH 即可。

---

## 3. Vercel 部署

| 项目 | 地址 |
|------|------|
| 项目名称 | `jiangnan-diary` |
| Dashboard | https://vercel.com/xhjn2023s-projects/jiangnan-diary |
| 生产域名 | https://jiangnan-diary.vercel.app |
| GitHub 集成 | 已关联，推送 `main` 分支自动触发部署 |

### 部署配置（`vercel.json`）

```json
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install"
}
```

### 环境变量（Vercel 控制台 Setting → Environment Variables 已设置）

| 变量名 | 来源 |
|--------|------|
| `VITE_SUPABASE_URL` | Supabase 项目控制台 → Project Settings → API → Project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase → Project Settings → API → anon public key |

> 注意：Vite 的环境变量以 `VITE_` 开头，构建时会被静态替换到代码中。部署后若修改环境变量，需在 Vercel 触发一次 Redeploy。

---

## 4. Supabase 数据库

| 项目 | 值 |
|------|------|
| 项目引用 ID | `cszkekdciqgimsvfgons` |
| 区域 | `us-east-1` |
| 连接池 (Pooler) | `aws-0-us-east-1.pooler.supabase.com:6543` |
| 数据库密码 | （创建项目时设置，已配置） |

### 连接字符串（Session 模式）

```
postgresql://postgres.cszkekdciqgimsvfgons:<DB_PASSWORD>@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

### 建表 SQL（`supabase/schema.sql`）

数据库 `public.diaries` 表结构：

```sql
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
```

索引：
```sql
create index if not exists diaries_user_id_idx on public.diaries(user_id);
create index if not exists diaries_date_idx on public.diaries(date desc);
```

行级安全策略（已启用）：
```sql
alter table public.diaries enable row level security;

create policy diaries_select_own on public.diaries for select using (auth.uid() = user_id);
create policy diaries_insert_own on public.diaries for insert with check (auth.uid() = user_id);
create policy diaries_update_own on public.diaries for update using (auth.uid() = user_id);
create policy diaries_delete_own on public.diaries for delete using (auth.uid() = user_id);
```

> 如果后续要在新环境中重建，在 Supabase SQL Editor 执行 `supabase/schema.sql` 即可。

### Auth 设置

Supabase 默认开启**邮箱确认**。如需关闭（开发期方便测试）：
Supabase Dashboard → Authentication → Providers → Email → 关闭 **Confirm email**。

---

## 5. 本地开发

```bash
# 克隆
git clone git@github.com:xhjn2023/jiangnan-diary.git
cd jiangnan-diary

# 配置环境变量
cp .env.example .env
# 编辑 .env，填入 Supabase URL 和 ANON KEY

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览构建产物
npm run preview
```

未配置 `.env` 时应用自动进入**本地回退模式**（数据存浏览器 localStorage、无需登录），适合先体验界面。

---

## 6. 技术栈

- **前端框架**: React 18 + Vite 5
- **后端**: Supabase（认证 + PostgreSQL 数据库）
- **部署**: Vercel（静态站点自动部署）
- **样式**: 纯 CSS（江南水乡风格）

## 7. 项目文件结构

```
/
├── index.html              # Vite 入口
├── package.json            # 项目配置与依赖
├── vite.config.js          # Vite 构建配置
├── vercel.json             # Vercel 部署配置
├── .env.example            # 环境变量模板
├── supabase/
│   └── schema.sql          # 数据库建表 + RLS
├── src/
│   ├── main.jsx            # React 入口
│   ├── App.jsx             # 应用主组件（路由/会话）
│   ├── index.css           # 全局样式
│   ├── lib/
│   │   ├── supabase.js     # Supabase 客户端
│   │   └── diaryStore.js   # 数据层（Supabase ↔ localStorage 回退）
│   ├── context/
│   │   └── SessionContext.jsx  # 认证会话管理
│   └── components/
│       ├── AuthView.jsx    # 登录/注册
│       ├── Header.jsx      # 顶栏（模式徽章/登出）
│       ├── Composer.jsx    # 写日记表单
│       └── DiaryList.jsx   # 日记列表
└── dist/                   # 构建产物（Vercel 部署用，不入 Git）
```
