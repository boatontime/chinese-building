import { useMemo, useState } from 'react'
import { askArchitectureAI } from '../services/aiClient'

function MetricRow({ label, value }) {
  return (
    <div className="metric-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

export function KnowledgePanel({ selectedCase, allCases }) {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('试试提问：这类建筑如何体现中国古代工程智慧？')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const context = useMemo(
    () => ({
      selected: selectedCase,
      references: allCases.map((item) => ({
        label: item.label,
        structure: item.engineering.structure,
        period: item.period,
      })),
    }),
    [selectedCase, allCases],
  )

  const handleAsk = async (event) => {
    event.preventDefault()

    if (!question.trim()) {
      return
    }

    setLoading(true)
    setError('')

    try {
      const result = await askArchitectureAI(question.trim(), context)
      setAnswer(result.answer)
    } catch (err) {
      setError(err?.message || 'AI 服务调用失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="knowledge-layout">
      <article className="info-block">
        <h3>历史背景科普</h3>
        <p>{selectedCase?.story}</p>
      </article>

      <article className="info-block">
        <h3>技术参数分析</h3>
        <div className="metric-grid">
          <MetricRow label="结构体系" value={selectedCase?.engineering?.structure} />
          <MetricRow label="代表跨度" value={selectedCase?.engineering?.span} />
          <MetricRow label="抗震特征" value={selectedCase?.engineering?.seismicGrade} />
          <MetricRow label="气候适应" value={selectedCase?.engineering?.climate} />
        </div>
      </article>

      <article className="info-block ai-panel">
        <h3>AI 文化讲解</h3>
        <form className="ai-form" onSubmit={handleAsk}>
          <textarea
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="输入问题，例如：古代桥梁如何平衡力学稳定与洪水疏导？"
          />
          <button type="submit" disabled={loading}>
            {loading ? 'AI 思考中...' : '向 AI 提问'}
          </button>
        </form>

        <div className="ai-answer" role="status" aria-live="polite">
          {error ? <p className="error-text">{error}</p> : <p>{answer}</p>}
        </div>
      </article>
    </div>
  )
}
