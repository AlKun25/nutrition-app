import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { Home, BookOpen, Calendar, Package, ShoppingCart, User } from 'lucide-react'

const navigation = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/recipes', label: 'Recipes', icon: BookOpen },
  { path: '/meal-plan', label: 'Plan', icon: Calendar },
  { path: '/pantry', label: 'Pantry', icon: Package },
  { path: '/grocery', label: 'Grocery', icon: ShoppingCart },
  { path: '/profile', label: 'Profile', icon: User },
]

export function Layout() {
  const location = useLocation()

  return (
    <div 
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '100vh',
        backgroundColor: 'hsl(39 33% 99%)'  /* Brand paper background */
      }}
    >
      {/* Main content area */}
      <main style={{ flex: 1, paddingBottom: '80px' }}>
        <Outlet />
      </main>

      {/* Bottom sticky navigation */}
      <nav 
        style={{
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 50,
          borderTop: '1px solid hsl(43 18% 86%)',
          backgroundColor: 'hsl(0 0% 100% / 0.95)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <div 
          style={{ 
            display: 'flex', 
            height: '64px', 
            maxWidth: '480px',
            margin: '0 auto',
            alignItems: 'center', 
            justifyContent: 'space-around',
            padding: '0 8px',
          }}
        >
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = item.path === '/' 
              ? location.pathname === '/'
              : location.pathname.startsWith(item.path)

            return (
              <NavLink
                key={item.path}
                to={item.path}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  padding: '8px 12px',
                  minWidth: '48px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  color: isActive ? 'hsl(120 14% 54%)' : 'hsl(50 3% 37%)',
                  transition: 'color 0.15s ease',
                }}
              >
                <Icon 
                  size={20}
                  strokeWidth={isActive ? 2.5 : 2}
                  style={{
                    transform: isActive ? 'scale(1.1)' : 'scale(1)',
                    transition: 'transform 0.15s ease',
                  }}
                />
                <span 
                  style={{ 
                    fontSize: '10px', 
                    fontWeight: isActive ? 600 : 500,
                    lineHeight: 1,
                  }}
                >
                  {item.label}
                </span>
              </NavLink>
            )
          })}
        </div>
      </nav>
    </div>
  )
}