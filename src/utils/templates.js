// Industry templates for quick workshop start

export const ECOMMERCE_TEMPLATE = {
  name: 'E-Commerce Template',
  industry: 'E-Commerce',
  tools: [
    { name: 'Shopify', category: 'E-Commerce', frequency: 'Täglich', hasAPI: true },
    { name: 'HubSpot', category: 'CRM', frequency: 'Täglich', hasAPI: true },
    { name: 'Gmail', category: 'E-Mail', frequency: 'Täglich', hasAPI: true },
    { name: 'Lexoffice', category: 'Buchhaltung', frequency: 'Täglich', hasAPI: true },
    { name: 'Slack', category: 'Kommunikation', frequency: 'Täglich', hasAPI: true },
    { name: 'Google Sheets', category: 'Tabellen', frequency: 'Täglich', hasAPI: true }
  ],
  processes: [
    {
      name: 'Bestelleingang in CRM übertragen',
      department: 'Vertrieb',
      description: '1. Bestellung kommt in Shopify rein\n2. E-Mail-Benachrichtigung erhalten\n3. Kundendaten manuell in HubSpot CRM eintragen\n4. Status-Update in Slack posten',
      tools: ['Shopify', 'HubSpot', 'Slack'],
      frequency: 'Täglich',
      timePerExecution: 5,
      executionsPerPeriod: 30,
      errorProneness: 3,
      automatable: 3
    },
    {
      name: 'Rechnungserstellung und Versand',
      department: 'Buchhaltung',
      description: '1. Auftragsdaten aus CRM exportieren\n2. Rechnung in Lexoffice manuell erstellen\n3. Als PDF herunterladen\n4. Per E-Mail an Kunden versenden',
      tools: ['HubSpot', 'Lexoffice', 'Gmail'],
      frequency: 'Täglich',
      timePerExecution: 10,
      executionsPerPeriod: 25,
      errorProneness: 2,
      automatable: 3
    },
    {
      name: 'Support-Ticket Routing',
      department: 'Support',
      description: '1. Support-Anfrage per E-Mail erhalten\n2. Kategorie und Priorität manuell bestimmen\n3. An zuständigen Mitarbeiter weiterleiten\n4. Ticket in CRM dokumentieren',
      tools: ['Gmail', 'HubSpot', 'Slack'],
      frequency: 'Täglich',
      timePerExecution: 3,
      executionsPerPeriod: 50,
      errorProneness: 2,
      automatable: 3
    },
    {
      name: 'Produktdaten-Synchronisation',
      department: 'Operations',
      description: '1. Produktdaten in Google Sheets pflegen\n2. Änderungen manuell in Shopify übertragen\n3. Produktbilder hochladen\n4. Preise und Lagerbestände aktualisieren',
      tools: ['Google Sheets', 'Shopify'],
      frequency: 'Wöchentlich',
      timePerExecution: 120,
      executionsPerPeriod: 3,
      errorProneness: 3,
      automatable: 2
    },
    {
      name: 'Monatliches Finanz-Reporting',
      department: 'Buchhaltung',
      description: '1. Finanzdaten aus Lexoffice exportieren\n2. In Excel/Google Sheets aufbereiten\n3. Charts und Grafiken erstellen\n4. PDF-Report generieren und versenden',
      tools: ['Lexoffice', 'Google Sheets', 'Gmail'],
      frequency: 'Monatlich',
      timePerExecution: 180,
      executionsPerPeriod: 1,
      errorProneness: 1,
      automatable: 2
    },
    {
      name: 'Versandbenachrichtigungen senden',
      department: 'Operations',
      description: '1. Tracking-Nummer vom Versanddienstleister erhalten\n2. Kunden aus Shopify-Bestellung identifizieren\n3. E-Mail mit Tracking-Link manuell versenden\n4. Status in Shopify aktualisieren',
      tools: ['Shopify', 'Gmail'],
      frequency: 'Täglich',
      timePerExecution: 2,
      executionsPerPeriod: 40,
      errorProneness: 2,
      automatable: 3
    },
    {
      name: 'Retouren-Management',
      department: 'Support',
      description: '1. Retouren-Anfrage per E-Mail erhalten\n2. Retourenlabel erstellen und versenden\n3. Rücksendung in Shopify erfassen\n4. Rückerstattung in Lexoffice buchen',
      tools: ['Gmail', 'Shopify', 'Lexoffice'],
      frequency: 'Täglich',
      timePerExecution: 8,
      executionsPerPeriod: 10,
      errorProneness: 3,
      automatable: 2
    },
    {
      name: 'Newsletter-Segmentierung',
      department: 'Marketing',
      description: '1. Kundendaten aus Shopify exportieren\n2. In Google Sheets nach Kriterien segmentieren\n3. Segmente in E-Mail-Tool importieren\n4. Newsletter-Kampagne vorbereiten',
      tools: ['Shopify', 'Google Sheets', 'Gmail'],
      frequency: 'Wöchentlich',
      timePerExecution: 45,
      executionsPerPeriod: 1,
      errorProneness: 2,
      automatable: 3
    }
  ]
}

