import ReactECharts from 'echarts-for-react'
import { timelineData } from '../data/architectureData'

function buildRadarOption(selectedCase) {
  const values = selectedCase?.values || {
    structureComplexity: 0,
    culturalInfluence: 0,
    technologyInnovation: 0,
    preservation: 0,
  }

  return {
    tooltip: { trigger: 'item' },
    radar: {
      radius: '64%',
      splitNumber: 4,
      axisName: { color: '#e7dcbf' },
      splitLine: { lineStyle: { color: 'rgba(220, 187, 117, 0.18)' } },
      splitArea: { areaStyle: { color: ['rgba(255,255,255,0.02)'] } },
      indicator: [
        { name: '结构复杂度', max: 100 },
        { name: '文化影响力', max: 100 },
        { name: '技术创新性', max: 100 },
        { name: '保护完整度', max: 100 },
      ],
    },
    series: [
      {
        type: 'radar',
        data: [
          {
            value: [
              values.structureComplexity,
              values.culturalInfluence,
              values.technologyInnovation,
              values.preservation,
            ],
            areaStyle: { color: 'rgba(212, 182, 118, 0.38)' },
            lineStyle: { width: 2, color: '#f5d484' },
            symbolSize: 5,
            itemStyle: { color: '#f5d484' },
          },
        ],
      },
    ],
  }
}

function buildTimelineOption() {
  return {
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: timelineData.map((item) => item.period),
      axisLabel: { color: '#dbc899' },
      axisLine: { lineStyle: { color: 'rgba(219, 200, 153, 0.42)' } },
    },
    yAxis: {
      type: 'value',
      name: '技术成熟度',
      min: 0,
      max: 100,
      axisLabel: { color: '#dbc899' },
      splitLine: { lineStyle: { color: 'rgba(219, 200, 153, 0.16)' } },
    },
    series: [
      {
        data: timelineData.map((item) => item.score),
        type: 'line',
        smooth: true,
        symbol: 'circle',
        lineStyle: { width: 3, color: '#9bb8d3' },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(155, 184, 211, 0.55)' },
              { offset: 1, color: 'rgba(155, 184, 211, 0.06)' },
            ],
          },
        },
      },
    ],
  }
}

export function DashboardPanel({ selectedCase, allCases }) {
  const distributionOption = {
    tooltip: { trigger: 'item' },
    series: [
      {
        type: 'pie',
        radius: ['42%', '70%'],
        padAngle: 2,
        data: allCases.map((item) => ({
          value: item.values.culturalInfluence,
          name: item.label,
        })),
        label: { color: '#f2e6c7' },
      },
    ],
  }

  return (
    <div className="dashboard-grid">
      <div className="chart-card">
        <h3>{selectedCase?.name} · 指标雷达</h3>
        <ReactECharts option={buildRadarOption(selectedCase)} style={{ height: 280 }} />
      </div>
      <div className="chart-card">
        <h3>建筑演进时间趋势</h3>
        <ReactECharts option={buildTimelineOption()} style={{ height: 280 }} />
      </div>
      <div className="chart-card">
        <h3>四类建筑文化影响占比</h3>
        <ReactECharts option={distributionOption} style={{ height: 260 }} />
      </div>
    </div>
  )
}
