import React, { useEffect, useState } from 'react'

export default function EditTaskModal({ task, onClose, onSave }) {
  const [title, setTitle] = useState('')
  const [completed, setCompleted] = useState(false)

  useEffect(() => {
    if (task) {
      setTitle(task.title || '')
      setCompleted(Boolean(task.completed))
    }
  }, [task])

  if (!task) return null

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded shadow w-full max-w-md p-4">
        <h3 className="text-lg font-semibold mb-2">Edit Task</h3>
        <div className="space-y-3">
          <input
            className="w-full p-2 border rounded"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" checked={completed} onChange={e => setCompleted(e.target.checked)} />
            <span>Completed</span>
          </label>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button className="px-3 py-1 rounded border" onClick={onClose}>Cancel</button>
          <button
            className="px-3 py-1 rounded bg-blue-600 text-white"
            onClick={() => onSave({ ...task, title: title.trim(), completed })}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}
