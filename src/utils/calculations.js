import { FREQUENCY_MULTIPLIERS, FREQUENCY_SCORES, TIME_EFFORT_SCORES } from './constants'

/**
 * Calculate process score for prioritization
 * @param {Object} process - Process object
 * @returns {number} - Total score (0-12)
 */
export const calculateProcessScore = (process) => {
  // Frequency score (1-3)
  const frequencyScore = FREQUENCY_SCORES[process.frequency] || 0

  // Time effort score (1-3) based on hours per week
  const timePerWeek = calculateTimePerWeek(process)
  let timeScore = TIME_EFFORT_SCORES.LOW
  if (timePerWeek > 10) timeScore = TIME_EFFORT_SCORES.HIGH
  else if (timePerWeek > 5) timeScore = TIME_EFFORT_SCORES.MEDIUM

  // Error proneness (1-3)
  const errorScore = process.errorProneness || 0

  // Automatable (1-3)
  const automatableScore = process.automatable || 0

  return frequencyScore + timeScore + errorScore + automatableScore
}

/**
 * Calculate time per week for a process
 * @param {Object} process - Process object
 * @returns {number} - Hours per week
 */
export const calculateTimePerWeek = (process) => {
  const { timePerExecution, executionsPerPeriod, frequency } = process

  if (!timePerExecution || !executionsPerPeriod || !frequency) return 0

  // Convert minutes to hours
  const hoursPerExecution = timePerExecution / 60

  // Calculate based on frequency
  let executionsPerWeek = 0
  if (frequency === 'Täglich') {
    executionsPerWeek = executionsPerPeriod * 5 // 5 work days
  } else if (frequency === 'Wöchentlich') {
    executionsPerWeek = executionsPerPeriod
  } else if (frequency === 'Monatlich') {
    executionsPerWeek = executionsPerPeriod / 4 // ~4 weeks per month
  }

  return hoursPerExecution * executionsPerWeek
}

/**
 * Calculate time per year for a process
 * @param {Object} process - Process object
 * @returns {number} - Hours per year
 */
export const calculateTimePerYear = (process) => {
  const timePerWeek = calculateTimePerWeek(process)
  return timePerWeek * 50 // 50 work weeks per year
}

/**
 * Get score badge based on score value
 * @param {number} score - Score value (0-12)
 * @returns {string} - Badge text
 */
export const getScoreBadge = (score) => {
  if (score >= 10) return '🔥🔥🔥'
  if (score >= 8) return '🔥🔥'
  if (score >= 6) return '🔥'
  return '💡'
}

/**
 * Get score color class based on score value
 * @param {number} score - Score value (0-12)
 * @returns {string} - Tailwind color class
 */
export const getScoreColor = (score) => {
  if (score >= 10) return 'text-red-600 bg-red-50'
  if (score >= 8) return 'text-orange-600 bg-orange-50'
  if (score >= 6) return 'text-yellow-600 bg-yellow-50'
  return 'text-blue-600 bg-blue-50'
}

/**
 * Calculate ROI for automation scenarios
 * @param {Array} processes - Array of processes
 * @param {Array} automationScenarios - Array of automation scenarios
 * @param {number} hourlyRate - Cost per hour (default 45€)
 * @param {number} packagePrice - Selected package price
 * @returns {Object} - ROI calculation results
 */
