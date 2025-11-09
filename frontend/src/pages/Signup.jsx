import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import GoogleSignInButton from '../components/auth/GoogleSignInButton'
import { register, googleSignIn } from '../services/auth'
import Alert from '../components/common/Alert'

export default function Signup() {
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    if (password !== confirm) return setError('Passwords do not match')
    if (!email || !password) return setError('Please fill email and password')
    setLoading(true)
    const res = await register({ email, password, displayName })
    setLoading(false)
    if (res && res.token) {
        setToast({ message: 'Account created — redirecting...', type: 'success', staged: true })
    } else {
      const msg = (res && res.message) || 'Signup failed. Check console for details.'
      setToast({ message: msg, type: 'error' })
      setError(msg)
    }
  }

  const handleGoogle = async () => {
  setLoading(true)
  const res = await googleSignIn()
  setLoading(false)
  if (res && res.token) {
    setToast({ message: 'Signed in with Google (dev) — redirecting...', type: 'success', staged: true })
  } else {
    const msg = (res && res.message) || 'Google sign in failed'
    setToast({ message: msg, type: 'error' })
    setError(msg)
  }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/">
          <h2 className="text-center text-3xl font-extrabold text-gray-900">StudyBuddy</h2>
        </Link>
        <h2 className="mt-6 text-center text-2xl font-bold text-gray-900">Create your account</h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
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
                <label htmlFor="displayName" className="block text-sm font-medium text-gray-700">Full name</label>
                <div className="mt-1">
                  <input id="displayName" name="displayName" type="text" autoComplete="name" required value={displayName} onChange={e=>setDisplayName(e.target.value)} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
                <div className="mt-1">
                  <input id="email" name="email" type="email" autoComplete="email" required value={email} onChange={e=>setEmail(e.target.value)} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                <div className="mt-1">
                  <input id="password" name="password" type="password" autoComplete="new-password" required value={password} onChange={e=>setPassword(e.target.value)} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
              </div>

              <div>
                <label htmlFor="confirm" className="block text-sm font-medium text-gray-700">Confirm password</label>
                <div className="mt-1">
                  <input id="confirm" name="confirm" type="password" autoComplete="new-password" required value={confirm} onChange={e=>setConfirm(e.target.value)} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
              </div>

              <div>
                <button type="submit" disabled={loading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  {loading ? 'Creating...' : 'Create account'}
                </button>
              </div>

              <div className="text-sm text-center">
                <span className="text-gray-600">Already have an account?</span>{' '}
                <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">Sign in</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
