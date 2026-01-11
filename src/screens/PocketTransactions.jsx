import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import Card from '../components/Card'
import Button from '../components/Button'
import SwipeableTransaction from '../components/SwipeableTransaction'
import { formatCurrency, convertCurrency } from '../utils/format'
import { TOP_20_CRYPTO, fetchCryptoPrice, convertCryptoToUSD } from '../utils/crypto'

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

// Get transactions for a specific pocket
const getPocketTransactions = (pocketId, allTransactions) => {
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/cf5b3080-7cbe-407c-bc05-9619da1a765a',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'PocketTransactions.jsx:56',message:'getPocketTransactions called',data:{pocketId,pocketIdType:typeof pocketId,allTransactionsLength:allTransactions?.length,allTransactionsType:Array.isArray(allTransactions)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
  // #endregion
  // Ensure pocketId is a number for consistent comparison
  const pocketIdNum = typeof pocketId === 'string' ? parseInt(pocketId, 10) : pocketId
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/cf5b3080-7cbe-407c-bc05-9619da1a765a',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'PocketTransactions.jsx:60',message:'Before filter in getPocketTransactions',data:{pocketIdNum,isNaN:isNaN(pocketIdNum)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
  // #endregion
  
  // Filter transactions by pocketId
  // For legacy transactions without pocketId, use hardcoded mapping only for initial pockets (1-5)
  try {
    const result = allTransactions.filter(t => {
      // If transaction has pocketId, use it (works for all pockets, new and old)
      if (t.pocketId !== undefined && t.pocketId !== null) {
        // Ensure both are numbers for comparison
        const tPocketId = typeof t.pocketId === 'string' ? parseInt(t.pocketId, 10) : t.pocketId
        return tPocketId === pocketIdNum
      }
      // Legacy mapping only for initial pockets (1-5) that don't have pocketId set
      // This ensures backward compatibility with existing sample data
      if (pocketIdNum >= 1 && pocketIdNum <= 5) {
        const legacyMapping = {
          1: [2, 3], // Cash
          2: [5], // Investments
          3: [1, 4], // Credit Cards
          4: [1], // Bills
          5: [], // Maintenance
        }
        const legacyIds = legacyMapping[pocketIdNum] || []
        return legacyIds.includes(t.id)
      }
      // For newly created pockets (ID > 5), only show transactions with matching pocketId
      return false
    })
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/cf5b3080-7cbe-407c-bc05-9619da1a765a',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'PocketTransactions.jsx:88',message:'getPocketTransactions result',data:{resultLength:result.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
    return result
  } catch (error) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/cf5b3080-7cbe-407c-bc05-9619da1a765a',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'PocketTransactions.jsx:91',message:'Error in getPocketTransactions filter',data:{error:error.message,errorStack:error.stack},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
    throw error
  }
}

