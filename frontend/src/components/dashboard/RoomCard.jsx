import React from 'react'
import { Link } from 'react-router-dom'

export default function RoomCard({ id, title, description, participants = 0, lastActive = 'now', imageUrl }) {
  return (
    <Link to={`/room/${id}`} className="block">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        {imageUrl && (
          <div
            className="h-32 bg-cover bg-center"
            style={{ backgroundImage: `url(${imageUrl})` }}
          />
        )}
        <div className="p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-1">{title}</h3>
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">{description}</p>
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center">
              {/* Users icon (inline) */}
              <svg className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 11c1.657 0 3-1.567 3-3.5S17.657 4 16 4s-3 1.567-3 3.5S14.343 11 16 11zM8 11c1.657 0 3-1.567 3-3.5S9.657 4 8 4 5 5.567 5 7.5 6.343 11 8 11zM8 13c-2.33 0-7 1.17-7 3.5V19h14v-2.5C15 14.17 10.33 13 8 13zM16 13c-.29 0-.62.02-.97.05C15.36 14.08 16 15.24 16 16.5V19h6v-2.5c0-2.33-4.67-3.5-6-3.5z" fill="currentColor" />
              </svg>
              <span>{participants} members</span>
            </div>
            <div className="flex items-center">
              {/* Clock icon (inline) */}
              <svg className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 1a11 11 0 1 0 11 11A11.012 11.012 0 0 0 12 1zm0 20a9 9 0 1 1 9-9 9.01 9.01 0 0 1-9 9z" fill="currentColor" />
                <path d="M12.75 7h-1.5v6l5.25 3.15.75-1.23-4.5-2.67z" fill="currentColor" />
              </svg>
              <span>Active {lastActive}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
