import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { signOut } from '../../services/auth'

export default function Navbar() {
  const { currentUser } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate('/')
    } catch (error) {
      console.error('Failed to sign out:', error)
    }
  }

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-indigo-600 text-xl font-bold">StudyBuddy</span>
            </Link>
          </div>
          <div className="flex items-center">
            {currentUser ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  {currentUser.photoURL && (
                    <img className="h-8 w-8 rounded-full" src={currentUser.photoURL} alt={currentUser.displayName || 'User'} />
                  )}
                  <span className="text-sm font-medium text-gray-700">{currentUser.displayName}</span>
                </div>
                <button onClick={handleSignOut} className="text-sm font-medium text-gray-500 hover:text-gray-700">Sign out</button>
              </div>
            ) : (
              <div className="space-x-4">
                <Link to="/login" className="text-sm font-medium text-gray-500 hover:text-gray-700">Sign in</Link>
                <Link to="/login" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">Get Started</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
