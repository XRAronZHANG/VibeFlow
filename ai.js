/**
 * Netlify Function: /.netlify/functions/ai
 *
 * 作用：用你在 Netlify 环境变量里配置的 DeepSeek Key 代理调用，
 *      让访客无需 Key 也能使用 AI（前端只需 fetch 这个函数）。
 *
 * 必填环境变量：
 * - DEEPSEEK_API_KEY
 *
 * 可选环境变量：
 * - DEEPSEEK_BASE_URL (默认 https://api.deepseek.com)
 * - DEEPSEEK_MODEL    (默认 deepseek-v4-flash)
 */

const json = (statusCode, body, extraHeaders = {}) => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    // 公开接口（你选择的是公开）：允许跨域，方便嵌入/二次部署
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    ...extraHeaders,
  },
  body: JSON.stringify(body),
});

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return json(200, { ok: true });
  }

  if (event.httpMethod !== 'POST') {
    return json(405, { error: 'Method Not Allowed' }, { Allow: 'POST, OPTIONS' });
  }

  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    return json(500, { error: 'Missing DEEPSEEK_API_KEY in Netlify environment variables.' });
  }

  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch (e) {
    return json(400, { error: 'Invalid JSON body.' });
  }

  const messages = Array.isArray(payload.messages) ? payload.messages : null;
  if (!messages || messages.length === 0) {
    return json(400, { error: 'Missing messages[]' });
  }

  const temperature = Number.isFinite(Number(payload.temperature)) ? Number(payload.temperature) : 0.8;
  const max_tokens = Number.isFinite(Number(payload.max_tokens)) ? Number(payload.max_tokens) : 220;

  const baseUrl = (process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com').replace(/\/$/, '');
  const model = String(process.env.DEEPSEEK_MODEL || payload.model || 'deepseek-v4-flash');
  const url = `${baseUrl}/chat/completions`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        max_tokens,
      }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      return json(res.status, { error: `DeepSeek HTTP ${res.status}`, detail: text.slice(0, 800) });
    }

    const data = await res.json();
    const content = data?.choices?.[0]?.message?.content;
    if (!content) {
      return json(502, { error: 'Empty response from DeepSeek' });
    }

    // 前端使用 {content} 更轻量，避免暴露不必要字段
    return json(200, { content: String(content).trim() });
  } catch (e) {
    return json(500, { error: 'Proxy error', detail: String(e?.message || e) });
  }
};
