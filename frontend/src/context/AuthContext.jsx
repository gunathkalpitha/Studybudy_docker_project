import React, { createContext, useEffect, useState, useContext } from 'react'
import { onAuthChange } from '../services/auth'

const AuthContext = createContext({ currentUser: null, loading: true })

export function useAuth() {
  return useContext(AuthContext)
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      setCurrentUser(user)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const value = { currentUser, loading }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthContext
