const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');

const app = express();
const PORT = 3000;

// ============ Supabase 连接配置（Settings→API） ============
const SUPABASE_URL = process.env.SUPABASE_URL || "https://ctxdyaceigqqmbewblgu.supabase.co";
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || "sb_publishable_Vyr1pyiMkd5u48M2SFj1Fg_gh4BdhL8";
// ========================================================

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 获取任务，支持优先级筛选（按创建时间倒序）
app.get('/api/tasks', async (req, res) => {
  const filter = req.query.filter || '全部';
  let query = supabase.from('tasks').select('*').order('created_at', { ascending: false });
  if (filter !== '全部') {
    query = query.eq('priority', filter);
  }
  const { data, error } = await query;
  res.json({ data, error });
});

// 添加任务
app.post('/api/tasks', async (req, res) => {
  const { title, priority } = req.body;
  const { data, error } = await supabase
    .from('tasks')
    .insert([{ title, priority, completed: false }])
    .select();
  res.json({ data, error });
});

// 切换完成状态
app.patch('/api/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;
  const { data, error } = await supabase
    .from('tasks')
    .update({ completed })
    .eq('id', id)
    .select();
  res.json({ data, error });
});

// 删除任务
app.delete('/api/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('tasks').delete().eq('id', id);
  res.json({ error });
});

app.listen(PORT, () => {
  console.log(`服务启动：http://localhost:${PORT}`);
});
