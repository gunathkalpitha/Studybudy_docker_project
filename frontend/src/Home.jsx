import { Link } from 'react-router-dom'
import './Home.css'

export default function Home() {
  return (
    <div className="home-container">
      <h1>Welcome to the Home Page</h1>
      <div className="button-group">
        <Link to="/login">
          <button className="btn primary">Login</button>
        </Link>
        <Link to="/signup">
          <button className="btn secondary">Signup</button>
        </Link>
      </div>
    </div>
  )
}
