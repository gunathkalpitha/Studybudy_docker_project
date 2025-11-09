import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import io from 'socket.io-client'
import { useAuth } from '../context/AuthContext'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

// Minimal inline icons to avoid adding lucide-react as a dependency
const Icon = ({ children, className = '', ...props }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    {...props}
  >
    {children}
  </svg>
)

const SendIcon = (props) => (
  <Icon {...props}>
    <path d="M22 2L11 13" />
    <path d="M22 2l-7 20 -4-9 -9-4 20-7z" />
  </Icon>
)

const UsersIcon = (props) => (
  <Icon {...props}>
    <path d="M17 21v-2a4 4 0 00-3-3.87" />
    <path d="M7 21v-2a4 4 0 013-3.87" />
    <circle cx="12" cy="7" r="4" />
  </Icon>
)

const FileIcon = (props) => (
  <Icon {...props}>
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <path d="M14 2v6h6" />
  </Icon>
)

const MessageSquareIcon = (props) => (
  <Icon {...props}>
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
  </Icon>
)

const PencilIcon = (props) => (
  <Icon {...props}>
    <path d="M12 20h9" />
    <path d="M16.5 3.5l4 4L8 20l-4 1 1-4L16.5 3.5z" />
  </Icon>
)

const MicIcon = (props) => (
  <Icon {...props}>
    <path d="M12 1v11" />
    <path d="M19 11a7 7 0 01-14 0" />
    <path d="M12 21v-4" />
  </Icon>
)

function ChatInput({ onSend }){
  const [text, setText] = useState('')
  return (
    <div className="flex gap-2">
      <input className="flex-1 p-2 border rounded" value={text} onChange={e=>setText(e.target.value)} />
      <button type="button" className="inline-flex items-center px-3 py-2 bg-indigo-600 text-white rounded" onClick={()=>{ onSend(text); setText('') }}>
        <SendIcon className="h-4 w-4" />
      </button>
    </div>
  )
}

