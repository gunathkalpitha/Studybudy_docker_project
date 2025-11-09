import React, { useState } from 'react'

export default function TaskList({ initialTasks = null }) {
  const [tasks, setTasks] = useState(
    initialTasks
      ? initialTasks.map(t => ({ id: t.id, text: t.title || t.text || 'Task', completed: !!t.completed }))
      : [
          { id: '1', text: 'Complete Physics homework', completed: false },
          { id: '2', text: 'Review calculus notes', completed: true },
          { id: '3', text: 'Prepare for history presentation', completed: false },
        ]
  )
  const [newTaskText, setNewTaskText] = useState('')

  const addTask = () => {
    if (newTaskText.trim() === '') return
    const newTask = { id: Date.now().toString(), text: newTaskText.trim(), completed: false }
    setTasks((prev) => [...prev, newTask])
    setNewTaskText('')
  }

  const toggleTask = (id) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)))
  }

  const deleteTask = (id) => setTasks((prev) => prev.filter((t) => t.id !== id))

  const handleKeyDown = (e) => { if (e.key === 'Enter') addTask() }

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Study Tasks</h3>
      <div className="flex mb-4">
        <input
          type="text"
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a new task..."
          className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
        <button onClick={addTask} className="bg-indigo-600 text-white px-3 py-2 rounded-r-md hover:bg-indigo-700">
          {/* Plus icon */}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <ul className="space-y-2">
        {tasks.map((task) => (
          <li key={task.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
            <div className="flex items-center">
              <button
                onClick={() => toggleTask(task.id)}
                className={`w-5 h-5 rounded-full mr-3 flex items-center justify-center ${task.completed ? 'bg-indigo-600' : 'border border-gray-300'}`}
              >
                {task.completed ? (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17l-5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : null}
              </button>
              <span className={`${task.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>{task.text}</span>
            </div>
            <button onClick={() => deleteTask(task.id)} className="text-gray-400 hover:text-red-500">
              {/* Trash icon */}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 6h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M8 6v14a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M10 11v6M14 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M9 6V4h6v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
