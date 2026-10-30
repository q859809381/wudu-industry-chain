/**
 * 扣子（Coze）对话代理 —— Cloudflare Worker
 * ============================================================
 * 作用：把个人访问令牌（PAT）和 bot_id 保存在服务端环境变量里，
 *       前端页面只调用本代理，令牌不会暴露在静态站代码中。
 *
 * 部署步骤（免费，约 5 分钟）：
 * 1. 打开 https://dash.cloudflare.com → 注册/登录 → 左侧「Workers 和 Pages」→「创建」→「创建 Worker」→ 命名（如 coze-proxy）→「部署」。
 * 2. 点「编辑代码」，把本文件全部内容粘贴进去，替换默认代码，点「部署」。
 * 3. 部署详情页 →「设置」→「变量和机密」，添加三个变量（类型都选「机密/Secret」）：
 *      COZE_PAT   = 在扣子平台「个人设置 → API 授权 → 个人访问令牌」生成的令牌
 *      COZE_BOT_ID = 你要对接的智能体 ID（扣子平台发布页/URL 中可查）
 *      ALLOWED_ORIGIN = 本站地址，如 https://xxx.cloudstudio.workstations.dev（本地调试填 *）
 * 4. 回到 Worker 详情页，复制它的访问地址，前端填入 coze-chat.js 的 proxyUrl：
 *      https://coze-proxy.<你的子域>.workers.dev/api/coze/chat
 *
 * 说明：
 * - 前端请求体：{ userId, messages: [{ role: 'user'|'assistant', content }] }
 * - 代理转发到扣子 v3 Chat API（流式），SSE 原样透传给前端实现打字机效果。
 * ============================================================ */

const COZE_API = 'https://api.coze.cn/v3/chat';

const corsHeaders = (origin, allowed) => ({
  'Access-Control-Allow-Origin': allowed === '*' ? '*' : allowed,
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400'
});

export default {
  async fetch(request, env) {
    const allowed = env.ALLOWED_ORIGIN || '*';
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: corsHeaders(request.headers.get('Origin'), allowed) });
    if (request.method !== 'POST' || !new URL(request.url).pathname.endsWith('/api/coze/chat')) {
      return json({ error: 'Not Found' }, 404, allowed);
    }
    if (!env.COZE_PAT || !env.COZE_BOT_ID) return json({ error: 'Worker 缺少 COZE_PAT 或 COZE_BOT_ID 环境变量' }, 500, allowed);

    let body;
    try {
      body = await request.json();
    } catch (error) {
      return json({ error: '请求体必须是 JSON' }, 400, allowed);
    }
    const history = Array.isArray(body.messages)
      ? body.messages
          .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string' && m.content.trim())
          .slice(-12)
          .map((m) => ({ role: m.role, type: m.role === 'assistant' ? 'answer' : undefined, content: String(m.content).slice(0, 4000), content_type: 'text' }))
      : [];
    if (!history.length) return json({ error: 'messages 不能为空' }, 400, allowed);

    const cozeResponse = await fetch(COZE_API, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.COZE_PAT}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        bot_id: env.COZE_BOT_ID,
        user_id: String(body.userId || 'wudu-guest').slice(0, 64),
        stream: true,
        auto_save_history: false,
        additional_messages: history
      })
    });

    if (!cozeResponse.ok) {
      const detail = await cozeResponse.text().catch(() => '');
      return new Response(detail || 'Coze upstream error', { status: cozeResponse.status, headers: { 'Content-Type': 'text/plain; charset=utf-8', ...corsHeaders(request.headers.get('Origin'), allowed) } });
    }

    // SSE 原样透传，前端按 event 分帧解析
    return new Response(cozeResponse.body, {
      headers: {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
        ...corsHeaders(request.headers.get('Origin'), allowed)
      }
    });
  }
};

function json(data, status, allowed) {
  return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', ...corsHeaders('*', allowed) } });
}
