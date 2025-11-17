# Workshop Wizard - Workflow-Automatisierung Tool

Ein professionelles, interaktives Workshop-Tool für Workflow-Automatisierungs-Beratung bei deutschen KMU.

## Features

### 8-Schritte Workshop-Flow

1. **Kundeninfo** - Erfassung von Firmendaten und Teilnehmern
2. **Tool-Landscape** - Dokumentation aller genutzten Software-Tools
3. **Prozess-Erfassung** - Detaillierte Erfassung manueller Geschäftsprozesse
4. **Automatisierungsszenarien** - Definition von SOLL-Zuständen und Einsparpotenzial
5. **Priorisierung** - Automatische Bewertungsmatrix nach Automatisierungspotenzial
6. **ROI-Berechnung** - Best/Average/Worst Case ROI-Kalkulation
7. **Paket-Empfehlung** - Automatische Empfehlung des passenden Cynefa-Pakets
8. **Zusammenfassung** - Vollständiger Workshop-Report mit Export-Funktionen

### Kernfunktionalitäten

- ✅ **Auto-Save** - Automatisches Speichern in LocalStorage
- ✅ **PDF-Export** - Professioneller mehrseitiger Report
- ✅ **JSON/CSV-Export** - Datenexport für Nachbearbeitung
- ✅ **Demo-Daten** - Schnelleinstieg mit vorkonfigurierten Beispieldaten
- ✅ **Templates** - Branchen-spezifische Vorlagen (E-Commerce, Dienstleistung, B2B)
- ✅ **ROI-Dashboard** - Interaktive Sensitivitätsanalyse
- ✅ **Responsive Design** - Optimiert für Desktop, Tablet und Mobile

## Technologie-Stack

- **Framework:** React 18 mit Hooks
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **PDF:** jsPDF + html2canvas
- **Charts:** Recharts
- **Validation:** Zod
- **State:** Context API + useReducer
- **Build:** Vite

## Installation

```bash
# Dependencies installieren
npm install

# Development Server starten
npm run dev

# Production Build erstellen
npm run build
```

## Verwendung

1. **Starten Sie die Anwendung**
   ```bash
   npm run dev
   ```
   Die App läuft auf [http://localhost:3000](http://localhost:3000)

2. **Demo-Daten laden** (optional)
   - Klicken Sie auf "Demo laden" im Header
   - Vorkonfigurierte E-Commerce-Beispieldaten werden geladen

3. **Workshop durchführen**
   - Arbeiten Sie sich durch die 8 Schritte
   - Alle Daten werden automatisch gespeichert

4. **Export**
   - **PDF**: Vollständiger Workshop-Report
   - **JSON**: Alle Daten für Backup/Import
   - **CSV**: Prozess-Tabelle für Excel

## Version

**Version:** 2.0.0