export const calculateROI = (processes, automationScenarios = [], hourlyRate = 45, packagePrice = 0) => {
  // Calculate total time savings per year
  let totalTimeSavingsYear = 0
  let bestCaseSavings = 0
  let worstCaseSavings = 0

  automationScenarios.forEach(scenario => {
    const process = processes.find(p => p.id === scenario.processId)
    if (!process) return

    const timePerYear = calculateTimePerYear(process)
    const savingsPercent = scenario.timeSavingsPercent || 0
    const confidenceMultiplier = getConfidenceMultiplier(scenario.confidence)

    // Average case (with confidence)
    const savings = (timePerYear * savingsPercent / 100) * confidenceMultiplier
    totalTimeSavingsYear += savings

    // Best case (all certain)
    bestCaseSavings += timePerYear * savingsPercent / 100

    // Worst case (conservative -30%)
    worstCaseSavings += (timePerYear * savingsPercent / 100) * 0.7
  })

  // Cost savings
  const averageCostSavings = totalTimeSavingsYear * hourlyRate
  const bestCaseCostSavings = bestCaseSavings * hourlyRate
  const worstCaseCostSavings = worstCaseSavings * hourlyRate

  // ROI calculation
  const investment = packagePrice || 0

  const averageROI = investment > 0 ? ((averageCostSavings - investment) / investment) * 100 : 0
  const bestCaseROI = investment > 0 ? ((bestCaseCostSavings - investment) / investment) * 100 : 0
  const worstCaseROI = investment > 0 ? ((worstCaseCostSavings - investment) / investment) * 100 : 0

  // Amortization (in months)
  const averageAmortization = averageCostSavings > 0 ? (investment / (averageCostSavings / 12)) : 0
  const bestCaseAmortization = bestCaseCostSavings > 0 ? (investment / (bestCaseCostSavings / 12)) : 0
  const worstCaseAmortization = worstCaseCostSavings > 0 ? (investment / (worstCaseCostSavings / 12)) : 0

  return {
    // Time savings
    averageTimeSavings: totalTimeSavingsYear,
    bestCaseTimeSavings: bestCaseSavings,
    worstCaseTimeSavings: worstCaseSavings,

    // Cost savings
    averageCostSavings,
    bestCaseCostSavings,
    worstCaseCostSavings,

    // ROI
    averageROI,
    bestCaseROI,
    worstCaseROI,

    // Amortization
    averageAmortization,
    bestCaseAmortization,
    worstCaseAmortization,

    // Input values
    investment,
    hourlyRate
  }
}

/**
 * Get confidence multiplier
 * @param {string} confidence - Confidence level
 * @returns {number} - Multiplier value
 */
const getConfidenceMultiplier = (confidence) => {
  const multipliers = {
    'certain': 1.0,
    'probable': 0.85,
    'uncertain': 0.7
  }
  return multipliers[confidence] || 0.85
}

/**
 * Recommend package based on required workflows
 * @param {number} requiredWorkflows - Number of workflows needed
 * @returns {string} - Package ID
 */
export const recommendPackage = (requiredWorkflows) => {
  if (requiredWorkflows <= 5) return 'starter'
  if (requiredWorkflows <= 10) return 'professional'
  return 'enterprise'
}

/**
 * Sort processes by score (descending)
 * @param {Array} processes - Array of processes
 * @returns {Array} - Sorted processes
 */
export const sortProcessesByScore = (processes) => {
  return [...processes].sort((a, b) => {
    const scoreA = a.score || calculateProcessScore(a)
    const scoreB = b.score || calculateProcessScore(b)
    return scoreB - scoreA
  })
}

/**
 * Get top N processes by score
 * @param {Array} processes - Array of processes
 * @param {number} n - Number of top processes (default 5)
 * @returns {Array} - Top N processes
 */
export const getTopProcesses = (processes, n = 5) => {
  const sorted = sortProcessesByScore(processes)
  return sorted.slice(0, n)
}

/**
 * Calculate total required workflows from automation scenarios
 * @param {Array} automationScenarios - Array of automation scenarios
 * @returns {number} - Total workflows needed
 */
export const calculateRequiredWorkflows = (automationScenarios) => {
  return automationScenarios.reduce((total, scenario) => {
    return total + (scenario.workflowsNeeded || 1)
  }, 0)
}

/**
 * Format number as currency (EUR)
 * @param {number} value - Number to format
 * @returns {string} - Formatted currency string
 */
export const formatCurrency = (value) => {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value)
}

/**
 * Format number as decimal
 * @param {number} value - Number to format
 * @param {number} decimals - Number of decimal places (default 1)
 * @returns {string} - Formatted number string
 */
export const formatNumber = (value, decimals = 1) => {
  return new Intl.NumberFormat('de-DE', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value)
}

/**
 * Calculate distribution of time savings by department
 * @param {Array} processes - Array of processes
 * @param {Array} automationScenarios - Array of automation scenarios
 * @returns {Array} - Department distribution
 */
export const calculateDepartmentDistribution = (processes, automationScenarios) => {
  const distribution = {}

  automationScenarios.forEach(scenario => {
    const process = processes.find(p => p.id === scenario.processId)
    if (!process) return

    const dept = process.department
    const timePerYear = calculateTimePerYear(process)
    const savings = timePerYear * (scenario.timeSavingsPercent || 0) / 100

    if (!distribution[dept]) {
      distribution[dept] = 0
    }
    distribution[dept] += savings
  })

  // Convert to array for charts
  return Object.entries(distribution).map(([name, value]) => ({
    name,
    value: Math.round(value)
  }))
}
