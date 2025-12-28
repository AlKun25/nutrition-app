import { Outlet, NavLink } from 'react-router-dom'
import { LayoutDashboard, User, BookOpen, Package, Calendar, ShoppingCart } from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/profile', label: 'Profile', icon: User },
  { path: '/recipes', label: 'Recipes', icon: BookOpen },
  { path: '/pantry', label: 'Pantry', icon: Package },
  { path: '/meal-plan', label: 'Meal Plan', icon: Calendar },
  { path: '/grocery', label: 'Grocery', icon: ShoppingCart },
]

export function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 pb-20">
        <Outlet />
      </main>
      <nav className="fixed bottom-0 left-0 right-0 border-t bg-background z-50">
        <div className="grid grid-cols-6 h-16">
          {navigation.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  cn(
                    'flex flex-col items-center justify-center gap-1 text-xs transition-colors',
                    isActive
                      ? 'text-primary font-medium'
                      : 'text-muted-foreground hover:text-foreground'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className={cn('h-5 w-5', isActive && 'text-primary')} />
                    <span className="text-[10px] leading-tight">{item.label}</span>
                  </>
                )}
              </NavLink>
            )
          })}
        </div>
      </nav>
    </div>
  )
}

