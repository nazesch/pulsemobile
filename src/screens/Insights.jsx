import { useApp } from '../context/AppContext'
import Card from '../components/Card'
import { formatCurrency, convertCurrency } from '../utils/format'

export default function Insights() {
  const { pockets, transactions, totalNetWorth, currency, getPocketBalance } = useApp()

  const largestPocket = pockets.reduce((max, pocket) => {
    const maxBalance = getPocketBalance(max.id)
    const pocketBalance = getPocketBalance(pocket.id)
    return pocketBalance > maxBalance ? pocket : max
  }, pockets[0] || { id: 0, name: 'N/A' })

  return (
    <div className="min-h-screen px-4 pt-6 pb-24">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Insights</h1>
        <p className="text-gray-600 mt-1">Your financial overview</p>
      </div>

      <div className="space-y-4">
        {/* Net Worth Summary */}
        <Card gradient>
          <div className="text-center">
            <p className="text-gray-600 text-sm mb-2">Total Net Worth</p>
            <h2 className="text-4xl font-bold text-balance text-gray-900 mb-4">
              {formatCurrency(convertCurrency(totalNetWorth, 'USD', currency), currency)}
            </h2>
            <div className="flex items-center justify-center space-x-1 text-green-600">
              <span>↗</span>
              <span className="text-sm font-medium">+12.5% this month</span>
            </div>
          </div>
        </Card>

        {/* Top Pocket */}
        <Card>
          <h3 className="font-semibold text-gray-900 mb-4">Largest Pocket</h3>
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-primary-100 flex items-center justify-center text-3xl">
              💼
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900">{largestPocket.name}</p>
              <p className="text-2xl font-bold text-balance text-gray-900">
                {formatCurrency(convertCurrency(getPocketBalance(largestPocket.id), 'USD', currency), currency)}
              </p>
            </div>
          </div>
        </Card>

        {/* Pocket Distribution */}
        <Card>
          <h3 className="font-semibold text-gray-900 mb-4">Pocket Distribution</h3>
          <div className="space-y-3">
            {pockets.map((pocket) => {
              const pocketBalance = getPocketBalance(pocket.id)
              const percentage =
                totalNetWorth !== 0
                  ? (Math.abs(pocketBalance) / Math.abs(totalNetWorth)) * 100
                  : 0
              return (
                <div key={pocket.id}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">
                      {pocket.name}
                    </span>
                    <span className="text-sm font-semibold text-gray-900">
                      {formatCurrency(convertCurrency(pocketBalance, 'USD', currency), currency)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-500 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      </div>
    </div>
  )
}

