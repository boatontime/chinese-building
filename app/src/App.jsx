import { useMemo, useState } from 'react'
import { DashboardPanel } from './components/DashboardPanel'
import { KnowledgePanel } from './components/KnowledgePanel'
import { ModelViewer } from './components/ModelViewer'
import { architectureCases } from './data/architectureData'

function App() {
  const [activeCaseId, setActiveCaseId] = useState(architectureCases[0].id)
  const activeCase = useMemo(
    () => architectureCases.find((item) => item.id === activeCaseId),
    [activeCaseId],
  )

  return (
    <div className="app-shell">
      <header className="hero-header">
        <p className="hero-kicker">2026 全国大学生计算机程序设计大赛 · AI + 信息可视化</p>
        <h1>中国古代建筑成就数字图谱</h1>
        <p className="hero-subtitle">
          以“民居、官府、皇宫、桥梁”为核心对象，结合三维模型、时空数据看板与 AI
          讲解，展示 1911 年以前中国古建筑的科学智慧与文化制度。
        </p>
      </header>

      <main className="content-grid">
        <section className="card model-card">
          <div className="card-head">
            <h2>古建数字孪生模型</h2>
            <div className="chip-row" role="tablist" aria-label="建筑类型选择">
              {architectureCases.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`chip ${item.id === activeCaseId ? 'active' : ''}`}
                  onClick={() => setActiveCaseId(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          <ModelViewer selectedCase={activeCase} />
        </section>

        <section className="card dashboard-card">
          <h2>建筑成就数据看板</h2>
          <DashboardPanel selectedCase={activeCase} allCases={architectureCases} />
        </section>

        <section className="card knowledge-card">
          <h2>历史背景与技术参数</h2>
          <KnowledgePanel selectedCase={activeCase} allCases={architectureCases} />
        </section>
      </main>
    </div>
  )
}

export default App
