import React, { useEffect, useState } from 'react'
import api from '../api'
import CategoryBreakdown from '../components/CategoryBreakdown'
import { formatINR } from '../utils/format'

export default function Expenses() {
  const [expenses, setExpenses] = useState([])
  const [form, setForm] = useState({ title: '', amount: '', category: '', date: '' })

  const fetch = async () => {
    const res = await api.get('/api/expenses')
    setExpenses(res.data)
  }

  useEffect(() => { fetch() }, [])

  const submit = async (e) => {
    e.preventDefault()
    const { title, amount, category, date } = form
    if (!title || !amount) return
    await api.post('/api/expenses', { title, amount: Number(amount), category, date: date || new Date() })
    setForm({ title: '', amount: '', category: '', date: '' })
    fetch()
  }

  const remove = async (id) => {
    if (!confirm('Delete expense?')) return
    await api.delete(`/api/expenses/${id}`)
    fetch()
  }

  const total = expenses.reduce((s, e) => s + (Number(e.amount) || 0), 0)

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Expenses</h2>

      <form onSubmit={submit} className="card mb-4 grid grid-cols-1 md:grid-cols-4 gap-2">
        <input placeholder="Title" className="p-2 border rounded col-span-1 md:col-span-1" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
        <input placeholder="Amount" type="number" className="p-2 border rounded" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} />
        <input placeholder="Category" className="p-2 border rounded" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
        <div className="flex gap-2">
          <input type="date" className="p-2 border rounded" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
          <button className="btn-gradient flex items-center gap-2 hover:shadow-lg"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg> Add</button>
        </div>
      </form>

      <CategoryBreakdown expenses={expenses} />

      <div className="card">
        <h3 className="font-semibold mb-2">Total: {formatINR(total)}</h3>
        <ul className="space-y-2">
          {expenses.map(ex => (
            <li key={ex._id} className="flex justify-between items-center border-b py-2">
              <div>
                <div className="font-medium">{ex.title}</div>
                <div className="text-sm text-gray-500">{ex.category} • {new Date(ex.date).toLocaleDateString()}</div>
              </div>
              <div className="flex items-center gap-4">
                <div className="font-semibold">{formatINR(Number(ex.amount))}</div>
                <button className="text-red-500 hover:text-red-700" onClick={() => remove(ex._id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
