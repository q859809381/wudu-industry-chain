/* ===================== 扣子（Coze）对话接入 =====================
 * 通过自建 Cloudflare Worker 代理调用扣子 v3 Chat API（流式 SSE）。
 * 个人访问令牌与 bot_id 保存在 Worker 环境变量中，前端只持有代理地址。
 * 使用前：部署 coze-proxy-worker.js 后，把代理地址填到下方 proxyUrl。
 * 代理地址留空时，页面自动回落到内置的规则回答，不影响演示。
 * ================================================================ */
const COZE_CHAT_CONFIG = {
  // 扣子代理服务地址（已部署，含访问码）
  proxyUrl: 'https://coze-chat-proxy.app.workbuddy.host/api/coze/chat?sharecode=3WNLD3VJIJ',
  // 智能体 ID（扣子平台智能体 URL 中 bot/ 后的数字）
  botId: '7701891157701787699'
};

// 同一会话沿用同一 userId，便于扣子侧关联
function cozeUserId() {
  try {
    let id = localStorage.getItem('wudu-coze-user');
    if (!id) {
      id = `wudu-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
      localStorage.setItem('wudu-coze-user', id);
    }
    return id;
  } catch (error) {
    return 'wudu-guest';
  }
}

function cozeConfigured() {
  return /^https?:\/\//.test(COZE_CHAT_CONFIG.proxyUrl);
}

// 与应用内 escapeHtml 等价（coze-chat.js 先于 app.js 加载时仍可用）
function cozeEscape(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// 简易 Markdown 加粗 / 换行渲染，避免 AI 回复中的 ** 符号裸露
function cozeFormat(text) {
  const safe = cozeEscape(text);
  return safe
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/^###?\s*([^<\n]+)$/gm, '<strong>$1</strong>')
    .replace(/\n/g, '<br>');
}

/**
 * 流式调用扣子对话。
 * @param {Array<{role:'user'|'assistant', content:string}>} messages 会话历史（含本次提问）
 * @param {{onDelta?:(fullText:string)=>void, onThink?:(fullThink:string)=>void, signal?:AbortSignal}} handlers
 * @param {string} [conversationId] 扣子会话 ID（续接同一会话，与扣子 UI 内多轮体验一致）
 * @returns {Promise<{text:string, conversationId:string}>} 完整回复文本与扣子会话 ID
 */
async function cozeStreamChat(messages, handlers = {}, conversationId = '') {
  if (!cozeConfigured()) throw new Error('未配置扣子代理地址');
  const response = await fetch(COZE_CHAT_CONFIG.proxyUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId: cozeUserId(),
      botId: COZE_CHAT_CONFIG.botId,
      ...(conversationId ? { conversationId } : {}),
      // 续接会话时只发最新一条（历史已在扣子侧）；首轮带最近 12 条上下文
      messages: (conversationId ? messages.slice(-1) : messages.slice(-12)).map(({ role, content }) => ({ role, content }))
    }),
    signal: handlers.signal
  });
  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    throw new Error(`代理响应异常 ${response.status}${detail ? `：${detail.slice(0, 120)}` : ''}`);
  }
  if (!response.body) throw new Error('当前浏览器不支持流式响应');

  const reader = response.body.getReader();
  const decoder = new TextDecoder('utf-8');
  let buffer = '';
  let fullText = '';
  let thinkText = '';
  let convId = conversationId || '';

  const handleEvent = (event, data) => {
    // 任意事件携带 conversation_id 时捕获（chat.created 必带），用于后续续接同一会话
    if (data?.conversation_id && !convId) convId = data.conversation_id;
    if (event === 'conversation.chat.failed') throw new Error(data?.last_error?.msg || '扣子对话失败');
    if (data?.type !== 'answer') return;
    if (event === 'conversation.message.delta') {
      // 正式回答增量；深度思考模型的 reasoning_content 是逐 token 增量，需累积后上屏
      if (data.content) {
        fullText += data.content;
        handlers.onDelta?.(fullText);
      } else if (data.reasoning_content) {
        thinkText += data.reasoning_content;
        handlers.onThink?.(thinkText);
      }
    } else if (event === 'conversation.message.completed' && data.content && !fullText) {
      // 深度思考模型：正式答案一次性在 completed 事件到达
      fullText = data.content;
      handlers.onDelta?.(fullText);
    }
  };

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    let sep;
    while ((sep = buffer.indexOf('\n\n')) >= 0) {
      const rawEvent = buffer.slice(0, sep);
      buffer = buffer.slice(sep + 2);
      let event = 'message';
      const dataLines = [];
      rawEvent.split('\n').forEach((line) => {
        if (line.startsWith('event:')) event = line.slice(6).trim();
        else if (line.startsWith('data:')) dataLines.push(line.slice(5).trim());
      });
      const payload = dataLines.join('');
      if (!payload || payload === '[DONE]') continue;
      let data;
      try {
        data = JSON.parse(payload);
      } catch (error) {
        continue;
      }
      if (data.code && data.code !== 0) throw new Error(data.msg || `扣子返回错误 ${data.code}`);
      handleEvent(event, data);
    }
  }
  if (!fullText.trim()) throw new Error('扣子未返回有效内容');
  return { text: fullText, conversationId: convId };
}

window.CozeChat = { config: COZE_CHAT_CONFIG, configured: cozeConfigured, stream: cozeStreamChat, format: cozeFormat };
