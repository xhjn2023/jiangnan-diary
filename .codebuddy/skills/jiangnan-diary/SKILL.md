---
name: jiangnan-diary
description: 江南·日记项目 — GitHub / Vercel / Supabase 部署与运维技能
---

# 江南·日记 Project Skill

React + Vite + Supabase Auth + Vercel 部署的日记应用。

## 🗄️ 仓库

- **远程**: `git@github.com:xhjn2023/jiangnan-diary.git`
- **本地**: `/workspace`
- **推送**: `git push origin main` → Vercel 自动部署

## 🌐 生产环境

- **Vercel Dashboard**: https://vercel.com/xhjn2023s-projects/jiangnan-diary
- **生产域名**: https://jiangnan-diary.vercel.app
- **自动部署**: 推送 `main` 分支即触发

### Vercel 环境变量

| 变量 | 来源 |
|------|------|
| `VITE_SUPABASE_URL` | Supabase → Settings → API → Project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase → Settings → API → anon public key |

修改后需在 Vercel Dashboard 触发 Redeploy。

## 🔐 SSH

沙盒环境使用 443 端口绕过防火墙（`~/.ssh/config` 已配置）。

```bash
# 验证
ssh -T git@github.com
```

## 🗃️ Supabase

- **项目 ID**: `cszkekdciqgimsvfgons`
- **区域**: `us-east-1`
- **Pooler**: `aws-0-us-east-1.pooler.supabase.com:6543`

### 数据库直连

```bash
PGPASSWORD="<DB_PASSWORD>" psql \
  -h aws-0-us-east-1.pooler.supabase.com \
  -U postgres.cszkekdciqgimsvfgons \
  -d postgres -p 6543
```

### 常用 SQL

**建表**（如果新环境需重建）：
执行 `supabase/schema.sql`。

**检查数据**：
```sql
select id, user_id, date, title, mood, created_at
from public.diaries order by created_at desc limit 10;
```

**用户数统计**：
```sql
select count(distinct user_id) as user_count from public.diaries;
```

## 🧑‍💻 本地开发

```bash
cp .env.example .env   # 填入 Supabase URL + ANON KEY
npm install
npm run dev            # 开发 → http://localhost:5173
npm run build          # 构建 → dist/
npm run preview        # 预览构建产物
```

未配 `.env` 时自动进入**本地回退模式**（localStorage，免登录）。

## 📦 触发重部署

在 Vercel Dashboard 手动 Redeploy，或者在沙盒执行：

```bash
npx vercel --token "<VERCEL_TOKEN>" --prod --yes
```

## 🏗️ 项目文件结构

```
index.html, package.json, vite.config.js, vercel.json
src/ → main.jsx, App.jsx, index.css
src/lib/ → supabase.js, diaryStore.js
src/context/ → SessionContext.jsx
src/components/ → AuthView, Header, Composer, DiaryList
supabase/schema.sql
SETUP.md   ← 完整部署记录文档
```
