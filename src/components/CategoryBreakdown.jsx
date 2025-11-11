// If the packages aren't installed run:
// npm install react-chartjs-2 chart.js

import React, { useMemo } from 'react'
import { Pie } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title as ChartTitle
} from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend, ChartTitle)

export default function CategoryBreakdown({ expenses = [] }) {
  // Aggregate amounts by category
  const map = useMemo(() => {
    return expenses.reduce((acc, e) => {
      const cat = e.category || 'Other'
      acc[cat] = (acc[cat] || 0) + (Number(e.amount) || 0)
      return acc
    }, {})
  }, [expenses])

  const entries = useMemo(() => Object.entries(map).sort((a, b) => b[1] - a[1]), [map])

  if (entries.length === 0) return null

  const total = entries.reduce((s, [, v]) => s + v, 0)

  // Prepare chart data
  const labels = entries.map(([cat]) => cat)
  const dataValues = entries.map(([_, amt]) => amt)

  // Color palette (extendable)
  const palette = [
    '#4F46E5', // indigo
    '#06B6D4', // teal
    '#F59E0B', // amber
    '#EF4444', // red
    '#10B981', // green
    '#8B5CF6', // purple
    '#F97316', // orange
    '#3B82F6', // blue
    '#E11D48', // rose
    '#06B6D4'
  ]

  const backgroundColor = labels.map((_, i) => palette[i % palette.length])

  const chartData = {
    labels,
    datasets: [
      {
        data: dataValues,
        backgroundColor,
        hoverOffset: 8
      }
    ]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom'
      },
      title: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || ''
            const value = context.raw || 0
            const pct = total ? ((value / total) * 100).toFixed(1) : '0.0'
            // format INR
            const formatted = Number(value).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })
            return `${label}: ${formatted} (${pct}%)`
          }
        }
      }
    }
  }

  return (
    <div className="bg-white p-4 rounded shadow mb-4">
      <h4 className="font-semibold mb-4">Spending by Category</h4>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
        <div className="w-full h-64 md:h-80">
          <Pie data={chartData} options={options} />
        </div>

        <div className="space-y-2">
          {entries.map(([cat, amt]) => (
            <div key={cat} className="flex justify-between items-center">
              <div className="text-sm text-gray-700">{cat}</div>
              <div className="text-sm font-medium">{Number(amt).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })} <span className="text-xs text-gray-400">({total ? ((amt / total) * 100).toFixed(0) : 0}%)</span></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
