import React, { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import GoogleSignInButton from '../components/auth/GoogleSignInButton'
import { useAuth } from '../context/AuthContext'
import { login } from '../services/auth'
import Alert from '../components/common/Alert'

export default function Login() {
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)

  // If already logged in and no active toast from this page, redirect immediately.
  if (currentUser && !toast) {
    return <Navigate to="/dashboard" />
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    if (!email || !password) return setError('Please enter email and password')
    setLoading(true)
    const res = await login({ email, password })
    setLoading(false)
    if (res && res.token) {
      // staged alert: spinner -> check -> navigate when done
      setToast({ message: 'Login successful — redirecting...', type: 'success', staged: true })
    } else {
      const msg = (res && res.message) || 'Login failed'
      setToast({ message: msg, type: 'error' })
    }
  }

  const handleGoogle = async () => {
    // GoogleSignInButton handles calling googleSignIn via services/auth
    // if successful it will update localStorage and dispatch authChanged
    // so AuthContext will be updated and redirect can occur elsewhere.
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/">
          <h2 className="text-center text-3xl font-extrabold text-gray-900">StudyBuddy</h2>
        </Link>
        <h2 className="mt-6 text-center text-2xl font-bold text-gray-900">Sign in to your account</h2>
        <p className="mt-2 text-center text-sm text-gray-600">Or{' '}
          <Link to="/" className="font-medium text-indigo-600 hover:text-indigo-500">explore our features</Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-6">
            <div>
              <GoogleSignInButton onClick={handleGoogle} />
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            {error && <div className="text-red-600 text-sm">{error}</div>}
            {toast && (
              <Alert
                message={toast.message}
                type={toast.type}
                staged={!!toast.staged}
                onClose={() => setToast(null)}
                onDone={() => {
                  setToast(null)
                  navigate('/dashboard')
                }}
              />
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
                <div className="mt-1">
                  <input id="email" name="email" type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                <div className="mt-1">
                  <input id="password" name="password" type="password" autoComplete="current-password" required value={password} onChange={e => setPassword(e.target.value)} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input id="remember_me" name="remember_me" type="checkbox" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                  <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-900">Remember me</label>
                </div>

                <div className="text-sm">
                  <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">Forgot your password?</a>
                </div>
              </div>

              <div>
                <button type="submit" disabled={loading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">{loading ? 'Signing in...' : 'Sign in'}</button>
              </div>

              <div className="text-sm text-center">
                <span className="text-gray-600">Don't have an account?</span>{' '}
                <Link to="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">Sign up</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
