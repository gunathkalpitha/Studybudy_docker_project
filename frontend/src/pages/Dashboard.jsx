import React, { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/layout/Navbar'
import RoomCard from '../components/dashboard/RoomCard'
import PomodoroTimer from '../components/dashboard/PomodoroTimer'
import TaskList from '../components/dashboard/TaskList'

function PlusIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function SettingsIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 15.5A3.5 3.5 0 1 0 12 8.5a3.5 3.5 0 0 0 0 7z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06A2 2 0 1 1 2.27 16.8l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09c.7 0 1.3-.4 1.51-1a1.65 1.65 0 0 0-.33-1.82l-.06-.06A2 2 0 1 1 7.8 2.27l.06.06c.45.45 1.07.7 1.71.7.26 0 .52-.04.77-.12.5-.16 1.05-.36 1.62-.36.57 0 1.12.2 1.62.36.25.08.51.12.77.12.64 0 1.26-.25 1.71-.7l.06-.06A2 2 0 1 1 21.73 7.8l-.06.06c-.45.45-.7 1.07-.7 1.71 0 .26.04.52.12.77.16.5.36 1.05.36 1.62 0 .57-.2 1.12-.36 1.62-.08.25-.12.51-.12.77 0 .64.25 1.26.7 1.71z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function BellIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0 1 18.5 14.5V11a6.5 6.5 0 1 0-13 0v3.5c0 .538-.214 1.055-.595 1.445L3 17h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function Dashboard() {
  const { currentUser, loading } = useAuth()
  const [loadingData, setLoadingData] = useState(true)
  const [data, setData] = useState({ rooms: [], tasks: [], resources: [], flashcards: [], user: null })
  const navigate = useNavigate()

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

  // Create room UI state
  const [creating, setCreating] = useState(false)
  const [createName, setCreateName] = useState('')
  const [createDesc, setCreateDesc] = useState('')
  const [createError, setCreateError] = useState(null)
  // Join room UI state
  const [joinOpen, setJoinOpen] = useState(false)
  const [joinId, setJoinId] = useState('')
  const [joinError, setJoinError] = useState(null)
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    )
  }
  if (!currentUser) {
    return <Navigate to="/login" />
  }

  useEffect(() => {
    let mounted = true
    async function load() {
      setLoadingData(true)
      try {
        const token = localStorage.getItem('token')
        const res = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/dashboard', {
          headers: { Authorization: token ? `Bearer ${token}` : '' }
        })
        if (!res.ok) throw new Error('Failed to fetch dashboard')
        const json = await res.json()
        if (!mounted) return
        setData(json)
      } catch (err) {
        console.error('Failed to load dashboard data', err)
      } finally {
        setLoadingData(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  async function createRoom() {
    setCreateError(null)
    if (!createName || createName.trim() === '') return setCreateError('Please provide a room name')
    setCreateError(null)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${API_URL}/api/rooms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({ name: createName, description: createDesc })
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: 'Create failed' }))
        throw new Error(err.message || 'Create failed')
      }
      const room = await res.json()
      setCreating(false)
      setCreateName('')
      setCreateDesc('')
      navigate(`/room/${room._id || room.id}`)
    } catch (err) {
      console.error('Create room failed', err)
      setCreateError(err.message || 'Create room failed')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Welcome back, { (currentUser.displayName || currentUser.email) || (data.user && data.user.displayName) || 'Student' }</p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <button onClick={() => setCreating(true)} className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
              <PlusIcon className="h-4 w-4 mr-2" />
              Create Room
            </button>
            <button onClick={() => setJoinOpen(true)} className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700">
              Join Room
            </button>
            <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              <SettingsIcon className="h-4 w-4" />
            </button>
            <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              <BellIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-xl font-medium text-gray-900 mb-4">Your Study Rooms</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {loadingData ? (
                  <div className="col-span-1 md:col-span-2 flex items-center justify-center p-8">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600"></div>
                  </div>
                ) : (
                  (data.rooms && data.rooms.length > 0) ? (
                    data.rooms.map((room) => (
                      <RoomCard
                        key={room._id || room.id}
                        id={room._id || room.id}
                        title={room.name}
                        description={room.description}
                        participants={(room.members && room.members.length) || 0}
                        lastActive={room.updatedAt ? new Date(room.updatedAt).toLocaleString() : 'now'}
                        imageUrl={room.imageUrl}
                      />
                    ))
                  ) : (
                    <div className="col-span-1 md:col-span-2 text-center text-gray-500 p-6">You have no study rooms yet. Create one to get started.</div>
                  )
                )}
              <div onClick={() => setCreating(true)} className="border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center p-6 hover:border-indigo-500 hover:bg-gray-50 cursor-pointer">
                <div className="text-center">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100">
                    <PlusIcon className="h-6 w-6 text-indigo-600" />
                  </div>
                  <h3 className="mt-2 text-sm font-medium text-indigo-600">Create Room</h3>
                  <p className="mt-1 text-xs text-gray-500">Start a new study session</p>
                </div>
              </div>
            </div>
            <h2 className="text-xl font-medium text-gray-900 mb-4">Recent Activity</h2>
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="space-y-4">
                {loadingData ? (
                  <div className="flex items-center justify-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
                  </div>
                ) : (
                  (data.resources && data.resources.length === 0 && data.flashcards && data.flashcards.length === 0) ? (
                    <div className="text-gray-500">No recent activity yet.</div>
                  ) : (
                    <div className="space-y-4">
                      {data.flashcards && data.flashcards.slice(0,3).map((f) => (
                        <div key={f.id} className="flex items-start">
                          <div className="h-10 w-10 rounded-full mr-3 bg-indigo-100 flex items-center justify-center text-indigo-600">F</div>
                          <div>
                            <div className="flex items-center">
                              <span className="font-medium text-gray-900">You</span>
                              <span className="ml-2 text-sm text-gray-500">recently</span>
                            </div>
                            <p className="text-gray-700">Created flashcards: "{f.title}"</p>
                          </div>
                        </div>
                      ))}
                      {data.resources && data.resources.slice(0,3).map((r) => (
                        <div key={r.id} className="flex items-start">
                          <div className="h-10 w-10 rounded-full mr-3 bg-green-100 flex items-center justify-center text-green-600">R</div>
                          <div>
                            <div className="flex items-center">
                              <span className="font-medium text-gray-900">You</span>
                              <span className="ml-2 text-sm text-gray-500">recently</span>
                            </div>
                            <p className="text-gray-700">Added resource: "{r.title}"</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <PomodoroTimer />
            <TaskList initialTasks={loadingData ? null : data.tasks} />
          </div>
        </div>
      </div>
      {/* Create Room Modal */}
      {creating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h3 className="text-lg font-medium mb-4">Create a new study room</h3>
            {createError && <div className="text-sm text-red-600 mb-2">{createError}</div>}
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700">Room name</label>
              <input value={createName} onChange={e=>setCreateName(e.target.value)} className="mt-1 block w-full px-3 py-2 border rounded" />
            </div>
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700">Description (optional)</label>
              <textarea value={createDesc} onChange={e=>setCreateDesc(e.target.value)} className="mt-1 block w-full px-3 py-2 border rounded" rows={3} />
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <button onClick={()=>{ setCreating(false); setCreateError(null) }} className="px-4 py-2 border rounded">Cancel</button>
              <button onClick={createRoom} className="px-4 py-2 bg-indigo-600 text-white rounded">Create</button>
            </div>
          </div>
        </div>
      )}
      {/* Join Room Modal */}
      {joinOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h3 className="text-lg font-medium mb-4">Join a study room</h3>
            {joinError && <div className="text-sm text-red-600 mb-2">{joinError}</div>}
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700">Room ID or Invite URL</label>
              <input value={joinId} onChange={e=>setJoinId(e.target.value)} placeholder="Paste room id or https://.../room/6910..." className="mt-1 block w-full px-3 py-2 border rounded" />
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <button onClick={()=>{ setJoinOpen(false); setJoinError(null); setJoinId('') }} className="px-4 py-2 border rounded">Cancel</button>
              <button onClick={async ()=>{
                setJoinError(null)
                let id = (joinId||'').trim()
                if (!id) return setJoinError('Please provide a room id or invite URL')
                // if full URL paste, extract last path segment
                try{
                  try{ const u = new URL(id); const parts = u.pathname.split('/').filter(Boolean); id = parts[parts.length-1] }catch(e){ /* not a url, keep as-is */ }
                  const token = localStorage.getItem('token')
                  const res = await fetch(`${API_URL}/api/rooms/${id}/join`, { method: 'POST', headers: { Authorization: token ? `Bearer ${token}` : '', 'Content-Type':'application/json' } })
                  if (!res.ok) {
                    const err = await res.json().catch(()=>({message:'Join failed'}))
                    throw new Error(err.message || 'Join failed')
                  }
                  const room = await res.json()
                  setJoinOpen(false); setJoinId(''); setJoinError(null)
                  navigate(`/room/${room._id || room.id}`)
                }catch(err){ console.error('Join failed', err); setJoinError(err.message || 'Join failed') }
              }} className="px-4 py-2 bg-indigo-600 text-white rounded">Join</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
