import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import Card from '../components/Card'
import Button from '../components/Button'
import { formatCurrency, convertCurrency } from '../utils/format'

// Modern line icons for pockets
const CashIcon = () => (
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
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
    <line x1="1" y1="10" x2="23" y2="10" />
  </svg>
)

const InvestmentsIcon = () => (
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
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
)

const CreditCardIcon = () => (
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
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
    <line x1="1" y1="10" x2="23" y2="10" />
  </svg>
)

const BillsIcon = () => (
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
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
)

const MaintenanceIcon = () => (
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
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  </svg>
)

// Additional icons for categories
const CryptoIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
    <path d="M6.34 6.34l2.83 2.83M14.83 14.83l2.83 2.83M6.34 17.66l2.83-2.83M14.83 9.17l2.83-2.83" />
  </svg>
)

const BankNoteIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="6" width="20" height="12" rx="2" />
    <circle cx="12" cy="12" r="2" />
    <path d="M6 12h.01M18 12h.01" />
  </svg>
)

const HouseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
)

const PackageIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
)

const HeartIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
)

const BriefcaseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
)

const iconMap = {
  '💵': CashIcon,
  '📈': InvestmentsIcon,
  '💳': CreditCardIcon,
  '📋': BillsIcon,
  '🔧': MaintenanceIcon,
  '💼': CashIcon, // Default fallback
}

// Map categories to icon components
const categoryIconMap = {
  'Crypto': CryptoIcon,
  'Venture Capital': InvestmentsIcon,
  'Private Credit': BankNoteIcon,
  'Real Estate': HouseIcon,
  'Public Markets': InvestmentsIcon,
  'Assets': BriefcaseIcon,
  'Commodities': PackageIcon,
  'Philanthropy': HeartIcon,
  'Philanthrophy': HeartIcon, // Support typo variant
  'Other': MaintenanceIcon,
}

// Pastel color backgrounds for pockets (darker pastels)
// Ensures each pocket gets a unique color with no duplicates
const getPocketColor = (pocket, allPockets) => {
  // Assign unique pastel colors - visually distinct colors
  const pastelColors = [
    'bg-blue-100',
    'bg-green-100',
    'bg-purple-100',
    'bg-pink-100',
    'bg-yellow-100',
    'bg-indigo-100',
    'bg-teal-100',
    'bg-orange-100',
    'bg-red-100',
    'bg-cyan-100',
    'bg-emerald-100',
    'bg-violet-100',
    'bg-rose-100',
    'bg-amber-100',
    'bg-sky-100',
    'bg-lime-100',
    'bg-fuchsia-100',
    'bg-stone-100',
  ]
  
  // Sort pockets by ID to get consistent order
  const sortedPockets = [...allPockets].sort((a, b) => a.id - b.id)
  const pocketIndex = sortedPockets.findIndex(p => p.id === pocket.id)
  
  // Use the index in the sorted list to assign color
  // This ensures each pocket gets a unique color based on its position
  return pastelColors[pocketIndex % pastelColors.length]
}

// Get the next available color for a new pocket
const getNextAvailableColor = (allPockets) => {
  const pastelColors = [
    'bg-blue-100',
    'bg-green-100',
    'bg-purple-100',
    'bg-pink-100',
    'bg-yellow-100',
    'bg-indigo-100',
    'bg-teal-100',
    'bg-orange-100',
    'bg-red-100',
    'bg-cyan-100',
    'bg-emerald-100',
    'bg-violet-100',
    'bg-rose-100',
    'bg-amber-100',
    'bg-sky-100',
    'bg-lime-100',
    'bg-fuchsia-100',
    'bg-stone-100',
  ]
  
  // Get all currently used colors
  const sortedPockets = [...allPockets].sort((a, b) => a.id - b.id)
  const usedColors = sortedPockets.map((p, index) => pastelColors[index % pastelColors.length])
  
  // Find the first color that's not used, or cycle through if all are used
  for (let i = 0; i < pastelColors.length; i++) {
    if (!usedColors.includes(pastelColors[i])) {
      return pastelColors[i]
    }
  }
  
  // If all colors are used, use the next one in sequence
  return pastelColors[allPockets.length % pastelColors.length]
}

export default function Pockets() {
  const { pockets, addPocket, currency, getPocketBalance } = useApp()
  const navigate = useNavigate()
  const [showAddModal, setShowAddModal] = useState(false)
  const [newPocket, setNewPocket] = useState({
    name: '',
    category: 'Other',
    balance: 0,
    color: 'blue',
    icon: '💼',
  })

  const categories = [
    'Crypto',
    'Venture Capital',
    'Private Credit',
    'Real Estate',
    'Public Markets',
    'Assets',
    'Commodities',
    'Philanthropy',
    'Other',
  ]

  // Get icon component based on category
  const getIconByCategory = (category) => {
    return categoryIconMap[category] || categoryIconMap['Other']
  }

  const handleAddPocket = () => {
    if (newPocket.name.trim()) {
      // Don't include color - it will be assigned automatically based on position
      const { color, ...pocketWithoutColor } = newPocket
      addPocket(pocketWithoutColor)
      setNewPocket({ name: '', category: 'Other', balance: 0, icon: '💼' })
      setShowAddModal(false)
    }
  }

  const handleCategoryChange = (category) => {
    setNewPocket({ ...newPocket, category })
  }

  const handlePocketClick = (pocket) => {
    navigate(`/pockets/${pocket.id}`)
  }

  return (
    <div className="min-h-screen px-4 pt-6 pb-24">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Pockets</h1>
        <p className="text-gray-600 mt-1">Organize your money by investment</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {pockets.map((pocket) => {
          // Use category-based icon if available, otherwise fall back to iconMap
          const IconComponent = pocket.category 
            ? (categoryIconMap[pocket.category] || categoryIconMap['Other'])
            : (iconMap[pocket.icon] || CashIcon)
          const pastelColor = getPocketColor(pocket, pockets)
          return (
            <Card
              key={pocket.id}
              onClick={() => handlePocketClick(pocket)}
              className={`cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98] ${pastelColor} relative h-56 !shadow-none`}
            >
              {/* Icon in top left with white circular container */}
              <div className="absolute top-4 left-4">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                  <div className="text-gray-700">
                    <IconComponent />
                  </div>
                </div>
              </div>

              {/* Pocket name below icon - 16px away */}
              <div className="absolute top-[80px] left-4">
                <h3 className="font-semibold text-gray-900 text-lg">{pocket.name}</h3>
              </div>

              {/* Balance amount in bottom left */}
              <div className="absolute bottom-4 left-4">
                <p className="text-xs text-gray-500 mb-1">Balance</p>
                <p className="text-2xl font-bold text-balance text-gray-900">
                  {formatCurrency(convertCurrency(getPocketBalance(pocket.id), 'USD', currency), currency)}
                </p>
              </div>
            </Card>
          )
        })}
      </div>

      <Button
        onClick={() => setShowAddModal(true)}
        variant="secondary"
        className="w-full !bg-black !text-white !border-0 py-4"
      >
        + Add Pocket
      </Button>

      {/* Add Pocket Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center p-4 z-50">
          <Card className="w-full max-w-sm mb-4 rounded-t-3xl rounded-b-2xl">
            <h2 className="text-xl font-bold mb-4">Add New Pocket</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={newPocket.name}
                  onChange={(e) =>
                    setNewPocket({ ...newPocket, name: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., Vacation Fund"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={newPocket.category}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex space-x-2">
                <Button
                  onClick={() => setShowAddModal(false)}
                  variant="ghost"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button onClick={handleAddPocket} variant="primary" className="flex-1">
                  Add
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
