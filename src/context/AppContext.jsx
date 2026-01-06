import { createContext, useContext, useState, useMemo, useEffect, useCallback } from 'react'

const AppContext = createContext()

// Default data for initial load
// Note: balance is now calculated from transactions, not stored
const defaultPockets = [
  { id: 1, name: 'Cash', color: 'blue', icon: '💵', category: 'Assets' },
  { id: 2, name: 'Investments', color: 'green', icon: '📈', category: 'Public Markets' },
  { id: 3, name: 'Credit Cards', color: 'red', icon: '💳', category: 'Other' },
  { id: 4, name: 'Bills', color: 'orange', icon: '📋', category: 'Other' },
  { id: 5, name: 'Maintenance', color: 'purple', icon: '🔧', category: 'Other' },
]

const defaultTransactions = [
  { id: 1, type: 'expense', name: 'Netflix', amount: 15.99, date: '2024-01-15', icon: '🎬', pocketId: 3 },
  { id: 2, type: 'expense', name: 'ATM Withdrawal', amount: 200, date: '2024-01-14', icon: '🏧', pocketId: 1 },
  { id: 3, type: 'income', name: 'Salary', amount: 5000, date: '2024-01-10', icon: '💰', pocketId: 1 },
  { id: 4, type: 'expense', name: 'QR Pay - Coffee', amount: 4.50, date: '2024-01-13', icon: '☕', pocketId: 3 },
  { id: 5, type: 'expense', name: 'Investment Return', amount: 1250, date: '2024-01-12', icon: '📊', pocketId: 2 },
]

