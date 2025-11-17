// Cynefa Package Pricing
export const PACKAGES = [
  {
    id: 'starter',
    name: 'Starter',
    workflows: 5,
    executions: 60000,
    price: 15000,
    customApis: 0,
    features: [
      '5 Workflows inklusive',
      '60.000 Executions/Jahr',
      'Standard-Integrationen',
      'E-Mail Support',
      'Dokumentation & Tutorials'
    ]
  },
  {
    id: 'professional',
    name: 'Professional',
    workflows: 10,
    executions: 180000,
    price: 36000,
    customApis: 1,
    features: [
      '10 Workflows inklusive',
      '180.000 Executions/Jahr',
      '1 Custom API Integration',
      'Priority Support',
      'Erweiterte Integrationen',
      'Monitoring & Analytics'
    ],
    recommended: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    workflows: 20,
    executions: 450000,
    price: 75000,
    customApis: 3,
    features: [
      '20 Workflows inklusive',
      '450.000 Executions/Jahr',
      '3 Custom API Integrationen',
      'Dedicated Support',
      'White-Label Option',
      'SLA Garantie',
      'Individuelles Onboarding'
    ]
  }
]

// Default hourly rate for ROI calculation
export const DEFAULT_HOURLY_RATE = 45

// Frequency multipliers (per year)
export const FREQUENCY_MULTIPLIERS = {
  'Täglich': 250, // 50 weeks * 5 days
  'Wöchentlich': 50, // 50 weeks
  'Monatlich': 12 // 12 months
}

// Frequency scores for prioritization
export const FREQUENCY_SCORES = {
  'Täglich': 3,
  'Wöchentlich': 2,
  'Monatlich': 1
}

// Time effort scores (hours per week)
export const TIME_EFFORT_SCORES = {
  HIGH: 3,    // >10h/week
  MEDIUM: 2,  // 5-10h/week
  LOW: 1      // <5h/week
}

// Industry types
export const INDUSTRIES = [
  'E-Commerce',
  'Dienstleistung',
  'B2B-Handel',
  'SaaS',
  'Produktion',
  'Beratung',
  'Agentur',
  'Andere'
]

// Departments
export const DEPARTMENTS = [
  'Vertrieb',
  'Marketing',
  'Support',
  'Buchhaltung',
  'Operations',
  'IT',
  'HR',
  'Management'
]

// Tool categories
export const TOOL_CATEGORIES = [
  'CRM',
  'E-Mail',
  'Buchhaltung',
  'E-Commerce',
  'Projektmanagement',
  'Kommunikation',
  'Tabellen',
  'Datenbank',
  'Marketing-Automation',
  'Analytics',
  'Cloud-Speicher',
  'Support/Helpdesk',
  'ERP',
  'HR/Recruiting',
  'Zeiterfassung',
  'Andere'
]

// Frequency options
export const FREQUENCIES = ['Täglich', 'Wöchentlich', 'Monatlich']

// Error proneness levels
export const ERROR_LEVELS = [
  { value: 1, label: 'Niedrig', color: 'text-green-600' },
  { value: 2, label: 'Mittel', color: 'text-yellow-600' },
  { value: 3, label: 'Hoch', color: 'text-red-600' }
]

// Automatable levels
export const AUTOMATABLE_LEVELS = [
  { value: 1, label: 'Niedrig', color: 'text-red-600' },
  { value: 2, label: 'Mittel', color: 'text-yellow-600' },
  { value: 3, label: 'Hoch', color: 'text-green-600' }
]

// Complexity levels
export const COMPLEXITY_LEVELS = [
  { value: 'low', label: 'Niedrig', color: 'text-green-600', estimatedWeeks: '2-3' },
  { value: 'medium', label: 'Mittel', color: 'text-yellow-600', estimatedWeeks: '4-6' },
  { value: 'high', label: 'Hoch', color: 'text-red-600', estimatedWeeks: '8-12' }
]

// Confidence levels
export const CONFIDENCE_LEVELS = [
  { value: 'certain', label: 'Sicher', multiplier: 1.0 },
  { value: 'probable', label: 'Wahrscheinlich', multiplier: 0.85 },
  { value: 'uncertain', label: 'Unsicher', multiplier: 0.7 }
]

