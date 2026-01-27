import React, { useState } from 'react'
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
  const [showLearnMore, setShowLearnMore] = useState(false)

  const scrollToLearnMore = () => {
    setShowLearnMore(true)
    setTimeout(() => {
      document.getElementById('learn-more-section')?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      })
    }, 100)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Study Together <br />Succeed Together</h1>
              <p className="text-xl mb-8">Join StudyBuddy to collaborate with peers, share resources, and boost your productivity in a supportive learning community.</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/login" className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-indigo-600 bg-white hover:bg-gray-50 transition-all duration-300 hover:scale-105">Get Started</Link>
                <button 
                  onClick={scrollToLearnMore}
                  className="inline-flex justify-center items-center px-6 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-indigo-500 transition-all duration-300 hover:scale-105"
                >
                  Learn More ↓
                </button>
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

      {/* Learn More Section - Animated Details */}
      {showLearnMore && (
        <div 
          id="learn-more-section"
          className="py-20 bg-white animate-fadeIn"
          style={{
            animation: 'fadeInUp 0.8s ease-out'
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4 animate-slideDown">
                Why Choose StudyBuddy?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Discover how our platform revolutionizes collaborative learning
              </p>
            </div>

            {/* Feature Details Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
              
              {/* Feature 1 */}
              <div className="flex gap-6 p-8 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105" style={{animation: 'slideInLeft 0.8s ease-out'}}>
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <UsersIcon className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Real-Time Collaboration</h3>
                  <p className="text-gray-700 mb-4">
                    Connect with study partners instantly in virtual rooms. Share screens, collaborate on whiteboards, 
                    and work together as if you're in the same physical space.
                  </p>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                      Live video/audio calls
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                      Shared digital whiteboard
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                      Instant messaging & file sharing
                    </li>
                  </ul>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex gap-6 p-8 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105" style={{animation: 'slideInRight 0.8s ease-out'}}>
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                    <BookOpenIcon className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Smart Study Tools</h3>
                  <p className="text-gray-700 mb-4">
                    Enhance your learning with AI-powered flashcards, interactive quizzes, and customizable study materials 
                    that adapt to your learning style.
                  </p>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      AI-generated flashcards
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      Interactive practice quizzes
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      Visual mind mapping
                    </li>
                  </ul>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex gap-6 p-8 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105" style={{animation: 'slideInLeft 0.8s ease-out 0.2s', animationFillMode: 'both'}}>
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                    <ClockIcon className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Productivity Boosters</h3>
                  <p className="text-gray-700 mb-4">
                    Stay focused and manage your time effectively with built-in Pomodoro timers, progress tracking, 
                    and personalized study schedules.
                  </p>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                      Customizable Pomodoro timer
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                      Study session analytics
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                      Goal tracking & reminders
                    </li>
                  </ul>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="flex gap-6 p-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105" style={{animation: 'slideInRight 0.8s ease-out 0.2s', animationFillMode: 'both'}}>
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                    <ShareIcon className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Seamless Resource Sharing</h3>
                  <p className="text-gray-700 mb-4">
                    Organize and share study materials effortlessly. Upload documents, create collaborative notes, 
                    and build a shared knowledge base with your study group.
                  </p>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      Cloud-based file storage
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      Collaborative note-taking
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      Resource tagging & search
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Statistics Section */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
              <div className="text-center p-8 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl transform hover:scale-110 transition-all duration-300" style={{animation: 'bounceIn 1s ease-out 0.4s', animationFillMode: 'both'}}>
                <div className="text-5xl font-bold text-indigo-600 mb-2">10K+</div>
                <div className="text-gray-700 font-medium">Active Students</div>
              </div>
              <div className="text-center p-8 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl transform hover:scale-110 transition-all duration-300" style={{animation: 'bounceIn 1s ease-out 0.5s', animationFillMode: 'both'}}>
                <div className="text-5xl font-bold text-blue-600 mb-2">500+</div>
                <div className="text-gray-700 font-medium">Study Rooms</div>
              </div>
              <div className="text-center p-8 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl transform hover:scale-110 transition-all duration-300" style={{animation: 'bounceIn 1s ease-out 0.6s', animationFillMode: 'both'}}>
                <div className="text-5xl font-bold text-purple-600 mb-2">95%</div>
                <div className="text-gray-700 font-medium">Success Rate</div>
              </div>
              <div className="text-center p-8 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl transform hover:scale-110 transition-all duration-300" style={{animation: 'bounceIn 1s ease-out 0.7s', animationFillMode: 'both'}}>
                <div className="text-5xl font-bold text-green-600 mb-2">24/7</div>
                <div className="text-gray-700 font-medium">Support Available</div>
              </div>
            </div>

            {/* Testimonials */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-12 text-white shadow-2xl" style={{animation: 'fadeInUp 1s ease-out 0.8s', animationFillMode: 'both'}}>
              <h3 className="text-3xl font-bold text-center mb-12">What Students Say</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 transform hover:scale-105 transition-all duration-300">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="mb-4 italic">"StudyBuddy transformed my study habits! The collaborative rooms are amazing for group projects."</p>
                  <div className="font-semibold">- Sarah Johnson, Computer Science</div>
                </div>
                <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 transform hover:scale-105 transition-all duration-300">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="mb-4 italic">"The Pomodoro timer and flashcards helped me ace my exams. Highly recommend!"</p>
                  <div className="font-semibold">- Michael Chen, Engineering</div>
                </div>
                <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 transform hover:scale-105 transition-all duration-300">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="mb-4 italic">"Best study platform ever! I've made great friends and improved my grades significantly."</p>
                  <div className="font-semibold">- Emma Davis, Business</div>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="text-center mt-16" style={{animation: 'fadeInUp 1s ease-out 1s', animationFillMode: 'both'}}>
              <Link 
                to="/login" 
                className="inline-flex items-center px-8 py-4 text-lg font-medium rounded-full text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-xl hover:shadow-2xl transform hover:scale-110 transition-all duration-300"
              >
                Join StudyBuddy Today
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      )}

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
