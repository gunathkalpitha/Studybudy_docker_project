import React from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'

function UsersIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 11c1.657 0 3-1.567 3-3.5S17.657 4 16 4s-3 1.567-3 3.5S14.343 11 16 11zM8 11c1.657 0 3-1.567 3-3.5S9.657 4 8 4 5 5.567 5 7.5 6.343 11 8 11zM8 13c-2.33 0-7 1.17-7 3.5V19h14v-2.5C15 14.17 10.33 13 8 13zM16 13c-.29 0-.62.02-.97.05C15.36 14.08 16 15.24 16 16.5V19h6v-2.5c0-2.33-4.67-3.5-6-3.5z" fill="currentColor" />
    </svg>
  )
}

function BookOpenIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 7v11a1 1 0 0 0 1 1h3a3 3 0 0 1 3 3V7a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1zM22 7v11a1 1 0 0 1-1 1h-3a3 3 0 0 0-3 3V7a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1z" fill="currentColor" />
    </svg>
  )
}

function ClockIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 1a11 11 0 1 0 11 11A11.012 11.012 0 0 0 12 1zm0 20a9 9 0 1 1 9-9 9.01 9.01 0 0 1-9 9z" fill="currentColor" />
      <path d="M12.75 7h-1.5v6l5.25 3.15.75-1.23-4.5-2.67z" fill="currentColor" />
    </svg>
  )
}

function ShareIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 6l-4-4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 2v13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Study Together, <br />Succeed Together</h1>
              <p className="text-xl mb-8">Join StudyBuddy to collaborate with peers, share resources, and boost your productivity in a supportive learning community.</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/login" className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-indigo-600 bg-white hover:bg-gray-50">Get Started</Link>
                <Link to="/about" className="inline-flex justify-center items-center px-6 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-indigo-500">Learn More</Link>
              </div>
            </div>
            <div className="hidden md:block">
              <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1171&q=80" alt="Students collaborating" className="rounded-lg shadow-xl" />
            </div>
          </div>
        </div>
      </div>
      {/* Features Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Everything You Need to Study Effectively</h2>
            <p className="mt-4 text-lg text-gray-600">Powerful tools designed to enhance your collaborative learning experience</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 ease-in-out cursor-pointer group">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-indigo-600 transition-colors duration-300">
                <UsersIcon className="h-6 w-6 text-indigo-600 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors duration-300">Collaborative Rooms</h3>
              <p className="text-gray-600">Join real-time study sessions with shared whiteboards and notes.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 ease-in-out cursor-pointer group">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-indigo-600 transition-colors duration-300">
                <BookOpenIcon className="h-6 w-6 text-indigo-600 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors duration-300">Study Tools</h3>
              <p className="text-gray-600">Create flashcards, quizzes, and mind maps with your study groups.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 ease-in-out cursor-pointer group">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-indigo-600 transition-colors duration-300">
                <ClockIcon className="h-6 w-6 text-indigo-600 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors duration-300">Productivity</h3>
              <p className="text-gray-600">Stay focused with Pomodoro timers and track your study progress.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 ease-in-out cursor-pointer group">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-indigo-600 transition-colors duration-300">
                <ShareIcon className="h-6 w-6 text-indigo-600 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors duration-300">Resource Sharing</h3>
              <p className="text-gray-600">Easily share and organize study materials with your peers.</p>
            </div>
          </div>
        </div>
      </div>
      {/* CTA Section */}
      <div className="bg-indigo-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Study Experience?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">Join thousands of students who are already using StudyBuddy to improve their learning outcomes.</p>
          <Link to="/login" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-indigo-700 bg-white hover:bg-gray-50">Get Started for Free</Link>
        </div>
      </div>
      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white text-lg font-bold mb-4">StudyBuddy</h3>
              <p className="text-sm">A collaborative learning platform designed to help students succeed together.</p>
            </div>
            <div>
              <h3 className="text-white text-lg font-bold mb-4">Features</h3>
              <ul className="space-y-2 text-sm">
                <li>Collaborative Rooms</li>
                <li>Study Tools</li>
                <li>Productivity Features</li>
                <li>Resource Sharing</li>
              </ul>
            </div>
            <div>
              <h3 className="text-white text-lg font-bold mb-4">Company</h3>
              <ul className="space-y-2 text-sm">
                <li>About Us</li>
                <li>Blog</li>
                <li>Careers</li>
                <li>Contact</li>
              </ul>
            </div>
            <div>
              <h3 className="text-white text-lg font-bold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li>Terms of Service</li>
                <li>Privacy Policy</li>
                <li>Cookie Policy</li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-700 text-sm text-center">&copy; {new Date().getFullYear()} StudyBuddy. All rights reserved.</div>
        </div>
      </footer>
    </div>
  )
}
