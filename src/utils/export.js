import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { formatCurrency, formatNumber, calculateROI, getTopProcesses } from './calculations'
import { PACKAGES } from './constants'

/**
 * Export workshop data to PDF
 * @param {Object} state - Workshop state
 * @returns {Promise<void>}
 */
export const exportToPDF = async (state) => {
  const { customer, processes, tools, automationScenarios, selectedPackage, hourlyRate } = state

  const pdf = new jsPDF('p', 'mm', 'a4')
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  const margin = 20
  let y = margin

  // Helper functions
  const addText = (text, fontSize = 12, isBold = false, color = [0, 0, 0]) => {
    pdf.setFontSize(fontSize)
    pdf.setFont('helvetica', isBold ? 'bold' : 'normal')
    pdf.setTextColor(...color)
    pdf.text(text, margin, y)
    y += fontSize * 0.5
  }

  const addLine = () => {
    pdf.setDrawColor(200, 200, 200)
    pdf.line(margin, y, pageWidth - margin, y)
    y += 5
  }

  const checkPageBreak = (neededSpace = 40) => {
    if (y + neededSpace > pageHeight - margin) {
      pdf.addPage()
      y = margin
    }
  }

  // Page 1: Title Page
  pdf.setFillColor(46, 49, 146) // Primary color
  pdf.rect(0, 0, pageWidth, 60, 'F')

  pdf.setTextColor(255, 255, 255)
  pdf.setFontSize(28)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Workshop-Zusammenfassung', margin, 35)

  pdf.setFontSize(14)
  pdf.setFont('helvetica', 'normal')
  pdf.text('Workflow-Automatisierung', margin, 45)

  y = 80
  pdf.setTextColor(0, 0, 0)

  addText(`Unternehmen: ${customer.name || 'N/A'}`, 16, true)
  addText(`Branche: ${customer.industry || 'N/A'}`, 12)
  addText(`Datum: ${new Date(customer.date).toLocaleDateString('de-DE')}`, 12)
  y += 10

  if (customer.participants.length > 0) {
    addText('Teilnehmer:', 12, true)
    customer.participants.forEach(p => {
      addText(`  • ${p.name} (${p.role})`, 10)
    })
  }

  // Page 2: Executive Summary
  pdf.addPage()
  y = margin

  pdf.setFillColor(46, 49, 146)
  pdf.rect(margin, y, pageWidth - 2 * margin, 10, 'F')
  pdf.setTextColor(255, 255, 255)
  pdf.setFontSize(16)
  pdf.text('Executive Summary', margin + 5, y + 7)
  y += 20
  pdf.setTextColor(0, 0, 0)

  const selectedPkg = PACKAGES.find(p => p.id === selectedPackage) || PACKAGES[1]
  const roi = calculateROI(processes, automationScenarios, hourlyRate, selectedPkg.price)

  // Key metrics boxes
  const boxWidth = (pageWidth - 3 * margin) / 2
  const boxHeight = 30

  // ROI Box
  pdf.setFillColor(16, 185, 129) // Success color
  pdf.roundedRect(margin, y, boxWidth, boxHeight, 3, 3, 'F')
  pdf.setTextColor(255, 255, 255)
  pdf.setFontSize(24)
  pdf.setFont('helvetica', 'bold')
  pdf.text(`${formatNumber(roi.averageROI, 0)}%`, margin + boxWidth / 2, y + 15, { align: 'center' })
  pdf.setFontSize(10)
  pdf.setFont('helvetica', 'normal')
  pdf.text('ROI (Average Case)', margin + boxWidth / 2, y + 23, { align: 'center' })

  // Time Savings Box
  pdf.setFillColor(79, 70, 229) // Secondary color
  pdf.roundedRect(margin + boxWidth + margin, y, boxWidth, boxHeight, 3, 3, 'F')
  pdf.setFontSize(24)
  pdf.setFont('helvetica', 'bold')
  pdf.text(`${formatNumber(roi.averageTimeSavings, 0)}h`, margin + boxWidth + margin + boxWidth / 2, y + 15, { align: 'center' })
  pdf.setFontSize(10)
  pdf.setFont('helvetica', 'normal')
  pdf.text('Zeitersparnis/Jahr', margin + boxWidth + margin + boxWidth / 2, y + 23, { align: 'center' })

  y += boxHeight + 15

  // Investment Box
  pdf.setFillColor(239, 68, 68) // Error color
  pdf.roundedRect(margin, y, boxWidth, boxHeight, 3, 3, 'F')
  pdf.setTextColor(255, 255, 255)
  pdf.setFontSize(20)
  pdf.setFont('helvetica', 'bold')
  pdf.text(formatCurrency(selectedPkg.price), margin + boxWidth / 2, y + 15, { align: 'center' })
  pdf.setFontSize(10)
  pdf.setFont('helvetica', 'normal')
  pdf.text('Investition/Jahr', margin + boxWidth / 2, y + 23, { align: 'center' })

  // Amortization Box
  pdf.setFillColor(245, 158, 11) // Warning color
  pdf.roundedRect(margin + boxWidth + margin, y, boxWidth, boxHeight, 3, 3, 'F')
  pdf.setFontSize(24)
  pdf.setFont('helvetica', 'bold')
  pdf.text(`${formatNumber(roi.averageAmortization, 1)}`, margin + boxWidth + margin + boxWidth / 2, y + 15, { align: 'center' })
  pdf.setFontSize(10)
  pdf.setFont('helvetica', 'normal')
  pdf.text('Monate bis ROI', margin + boxWidth + margin + boxWidth / 2, y + 23, { align: 'center' })

  y += boxHeight + 20
  pdf.setTextColor(0, 0, 0)

  // Page 3: Top Processes
  pdf.addPage()
  y = margin

  pdf.setFillColor(46, 49, 146)
  pdf.rect(margin, y, pageWidth - 2 * margin, 10, 'F')
  pdf.setTextColor(255, 255, 255)
  pdf.setFontSize(16)
  pdf.text('Top 5 Prozesse (höchste Priorität)', margin + 5, y + 7)
  y += 20
  pdf.setTextColor(0, 0, 0)

  const topProcesses = getTopProcesses(processes, 5)

  topProcesses.forEach((process, index) => {
    checkPageBreak()

    pdf.setFillColor(249, 250, 251)
    pdf.roundedRect(margin, y, pageWidth - 2 * margin, 25, 2, 2, 'F')

    pdf.setFontSize(14)
    pdf.setFont('helvetica', 'bold')
    pdf.text(`${index + 1}. ${process.name}`, margin + 5, y + 8)

    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'normal')
    pdf.text(`Abteilung: ${process.department}`, margin + 5, y + 15)
    pdf.text(`Score: ${process.score}/12`, pageWidth - margin - 30, y + 15)

    pdf.setFontSize(9)
    pdf.text(`Häufigkeit: ${process.frequency}`, margin + 5, y + 21)
    pdf.text(`Tools: ${process.tools.length}`, margin + 50, y + 21)

    y += 30
  })

  // Page 4: Package Recommendation
  pdf.addPage()
  y = margin

  pdf.setFillColor(46, 49, 146)
  pdf.rect(margin, y, pageWidth - 2 * margin, 10, 'F')
  pdf.setTextColor(255, 255, 255)
  pdf.setFontSize(16)
  pdf.text('Paket-Empfehlung', margin + 5, y + 7)
  y += 20
  pdf.setTextColor(0, 0, 0)

  pdf.setFillColor(240, 240, 255)
  pdf.roundedRect(margin, y, pageWidth - 2 * margin, 50, 3, 3, 'F')

  pdf.setFontSize(18)
  pdf.setFont('helvetica', 'bold')
  pdf.setTextColor(46, 49, 146)
  pdf.text(selectedPkg.name, margin + 10, y + 15)

  pdf.setFontSize(12)
  pdf.setTextColor(0, 0, 0)
  pdf.setFont('helvetica', 'normal')
  pdf.text(`Workflows: ${selectedPkg.workflows}`, margin + 10, y + 25)
  pdf.text(`Executions/Jahr: ${(selectedPkg.executions / 1000).toFixed(0)}k`, margin + 10, y + 32)
  pdf.text(`Custom APIs: ${selectedPkg.customApis}`, margin + 10, y + 39)

  pdf.setFontSize(16)
  pdf.setFont('helvetica', 'bold')
  pdf.text(formatCurrency(selectedPkg.price) + '/Jahr', pageWidth - margin - 50, y + 30)

  y += 60

  addText('Enthaltene Features:', 12, true)
  selectedPkg.features.forEach((feature, index) => {
    checkPageBreak()
    addText(`  ✓ ${feature}`, 10)
  })

  // Page 5: Statistics
  pdf.addPage()
  y = margin

  pdf.setFillColor(46, 49, 146)
  pdf.rect(margin, y, pageWidth - 2 * margin, 10, 'F')
  pdf.setTextColor(255, 255, 255)
  pdf.setFontSize(16)
  pdf.text('Workshop-Statistik', margin + 5, y + 7)
  y += 20
  pdf.setTextColor(0, 0, 0)

  const stats = [
    { label: 'Erfasste Tools', value: tools.length },
    { label: 'Erfasste Prozesse', value: processes.length },
    { label: 'Automatisierungsszenarien', value: automationScenarios.length },
    { label: 'Beteiligte Abteilungen', value: new Set(processes.map(p => p.department)).size },
    { label: 'Workflows benötigt', value: automationScenarios.reduce((sum, s) => sum + (s.workflowsNeeded || 0), 0) }
  ]

  stats.forEach(stat => {
    checkPageBreak()
    pdf.setFillColor(249, 250, 251)
    pdf.roundedRect(margin, y, pageWidth - 2 * margin, 15, 2, 2, 'F')

    pdf.setFontSize(11)
    pdf.setFont('helvetica', 'normal')
    pdf.text(stat.label, margin + 5, y + 9)

    pdf.setFont('helvetica', 'bold')
    pdf.text(stat.value.toString(), pageWidth - margin - 20, y + 9)

    y += 20
  })

  // Footer on all pages
  const totalPages = pdf.internal.getNumberOfPages()
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i)
    pdf.setFontSize(8)
    pdf.setFont('helvetica', 'normal')
    pdf.setTextColor(150, 150, 150)
    pdf.text(
      `Workshop Wizard • Cynefa • Seite ${i} von ${totalPages}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    )
  }

  // Save PDF
  const filename = `workshop-${customer.name || 'report'}-${new Date().toISOString().split('T')[0]}.pdf`
  pdf.save(filename)
}