export const SERVICES_TEMPLATE = {
  name: 'Dienstleistung/Agentur Template',
  industry: 'Dienstleistung',
  tools: [
    { name: 'HubSpot', category: 'CRM', frequency: 'Täglich', hasAPI: true },
    { name: 'Asana', category: 'Projektmanagement', frequency: 'Täglich', hasAPI: true },
    { name: 'Gmail', category: 'E-Mail', frequency: 'Täglich', hasAPI: true },
    { name: 'Lexoffice', category: 'Buchhaltung', frequency: 'Täglich', hasAPI: true },
    { name: 'Slack', category: 'Kommunikation', frequency: 'Täglich', hasAPI: true },
    { name: 'Google Drive', category: 'Cloud-Speicher', frequency: 'Täglich', hasAPI: true }
  ],
  processes: [
    {
      name: 'Lead-Qualifizierung und Weiterleitung',
      department: 'Vertrieb',
      description: '1. Lead-Anfrage per E-Mail oder Webformular\n2. Manuell in CRM eintragen\n3. Qualifizierung durchführen\n4. An zuständigen Account Manager weiterleiten',
      tools: ['Gmail', 'HubSpot', 'Slack'],
      frequency: 'Täglich',
      timePerExecution: 8,
      executionsPerPeriod: 15,
      errorProneness: 2,
      automatable: 3
    },
    {
      name: 'Projekt-Setup und Kickoff',
      department: 'Operations',
      description: '1. Projektdaten aus Vertrag in Asana übertragen\n2. Projektstruktur und Tasks manuell anlegen\n3. Team-Mitglieder zuweisen\n4. Kickoff-Meeting-Einladung versenden',
      tools: ['HubSpot', 'Asana', 'Gmail', 'Slack'],
      frequency: 'Wöchentlich',
      timePerExecution: 60,
      executionsPerPeriod: 3,
      errorProneness: 2,
      automatable: 2
    },
    {
      name: 'Angebotserstellung und Versand',
      department: 'Vertrieb',
      description: '1. Angebotsdaten aus CRM und E-Mails sammeln\n2. Angebot in Word/Google Docs erstellen\n3. Als PDF exportieren\n4. Per E-Mail an Kunden senden\n5. Follow-up in CRM eintragen',
      tools: ['HubSpot', 'Google Drive', 'Gmail'],
      frequency: 'Täglich',
      timePerExecution: 25,
      executionsPerPeriod: 8,
      errorProneness: 2,
      automatable: 3
    },
    {
      name: 'Monats-Reporting für Kunden',
      department: 'Operations',
      description: '1. Projektdaten aus Asana exportieren\n2. KPIs manuell in Google Sheets zusammentragen\n3. Report-Template ausfüllen\n4. PDF generieren und an Kunden versenden',
      tools: ['Asana', 'Google Drive', 'Gmail'],
      frequency: 'Monatlich',
      timePerExecution: 120,
      executionsPerPeriod: 10,
      errorProneness: 2,
      automatable: 2
    },
    {
      name: 'Rechnungsstellung für Projekte',
      department: 'Buchhaltung',
      description: '1. Abgeschlossene Projektphasen in Asana prüfen\n2. Rechnungsdaten manuell sammeln\n3. Rechnung in Lexoffice erstellen\n4. Per E-Mail versenden\n5. Status in CRM aktualisieren',
      tools: ['Asana', 'Lexoffice', 'Gmail', 'HubSpot'],
      frequency: 'Wöchentlich',
      timePerExecution: 15,
      executionsPerPeriod: 12,
      errorProneness: 3,
      automatable: 3
    },
    {
      name: 'Team-Kapazitätsplanung',
      department: 'Management',
      description: '1. Projektauslastung aus Asana manuell erfassen\n2. Mitarbeiterkapazitäten in Google Sheets pflegen\n3. Überlastungen identifizieren\n4. Umplanung mit Team besprechen',
      tools: ['Asana', 'Google Drive', 'Slack'],
      frequency: 'Wöchentlich',
      timePerExecution: 90,
      executionsPerPeriod: 1,
      errorProneness: 2,
      automatable: 2
    }
  ]
}

