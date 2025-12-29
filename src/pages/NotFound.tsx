import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div 
      style={{ 
        padding: '24px 16px', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        minHeight: '60vh',
        textAlign: 'center',
      }}
    >
      <h1 style={{ fontSize: '48px', fontWeight: 700, color: 'hsl(60 4% 17%)' }}>404</h1>
      <p style={{ marginTop: '8px', fontSize: '14px', color: 'hsl(50 3% 37%)' }}>
        Page not found
      </p>
      <Link 
        to="/" 
        style={{ 
          marginTop: '24px', 
          color: 'hsl(120 14% 54%)', 
          textDecoration: 'none',
        }}
      >
        Go to Dashboard
      </Link>
    </div>
  )
}