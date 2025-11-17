import React from 'react'

const StepBanner = ({ title, description, steps, emoji }) => {
  return (
    <div className="bg-gradient-to-r from-primary to-secondary text-white rounded-xl p-6 shadow-soft-lg">
      <h2 className="text-3xl font-bold mb-2">{title} {emoji}</h2>
      <p className="text-lg opacity-90 mb-4">{description}</p>
      {steps && steps.length > 0 && (
        <div className="bg-white/10 rounded-lg p-4 backdrop-blur">
          <p className="text-sm font-medium mb-2">So geht's:</p>
          <ol className="text-sm space-y-1 opacity-90">
            {steps.map((step, index) => (
              <li key={index}>{index + 1}️⃣ {step}</li>
            ))}
          </ol>
        </div>
      )}
    </div>
  )
}

export default StepBanner