export default function PocketTransactions() {
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/cf5b3080-7cbe-407c-bc05-9619da1a765a',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'PocketTransactions.jsx:87',message:'Component render start',data:{timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
  // #endregion
  const { pocketId } = useParams()
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/cf5b3080-7cbe-407c-bc05-9619da1a765a',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'PocketTransactions.jsx:90',message:'pocketId from params',data:{pocketId,pocketIdType:typeof pocketId},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
  // #endregion
  const navigate = useNavigate()
  const { pockets, transactions, currency, addTransaction, updateTransaction, deleteTransaction, updatePocket, deletePocket, getPocketBalance } = useApp()
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/cf5b3080-7cbe-407c-bc05-9619da1a765a',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'PocketTransactions.jsx:93',message:'useApp hook result',data:{pocketsLength:pockets?.length,transactionsLength:transactions?.length,hasGetPocketBalance:typeof getPocketBalance==='function',pocketsType:Array.isArray(pockets),transactionsType:Array.isArray(transactions)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
  // #endregion
  
  const statuses = ['Paid', 'Pending', 'Due']
  const sources = ['Fuse', 'Bancolombia', 'Revolut', 'ABN', 'Bunq', 'Wise', 'Trade Republic', 'AMEX', 'Global66', 'Cash']
  const currencies = ['COP', 'USD', 'EUR']

  const pocketIdNum = parseInt(pocketId, 10)
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/cf5b3080-7cbe-407c-bc05-9619da1a765a',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'PocketTransactions.jsx:117',message:'Before pocket lookup',data:{pocketIdNum,isNaN:isNaN(pocketIdNum),pocketsLength:pockets?.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
  // #endregion
  // Find pocket with flexible ID matching (handle both string and number IDs)
  const pocket = pockets.find(p => {
    const pId = typeof p.id === 'string' ? parseInt(p.id, 10) : p.id
    return pId === pocketIdNum
  })
  
  // Check if current pocket is Crypto category (must be after pocket is defined)
  const isCryptoPocket = pocket?.category === 'Crypto'
  
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState(null)
  const [showKebabMenu, setShowKebabMenu] = useState(false)
  const [showRenameModal, setShowRenameModal] = useState(false)
  const [newPocketName, setNewPocketName] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    status: 'Paid',
    source: 'Cash',
    amount: '',
    currency: 'USD',
    date: new Date().toISOString().split('T')[0],
    description: '',
    icon: '🏧',
  })
  
  // Crypto-specific form state
  const [cryptoFormData, setCryptoFormData] = useState({
    cryptoAsset: 'BTC',
    cryptoAmount: '',
    usdAmount: 0,
  })
  const [isLoadingPrice, setIsLoadingPrice] = useState(false)
  const [priceError, setPriceError] = useState(null)
  
  // Scroll to top when component mounts or pocketId changes
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pocketId])

  // Fetch crypto price when asset or amount changes
  useEffect(() => {
    // Only run if pocket is loaded and is a crypto pocket
    if (!pocket) return
    
    if (isCryptoPocket && cryptoFormData.cryptoAsset && cryptoFormData.cryptoAmount) {
      const amount = parseFloat(cryptoFormData.cryptoAmount)
      if (!isNaN(amount) && amount > 0) {
        setIsLoadingPrice(true)
        setPriceError(null)
        convertCryptoToUSD(amount, cryptoFormData.cryptoAsset)
          .then(usdAmount => {
            setCryptoFormData(prev => ({ ...prev, usdAmount }))
            setIsLoadingPrice(false)
          })
          .catch(error => {
            console.error('Error fetching crypto price:', error)
            setPriceError('Failed to fetch price. Please try again.')
            setIsLoadingPrice(false)
            setCryptoFormData(prev => ({ ...prev, usdAmount: 0 }))
          })
      } else {
        setCryptoFormData(prev => ({ ...prev, usdAmount: 0 }))
      }
    } else if (!isCryptoPocket) {
      // Reset crypto form data if not a crypto pocket
      setCryptoFormData(prev => ({ ...prev, usdAmount: 0 }))
    }
  }, [cryptoFormData.cryptoAsset, cryptoFormData.cryptoAmount, isCryptoPocket, pocket])
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/cf5b3080-7cbe-407c-bc05-9619da1a765a',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'PocketTransactions.jsx:123',message:'After pocket lookup',data:{pocketFound:!!pocket,pocketId:pocket?.id,pocketName:pocket?.name},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
  // #endregion
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/cf5b3080-7cbe-407c-bc05-9619da1a765a',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'PocketTransactions.jsx:124',message:'Before getPocketTransactions',data:{pocketIdNum,transactionsLength:transactions?.length,transactionsType:Array.isArray(transactions)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
  // #endregion
  let pocketTransactions = []
  try {
    pocketTransactions = pocket ? getPocketTransactions(pocketIdNum, transactions) : []
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/cf5b3080-7cbe-407c-bc05-9619da1a765a',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'PocketTransactions.jsx:128',message:'After getPocketTransactions',data:{pocketTransactionsLength:pocketTransactions.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
  } catch (error) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/cf5b3080-7cbe-407c-bc05-9619da1a765a',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'PocketTransactions.jsx:131',message:'Error in getPocketTransactions',data:{error:error.message,errorStack:error.stack},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
    console.error('Error getting pocket transactions:', error)
    pocketTransactions = []
  }
  
  // Safely get pocket balance with error handling
  let pocketBalance = 0
  try {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/cf5b3080-7cbe-407c-bc05-9619da1a765a',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'PocketTransactions.jsx:138',message:'Before getPocketBalance',data:{hasPocket:!!pocket,hasGetPocketBalance:typeof getPocketBalance==='function',pocketId:pocket?.id},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    if (pocket && getPocketBalance) {
      pocketBalance = getPocketBalance(pocket.id)
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/cf5b3080-7cbe-407c-bc05-9619da1a765a',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'PocketTransactions.jsx:141',message:'After getPocketBalance',data:{pocketBalance,balanceType:typeof pocketBalance},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
    }
  } catch (error) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/cf5b3080-7cbe-407c-bc05-9619da1a765a',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'PocketTransactions.jsx:144',message:'Error in getPocketBalance',data:{error:error.message,errorStack:error.stack},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    console.error('Error calculating pocket balance:', error)
    pocketBalance = 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (isCryptoPocket) {
      // Handle crypto transaction
      if (cryptoFormData.cryptoAsset && cryptoFormData.cryptoAmount) {
        const cryptoAmount = parseFloat(cryptoFormData.cryptoAmount)
        if (!isNaN(cryptoAmount) && cryptoAmount > 0) {
          const usdAmount = cryptoFormData.usdAmount || await convertCryptoToUSD(cryptoAmount, cryptoFormData.cryptoAsset)
          
          const transactionData = {
            name: `${cryptoFormData.cryptoAsset} Holdings`,
            status: 'Paid',
            source: 'Crypto Wallet',
            amount: usdAmount, // USD equivalent for balance calculations
            originalAmount: cryptoAmount, // Original crypto amount
            originalCurrency: cryptoFormData.cryptoAsset, // Crypto code
            currency: 'USD', // Always USD for crypto
            date: formData.date,
            description: `${cryptoAmount} ${cryptoFormData.cryptoAsset}`,
            icon: '💎',
            cryptoAsset: cryptoFormData.cryptoAsset,
            cryptoAmount: cryptoAmount,
            pocketId: editingTransaction?.pocketId !== undefined 
              ? (typeof editingTransaction.pocketId === 'string' ? parseInt(editingTransaction.pocketId, 10) : editingTransaction.pocketId)
              : pocketIdNum,
          }

          if (editingTransaction) {
            updateTransaction(editingTransaction.id, transactionData)
          } else {
            addTransaction(transactionData)
          }
          
          // Reset forms
          setFormData({
            name: '',
            status: 'Paid',
            source: 'Cash',
            amount: '',
            currency: 'USD',
            date: new Date().toISOString().split('T')[0],
            description: '',
            icon: '🏧',
          })
          setCryptoFormData({
            cryptoAsset: 'BTC',
            cryptoAmount: '',
            usdAmount: 0,
          })
          setShowAddModal(false)
          setEditingTransaction(null)
          setPriceError(null)
        }
      }
    } else {
      // Handle regular transaction
      if (formData.name && formData.amount) {
        const amount = parseFloat(formData.amount)
        // Store the original amount in the original currency to preserve precision
        // Also store USD equivalent for balance calculations
        const originalAmount = Math.abs(amount)
        const amountInUSD = convertCurrency(originalAmount, formData.currency, 'USD')
        const transactionData = {
          name: formData.name,
          status: formData.status,
          source: formData.source,
          amount: amountInUSD, // USD equivalent for balance calculations
          originalAmount: originalAmount, // Original amount entered by user
          originalCurrency: formData.currency, // Original currency entered by user
          currency: formData.currency, // Keep for backward compatibility
          date: formData.date,
          description: formData.description || '',
          icon: '🏧',
          pocketId: editingTransaction?.pocketId !== undefined 
            ? (typeof editingTransaction.pocketId === 'string' ? parseInt(editingTransaction.pocketId, 10) : editingTransaction.pocketId)
            : pocketIdNum, // Preserve existing pocketId or use current pocket
        }

        if (editingTransaction) {
          updateTransaction(editingTransaction.id, transactionData)
        } else {
          addTransaction(transactionData)
        }
        
        setFormData({
          name: '',
          status: 'Paid',
          source: 'Cash',
          amount: '',
          currency: 'USD',
          date: new Date().toISOString().split('T')[0],
          description: '',
          icon: '🏧',
        })
        setShowAddModal(false)
        setEditingTransaction(null)
      }
    }
  }

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction)
    
    // Check if it's a crypto transaction
    if (transaction.cryptoAsset && transaction.cryptoAmount !== undefined) {
      setCryptoFormData({
        cryptoAsset: transaction.cryptoAsset,
        cryptoAmount: transaction.cryptoAmount.toString(),
        usdAmount: transaction.amount || 0,
      })
      setFormData({
        name: transaction.name || '',
        status: transaction.status || 'Paid',
        source: transaction.source || 'Crypto Wallet',
        amount: '',
        currency: 'USD',
        date: transaction.date || new Date().toISOString().split('T')[0],
        description: transaction.description || '',
        icon: transaction.icon || '💎',
      })
    } else {
      // Regular transaction
      const originalAmount = transaction.originalAmount !== undefined
        ? transaction.originalAmount
        : (transaction.currency 
            ? convertCurrency(Math.abs(transaction.amount), 'USD', transaction.currency)
            : Math.abs(transaction.amount))
      
      setFormData({
        name: transaction.name || '',
        status: transaction.status || 'Paid',
        source: transaction.source || 'Cash',
        amount: originalAmount.toString(),
        currency: transaction.originalCurrency || transaction.currency || 'USD',
        date: transaction.date || new Date().toISOString().split('T')[0],
        description: transaction.description || '',
        icon: transaction.icon || '🏧',
      })
      setCryptoFormData({
        cryptoAsset: 'BTC',
        cryptoAmount: '',
        usdAmount: 0,
      })
    }
    setShowAddModal(true)
  }

  const handleCancel = () => {
    setShowAddModal(false)
    setEditingTransaction(null)
    setFormData({
      name: '',
      status: 'Paid',
      source: 'Cash',
      amount: '',
      currency: 'USD',
      date: new Date().toISOString().split('T')[0],
      description: '',
      icon: '🏧',
    })
    setCryptoFormData({
      cryptoAsset: 'BTC',
      cryptoAmount: '',
      usdAmount: 0,
    })
    setPriceError(null)
  }

  const handleRename = () => {
    if (pocket && newPocketName.trim()) {
      updatePocket(pocket.id, { name: newPocketName.trim() })
      setNewPocketName('')
      setShowRenameModal(false)
      setShowKebabMenu(false)
    }
  }

  const handleDelete = () => {
    if (pocket && window.confirm(`Are you sure you want to delete "${pocket.name}"? This action cannot be undone.`)) {
      deletePocket(pocket.id)
      navigate('/pockets')
    }
    setShowKebabMenu(false)
  }

  const handleRenameClick = () => {
    if (pocket) {
      setNewPocketName(pocket.name)
      setShowRenameModal(true)
      setShowKebabMenu(false)
    }
  }

  if (!pocket) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/cf5b3080-7cbe-407c-bc05-9619da1a765a',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'PocketTransactions.jsx:299',message:'Pocket not found - rendering not found message',data:{pocketIdNum,pocketsLength:pockets?.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    // #endregion
    return (
      <div className="min-h-screen px-4 pt-6 pb-24 flex items-center justify-center">
        <Card>
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">Pocket not found</p>
            <Button onClick={() => navigate('/pockets')} variant="primary">
              Back to Pockets
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/cf5b3080-7cbe-407c-bc05-9619da1a765a',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'PocketTransactions.jsx:310',message:'Rendering main component',data:{pocketId:pocket.id,pocketName:pocket.name,pocketBalance,pocketTransactionsLength:pocketTransactions.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
  // #endregion
  return (
    <div className="min-h-screen px-4 pt-6 pb-24">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate('/pockets')}
            className="text-[#2d5016] font-medium flex items-center"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back
          </button>
          <div className="relative">
            <button
              onClick={() => setShowKebabMenu(!showKebabMenu)}
              className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
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
                <circle cx="12" cy="12" r="1" />
                <circle cx="12" cy="5" r="1" />
                <circle cx="12" cy="19" r="1" />
              </svg>
            </button>
            {showKebabMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowKebabMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden">
                  <button
                    onClick={handleRenameClick}
                    className="w-full text-left px-4 py-3 text-gray-900 hover:bg-gray-50 transition-colors flex items-center"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-3"
                    >
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                    Change Name
                  </button>
                  <button
                    onClick={handleDelete}
                    className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 transition-colors flex items-center"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-3"
                    >
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                    Delete Pocket
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">{pocket.name}</h1>
        <p className="text-3xl font-bold text-black mt-1">
          {(() => {
            try {
              const converted = convertCurrency(pocketBalance, 'USD', currency);
              const formatted = formatCurrency(converted, currency);
              // #region agent log
              fetch('http://127.0.0.1:7242/ingest/cf5b3080-7cbe-407c-bc05-9619da1a765a',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'PocketTransactions.jsx:365',message:'Formatting currency',data:{pocketBalance,currency,converted,formatted},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
              // #endregion
              return formatted;
            } catch (error) {
              // #region agent log
              fetch('http://127.0.0.1:7242/ingest/cf5b3080-7cbe-407c-bc05-9619da1a765a',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'PocketTransactions.jsx:370',message:'Error formatting currency',data:{error:error.message},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
              // #endregion
              return '$0';
            }
          })()}
        </p>
      </div>

      {/* Transactions List */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Transactions</h2>
            <Button
            onClick={() => {
              setEditingTransaction(null)
              setFormData({
                name: '',
                status: 'Paid',
                source: 'Cash',
                amount: '',
                currency: 'USD',
                date: new Date().toISOString().split('T')[0],
                description: '',
                icon: '🏧',
              })
              setCryptoFormData({
                cryptoAsset: 'BTC',
                cryptoAmount: '',
                usdAmount: 0,
              })
              setPriceError(null)
              setShowAddModal(true)
            }}
            variant="primary"
            size="sm"
          >
            + Add
          </Button>
        </div>

        {/* #region agent log */}
        {(() => {
          fetch('http://127.0.0.1:7242/ingest/cf5b3080-7cbe-407c-bc05-9619da1a765a',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'PocketTransactions.jsx:451',message:'Rendering transactions list',data:{pocketTransactionsLength:pocketTransactions.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
          return null;
        })()}
        {/* #endregion */}
        {pocketTransactions.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No transactions for this pocket</p>
              <Button
                onClick={() => {
                  setEditingTransaction(null)
                  setFormData({
                    name: '',
                    status: 'Paid',
                    source: 'Cash',
                    amount: '',
                    currency: 'USD',
                    date: new Date().toISOString().split('T')[0],
                    description: '',
                    icon: '🏧',
                  })
                  setShowAddModal(true)
                }}
                variant="secondary"
                size="sm"
                className="!bg-gray-100 !text-black !border-0 rounded-xl"
              >
                Add First Transaction
              </Button>
            </div>
          </Card>
        ) : (
          <Card className="!p-0">
            <div>
              {pocketTransactions.map((transaction, index) => {
                const IconComponent = transactionIconMap[transaction.icon] || ATMIcon
                // Use original amount if currency matches, otherwise convert from USD
                const displayAmount = transaction.originalAmount !== undefined && transaction.originalCurrency === currency
                  ? transaction.originalAmount
                  : convertCurrency(transaction.amount, 'USD', currency)
                return (
                  <div key={transaction.id}>
                    <SwipeableTransaction
                      onDelete={() => deleteTransaction(transaction.id)}
                      className=""
                    >
                      <div
                        onClick={() => handleEdit(transaction)}
                        className="flex items-center justify-between py-4 px-4 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <div className="flex items-center space-x-4 flex-1">
                          <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-700 flex-shrink-0">
                            <IconComponent />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 truncate">
                              {transaction.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {new Date(transaction.date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
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
                    {index < pocketTransactions.length - 1 && (
                      <div className="border-b w-full" style={{ borderColor: '#f0f0f0' }}></div>
                    )}
                  </div>
                )
              })}
            </div>
          </Card>
        )}
      </div>

      {/* Add/Edit Transaction Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center p-4 z-50" style={{ overflow: 'hidden' }}>
          <Card className="w-full max-w-sm max-h-[85vh] overflow-hidden flex flex-col mb-4 rounded-t-3xl rounded-b-2xl" style={{ position: 'relative', zIndex: 50, overflowY: 'auto', overflowX: 'hidden' }}>
            <h2 className="text-xl font-bold mb-4">
              {editingTransaction ? 'Edit Transaction' : 'Add Transaction'}
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden" style={{ maxHeight: '85vh', width: '100%' }}>
              <div className="space-y-4 flex-1 overflow-y-auto pr-2" style={{ maxHeight: 'calc(85vh - 120px)', width: '100%', overflowX: 'hidden' }}>
              {isCryptoPocket ? (
                // Crypto-specific form fields
                <>
                  <div style={{ width: '100%', minWidth: 0 }}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Crypto Asset
                    </label>
                    <select
                      value={cryptoFormData.cryptoAsset}
                      onChange={(e) => {
                        setCryptoFormData({ ...cryptoFormData, cryptoAsset: e.target.value, usdAmount: 0 })
                      }}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}
                      required
                    >
                      {TOP_20_CRYPTO.map((crypto) => (
                        <option key={crypto.code} value={crypto.code}>
                          {crypto.name} ({crypto.symbol})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={{ width: '100%', minWidth: 0 }}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Amount ({cryptoFormData.cryptoAsset})
                    </label>
                    <input
                      type="text"
                      inputMode="decimal"
                      lang="en-US"
                      value={cryptoFormData.cryptoAmount}
                      onChange={(e) => {
                        let value = e.target.value
                        // Replace comma with period for decimal separator (handle locale differences)
                        value = value.replace(/,/g, '.')
                        // Allow empty string, numbers, decimal point, and numbers starting with decimal point (e.g., .5)
                        // Pattern allows: empty, digits, .digits, digits.digits, .digits
                        if (value === '' || /^\.?\d*\.?\d*$/.test(value)) {
                          // Prevent multiple decimal points
                          const decimalCount = (value.match(/\./g) || []).length
                          if (decimalCount <= 1) {
                            setCryptoFormData({ ...cryptoFormData, cryptoAmount: value })
                          }
                        }
                      }}
                      onBlur={(e) => {
                        // Format the value when user leaves the field
                        let value = e.target.value.trim()
                        // Replace comma with period
                        value = value.replace(/,/g, '.')
                        if (value === '' || value === '.') {
                          setCryptoFormData({ ...cryptoFormData, cryptoAmount: '' })
                        } else if (!isNaN(parseFloat(value)) && parseFloat(value) >= 0) {
                          // Keep the value as is, but ensure it's a valid number
                          const numValue = parseFloat(value)
                          if (!isNaN(numValue)) {
                            // Don't force formatting - keep user's precision
                            setCryptoFormData({ ...cryptoFormData, cryptoAmount: value })
                          }
                        }
                      }}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-lg"
                      style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', letterSpacing: '0.5px' }}
                      placeholder="0.00000000"
                      required
                    />
                    {isLoadingPrice && (
                      <p className="text-xs text-gray-500 mt-1">Fetching price...</p>
                    )}
                    {priceError && (
                      <p className="text-xs text-red-500 mt-1">{priceError}</p>
                    )}
                  </div>

                  <div style={{ width: '100%', minWidth: 0 }}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      USD Value
                    </label>
                    <div className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 font-mono text-lg font-bold text-gray-900" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', letterSpacing: '0.5px' }}>
                      {cryptoFormData.usdAmount > 0 
                        ? formatCurrency(cryptoFormData.usdAmount, 'USD')
                        : '$0.00'}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {cryptoFormData.cryptoAmount && !isNaN(parseFloat(cryptoFormData.cryptoAmount)) && cryptoFormData.usdAmount > 0
                        ? `1 ${cryptoFormData.cryptoAsset} = ${formatCurrency(cryptoFormData.usdAmount / parseFloat(cryptoFormData.cryptoAmount), 'USD')}`
                        : 'Enter amount to see USD value'}
                    </p>
                  </div>

                  <div className="relative" style={{ width: '100%', minWidth: 0 }}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) =>
                        setFormData({ ...formData, date: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}
                      required
                    />
                  </div>
                </>
              ) : (
                // Regular transaction form fields
                <>
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
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}
                      required
                    >
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={{ width: '100%', minWidth: 0 }}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Source
                    </label>
                    <select
                      value={formData.source}
                      onChange={(e) =>
                        setFormData({ ...formData, source: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}
                      required
                    >
                      {sources.map((source) => (
                        <option key={source} value={source}>
                          {source}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={{ width: '100%', minWidth: 0 }}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Amount
                    </label>
                    <input
                      type="text"
                      inputMode="decimal"
                      lang="en-US"
                      value={formData.amount}
                      onChange={(e) => {
                        let value = e.target.value
                        // Replace comma with period for decimal separator (handle locale differences)
                        value = value.replace(/,/g, '.')
                        // Allow empty string, numbers, decimal point, and numbers starting with decimal point (e.g., .5)
                        if (value === '' || /^\.?\d*\.?\d*$/.test(value)) {
                          // Prevent multiple decimal points
                          const decimalCount = (value.match(/\./g) || []).length
                          if (decimalCount <= 1) {
                            setFormData({ ...formData, amount: value })
                          }
                        }
                      }}
                      onBlur={(e) => {
                        // Format to 2 decimal places when user leaves the field
                        let value = e.target.value.trim()
                        // Replace comma with period
                        value = value.replace(/,/g, '.')
                        if (value === '' || value === '.') {
                          setFormData({ ...formData, amount: '' })
                        } else if (value && !isNaN(parseFloat(value)) && parseFloat(value) >= 0) {
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
                      Currency
                    </label>
                    <select
                      value={formData.currency}
                      onChange={(e) =>
                        setFormData({ ...formData, currency: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}
                      required
                    >
                      {currencies.map((curr) => (
                        <option key={curr} value={curr}>
                          {curr}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="relative" style={{ width: '100%', minWidth: 0 }}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) =>
                        setFormData({ ...formData, date: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}
                      required
                    />
                  </div>

                  <div style={{ width: '100%', minWidth: 0 }}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description <span className="text-gray-400 text-xs">(Optional)</span>
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', resize: 'vertical' }}
                      placeholder="Add a description..."
                      rows="3"
                    />
                  </div>
                </>
              )}
              </div>
              <div className="flex space-x-2 pt-4 mt-4 border-t border-gray-200">
                <Button
                  type="button"
                  onClick={handleCancel}
                  variant="ghost"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" className="flex-1">
                  {editingTransaction ? 'Save' : 'Add'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Rename Pocket Modal */}
      {showRenameModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-sm">
            <h2 className="text-xl font-bold mb-4">Change Pocket Name</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={newPocketName}
                  onChange={(e) => setNewPocketName(e.target.value)}
                  onFocus={(e) => e.target.select()}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter pocket name"
                  autoFocus
                  required
                />
              </div>
              <div className="flex space-x-2">
                <Button
                  onClick={() => {
                    setShowRenameModal(false)
                    setNewPocketName('')
                  }}
                  variant="ghost"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button onClick={handleRename} variant="primary" className="flex-1">
                  Save
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

