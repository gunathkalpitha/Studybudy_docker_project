import React, { useEffect, useRef, useState } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import { useAuth } from '../context/AuthContext'
import io from 'socket.io-client'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

function ChatInput({ onSend }){
  const [text, setText] = useState('')
  return (
    <div className="flex gap-2">
      <input className="flex-1 p-2 border rounded" value={text} onChange={e=>setText(e.target.value)} />
      <button type="button" className="inline-flex items-center px-3 py-1.5 bg-indigo-600 text-white rounded" onClick={()=>{ if(text.trim()){ onSend(text); setText('') } }}>Send</button>
    </div>
  )
}

export default function StudyRoom(){
  const { roomId } = useParams()
  const { currentUser, loading } = useAuth()
  const [room, setRoom] = useState(null)
  const [notepad, setNotepad] = useState('')
  const [messages, setMessages] = useState([])
  const [participants, setParticipants] = useState([])
  const socketRef = useRef(null)

  useEffect(()=>{
    // fetch room data
    let mounted = true
    async function load(){
      try{
        const res = await fetch(`${API_URL}/api/rooms/${roomId}`)
        if(!res.ok) throw new Error('Room not found')
        const json = await res.json()
            if(mounted) {
              setRoom(json)
              // initialize notepad and messages from persisted room
              if (json.notepad) setNotepad(json.notepad)
              if (json.messages && Array.isArray(json.messages)) {
                const mapped = json.messages.map(m => {
                  const from = m.sender || m.from || m.fromId || 'Unknown'
                  const message = m.text || m.message || ''
                  let ts = Date.now()
                  if (m.ts) {
                    if (typeof m.ts === 'string') ts = Date.parse(m.ts) || Date.now()
                    else if (typeof m.ts === 'number') ts = m.ts
                    else if (m.ts instanceof Date) ts = m.ts.getTime()
                  }
                  return { from, message, ts }
                })
                setMessages(mapped)
              }
              // if current user exists and is not a member, attempt to join via API
              try {
                const token = localStorage.getItem('token')
                if (token && json.members && Array.isArray(json.members) && currentUser) {
                  const isMember = json.members.some(mem => (mem._id || mem.id || String(mem)) === (currentUser.id || currentUser._id || ''))
                  if (!isMember) {
                    const jres = await fetch(`${API_URL}/api/rooms/${roomId}/join`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
                    })
                    if (jres.ok) {
                      const updated = await jres.json().catch(() => null)
                      if (updated) setRoom(updated)
                    }
                  }
                }
              } catch (e) {
                // join best-effort, ignore errors
                console.warn('Auto-join failed', e)
              }
            }
      }catch(err){
        console.error('Failed to load room', err)
      }
    }
    if(roomId) load()
    return ()=>{ mounted = false }
  },[roomId])

  useEffect(()=>{
    if(!roomId) return
    // connect socket
    const s = io(API_URL, { transports: ['websocket'] })
    socketRef.current = s
    const user = currentUser ? { id: currentUser.id || currentUser._id || 'anon', name: currentUser.displayName || currentUser.email || 'Anonymous' } : { id: 'anon-'+Math.random().toString(36).slice(2,8), name: 'Anonymous' }
    s.emit('joinRoom', { roomId, user })

    // helper to normalize server messages -> { from, message, ts }
    const normalizeMsg = (m) => {
      const from = m.sender || m.from || m.fromId || 'Unknown'
      const message = m.text || m.message || ''
      let ts = Date.now()
      if (m.ts) {
        if (typeof m.ts === 'string') ts = Date.parse(m.ts) || Date.now()
        else if (typeof m.ts === 'number') ts = m.ts
        else if (m.ts instanceof Date) ts = m.ts.getTime()
      }
      return { from, message, ts }
    }

    s.on('notepad', c => setNotepad(c))

    // initial history from server (array)
    s.on('chatHistory', (arr) => {
      if (!Array.isArray(arr)) return
      const mapped = arr.map(normalizeMsg)
      setMessages(mapped)
    })

    // single incoming message
    s.on('chatMessage', (m) => {
      const nm = normalizeMsg(m)
      setMessages(prev => {
        // simple dedupe: ignore if same from+message with nearly-equal timestamp (prevents duplicate when client also appended)
        const dup = prev.some(p => p.from === nm.from && p.message === nm.message && Math.abs((p.ts||0) - (nm.ts||0)) < 2000)
        if (dup) return prev
        return [...prev, nm]
      })
    })

    s.on('presence', (list) => setParticipants(list))
    return ()=>{ try{ s.emit('leaveRoom', { roomId }); s.disconnect() }catch(e){} }
  },[roomId, currentUser])

  const handleNotepadChange = (value) => {
    setNotepad(value)
    socketRef.current?.emit('notepadUpdate', { roomId, content: value })
  }

  const handleSendMessage = (text) => {
    if(!text || text.trim()==='') return
    const payload = { roomId, message: text, from: currentUser?.displayName || currentUser?.email || 'You' }
    socketRef.current?.emit('chatMessage', payload)
    setMessages(prev => [...prev, { ...payload, ts: Date.now() }])
  }

  const handleCopyInvite = async () => {
    const url = `${window.location.origin}/room/${roomId}`
    try{
      await navigator.clipboard.writeText(url)
      alert('Invite link copied to clipboard')
    }catch(e){
      console.error('Clipboard failed', e)
      alert('Copy failed — manually share: ' + url)
    }
  }

  if(loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div></div>
  if(!currentUser) return <Navigate to="/login" />

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="flex-1 flex flex-col">
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-gray-900">{room?.name || 'Study Room'}</h1>
                <p className="text-sm text-gray-600">{(room?.members && room.members.length) ? `${room.members.length} participants` : 'No participants yet'} • Created by {room?.host?.displayName || room?.host?.email || 'Host'}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button onClick={handleCopyInvite} className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">Invite</button>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex h-full">
            <div className="flex-1 flex flex-col bg-white shadow-md rounded-lg overflow-hidden">
              <div className="flex border-b">
                <button className={`px-4 py-2 text-sm font-medium text-indigo-600 border-b-2 border-indigo-600`}>Whiteboard</button>
                <button className={`px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700`}>Chat</button>
                <button className={`px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700`}>Files</button>
              </div>
              <div className="flex-1 p-4">
                <div className="p-4 bg-white rounded shadow mb-4">
                  <h3 className="font-medium mb-2">Shared Notepad</h3>
                  <textarea className="w-full p-2 border rounded" rows={12} value={notepad} onChange={(e)=>handleNotepadChange(e.target.value)} />
                </div>

                <div className="p-4 bg-white rounded shadow">
                  <h3 className="font-medium mb-2">Chat</h3>
                  <div className="space-y-2 max-h-48 overflow-auto mb-2">
                    {messages.map((m,i)=> (
                      <div key={i} className="text-sm"><strong>{m.from || m.fromId || 'Unknown'}:</strong> {m.message}</div>
                    ))}
                  </div>
                  <ChatInput onSend={handleSendMessage} />
                </div>
              </div>
            </div>

            <aside className="w-64 ml-6 bg-white shadow-md rounded-lg overflow-hidden">
              <div className="p-4 border-b">
                <h2 className="font-medium text-gray-900">Participants</h2>
              </div>
              <div className="p-4">
                <ul className="space-y-3">
                  {participants.length > 0 ? participants.map(p => (
                    <li key={p.id || p.socketId} className="flex items-center">
                      <div className="h-8 w-8 rounded-full mr-2 bg-indigo-100 flex items-center justify-center text-indigo-600">{(p.name||'U').charAt(0)}</div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{p.name || p.displayName || p.email || 'User'}</div>
                        <div className="text-xs text-green-600">Online</div>
                      </div>
                    </li>
                  )) : (
                    <div className="text-gray-500">No one here yet.</div>
                  )}
                </ul>
              </div>
              <div className="p-4 border-t">
                <h2 className="font-medium text-gray-900 mb-2">Voice Chat</h2>
                <button className="inline-flex items-center justify-center w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">Join Voice Chat</button>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  )
}