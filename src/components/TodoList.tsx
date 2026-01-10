import { useState, useEffect, useCallback } from 'react'
import { format, addDays, isPast } from 'date-fns'
import './TodoList.css'

interface Todo {
  id: string
  text: string
  completed: boolean
  dueDate: Date | null
  priority: 'low' | 'medium' | 'high'
}

const TodoList = () => {
  const [todos, setTodos] = useState<Todo[]>([])
  const [inputValue, setInputValue] = useState('')
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')
  const [sortBy, setSortBy] = useState<'date' | 'priority'>('date')

  useEffect(() => {
    const saved = localStorage.getItem('todos')
    if (saved) {
      const parsed = JSON.parse(saved)
      setTodos(parsed.map((todo: any) => ({
        ...todo,
        dueDate: todo.dueDate ? new Date(todo.dueDate) : null
      })))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  const addTodo = useCallback(() => {
    if (!inputValue.trim()) return

    const newTodo: Todo = {
      id: Date.now().toString(),
      text: inputValue,
      completed: false,
      dueDate: addDays(new Date(), 7),
      priority: 'medium'
    }

    setTodos(prev => {
      const exists = prev.find(t => t.text === inputValue && !t.completed)
      if (exists) return prev
      return [...prev, newTodo]
    })
    setInputValue('')
  }, [inputValue])

  const toggleTodo = (id: string) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id))
  }

  const updatePriority = (id: string, priority: 'low' | 'medium' | 'high') => {
    setTodos(prev => prev.map(todo => 
      todo.id === id ? { ...todo, priority } : todo
    ))
  }

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed
    if (filter === 'completed') return todo.completed
    return true
  })

  const sortedTodos = [...filteredTodos].sort((a, b) => {
    if (sortBy === 'priority') {
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      return priorityOrder[b.priority] - priorityOrder[a.priority]
    }
    
    if (!a.dueDate && !b.dueDate) return 0
    if (!a.dueDate) return 1
    if (!b.dueDate) return -1
    
    return a.dueDate.getTime() - b.dueDate.getTime()
  })

  const completedCount = todos.filter(t => t.completed).length
  const overdueCount = todos.filter(t => 
    t.dueDate && !t.completed && isPast(t.dueDate)
  ).length

  return (
    <div className="todo-container">
      <h1>Todo List</h1>
      
      <div className="todo-stats">
        <span>Total: {todos.length}</span>
        <span>Completed: {completedCount}</span>
        <span>Overdue: {overdueCount}</span>
      </div>

      <div className="todo-controls">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          placeholder="Add new todo..."
          className="todo-input"
        />
        <button onClick={addTodo} className="btn-primary">Add</button>
      </div>

      <div className="todo-filters">
        <button 
          onClick={() => setFilter('all')}
          className={filter === 'all' ? 'active' : ''}
        >
          All
        </button>
        <button 
          onClick={() => setFilter('active')}
          className={filter === 'active' ? 'active' : ''}
        >
          Active
        </button>
        <button 
          onClick={() => setFilter('completed')}
          className={filter === 'completed' ? 'active' : ''}
        >
          Completed
        </button>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value as 'date' | 'priority')}>
          <option value="date">Sort by Date</option>
          <option value="priority">Sort by Priority</option>
        </select>
      </div>

      <ul className="todo-list">
        {sortedTodos.map(todo => (
          <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
            />
            <span className="todo-text">{todo.text}</span>
            {todo.dueDate && (
              <span className={`todo-date ${isPast(todo.dueDate) && !todo.completed ? 'overdue' : ''}`}>
                {format(todo.dueDate, 'MMM dd, yyyy')}
              </span>
            )}
            <select
              value={todo.priority}
              onChange={(e) => updatePriority(todo.id, e.target.value as 'low' | 'medium' | 'high')}
              className="priority-select"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <button onClick={() => deleteTodo(todo.id)} className="btn-delete">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default TodoList

