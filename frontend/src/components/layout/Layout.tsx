import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { BottomNav } from './BottomNav'
import { Sun, Moon } from 'lucide-react'
import { useStore } from '../../store/useStore'

const TopNav = () => {
  const { theme, setTheme } = useStore()
  const links = [
    { to: '/matchday', label: 'Matchday' },
    { to: '/inplay', label: 'In Play' },
    { to: '/fulltime', label: 'Full Time' },
    { to: '/dugout', label: 'Dugout' },
  ]
  return (
    <div className="hidden md:flex items-center justify-between px-6 h-14 border-b border-border-dark-default bg-bg-dark-primary w-full flex-shrink-0">
      <a href="/matchday" className="font-display text-lg font-medium cursor-pointer no-underline block">
        <span className="text-white">Pitch</span>
        <span className="text-accent-green">Side</span>
      </a>
      <div className="flex items-center gap-6 h-full">
        <button 
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-1.5 rounded-full border border-border-dark-default text-text-dark-secondary hover:text-white transition-colors"
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
        </button>
        {links.map(l => (
          <NavLink 
            key={l.to} 
            to={l.to}
            className={({ isActive }) => `text-sm font-medium tracking-[0.3px] h-full flex items-center border-b-2 transition-colors ${
              isActive ? 'border-accent-green text-accent-green' : 'border-transparent text-text-dark-secondary hover:text-white hover:border-text-dark-secondary'
            }`}
          >
            {l.label}
          </NavLink>
        ))}
      </div>
    </div>
  )
}

export const Layout = () => {
  const location = useLocation()
  const isMatchday = location.pathname === '/matchday' || location.pathname === '/'

  return (
    <div className="flex h-screen bg-bg-primary overflow-hidden">
      {isMatchday && <Sidebar />}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <TopNav />
        <div className="flex-1 overflow-y-auto pb-16 md:pb-0 hide-scrollbar">
          <Outlet />
        </div>
      </main>
      <BottomNav />
    </div>
  )
}
