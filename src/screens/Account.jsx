import { useApp } from '../context/AppContext'
import Card from '../components/Card'
import Button from '../components/Button'
import { useState } from 'react'

// Modern line icons
const ProfileIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)

const NotificationsIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
)

const SecurityIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
)

const PaymentIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
    <line x1="1" y1="10" x2="23" y2="10" />
  </svg>
)

const HelpIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
)

const AboutIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
)

const SettingsIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M12 1v6m0 6v6M5.64 5.64l4.24 4.24m4.24 4.24l4.24 4.24M1 12h6m6 0h6M5.64 18.36l4.24-4.24m4.24-4.24l4.24-4.24" />
  </svg>
)

const CurrencyIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
)

export default function Account() {
  const { user, currency, setCurrency } = useApp()
  const [showCurrencyModal, setShowCurrencyModal] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem('isOnboarded')
    window.location.reload()
  }

  const accountOptions = [
    { icon: ProfileIcon, label: 'Profile Settings', action: () => console.log('Profile') },
    { icon: NotificationsIcon, label: 'Notifications', action: () => console.log('Notifications') },
    { icon: SecurityIcon, label: 'Security', action: () => console.log('Security') },
    { icon: HelpIcon, label: 'Help & Support', action: () => console.log('Help') },
    { icon: AboutIcon, label: 'About', action: () => console.log('About') },
  ]

  const currencies = [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'COP', name: 'Colombian Peso', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
  ]

  return (
    <div className="min-h-screen px-4 pt-6 pb-24">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Account</h1>
        <p className="text-gray-600 mt-1">Manage your account settings</p>
      </div>

      {/* Profile Card */}
      <Card className="mb-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center text-3xl text-white">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
            <p className="text-gray-600 text-sm">Member since 2024</p>
          </div>
        </div>
      </Card>

      {/* App Settings Section */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3 px-2">App Settings</h2>
        <Card onClick={() => setShowCurrencyModal(true)} className="cursor-pointer">
          <div className="flex items-center space-x-4">
            <div className="text-gray-700">
              <CurrencyIcon />
            </div>
            <div className="flex-1">
              <span className="font-medium text-gray-900">Currency</span>
              <p className="text-sm text-gray-500">
                {currencies.find(c => c.code === currency)?.name || 'USD'}
              </p>
            </div>
            <span className="text-gray-400">→</span>
          </div>
        </Card>
      </div>

      {/* Account Options */}
      <div className="space-y-2 mb-6">
        {accountOptions.map((option, idx) => {
          const IconComponent = option.icon
          return (
            <Card
              key={idx}
              className="opacity-50 cursor-not-allowed"
            >
              <div className="flex items-center space-x-4">
                <div className="text-gray-400">
                  <IconComponent />
                </div>
                <span className="flex-1 font-medium text-gray-400">
                  {option.label}
                </span>
                <span className="text-gray-300">→</span>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Logout Button */}
      <Button
        onClick={handleLogout}
        variant="ghost"
        className="w-full text-red-600 opacity-50 cursor-not-allowed"
        disabled
      >
        Log Out
      </Button>

      {/* Currency Selection Modal */}
      {showCurrencyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Select Currency</h2>
              <button
                onClick={() => setShowCurrencyModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className="space-y-2">
              {currencies.map((curr) => (
                <button
                  key={curr.code}
                  onClick={() => {
                    setCurrency(curr.code)
                    setShowCurrencyModal(false)
                  }}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                    currency === curr.code
                      ? 'border-[#2d5016] bg-[#2d5016]/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">{curr.name}</p>
                      <p className="text-sm text-gray-500">{curr.code}</p>
                    </div>
                    {currency === curr.code && (
                      <div className="w-5 h-5 rounded-full bg-[#2d5016] flex items-center justify-center">
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="white"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
