// LocalStorage wrapper with error handling
const STORAGE_KEY = 'workshop-wizard-data'
const STORAGE_VERSION = '2.0.0'

/**
 * Save workshop data to localStorage
 * @param {Object} data - Workshop data to save
 * @returns {boolean} - Success status
 */
export const saveToStorage = (data) => {
  try {
    const dataWithVersion = {
      version: STORAGE_VERSION,
      timestamp: new Date().toISOString(),
      data
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataWithVersion))
    return true
  } catch (error) {
    console.error('Error saving to localStorage:', error)
    // Handle quota exceeded error
    if (error.name === 'QuotaExceededError') {
      console.warn('LocalStorage quota exceeded. Consider clearing old data.')
    }
    return false
  }
}

/**
 * Load workshop data from localStorage
 * @returns {Object|null} - Workshop data or null if not found
 */
export const loadFromStorage = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return null

    const parsed = JSON.parse(stored)

    // Version migration logic (if needed in future)
    if (parsed.version !== STORAGE_VERSION) {
      console.warn('Data version mismatch. Migration may be needed.')
      // Handle migration here if necessary
    }

    return parsed.data
  } catch (error) {
    console.error('Error loading from localStorage:', error)
    return null
  }
}

/**
 * Clear workshop data from localStorage
 * @returns {boolean} - Success status
 */
export const clearStorage = () => {
  try {
    localStorage.removeItem(STORAGE_KEY)
    return true
  } catch (error) {
    console.error('Error clearing localStorage:', error)
    return false
  }
}

/**
 * Export data as JSON file
 * @param {Object} data - Data to export
 * @param {string} filename - Filename for export
 */
export const exportAsJSON = (data, filename = 'workshop-export.json') => {
  try {
    const dataStr = JSON.stringify(data, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)

    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    URL.revokeObjectURL(url)
    return true
  } catch (error) {
    console.error('Error exporting JSON:', error)
    return false
  }
}

/**
 * Import data from JSON file
 * @param {File} file - JSON file to import
 * @returns {Promise<Object>} - Imported data
 */
export const importFromJSON = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result)
        resolve(data)
      } catch (error) {
        reject(new Error('Invalid JSON file'))
      }
    }

    reader.onerror = () => {
      reject(new Error('Error reading file'))
    }

    reader.readAsText(file)
  })
}

/**
 * Export data as CSV
 * @param {Array} processes - Process data to export
 * @param {string} filename - Filename for export
 */
export const exportAsCSV = (processes, filename = 'prozesse-export.csv') => {
  try {
    // CSV header
    const headers = [
      'Prozess',
      'Abteilung',
      'Häufigkeit',
      'Zeit/Woche (h)',
      'Zeit/Jahr (h)',
      'Fehleranfälligkeit',
      'Automatisierbarkeit',
      'Score',
      'Rang'
    ]

    // Create CSV rows
    const rows = processes.map((process, index) => {
      const timePerWeek = (process.timePerExecution * process.executionsPerPeriod *
        (process.frequency === 'Täglich' ? 5 : process.frequency === 'Wöchentlich' ? 1 : 0.25)) / 60
      const timePerYear = timePerWeek * 50

      return [
        `"${process.name}"`,
        `"${process.department}"`,
        `"${process.frequency}"`,
        timePerWeek.toFixed(1),
        timePerYear.toFixed(0),
        process.errorProneness,
        process.automatable,
        process.score || 0,
        index + 1
      ].join(',')
    })

    // Combine headers and rows
    const csv = [headers.join(','), ...rows].join('\n')

    // Add UTF-8 BOM for Excel compatibility
    const csvWithBOM = '\uFEFF' + csv

    // Create and download file
    const blob = new Blob([csvWithBOM], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    URL.revokeObjectURL(url)
    return true
  } catch (error) {
    console.error('Error exporting CSV:', error)
    return false
  }
}

/**
 * Check if localStorage is available
 * @returns {boolean} - Availability status
 */
export const isStorageAvailable = () => {
  try {
    const test = '__storage_test__'
    localStorage.setItem(test, test)
    localStorage.removeItem(test)
    return true
  } catch (error) {
    return false
  }
}

/**
 * Get storage usage information
 * @returns {Object} - Storage usage stats
 */
export const getStorageInfo = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    const size = data ? new Blob([data]).size : 0
    const sizeKB = (size / 1024).toFixed(2)

    return {
      size,
      sizeKB,
      sizeFormatted: `${sizeKB} KB`
    }
  } catch (error) {
    return {
      size: 0,
      sizeKB: '0',
      sizeFormatted: '0 KB'
    }
  }
}
