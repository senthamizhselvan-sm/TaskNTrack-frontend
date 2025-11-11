import React from 'react'
import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <header className="py-4">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold nav-gradient-text">TaskNTrack</h1>
        <nav className="space-x-6">
          <Link to="/" className="text-gray-700 hover:text-gray-900">Dashboard</Link>
          <Link to="/tasks" className="text-gray-700 hover:text-gray-900">Tasks</Link>
          <Link to="/expenses" className="text-gray-700 hover:text-gray-900">Expenses</Link>
        </nav>
      </div>
    </header>
  )
}
