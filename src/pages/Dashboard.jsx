import React, { useEffect, useState } from 'react'
import api from '../api'
import CategoryBreakdown from '../components/CategoryBreakdown'
import { formatINR } from '../utils/format'
// Framer Motion for smooth transitions (install if needed):
// npm install framer-motion
import { motion } from 'framer-motion'
// icons (lucide-react)
import * as Icons from 'lucide-react'

export default function Dashboard() {
  const [pendingTasks, setPendingTasks] = useState(0)
  const [monthlyTotal, setMonthlyTotal] = useState(0)
  const [expenses, setExpenses] = useState([])

  useEffect(() => {
    const load = async () => {
      try {
        const tasksRes = await api.get('/api/tasks')
        const pending = tasksRes.data.filter(t => !t.completed).length
        setPendingTasks(pending)

        const summaryRes = await api.get('/api/expenses/summary/month')
        setMonthlyTotal(summaryRes.data.total || 0)

        const exRes = await api.get('/api/expenses')
        setExpenses(exRes.data)
      } catch (err) {
        console.error(err)
      }
    }
    load()
  }, [])

  const cardData = [
    { id: 1, title: 'Manage Tasks', desc: 'Add, edit, and complete tasks', iconName: 'CheckSquare', color: 'from-indigo-500 to-pink-500' },
    { id: 2, title: 'Track Expenses', desc: 'View spending summaries', iconName: 'DollarSign', color: 'from-emerald-400 to-teal-500' },
    { id: 3, title: 'Analyze Categories', desc: 'See category breakdowns', iconName: 'ChartPie', color: 'from-yellow-400 to-orange-500' },
    { id: 4, title: 'Stay Organized', desc: 'Dashboard overview', iconName: 'CalendarCheck', color: 'from-sky-400 to-indigo-500' }
  ]

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-8">
      <div className="w-full max-w-5xl">
        <div className="text-center mb-8">
          <h1 className="text-6xl md:text-7xl font-extrabold leading-tight nav-gradient-text drop-shadow-lg">TaskNTrack</h1>
          <p className="mt-3 text-gray-700">Manage tasks, track expenses, and analyze your spending — all in one place.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {cardData.map(card => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.35 }}
              className={`rounded-xl shadow-lg overflow-hidden transform-gpu bg-gradient-to-r ${card.color} p-5`}
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-white/20 backdrop-blur-sm">
                  {(() => {
                    const IconComp = Icons[card.iconName] || Icons[card.iconName + '2'] || (() => <span className="text-white text-xl">✓</span>)
                    return <IconComp size={28} className="text-white" />
                  })()}
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg">{card.title}</h3>
                  <p className="text-white/90 text-sm mt-1">{card.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div className="card md:col-span-1" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="text-sm muted">Pending Tasks</div>
            <div className="text-3xl font-bold mt-2">{pendingTasks}</div>
          </motion.div>

          <motion.div className="card md:col-span-2" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <div className="flex items-center gap-3 mb-2">
              {Icons.ChartPie ? <Icons.ChartPie size={20} className="text-sky-500" /> : <span className="text-sky-500">📊</span>}
              <h3 className="font-semibold">This Month's Spending</h3>
            </div>
            <div className="text-2xl font-bold mb-2">{formatINR(monthlyTotal)}</div>
            <div className="w-full">
              <CategoryBreakdown expenses={expenses} />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
