// Minimal backend-backed auth service (replaces Firebase usage).
// Uses the backend REST API at /api/auth to signup/login and stores a JWT in localStorage.
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000'

async function requestJson(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    credentials: 'include',
  })
  const data = await res.json().catch(() => null)
  if (!res.ok) {
    const err = new Error(data?.message || 'Request failed')
    err.status = res.status
    err.payload = data
    throw err
  }
  return data
}

export async function login({ email, password }) {
  try {
    const data = await requestJson('/api/auth/login', { email, password })
    // store token and user
    if (data.token) {
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user || null))
      // notify listeners in this window
      try { window.dispatchEvent(new CustomEvent('authChanged', { detail: data.user || null })) } catch (e) { /* ignore */ }
    }
    return data
  } catch (err) {
    console.error('Login failed', err)
    return null
  }
}

export async function register({ email, password, displayName }) {
  try {
    const data = await requestJson('/api/auth/signup', { email, password, displayName })
    if (data.token) {
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user || null))
      try { window.dispatchEvent(new CustomEvent('authChanged', { detail: data.user || null })) } catch (e) { /* ignore */ }
    }
    return data
  } catch (err) {
    console.error('Registration failed', err)
    return null
  }
}

export async function googleSignIn() {
  try {
    const data = await requestJson('/api/auth/google/dev', {})
    if (data.token) {
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user || null))
    }
    return data
  } catch (err) {
    console.error('Google sign in failed', err)
    return null
  }
}

export async function signOut() {
  try {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    try { window.dispatchEvent(new CustomEvent('authChanged', { detail: null })) } catch (e) { /* ignore */ }
    return { ok: true }
  } catch (err) {
    console.error('Sign out failed', err)
    return { ok: false }
  }
}

// Very small onAuthChange replacement that calls cb immediately and returns an unsubscribe no-op.
export function onAuthChange(cb) {
  // call immediately with current value
  const callNow = () => {
    const raw = localStorage.getItem('user')
    const user = raw ? JSON.parse(raw) : null
    try { cb(user) } catch (e) { /* ignore */ }
  }

  callNow()

  const handler = (e) => {
    // CustomEvent from same-window dispatch
    if (e && e.type === 'authChanged') {
      try { cb(e.detail) } catch (err) { /* ignore */ }
      return
    }
  }

  const storageHandler = (e) => {
    if (e.key === 'user') {
      const raw = localStorage.getItem('user')
      const user = raw ? JSON.parse(raw) : null
      try { cb(user) } catch (err) { /* ignore */ }
    }
  }

  window.addEventListener('authChanged', handler)
  window.addEventListener('storage', storageHandler)

  return () => {
    window.removeEventListener('authChanged', handler)
    window.removeEventListener('storage', storageHandler)
  }
}
