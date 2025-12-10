import { useState, useEffect, useRef } from 'react'
import './Dashboard.css'

interface Metric {
  id: string
  label: string
  value: number
  trend: number
}

const Dashboard = () => {
  const [metrics, setMetrics] = useState<Metric[]>([])
  const [selectedTimeRange, setSelectedTimeRange] = useState<'day' | 'week' | 'month'>('week')
  const [chartData, setChartData] = useState<number[]>([])
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const resizeObserverRef = useRef<ResizeObserver | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const generateMetrics = () => {
    return [
      { id: '1', label: 'Total Users', value: Math.floor(Math.random() * 10000) + 5000, trend: Math.random() * 20 - 10 },
      { id: '2', label: 'Revenue', value: Math.floor(Math.random() * 50000) + 20000, trend: Math.random() * 15 - 5 },
      { id: '3', label: 'Active Sessions', value: Math.floor(Math.random() * 5000) + 1000, trend: Math.random() * 25 - 10 },
      { id: '4', label: 'Conversion Rate', value: Math.random() * 10 + 2, trend: Math.random() * 5 - 2 }
    ]
  }

  const generateChartData = () => {
    const points = selectedTimeRange === 'day' ? 24 : selectedTimeRange === 'week' ? 7 : 30
    return Array.from({ length: points }, () => Math.floor(Math.random() * 100) + 50)
  }

  useEffect(() => {
    setMetrics(generateMetrics())
    setChartData(generateChartData())
  }, [selectedTimeRange])

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setMetrics(generateMetrics())
      setChartData(generateChartData())
    }, 5000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [selectedTimeRange])

  useEffect(() => {
    if (containerRef.current) {
      const handleResize = () => {
        setChartData(generateChartData())
      }

      resizeObserverRef.current = new ResizeObserver(handleResize)
      resizeObserverRef.current.observe(containerRef.current)

      window.addEventListener('resize', handleResize)

      return () => {
        if (resizeObserverRef.current) {
          resizeObserverRef.current.disconnect()
        }
        window.removeEventListener('resize', handleResize)
      }
    }
  }, [selectedTimeRange])

  const maxValue = chartData.length > 0 ? Math.max(...chartData, 100) : 100
  const chartHeight = 200

  return (
    <div className="dashboard-container" ref={containerRef}>
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <div className="time-range-selector">
          <button
            onClick={() => setSelectedTimeRange('day')}
            className={selectedTimeRange === 'day' ? 'active' : ''}
          >
            Day
          </button>
          <button
            onClick={() => setSelectedTimeRange('week')}
            className={selectedTimeRange === 'week' ? 'active' : ''}
          >
            Week
          </button>
          <button
            onClick={() => setSelectedTimeRange('month')}
            className={selectedTimeRange === 'month' ? 'active' : ''}
          >
            Month
          </button>
        </div>
      </div>

      <div className="metrics-grid">
        {metrics.map(metric => (
          <div key={metric.id} className="metric-card">
            <div className="metric-label">{metric.label}</div>
            <div className="metric-value">
              {metric.label === 'Conversion Rate' 
                ? metric.value.toFixed(2) + '%'
                : typeof metric.value === 'number' && metric.value % 1 !== 0
                ? metric.value.toFixed(2)
                : metric.value.toLocaleString()}
            </div>
            <div className={`metric-trend ${metric.trend >= 0 ? 'positive' : 'negative'}`}>
              {metric.trend >= 0 ? '↑' : '↓'} {Math.abs(metric.trend).toFixed(1)}%
            </div>
          </div>
        ))}
      </div>

      <div className="chart-container">
        <h2>Activity Chart</h2>
        <div className="chart">
          <svg width="100%" height={chartHeight} viewBox={`0 0 ${chartData.length * 40} ${chartHeight}`}>
            <polyline
              points={chartData.map((value, index) => 
                `${index * 40},${chartHeight - (value / maxValue) * (chartHeight - 40)}`
              ).join(' ')}
              fill="none"
              stroke="#3498db"
              strokeWidth="2"
            />
            {chartData.map((value, index) => (
              <circle
                key={index}
                cx={index * 40}
                cy={chartHeight - (value / maxValue) * (chartHeight - 40)}
                r="4"
                fill="#3498db"
              />
            ))}
          </svg>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

