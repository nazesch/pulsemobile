import { Link, useLocation } from 'react-router-dom'

// Modern line icons as SVG components
const HomeIcon = ({ isActive }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke={isActive ? '#2d5016' : '#6b7280'}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
)

const PocketsIcon = ({ isActive }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke={isActive ? '#2d5016' : '#6b7280'}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
)

const InsightsIcon = ({ isActive }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke={isActive ? '#2d5016' : '#6b7280'}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
)

const AccountIcon = ({ isActive }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke={isActive ? '#2d5016' : '#6b7280'}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)

const iconMap = {
  home: HomeIcon,
  pockets: PocketsIcon,
  insights: InsightsIcon,
  account: AccountIcon,
}

const navItems = [
  { path: '/', label: 'Home', iconKey: 'home' },
  { path: '/pockets', label: 'Pockets', iconKey: 'pockets' },
  { path: '/insights', label: 'Insights', iconKey: 'insights' },
  { path: '/account', label: 'Account', iconKey: 'account' },
]

export default function BottomNavigation() {
  const location = useLocation()

  return (
    <nav className="fixed bottom-0 left-0 right-0 pointer-events-none safe-area-bottom">
      <div className="max-w-md mx-auto px-4 pb-8 pointer-events-auto">
        <div className="glass-effect rounded-full relative overflow-hidden">
          <div className="flex items-center justify-around py-3 relative z-10">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path
              const IconComponent = iconMap[item.iconKey]

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex flex-col items-center justify-center flex-1 py-2 transition-all active:scale-95"
                >
                  <div className="mb-1">
                    <IconComponent isActive={isActive} />
                  </div>
                  <span
                    className={`text-xs font-medium transition-colors ${
                      isActive ? 'text-[#2d5016]' : 'text-gray-500'
                    }`}
                  >
                    {item.label}
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}
