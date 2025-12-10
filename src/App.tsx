import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import TodoList from './components/TodoList'
import Search from './components/Search'
import Dashboard from './components/Dashboard'
import Form from './components/Form'
import DragDrop from './components/DragDrop'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <nav className="navbar">
          <Link to="/">Dashboard</Link>
          <Link to="/todos">Todos</Link>
          <Link to="/search">Search</Link>
          <Link to="/form">Form</Link>
          <Link to="/dragdrop">DragDrop</Link>
        </nav>
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/todos" element={<TodoList />} />
            <Route path="/search" element={<Search />} />
            <Route path="/form" element={<Form />} />
            <Route path="/dragdrop" element={<DragDrop />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App

