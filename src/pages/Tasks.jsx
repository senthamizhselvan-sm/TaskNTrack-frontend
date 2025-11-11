import React, { useEffect, useState } from 'react'
import api from '../api'
import EditTaskModal from '../components/EditTaskModal'
// If not installed run:
// npm install react-hot-toast lucide-react
import toast from 'react-hot-toast'
import { Plus, Edit2, Trash2 } from 'lucide-react'

export default function Tasks() {
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState('')
  const [editing, setEditing] = useState(null)

  const fetchTasks = async () => {
    const res = await api.get('/api/tasks')
    setTasks(res.data)
  }

  useEffect(() => { fetchTasks() }, [])

  const addTask = async (e) => {
    e.preventDefault()
    if (!title.trim()) {
      toast.error('Please enter a task title')
      return
    }
    try {
      // use the VITE_API_URL via api baseURL
      await api.post('/api/tasks', { title })
      setTitle('')
      fetchTasks()
      toast.success('Task added')
    } catch (err) {
      console.error(err)
      toast.error('Failed to add task')
    }
  }

  const toggle = async (task) => {
    try {
      await api.put(`/api/tasks/${task._id}`, { completed: !task.completed })
      fetchTasks()
    } catch (err) {
      console.error(err)
      toast.error('Failed to update task')
    }
  }

  const remove = async (task) => {
    if (!confirm('Delete task?')) return
    try {
      await api.delete(`/api/tasks/${task._id}`)
      fetchTasks()
      toast.success('Task deleted')
    } catch (err) {
      console.error(err)
      toast.error('Failed to delete task')
    }
  }

  const saveEdit = async (updated) => {
    if (!updated || !updated._id) return
    await api.put(`/api/tasks/${updated._id}`, { title: updated.title, completed: updated.completed })
    setEditing(null)
    fetchTasks()
  }

  return (
    <div className="container mx-auto px-4">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 nav-gradient-text">Tasks</h2>

        <form onSubmit={addTask} className="flex gap-3 mb-6">
          <input
            className="flex-1 p-3 rounded-md border focus:ring-2 focus:ring-sky-300"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Add a new task"
          />
          <button className="btn-gradient flex items-center gap-2 hover:shadow-lg">
            <Plus size={16} />
            Add Task
          </button>
        </form>

        <div className="space-y-3">
          {tasks.map(t => (
            <div key={t._id} className="card flex items-center justify-between">
              <div className="flex items-center gap-3">
                <input type="checkbox" checked={t.completed} onChange={() => toggle(t)} />
                <div className={t.completed ? 'line-through text-gray-400' : 'text-gray-800 font-medium'}>{t.title}</div>
              </div>
              <div className="flex items-center gap-3">
                <button className="text-sky-600 hover:text-sky-800 flex items-center gap-1" onClick={() => setEditing(t)}><Edit2 size={14} />Edit</button>
                <button className="text-red-500 hover:text-red-700 flex items-center gap-1" onClick={() => remove(t)}><Trash2 size={14} />Delete</button>
              </div>
            </div>
          ))}
        </div>

        {editing && <EditTaskModal task={editing} onClose={() => setEditing(null)} onSave={saveEdit} />}
      </div>
    </div>
  )
}
