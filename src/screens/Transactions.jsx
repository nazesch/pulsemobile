import { useApp } from '../context/AppContext'
import Card from '../components/Card'
import SwipeableTransaction from '../components/SwipeableTransaction'
import { formatCurrency, convertCurrency } from '../utils/format'

// Transaction type icons
const NetflixIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
    <polyline points="17 2 12 7 7 2" />
  </svg>
)

const ATMIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
    <line x1="1" y1="10" x2="23" y2="10" />
  </svg>
)

const SalaryIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
)

const CoffeeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
    <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
    <line x1="6" y1="1" x2="6" y2="4" />
    <line x1="10" y1="1" x2="10" y2="4" />
    <line x1="14" y1="1" x2="14" y2="4" />
  </svg>
)

const InvestmentIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

export default function Transactions() {
  const { transactions, currency, deleteTransaction } = useApp()

  const groupedTransactions = transactions.reduce((acc, transaction) => {
    const date = new Date(transaction.date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
    if (!acc[date]) {
      acc[date] = []
    }
    acc[date].push(transaction)
    return acc
  }, {})

  return (
    <div className="min-h-screen px-4 pt-6 pb-24">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
        <p className="text-gray-600 mt-1">All your money movement</p>
      </div>

      {Object.keys(groupedTransactions).length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-700 mx-auto mb-4">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            </div>
            <p className="text-gray-500">No transactions yet</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedTransactions).map(([date, dateTransactions]) => (
            <div key={date}>
              <h3 className="text-sm font-semibold text-gray-500 mb-3 px-2">
                {date}
              </h3>
              <Card>
                <div className="space-y-4">
                  {dateTransactions.map((transaction) => {
                    const IconComponent = transactionIconMap[transaction.icon] || ATMIcon
                    // Use original amount if currency matches, otherwise convert from USD
                    const displayAmount = transaction.originalAmount !== undefined && transaction.originalCurrency === currency
                      ? transaction.originalAmount
                      : convertCurrency(transaction.amount, 'USD', currency)
                    return (
                    <SwipeableTransaction
                      key={transaction.id}
                      onDelete={() => deleteTransaction(transaction.id)}
                      className=""
                    >
                      <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0 last:pb-0">
                        <div className="flex items-center space-x-4 flex-1">
                          <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-700 flex-shrink-0">
                            <IconComponent />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 truncate">
                              {transaction.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {transaction.type === 'income' ? 'Income' : 'Expense'}
                            </p>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0 ml-4">
                          <p className="font-bold text-lg text-balance text-black">
                            {formatCurrency(Math.abs(displayAmount), currency)}
                          </p>
                        </div>
                      </div>
                    </SwipeableTransaction>
                    )
                  })}
                </div>
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

