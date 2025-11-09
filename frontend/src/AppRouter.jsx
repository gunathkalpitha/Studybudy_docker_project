import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import StudyRoom from './pages/StudyRoomClean'
import { useContext } from 'react'
import AuthContext from './context/AuthContext'

function Protected({ children }) {
  const { isAuthenticated } = useContext(AuthContext)
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

export default function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
        <Route path="/room/:id" element={<Protected><StudyRoom /></Protected>} />
      </Routes>
    </Router>
  )
}
