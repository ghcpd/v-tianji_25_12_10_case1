import { useState, useRef, useEffect } from 'react'
import './DragDrop.css'

interface Task {
  id: string
  title: string
  description: string
  status: 'todo' | 'in-progress' | 'done'
}

const DragDrop = () => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Task 1', description: 'Description 1', status: 'todo' },
    { id: '2', title: 'Task 2', description: 'Description 2', status: 'in-progress' },
    { id: '3', title: 'Task 3', description: 'Description 3', status: 'done' },
    { id: '4', title: 'Task 4', description: 'Description 4', status: 'todo' }
  ])

  const [draggedTask, setDraggedTask] = useState<Task | null>(null)
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null)
  const dragCounter = useRef(0)

  const handleDragStart = (task: Task) => {
    setDraggedTask(task)
  }

  const handleDragOver = (e: React.DragEvent, status: string) => {
    e.preventDefault()
    setDragOverColumn(status)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    dragCounter.current--
    if (dragCounter.current === 0) {
      setDragOverColumn(null)
    }
  }

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    dragCounter.current++
  }

  const handleDrop = (e: React.DragEvent, targetStatus: string) => {
    e.preventDefault()
    dragCounter.current = 0
    setDragOverColumn(null)

    if (draggedTask) {
      setTasks(prev => prev.map(task => 
        task.id === draggedTask.id 
          ? { ...task, status: targetStatus as 'todo' | 'in-progress' | 'done' }
          : task
      ))
    }
    setDraggedTask(null)
  }

  const addTask = () => {
    const todoCount = tasks.filter(t => t.status === 'todo').length
    const newTask: Task = {
      id: Date.now().toString(),
      title: `Task ${todoCount + 1}`,
      description: `Description ${todoCount + 1}`,
      status: 'todo'
    }
    setTasks(prev => [...prev, newTask])
  }

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id))
  }

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, ...updates } : task
    ))
  }

  const columns = [
    { id: 'todo', title: 'To Do' },
    { id: 'in-progress', title: 'In Progress' },
    { id: 'done', title: 'Done' }
  ]

  useEffect(() => {
    const saved = localStorage.getItem('tasks')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setTasks(parsed)
      } catch (e) {
        console.error('Failed to load tasks')
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }, [tasks])

  return (
    <div className="dragdrop-container">
      <div className="dragdrop-header">
        <h1>Task Board</h1>
        <button onClick={addTask} className="add-task-btn">Add Task</button>
      </div>

      <div className="columns-container">
        {columns.map(column => {
          const columnTasks = tasks.filter(task => task.status === column.id)
          const isDragOver = dragOverColumn === column.id

          return (
            <div
              key={column.id}
              className={`column ${isDragOver ? 'drag-over' : ''}`}
              onDragOver={(e) => handleDragOver(e, column.id)}
              onDragLeave={handleDragLeave}
              onDragEnter={handleDragEnter}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              <h2 className="column-title">
                {column.title} ({columnTasks.length})
              </h2>
              
              <div className="tasks-list">
                {columnTasks.map(task => (
                  <div
                    key={task.id}
                    className="task-card"
                    draggable
                    onDragStart={() => handleDragStart(task)}
                  >
                    <input
                      type="text"
                      value={task.title}
                      onChange={(e) => updateTask(task.id, { title: e.target.value })}
                      className="task-title-input"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <textarea
                      value={task.description}
                      onChange={(e) => updateTask(task.id, { description: e.target.value })}
                      className="task-description-input"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="delete-task-btn"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default DragDrop