export function AppProvider({ children }) {
  const [user, setUser] = useState({ name: 'Daniel' })
  const [currency, setCurrency] = useState(() => {
    const saved = localStorage.getItem('currency')
    return saved || 'USD'
  })

  // Load pockets from localStorage or use defaults
  const [pockets, setPockets] = useState(() => {
    try {
      const saved = localStorage.getItem('pulse_pockets')
      if (saved) {
        const parsed = JSON.parse(saved)
        // Remove balance field from existing pockets - balance is now calculated from transactions
        return parsed.map(pocket => {
          const { balance, ...pocketWithoutBalance } = pocket
          return pocketWithoutBalance
        })
      }
    } catch (error) {
      console.error('Error loading pockets from localStorage:', error)
    }
    return defaultPockets
  })

  // Load transactions from localStorage or use defaults
  const [transactions, setTransactions] = useState(() => {
    try {
      const saved = localStorage.getItem('pulse_transactions')
      if (saved) {
        const parsed = JSON.parse(saved)
        // Migration: Ensure all transactions have pocketId and proper amount format
        const migrated = parsed.map(transaction => {
          // Ensure amount is a number and positive (we use Math.abs in calculation)
          const amount = typeof transaction.amount === 'number' 
            ? Math.abs(transaction.amount) 
            : Math.abs(parseFloat(transaction.amount) || 0)
          
          // Ensure pocketId exists - if not, try to infer from legacy mapping or assign to first pocket
          let pocketId = transaction.pocketId
          if (pocketId === undefined || pocketId === null) {
            // Legacy transaction ID mapping (only for old default transactions)
            const legacyMapping = {
              1: 3, // Netflix -> Credit Cards
              2: 1, // ATM Withdrawal -> Cash
              3: 1, // Salary -> Cash
              4: 3, // QR Pay -> Credit Cards
              5: 2, // Investment Return -> Investments
            }
            pocketId = legacyMapping[transaction.id] || 1 // Default to first pocket if unknown
          }
          
          return {
            ...transaction,
            amount,
            pocketId: typeof pocketId === 'string' ? parseInt(pocketId, 10) : pocketId,
          }
        })
        
        // Save migrated transactions back to localStorage
        localStorage.setItem('pulse_transactions', JSON.stringify(migrated))
        return migrated
      }
    } catch (error) {
      console.error('Error loading transactions from localStorage:', error)
    }
    return defaultTransactions
  })

  // Save currency to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('currency', currency)
  }, [currency])

  // Save pockets to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('pulse_pockets', JSON.stringify(pockets))
    } catch (error) {
      console.error('Error saving pockets to localStorage:', error)
    }
  }, [pockets])

  // Save transactions to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('pulse_transactions', JSON.stringify(transactions))
    } catch (error) {
      console.error('Error saving transactions to localStorage:', error)
    }
  }, [transactions])

  // Calculate pocket balance from transactions
  const getPocketBalance = useCallback((pocketId) => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/cf5b3080-7cbe-407c-bc05-9619da1a765a',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AppContext.jsx:85',message:'getPocketBalance called',data:{pocketId,pocketIdType:typeof pocketId,transactionsLength:transactions?.length,transactionsType:Array.isArray(transactions)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    if (!pocketId || !transactions || !Array.isArray(transactions)) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/cf5b3080-7cbe-407c-bc05-9619da1a765a',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AppContext.jsx:88',message:'getPocketBalance early return',data:{hasPocketId:!!pocketId,hasTransactions:!!transactions,isArray:Array.isArray(transactions)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      return 0
    }
    try {
      const pocketIdNum = typeof pocketId === 'string' ? parseInt(pocketId, 10) : pocketId
      if (isNaN(pocketIdNum)) {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/cf5b3080-7cbe-407c-bc05-9619da1a765a',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AppContext.jsx:93',message:'getPocketBalance NaN check',data:{pocketIdNum},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
        // #endregion
        return 0
      }
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/cf5b3080-7cbe-407c-bc05-9619da1a765a',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AppContext.jsx:96',message:'Before filter transactions',data:{pocketIdNum,transactionsLength:transactions.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      const filtered = transactions.filter(t => {
        if (!t || t.pocketId === undefined || t.pocketId === null) return false
        const tPocketId = typeof t.pocketId === 'string' ? parseInt(t.pocketId, 10) : t.pocketId
        return tPocketId === pocketIdNum
      })
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/cf5b3080-7cbe-407c-bc05-9619da1a765a',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AppContext.jsx:103',message:'After filter transactions',data:{filteredLength:filtered.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      const result = filtered.reduce((sum, t) => {
        const amount = t.amount || 0
        return sum + Math.abs(typeof amount === 'number' ? amount : parseFloat(amount) || 0)
      }, 0)
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/cf5b3080-7cbe-407c-bc05-9619da1a765a',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AppContext.jsx:108',message:'getPocketBalance result',data:{result},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      return result
    } catch (error) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/cf5b3080-7cbe-407c-bc05-9619da1a765a',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AppContext.jsx:111',message:'Error in getPocketBalance',data:{error:error.message,errorStack:error.stack},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      console.error('Error calculating pocket balance:', error)
      return 0
    }
  }, [transactions])

  // Calculate total net worth as sum of all pocket balances
  const totalNetWorth = useMemo(() => {
    if (!pockets || !Array.isArray(pockets)) return 0
    try {
      return pockets.reduce((sum, pocket) => {
        if (!pocket || !pocket.id) return sum
        const balance = getPocketBalance(pocket.id)
        return sum + (isNaN(balance) ? 0 : balance)
      }, 0)
    } catch (error) {
      console.error('Error calculating total net worth:', error)
      return 0
    }
  }, [pockets, getPocketBalance])

  const addTransaction = (transaction) => {
    const newTransaction = {
      id: Date.now(),
      ...transaction,
      // Use the provided date, or default to today if not provided
      date: transaction.date || new Date().toISOString().split('T')[0],
      // Ensure amount is a positive number
      amount: typeof transaction.amount === 'number' 
        ? Math.abs(transaction.amount) 
        : Math.abs(parseFloat(transaction.amount) || 0),
      // Ensure pocketId is a number
      pocketId: transaction.pocketId !== undefined && transaction.pocketId !== null
        ? (typeof transaction.pocketId === 'string' ? parseInt(transaction.pocketId, 10) : transaction.pocketId)
        : 1, // Default to first pocket if missing
    }
    setTransactions(prev => [newTransaction, ...prev])
    // Balance is now calculated from transactions, no need to update pocket balance
  }

  const updateTransaction = (id, updates) => {
    setTransactions(prev => prev.map(transaction => 
      transaction.id === id ? { ...transaction, ...updates } : transaction
    ))
    // Balance is now calculated from transactions, no need to update pocket balance
  }

  const updatePocket = (id, updates) => {
    setPockets(prev => prev.map(pocket => 
      pocket.id === id ? { ...pocket, ...updates } : pocket
    ))
  }

  const addPocket = (pocket) => {
    const newPocket = {
      id: Date.now(),
      ...pocket,
      // New pockets start with 0 balance (calculated from transactions)
    }
    setPockets(prev => [...prev, newPocket])
  }

  const deletePocket = (id) => {
    setPockets(prev => prev.filter(pocket => pocket.id !== id))
  }

  const deleteTransaction = (id) => {
    setTransactions(prev => prev.filter(transaction => transaction.id !== id))
  }

  const value = {
    user,
    setUser,
    pockets,
    setPockets,
    transactions,
    setTransactions,
    totalNetWorth,
    getPocketBalance,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    updatePocket,
    addPocket,
    deletePocket,
    currency,
    setCurrency,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within AppProvider')
  }
  return context
}

