import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Onboarding from './screens/Onboarding'
import Home from './screens/Home'
import Transactions from './screens/Transactions'
import Pockets from './screens/Pockets'
import PocketTransactions from './screens/PocketTransactions'
import Scan from './screens/Scan'
import Insights from './screens/Insights'
import Account from './screens/Account'
import BottomNavigation from './components/BottomNavigation'
import { AppProvider } from './context/AppContext'

function App() {
  const [isOnboarded, setIsOnboarded] = useState(false)

  useEffect(() => {
    const onboarded = localStorage.getItem('isOnboarded')
    setIsOnboarded(onboarded === 'true')
  }, [])

  const handleOnboardingComplete = () => {
    localStorage.setItem('isOnboarded', 'true')
    setIsOnboarded(true)
  }

  if (!isOnboarded) {
    return <Onboarding onComplete={handleOnboardingComplete} />
  }

  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 pb-20">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/pockets" element={<Pockets />} />
            <Route path="/pockets/:pocketId" element={<PocketTransactions />} />
            <Route path="/scan" element={<Scan />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/account" element={<Account />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <BottomNavigation />
        </div>
      </Router>
    </AppProvider>
  )
}

export default App

