import { NavLink } from 'react-router-dom'
import { Calendar, Activity, CheckCircle, HelpCircle } from 'lucide-react'

export const BottomNav = () => {
  const navItems = [
    { to: '/matchday', icon: Calendar, label: 'Matchday' },
    { to: '/inplay', icon: Activity, label: 'In Play' },
    { to: '/fulltime', icon: CheckCircle, label: 'Full Time' },
    { to: '/dugout', icon: HelpCircle, label: 'Dugout' },
  ]

  return (
    <nav className="md:hidden fixed bottom-0 w-full bg-bg-sidebar border-t border-border-dark-default flex justify-around items-center h-16 z-50">
      {navItems.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center w-full h-full space-y-1 ${
              isActive ? 'text-accent-green' : 'text-text-dark-secondary hover:text-white'
            }`
          }
        >
          <Icon className="w-5 h-5" />
          <span className="text-[14px] font-medium">{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
