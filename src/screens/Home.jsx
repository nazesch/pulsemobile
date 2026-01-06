import { useApp } from '../context/AppContext'
import Card from '../components/Card'
import { useNavigate } from 'react-router-dom'
import { formatCurrency, convertCurrency } from '../utils/format'

// Modern line icons for action buttons
const AddIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
)

const WithdrawIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <polyline points="19 12 12 19 5 12" />
  </svg>
)

const InvestIcon = () => (
  <svg
    width="20"
    height="20"
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

const TransferIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="9 18 15 12 9 6" />
    <polyline points="15 18 21 12 15 6" />
  </svg>
)

// Transaction type icons
const NetflixIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
    <polyline points="17 2 12 7 7 2" />
  </svg>
)

const ATMIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
    <line x1="1" y1="10" x2="23" y2="10" />
  </svg>
)

const SalaryIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
)

const CoffeeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
    <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
    <line x1="6" y1="1" x2="6" y2="4" />
    <line x1="10" y1="1" x2="10" y2="4" />
    <line x1="14" y1="1" x2="14" y2="4" />
  </svg>
)

const InvestmentIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
)

const transactionIconMap = {
  '🎬': NetflixIcon,
  '🏧': ATMIcon,
  '💰': SalaryIcon,
  '☕': CoffeeIcon,
  '📊': InvestmentIcon,
}

const iconMap = {
  add: AddIcon,
  withdraw: WithdrawIcon,
  invest: InvestIcon,
  transfer: TransferIcon,
}

export default function Home() {
  const { user, totalNetWorth, transactions, currency } = useApp()
  const navigate = useNavigate()

  const recentTransactions = transactions.slice(0, 5)

  const actionButtons = [
    { iconKey: 'add', label: 'Add', action: () => console.log('Add funds') },
    { iconKey: 'withdraw', label: 'Withdraw', action: () => console.log('Withdraw') },
    { iconKey: 'invest', label: 'Invest', action: () => navigate('/pockets') },
    { iconKey: 'transfer', label: 'Transfer', action: () => navigate('/pockets') },
  ]

  const convertedNetWorth = convertCurrency(totalNetWorth, 'USD', currency)

  return (
    <div className="min-h-screen px-4 pt-6 pb-24">
      {/* Centered Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Pulse</h1>
        <p className="text-gray-600 text-sm">
          {user.name}, here's your financial overview
        </p>
      </div>

      {/* Balance Card */}
      <Card className="mb-6 gradient-primary text-white">
        <div className="mb-6">
          <p className="text-white/80 text-sm mb-2">Total Net Worth</p>
          <h2 className="text-4xl font-bold text-balance">
            {formatCurrency(convertedNetWorth, currency)}
          </h2>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-4 gap-3">
          {actionButtons.map((btn, idx) => {
            const IconComponent = iconMap[btn.iconKey]
            return (
              <button
                key={idx}
                onClick={btn.action}
                className="flex flex-col items-center justify-center p-3 bg-white/20 rounded-xl backdrop-blur-sm transition-transform active:scale-95 text-white"
              >
                <div className="mb-1">
                  <IconComponent />
                </div>
                <span className="text-xs font-medium">{btn.label}</span>
              </button>
            )
          })}
        </div>
      </Card>

      {/* Recent Activity */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <Card>
          <div className="space-y-4">
            {recentTransactions.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No transactions yet</p>
            ) : (
              recentTransactions.map((transaction) => {
                const IconComponent = transactionIconMap[transaction.icon] || ATMIcon
                // Use original amount if currency matches, otherwise convert from USD
                const convertedAmount = transaction.originalAmount !== undefined && transaction.originalCurrency === currency
                  ? transaction.originalAmount
                  : convertCurrency(transaction.amount, 'USD', currency)
                return (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between py-2"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-700">
                        <IconComponent />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{transaction.name}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(transaction.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-balance text-black">
                        {formatCurrency(Math.abs(convertedAmount), currency)}
                      </p>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </Card>
      </div>

      {/* Quick View All */}
      <button
        onClick={() => navigate('/transactions')}
        className="text-primary-600 font-medium text-sm w-full text-center py-2"
      >
        View All Transactions →
      </button>
    </div>
  )
}