// Popular tools database
export const POPULAR_TOOLS = [
  // CRM
  { name: 'HubSpot', category: 'CRM', hasAPI: true },
  { name: 'Salesforce', category: 'CRM', hasAPI: true },
  { name: 'Pipedrive', category: 'CRM', hasAPI: true },
  { name: 'Zoho CRM', category: 'CRM', hasAPI: true },

  // E-Commerce
  { name: 'Shopify', category: 'E-Commerce', hasAPI: true },
  { name: 'WooCommerce', category: 'E-Commerce', hasAPI: true },
  { name: 'Magento', category: 'E-Commerce', hasAPI: true },
  { name: 'BigCommerce', category: 'E-Commerce', hasAPI: true },

  // E-Mail
  { name: 'Gmail', category: 'E-Mail', hasAPI: true },
  { name: 'Outlook', category: 'E-Mail', hasAPI: true },
  { name: 'Mailchimp', category: 'E-Mail', hasAPI: true },
  { name: 'SendGrid', category: 'E-Mail', hasAPI: true },

  // Buchhaltung
  { name: 'Lexoffice', category: 'Buchhaltung', hasAPI: true },
  { name: 'DATEV', category: 'Buchhaltung', hasAPI: false },
  { name: 'sevDesk', category: 'Buchhaltung', hasAPI: true },
  { name: 'QuickBooks', category: 'Buchhaltung', hasAPI: true },

  // Projektmanagement
  { name: 'Asana', category: 'Projektmanagement', hasAPI: true },
  { name: 'Trello', category: 'Projektmanagement', hasAPI: true },
  { name: 'Monday.com', category: 'Projektmanagement', hasAPI: true },
  { name: 'Jira', category: 'Projektmanagement', hasAPI: true },
  { name: 'ClickUp', category: 'Projektmanagement', hasAPI: true },

  // Kommunikation
  { name: 'Slack', category: 'Kommunikation', hasAPI: true },
  { name: 'Microsoft Teams', category: 'Kommunikation', hasAPI: true },
  { name: 'Discord', category: 'Kommunikation', hasAPI: true },

  // Tabellen
  { name: 'Google Sheets', category: 'Tabellen', hasAPI: true },
  { name: 'Microsoft Excel', category: 'Tabellen', hasAPI: true },
  { name: 'Airtable', category: 'Tabellen', hasAPI: true },

  // Cloud-Speicher
  { name: 'Google Drive', category: 'Cloud-Speicher', hasAPI: true },
  { name: 'Dropbox', category: 'Cloud-Speicher', hasAPI: true },
  { name: 'OneDrive', category: 'Cloud-Speicher', hasAPI: true },

  // Support
  { name: 'Zendesk', category: 'Support/Helpdesk', hasAPI: true },
  { name: 'Freshdesk', category: 'Support/Helpdesk', hasAPI: true },
  { name: 'Intercom', category: 'Support/Helpdesk', hasAPI: true },

  // Marketing
  { name: 'Facebook Ads', category: 'Marketing-Automation', hasAPI: true },
  { name: 'Google Ads', category: 'Marketing-Automation', hasAPI: true },
  { name: 'LinkedIn Ads', category: 'Marketing-Automation', hasAPI: true },

  // Analytics
  { name: 'Google Analytics', category: 'Analytics', hasAPI: true },
  { name: 'Mixpanel', category: 'Analytics', hasAPI: true },
  { name: 'Amplitude', category: 'Analytics', hasAPI: true }
]

// Workshop steps configuration
export const WORKSHOP_STEPS = [
  { id: 1, title: 'Kundeninfo', icon: 'Building2' },
  { id: 2, title: 'Tool-Landscape', icon: 'Wrench' },
  { id: 3, title: 'Prozess-Erfassung', icon: 'ListChecks' },
  { id: 4, title: 'Automatisierung', icon: 'Zap' },
  { id: 5, title: 'Priorisierung', icon: 'BarChart3' },
  { id: 6, title: 'ROI-Berechnung', icon: 'TrendingUp' },
  { id: 7, title: 'Paket-Empfehlung', icon: 'Package' },
  { id: 8, title: 'Zusammenfassung', icon: 'FileText' }
]
