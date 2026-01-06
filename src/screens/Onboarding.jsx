import Button from '../components/Button'

export default function Onboarding({ onComplete }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-gradient-to-br from-primary-50 to-white">
      <div className="flex-1 flex flex-col items-center justify-center max-w-sm w-full">
        {/* Hero Image Placeholder */}
        <div className="w-full max-w-xs mb-12">
          <div className="aspect-square rounded-3xl bg-gradient-primary flex items-center justify-center shadow-2xl">
            <div className="text-white text-center px-8">
              <div className="text-6xl mb-4">💼</div>
              <div className="text-3xl font-bold mb-2">Pulse</div>
              <div className="text-lg opacity-90">Your wealth, simplified</div>
            </div>
          </div>
        </div>

        {/* Brand Name */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Pulse</h1>

        {/* Value Prop */}
        <p className="text-lg text-gray-600 text-center mb-12 leading-relaxed">
          Track your net worth, manage investments, and organize your money with purpose.
        </p>

        {/* Primary CTA */}
        <div className="w-full max-w-xs">
          <Button 
            onClick={onComplete}
            variant="primary"
            size="lg"
            className="w-full"
          >
            Get Started
          </Button>
        </div>
      </div>
    </div>
  )
}

