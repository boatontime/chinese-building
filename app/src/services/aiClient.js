const AI_API_URL = import.meta.env.VITE_AI_API_URL

export async function askArchitectureAI(question, context) {
  if (!AI_API_URL) {
    return {
      answer:
        'AI 接口未配置。请在 .env 文件中设置 VITE_AI_API_URL，并将请求转发到你的 LLM 服务。',
      source: 'local-fallback',
    }
  }

  const response = await fetch(AI_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system:
        '你是中国古代建筑专家，请结合结构、礼制、工艺与文化语境回答，内容专业但易懂。',
      question,
      context,
    }),
  })

  if (!response.ok) {
    throw new Error(`AI 服务异常: ${response.status}`)
  }

  const data = await response.json()
  return {
    answer: data.answer || 'AI 未返回有效内容',
    source: data.source || 'remote-llm',
  }
}
