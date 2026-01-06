/**
 * Data Export/Import Utilities
 * Handles exporting and importing Pulse app data
 */

/**
 * Export all app data to a JSON file
 * @param {Object} data - The data to export (pockets, transactions, user, currency)
 * @returns {string} - JSON string of the data
 */
export function exportData(data) {
  const exportData = {
    version: '1.0.0',
    exportDate: new Date().toISOString(),
    app: 'Pulse - Wealth Management',
    data: {
      pockets: data.pockets || [],
      transactions: data.transactions || [],
      user: data.user || {},
      currency: data.currency || 'USD',
      settings: {
        isOnboarded: localStorage.getItem('isOnboarded') === 'true',
      },
    },
  }

  return JSON.stringify(exportData, null, 2)
}

/**
 * Download data as a JSON file
 * @param {string} jsonString - The JSON string to download
 * @param {string} filename - Optional filename (default: pulse-backup-YYYY-MM-DD.json)
 */
export function downloadDataFile(jsonString, filename = null) {
  const date = new Date().toISOString().split('T')[0]
  const defaultFilename = `pulse-backup-${date}.json`
  const finalFilename = filename || defaultFilename

  // Create a blob and download link
  const blob = new Blob([jsonString], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = finalFilename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Validate imported data structure
 * @param {Object} importedData - The data to validate
 * @returns {{valid: boolean, error?: string, data?: Object}}
 */
export function validateImportedData(importedData) {
  try {
    // Check if it's a valid object
    if (!importedData || typeof importedData !== 'object') {
      return { valid: false, error: 'Invalid file format. Expected JSON object.' }
    }

    // Check version (for future compatibility)
    if (!importedData.version) {
      return { valid: false, error: 'Invalid backup file. Missing version information.' }
    }

    // Check if data object exists
    if (!importedData.data || typeof importedData.data !== 'object') {
      return { valid: false, error: 'Invalid backup file. Missing data section.' }
    }

    const { data } = importedData

    // Validate pockets array
    if (data.pockets) {
      if (!Array.isArray(data.pockets)) {
        return { valid: false, error: 'Invalid pockets data. Expected an array.' }
      }
      // Validate each pocket has required fields
      for (const pocket of data.pockets) {
        if (!pocket.id || !pocket.name) {
          return { valid: false, error: 'Invalid pocket data. Missing required fields (id, name).' }
        }
      }
    }

    // Validate transactions array
    if (data.transactions) {
      if (!Array.isArray(data.transactions)) {
        return { valid: false, error: 'Invalid transactions data. Expected an array.' }
      }
      // Validate each transaction has required fields
      for (const transaction of data.transactions) {
        if (!transaction.id || transaction.amount === undefined) {
          return { valid: false, error: 'Invalid transaction data. Missing required fields (id, amount).' }
        }
      }
    }

    // All validations passed
    return { valid: true, data: importedData.data }
  } catch (error) {
    return { valid: false, error: `Validation error: ${error.message}` }
  }
}

/**
 * Read and parse a JSON file
 * @param {File} file - The file to read
 * @returns {Promise<Object>} - Parsed JSON data
 */
export function readJsonFile(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('No file provided'))
      return
    }

    if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
      reject(new Error('Invalid file type. Please select a JSON file.'))
      return
    }

    const reader = new FileReader()

    reader.onload = (event) => {
      try {
        const jsonString = event.target.result
        const parsed = JSON.parse(jsonString)
        resolve(parsed)
      } catch (error) {
        reject(new Error(`Failed to parse JSON: ${error.message}`))
      }
    }

    reader.onerror = () => {
      reject(new Error('Failed to read file'))
    }

    reader.readAsText(file)
  })
}

