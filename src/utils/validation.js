import { z } from 'zod'

// Customer info schema
export const customerSchema = z.object({
  name: z.string().min(2, 'Firmenname muss mindestens 2 Zeichen lang sein'),
  industry: z.string().min(1, 'Bitte wählen Sie eine Branche'),
  employees: z.number().min(1, 'Anzahl Mitarbeiter muss mindestens 1 sein'),
  participants: z.array(z.object({
    name: z.string().min(2, 'Name muss mindestens 2 Zeichen lang sein'),
    role: z.string().min(2, 'Rolle muss mindestens 2 Zeichen lang sein')
  })).min(1, 'Mindestens ein Teilnehmer erforderlich'),
  date: z.string().min(1, 'Workshop-Datum erforderlich')
})

// Tool schema
export const toolSchema = z.object({
  name: z.string().min(2, 'Tool-Name muss mindestens 2 Zeichen lang sein'),
  category: z.string().min(1, 'Bitte wählen Sie eine Kategorie'),
  department: z.string().optional(),
  frequency: z.enum(['Täglich', 'Wöchentlich', 'Monatlich']),
  hasAPI: z.boolean()
})

// Process schema
export const processSchema = z.object({
  name: z.string().min(10, 'Prozessname sollte mindestens 10 Zeichen lang sein'),
  department: z.string().min(1, 'Bitte wählen Sie eine Abteilung'),
  description: z.string().min(20, 'Beschreibung sollte mindestens 20 Zeichen lang sein'),
  tools: z.array(z.string()).min(1, 'Mindestens ein Tool erforderlich'),
  frequency: z.enum(['Täglich', 'Wöchentlich', 'Monatlich']),
  timePerExecution: z.number().min(1, 'Zeitaufwand muss mindestens 1 Minute sein'),
  executionsPerPeriod: z.number().min(1, 'Anzahl Durchläufe muss mindestens 1 sein'),
  errorProneness: z.number().min(1).max(3),
  automatable: z.number().min(1).max(3)
})

// Automation scenario schema
export const automationScenarioSchema = z.object({
  processId: z.string(),
  sollDescription: z.string().min(20, 'SOLL-Beschreibung sollte mindestens 20 Zeichen lang sein'),
  timeSavingsPercent: z.number().min(0).max(100, 'Zeitersparnis muss zwischen 0 und 100% liegen'),
  complexity: z.enum(['low', 'medium', 'high']),
  workflowsNeeded: z.number().min(1, 'Mindestens 1 Workflow erforderlich'),
  confidence: z.enum(['certain', 'probable', 'uncertain'])
})

// Validation helper functions
export const validateCustomer = (data) => {
  try {
    customerSchema.parse(data)
    return { valid: true, errors: [] }
  } catch (error) {
    return {
      valid: false,
      errors: error.errors.map(e => ({
        field: e.path.join('.'),
        message: e.message
      }))
    }
  }
}

export const validateTool = (data) => {
  try {
    toolSchema.parse(data)
    return { valid: true, errors: [] }
  } catch (error) {
    return {
      valid: false,
      errors: error.errors.map(e => ({
        field: e.path.join('.'),
        message: e.message
      }))
    }
  }
}

export const validateProcess = (data) => {
  try {
    processSchema.parse(data)
    return { valid: true, errors: [] }
  } catch (error) {
    return {
      valid: false,
      errors: error.errors.map(e => ({
        field: e.path.join('.'),
        message: e.message
      }))
    }
  }
}

export const validateAutomationScenario = (data) => {
  try {
    automationScenarioSchema.parse(data)
    return { valid: true, errors: [] }
  } catch (error) {
    return {
      valid: false,
      errors: error.errors.map(e => ({
        field: e.path.join('.'),
        message: e.message
      }))
    }
  }
}