export default function StudyRoom(){
  const params = useParams()
  const id = params.id || params.roomId
  const { currentUser } = useAuth()
    const [room, setRoom] = useState(null)
    const [notepad, setNotepad] = useState('')
    const [messages, setMessages] = useState([])
    const [participants, setParticipants] = useState([])
  const socketRef = useRef(null)
  const [inviteToast, setInviteToast] = useState({ show: false, text: '' })
  const [activeTab, setActiveTab] = useState('whiteboard')
  const [voiceActive, setVoiceActive] = useState(false)
  const [voiceParticipants, setVoiceParticipants] = useState([])

  

  // normalize server message shape to { from, message, ts }
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

  useEffect(()=>{
    // load persisted room state (not required but helpful)
    let mounted = true
    async function loadRoom(){
      if (!id) return
      try{
        const res = await fetch(`${API_URL}/api/rooms/${id}`)
        if (!res.ok) return
        const json = await res.json()
        if (!mounted) return
        setRoom(json)
        if (json.notepad) setNotepad(json.notepad)
        if (json.messages && Array.isArray(json.messages)) setMessages(json.messages.map(normalizeMsg))
        // initialize participants from persisted members (show names if populated)
        if (Array.isArray(json.members)) {
          const list = json.members.map(m => ({ id: m._id || m.id || String(m), name: (m.displayName || m.email || 'User') }))
          setParticipants(list)
        }

        // if user logged in and not a member, attempt to join via API
        try{
          const token = localStorage.getItem('token')
          if (token && json.members && Array.isArray(json.members) && currentUser) {
            const isMember = json.members.some(mem => (mem._id || mem.id || String(mem)) === (currentUser.id || currentUser._id || ''))
            if (!isMember) {
              const jres = await fetch(`${API_URL}/api/rooms/${id}/join`, { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type':'application/json' } })
              if (jres.ok) {
                /* ignore returned room for now */
              }
            }
          }
        }catch(e){/* best-effort */}

      }catch(e){ console.warn('loadRoom failed', e) }
    }
    loadRoom()
    return ()=>{ mounted = false }
  },[id, currentUser])

  useEffect(()=>{
    const s = io(API_URL, { transports: ['websocket'] })
    socketRef.current = s
    const user = currentUser ? { id: currentUser.id || currentUser._id || ('web-'+s.id), name: currentUser.displayName || currentUser.email || 'You' } : { id: 'web-'+s.id, name: 'Anonymous' }
    s.emit('joinRoom', { roomId: id, user })
    s.on('notepad', c => setNotepad(c))

    s.on('chatHistory', (arr) => {
      if (!Array.isArray(arr)) return
      setMessages(arr.map(normalizeMsg))
    })

  s.on('chatMessage', (m) => {
      const nm = normalizeMsg(m)
      setMessages(prev => {
        const dup = prev.some(p => p.from === nm.from && p.message === nm.message && Math.abs((p.ts||0)-(nm.ts||0)) < 2000)
        if (dup) return prev
        return [...prev, nm]
      })
    })

    s.on('presence', (list) => {
      // presence from socket contains objects like { id, name }
      if (!Array.isArray(list)) return
      const mapped = list.map(p => ({ id: p.id || p.socketId || p._id, name: p.name || p.displayName || p.email || 'User' }))
      setParticipants(mapped)
    })

    s.on('voicePresence', (list) => {
      if (!Array.isArray(list)) return setVoiceParticipants([])
      const mapped = list.map(p => ({ id: p.id || p.socketId || p._id, name: p.name || p.displayName || p.email || 'User' }))
      setVoiceParticipants(mapped)
    })

    return () => { try{ s.emit('leaveRoom', { roomId: id }); s.disconnect() }catch(e){} }
  },[id, currentUser])

  const sendMessage = (t) => {
    if (!t) return
    const from = currentUser ? (currentUser.displayName || currentUser.email || currentUser.id) : undefined
    const payload = from ? { roomId: id, message: t, from } : { roomId: id, message: t }
    // optimistic append with normalized shape
    const local = { from: from || 'You', message: t, ts: Date.now() }
    setMessages(prev => [...prev, local])
    socketRef.current?.emit('chatMessage', payload)
  }

  const handleCopyInvite = async () => {
    if (!id) return
    const url = `${window.location.origin}/room/${id}`
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url)
      } else {
        // fallback
        const ta = document.createElement('textarea')
        ta.value = url
        ta.style.position = 'fixed'
        ta.style.left = '-9999px'
        document.body.appendChild(ta)
        ta.select()
        document.execCommand('copy')
        document.body.removeChild(ta)
      }
      setInviteToast({ show: true, text: 'Invite link copied to clipboard' })
      setTimeout(() => setInviteToast({ show: false, text: '' }), 3000)
    } catch (e) {
      console.error('Copy failed', e)
      setInviteToast({ show: true, text: 'Copy failed — please copy manually' })
      setTimeout(() => setInviteToast({ show: false, text: '' }), 4000)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      {/* invite toast */}
      {inviteToast.show && (
        <div aria-live="polite" className="fixed top-6 right-6 z-50">
          <div className="max-w-xs w-full bg-white border border-gray-200 shadow-lg rounded-md px-4 py-2 text-sm text-gray-800">
            {inviteToast.text}
          </div>
        </div>
      )}
      <div className="flex-1 flex flex-col">
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-gray-900">{room?.name || 'Study Room'}</h1>
                <p className="text-sm text-gray-600">{(room?.members && room.members.length) ? `${room.members.length} participants` : (participants.length ? `${participants.length} participants` : 'No participants yet')} • Created by {room?.host?.displayName || room?.host?.email || 'Host'}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button onClick={handleCopyInvite} className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  <UsersIcon className="h-4 w-4 mr-2" />
                  Invite
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex h-full">
            <div className="flex-1 flex flex-col bg-white shadow-md rounded-lg overflow-hidden">
              <div className="flex border-b">
                <button onClick={()=>setActiveTab('whiteboard')} className={`px-4 py-2 text-sm font-medium ${activeTab==='whiteboard' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}>
                  <PencilIcon className="h-4 w-4 inline mr-1" />
                  Whiteboard
                </button>
                <button onClick={()=>setActiveTab('chat')} className={`px-4 py-2 text-sm font-medium ${activeTab==='chat' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}>
                  <MessageSquareIcon className="h-4 w-4 inline mr-1" />
                  Chat
                </button>
                <button onClick={()=>setActiveTab('files')} className={`px-4 py-2 text-sm font-medium ${activeTab==='files' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}>
                  <FileIcon className="h-4 w-4 inline mr-1" />
                  Files
                </button>
              </div>
              <div className="flex-1 p-4">
                <div className="h-full flex flex-col">
                  {activeTab === 'whiteboard' && (
                    <div className="p-4 bg-white rounded shadow">
                      <h3 className="font-medium mb-2">Shared Notepad</h3>
                      <textarea className="w-full p-2 border rounded" rows={12} value={notepad} onChange={(e)=>{ setNotepad(e.target.value); socketRef.current?.emit('notepadUpdate',{ roomId:id, content:e.target.value }) }} />
                    </div>
                  )}

                  {activeTab === 'chat' && (
                    <div className="p-4 bg-white rounded shadow mt-0">
                      <h3 className="font-medium mb-2">Chat</h3>
                      <div className="space-y-2 max-h-48 overflow-auto mb-2">
                        {messages.map((m,i)=> <div key={i} className="text-sm"><strong>{m.from}:</strong> {m.message}</div>)}
                      </div>
                      <ChatInput onSend={sendMessage} />
                    </div>
                  )}

                  {activeTab === 'files' && (
                    <div className="p-4 bg-white rounded shadow">
                      <h3 className="font-medium mb-2">Files</h3>
                      <FileUploader roomId={id} onUploaded={(file)=>{
                        // append to room.files state
                        setRoom(prev => ({ ...(prev||{}), files: [...(prev?.files||[]), file] }))
                      }} />

                      <div className="mt-4 space-y-3">
                        {(room && room.files && room.files.length>0) ? room.files.map((f,i)=> (
                          <div key={i} className="flex items-center justify-between p-2 border rounded">
                            <div>
                              <div className="font-medium text-sm text-gray-900">{f.title || 'File'}</div>
                              <a className="text-xs text-indigo-600" href={`${API_URL}${f.url}`} target="_blank" rel="noreferrer">Open / Download</a>
                            </div>
                            <div className="text-sm text-gray-500">{new Date(f.createdAt||Date.now()).toLocaleString()}</div>
                          </div>
                        )) : (
                          <div className="text-gray-500">No files uploaded yet.</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="w-64 ml-6 bg-white shadow-md rounded-lg overflow-hidden">
              <div className="p-4 border-b">
                <h2 className="font-medium text-gray-900">Participants</h2>
              </div>
              <div className="p-4">
                <ul className="space-y-3">
                  {participants.length > 0 ? participants.map(p => (
                    <li key={p.id} className="flex items-center">
                      <div className="h-8 w-8 rounded-full mr-2 bg-indigo-100 flex items-center justify-center text-indigo-600">{(p.name||'U').charAt(0)}</div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{p.name}</div>
                        <div className="text-xs text-green-600">Online{room?.host && (p.id === (room.host._id || room.host.id)) ? ' • Host' : ''}</div>
                      </div>
                    </li>
                  )) : (
                    <div className="text-gray-500">No one here yet.</div>
                  )}
                </ul>
              </div>
              <div className="p-4 border-t">
                <h2 className="font-medium text-gray-900 mb-2">Voice Chat</h2>
                <button onClick={async ()=>{
                  try{
                    if (!voiceActive) {
                      // request mic
                      await navigator.mediaDevices.getUserMedia({ audio: true })
                      setVoiceActive(true)
                      socketRef.current?.emit('voiceJoin', { roomId: id, user: { id: currentUser?.id || currentUser?._id || 'anon', name: currentUser?.displayName || currentUser?.email || 'User' } })
                    } else {
                      setVoiceActive(false)
                      socketRef.current?.emit('voiceLeave', { roomId: id })
                    }
                  }catch(e){ console.error('Voice permission failed', e); alert('Microphone permission required') }
                }} className={`inline-flex items-center justify-center w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${voiceActive ? 'bg-red-600 hover:bg-red-700' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
                  <MicIcon className="h-4 w-4 mr-2" />
                  {voiceActive ? 'Leave Voice Chat' : 'Join Voice Chat'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// FileUploader component placed at bottom of file to keep this page self-contained
function FileUploader({ roomId, onUploaded }){
  const [file, setFile] = useState(null)
  const [title, setTitle] = useState('')
  const [uploading, setUploading] = useState(false)

  const handleSelect = (e) => setFile(e.target.files && e.target.files[0])

  const doUpload = async () => {
    if (!file) return alert('Select a file first')
    setUploading(true)
    try{
      const token = localStorage.getItem('token')
      const fd = new FormData()
      fd.append('file', file)
      fd.append('title', title || file.name)
      const res = await fetch(`${API_URL}/api/resources`, { method: 'POST', headers: { Authorization: token ? `Bearer ${token}` : '' }, body: fd })
      if (!res.ok) throw new Error('Upload failed')
      const resource = await res.json()
      // register file in room
      const reg = await fetch(`${API_URL}/api/rooms/${roomId}/files`, { method: 'POST', headers: { 'Content-Type':'application/json', Authorization: token ? `Bearer ${token}` : '' }, body: JSON.stringify({ title: resource.title || title || file.name, url: resource.url || resource.fileUrl || resource.url }) })
      if (!reg.ok) throw new Error('Failed to attach file to room')
      const fileEntry = await reg.json()
      onUploaded(fileEntry)
      setFile(null); setTitle('')
    }catch(e){ console.error('Upload failed', e); alert('Upload failed: '+ (e.message || e)) }
    finally{ setUploading(false) }
  }

  return (
    <div>
      <div className="flex gap-2">
        <input type="text" placeholder="File title (optional)" value={title} onChange={e=>setTitle(e.target.value)} className="flex-1 px-3 py-2 border rounded" />
        <input type="file" onChange={handleSelect} />
        <button onClick={doUpload} disabled={uploading} className="px-3 py-2 bg-indigo-600 text-white rounded">{uploading ? 'Uploading...' : 'Upload'}</button>
      </div>
    </div>
  )
}