export const B2B_TEMPLATE = {
  name: 'B2B-Handel Template',
  industry: 'B2B-Handel',
  tools: [
    { name: 'Salesforce', category: 'CRM', frequency: 'Täglich', hasAPI: true },
    { name: 'SAP', category: 'ERP', frequency: 'Täglich', hasAPI: true },
    { name: 'Outlook', category: 'E-Mail', frequency: 'Täglich', hasAPI: true },
    { name: 'Microsoft Teams', category: 'Kommunikation', frequency: 'Täglich', hasAPI: true },
    { name: 'Microsoft Excel', category: 'Tabellen', frequency: 'Täglich', hasAPI: true }
  ],
  processes: [
    {
      name: 'Bestellbestätigung und Auftragsanlage',
      department: 'Vertrieb',
      description: '1. Bestellung per E-Mail erhalten\n2. Daten in Salesforce erfassen\n3. Manuell in SAP ERP übertragen\n4. Auftragsbestätigung per E-Mail versenden',
      tools: ['Outlook', 'Salesforce', 'SAP'],
      frequency: 'Täglich',
      timePerExecution: 12,
      executionsPerPeriod: 20,
      errorProneness: 3,
      automatable: 3
    },
    {
      name: 'Anfragebearbeitung und Preiskalkulation',
      department: 'Vertrieb',
      description: '1. Preisanfrage per E-Mail erhalten\n2. Konditionen aus SAP und Excel manuell zusammentragen\n3. Kalkulation in Excel erstellen\n4. Angebot per E-Mail versenden',
      tools: ['Outlook', 'SAP', 'Microsoft Excel'],
      frequency: 'Täglich',
      timePerExecution: 20,
      executionsPerPeriod: 12,
      errorProneness: 2,
      automatable: 2
    },
    {
      name: 'Lagerbestandsabgleich',
      department: 'Operations',
      description: '1. Bestandsdaten aus SAP exportieren\n2. Mit physischem Lager abgleichen\n3. Differenzen in Excel dokumentieren\n4. Korrekturen in SAP eintragen',
      tools: ['SAP', 'Microsoft Excel'],
      frequency: 'Wöchentlich',
      timePerExecution: 180,
      executionsPerPeriod: 1,
      errorProneness: 3,
      automatable: 2
    },
    {
      name: 'Zahlungserinnerung und Mahnwesen',
      department: 'Buchhaltung',
      description: '1. Offene Posten aus SAP exportieren\n2. Kunden mit überfälligen Rechnungen identifizieren\n3. Mahnungen manuell erstellen\n4. Per E-Mail versenden\n5. Mahnlauf in SAP dokumentieren',
      tools: ['SAP', 'Outlook', 'Microsoft Excel'],
      frequency: 'Wöchentlich',
      timePerExecution: 90,
      executionsPerPeriod: 1,
      errorProneness: 2,
      automatable: 3
    },
    {
      name: 'Lieferanten-Bestellungen',
      department: 'Operations',
      description: '1. Mindestbestände in SAP prüfen\n2. Bestellmengen manuell berechnen\n3. Bestellungen bei Lieferanten aufgeben\n4. Bestellung in SAP erfassen',
      tools: ['SAP', 'Outlook', 'Microsoft Excel'],
      frequency: 'Wöchentlich',
      timePerExecution: 60,
      executionsPerPeriod: 2,
      errorProneness: 2,
      automatable: 2
    },
    {
      name: 'Monats-Umsatzreporting',
      department: 'Management',
      description: '1. Umsatzdaten aus SAP exportieren\n2. In Excel-Pivot aufbereiten\n3. Charts und Dashboards erstellen\n4. Report per E-Mail an Management senden',
      tools: ['SAP', 'Microsoft Excel', 'Outlook'],
      frequency: 'Monatlich',
      timePerExecution: 150,
      executionsPerPeriod: 1,
      errorProneness: 1,
      automatable: 2
    }
  ]
}

export const DEMO_DATA = {
  workshopId: null,
  workshopTitle: '',
  currentStep: 1,
  customer: {
    name: 'Mustermann E-Commerce GmbH',
    industry: 'E-Commerce',
    employees: 80,
    participants: [
      { name: 'Max Mustermann', role: 'Geschäftsführer' },
      { name: 'Julia Schmidt', role: 'Head of Operations' },
      { name: 'Tom Weber', role: 'IT-Leiter' }
    ],
    date: new Date().toISOString().split('T')[0]
  },
  tools: ECOMMERCE_TEMPLATE.tools,
  processes: ECOMMERCE_TEMPLATE.processes,
  automationScenarios: [],
  selectedPackage: null,
  hourlyRate: 45,
  notes: '',
  actionItems: [],
  customPackages: null,
  history: [],
  historyIndex: 0
}

/**
 * Get template by industry
 * @param {string} industry - Industry name
 * @returns {Object|null} - Template object or null
 */
export const getTemplateByIndustry = (industry) => {
  const templates = {
    'E-Commerce': ECOMMERCE_TEMPLATE,
    'Dienstleistung': SERVICES_TEMPLATE,
    'Agentur': SERVICES_TEMPLATE,
    'Beratung': SERVICES_TEMPLATE,
    'B2B-Handel': B2B_TEMPLATE
  }

  return templates[industry] || null
}

/**
 * Load demo data
 * @returns {Object} - Demo data
 */
export const loadDemoData = () => {
  return DEMO_DATA
}
