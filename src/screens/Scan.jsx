import { useState } from 'react'
import Card from '../components/Card'
import Button from '../components/Button'
import { useApp } from '../context/AppContext'

export default function Scan() {
  const { addTransaction } = useApp()
  const [scanMode, setScanMode] = useState(null)

  const scanActions = [
    {
      icon: '📄',
      title: 'Scan Document',
      description: 'Upload statements, invoices, or receipts',
      action: () => {
        setScanMode('document')
        // In a real app, this would open camera/document picker
        setTimeout(() => {
          alert('Document scanner would open here')
          setScanMode(null)
        }, 500)
      },
    },
    {
      icon: '📱',
      title: 'Scan QR Code',
      description: 'Pay or transfer using QR codes',
      action: () => {
        setScanMode('qr')
        // In a real app, this would open camera for QR scanning
        setTimeout(() => {
          alert('QR scanner would open here')
          setScanMode(null)
        }, 500)
      },
    },
    {
      icon: '➕',
      title: 'Quick Add',
      description: 'Manually add transaction or asset',
      action: () => {
        setScanMode('add')
      },
    },
  ]

  if (scanMode === 'add') {
    return (
      <QuickAddForm
        onClose={() => setScanMode(null)}
        onAdd={addTransaction}
      />
    )
  }

  return (
    <div className="min-h-screen px-4 pt-6 pb-24 flex flex-col items-center justify-center">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-24 h-24 rounded-full gradient-primary flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-5xl">📷</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Quick Actions</h1>
          <p className="text-gray-600">Choose what you'd like to do</p>
        </div>

        <div className="space-y-4">
          {scanActions.map((action, idx) => (
            <Card
              key={idx}
              onClick={action.action}
              className="cursor-pointer"
            >
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center text-3xl flex-shrink-0">
                  {action.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {action.title}
                  </h3>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </div>
                <div className="text-gray-400">→</div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

function QuickAddForm({ onClose, onAdd }) {
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    type: 'expense',
    icon: '💰',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (formData.name && formData.amount) {
      const amount = parseFloat(formData.amount)
      onAdd({
        ...formData,
        amount: formData.type === 'expense' ? -Math.abs(amount) : Math.abs(amount),
      })
      onClose()
    }
  }

  return (
    <div className="min-h-screen px-4 pt-6 pb-24">
      <div className="mb-6">
        <button
          onClick={onClose}
          className="text-primary-600 font-medium mb-4"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Quick Add</h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-4" style={{ width: '100%', overflowX: 'hidden' }}>
          <div style={{ width: '100%', minWidth: 0 }}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
              style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}
              placeholder="e.g., Grocery Shopping"
              required
            />
          </div>

          <div style={{ width: '100%', minWidth: 0 }}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              inputMode="decimal"
              value={formData.amount}
              onChange={(e) => {
                let value = e.target.value
                // Allow empty string, numbers, and one decimal point
                if (value === '' || /^\d*\.?\d*$/.test(value)) {
                  setFormData({ ...formData, amount: value })
                }
              }}
              onBlur={(e) => {
                // Format to 2 decimal places when user leaves the field
                const value = e.target.value
                if (value && !isNaN(parseFloat(value))) {
                  const formatted = parseFloat(value).toFixed(2)
                  setFormData({ ...formData, amount: formatted })
                }
              }}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-lg"
              style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', letterSpacing: '0.5px' }}
              placeholder="0.00"
              required
            />
            {formData.amount && !isNaN(parseFloat(formData.amount)) && (
              <p className="text-xs text-gray-500 mt-1">
                {parseFloat(formData.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            )}
          </div>

          <div style={{ width: '100%', minWidth: 0 }}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type
            </label>
            <select
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
              style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>

          <div className="flex space-x-2 pt-4">
            <Button
              type="button"
              onClick={onClose}
              variant="ghost"
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" className="flex-1">
              Add
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

