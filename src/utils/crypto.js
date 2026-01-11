/**
 * Crypto utilities for fetching prices and managing crypto assets
 */

// Top 20 crypto assets by market cap
export const TOP_20_CRYPTO = [
  { symbol: 'BTC', name: 'Bitcoin', code: 'BTC' },
  { symbol: 'ETH', name: 'Ethereum', code: 'ETH' },
  { symbol: 'USDT', name: 'Tether', code: 'USDT' },
  { symbol: 'BNB', name: 'BNB', code: 'BNB' },
  { symbol: 'SOL', name: 'Solana', code: 'SOL' },
  { symbol: 'USDC', name: 'USD Coin', code: 'USDC' },
  { symbol: 'XRP', name: 'XRP', code: 'XRP' },
  { symbol: 'DOGE', name: 'Dogecoin', code: 'DOGE' },
  { symbol: 'ADA', name: 'Cardano', code: 'ADA' },
  { symbol: 'TRX', name: 'TRON', code: 'TRX' },
  { symbol: 'AVAX', name: 'Avalanche', code: 'AVAX' },
  { symbol: 'SHIB', name: 'Shiba Inu', code: 'SHIB' },
  { symbol: 'DOT', name: 'Polkadot', code: 'DOT' },
  { symbol: 'LINK', name: 'Chainlink', code: 'LINK' },
  { symbol: 'MATIC', name: 'Polygon', code: 'MATIC' },
  { symbol: 'BCH', name: 'Bitcoin Cash', code: 'BCH' },
  { symbol: 'LTC', name: 'Litecoin', code: 'LTC' },
  { symbol: 'UNI', name: 'Uniswap', code: 'UNI' },
  { symbol: 'ATOM', name: 'Cosmos', code: 'ATOM' },
  { symbol: 'ETC', name: 'Ethereum Classic', code: 'ETC' },
]

// Cache for crypto prices (to avoid excessive API calls)
const priceCache = {
  data: {},
  timestamp: 0,
  TTL: 60000, // 1 minute cache
}

/**
 * Fetch crypto price from XE.com
 * @param {string} cryptoCode - Crypto code (e.g., 'BTC', 'ETH')
 * @returns {Promise<number>} - Price in USD
 */
export async function fetchCryptoPrice(cryptoCode) {
  try {
    // Check cache first
    const now = Date.now()
    if (priceCache.data[cryptoCode] && (now - priceCache.timestamp) < priceCache.TTL) {
      return priceCache.data[cryptoCode]
    }

    // Fetch from CoinGecko API (free, no API key needed for basic usage)
    // Note: XE.com doesn't have a public API, so we use CoinGecko as the data source
    // CoinGecko provides reliable crypto prices and is commonly used
    const coinGeckoId = getCoinGeckoId(cryptoCode)
    
    // Create AbortController for timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout
    
    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${coinGeckoId}&vs_currencies=usd`,
        { 
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
          signal: controller.signal
        }
      )
      
      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`Failed to fetch price: ${response.status}`)
      }

      const data = await response.json()
      const coinId = getCoinGeckoId(cryptoCode)
      const price = data[coinId]?.usd

      if (!price) {
        throw new Error(`Price not found for ${cryptoCode}`)
      }

      // Update cache
      priceCache.data[cryptoCode] = price
      priceCache.timestamp = now

      return price
    } catch (error) {
      clearTimeout(timeoutId)
      if (error.name === 'AbortError') {
        throw new Error('Request timeout - please try again')
      }
      throw error
    }
  } catch (error) {
    console.error(`Error fetching ${cryptoCode} price:`, error)
    // Return a fallback price or throw
    throw error
  }
}

/**
 * Get CoinGecko ID from crypto code
 */
function getCoinGeckoId(cryptoCode) {
  const mapping = {
    'BTC': 'bitcoin',
    'ETH': 'ethereum',
    'USDT': 'tether',
    'BNB': 'binancecoin',
    'SOL': 'solana',
    'USDC': 'usd-coin',
    'XRP': 'ripple',
    'DOGE': 'dogecoin',
    'ADA': 'cardano',
    'TRX': 'tron',
    'AVAX': 'avalanche-2',
    'SHIB': 'shiba-inu',
    'DOT': 'polkadot',
    'LINK': 'chainlink',
    'MATIC': 'matic-network',
    'BCH': 'bitcoin-cash',
    'LTC': 'litecoin',
    'UNI': 'uniswap',
    'ATOM': 'cosmos',
    'ETC': 'ethereum-classic',
  }
  return mapping[cryptoCode] || cryptoCode.toLowerCase()
}

/**
 * Convert crypto amount to USD
 * @param {number} amount - Amount of crypto
 * @param {string} cryptoCode - Crypto code (e.g., 'BTC')
 * @returns {Promise<number>} - Amount in USD
 */
export async function convertCryptoToUSD(amount, cryptoCode) {
  if (!amount || amount === 0) return 0
  if (!cryptoCode) return 0

  try {
    const price = await fetchCryptoPrice(cryptoCode)
    return amount * price
  } catch (error) {
    console.error('Error converting crypto to USD:', error)
    return 0
  }
}

/**
 * Get crypto asset by code
 */
export function getCryptoAsset(code) {
  return TOP_20_CRYPTO.find(crypto => crypto.code === code) || TOP_20_CRYPTO[0]
}

