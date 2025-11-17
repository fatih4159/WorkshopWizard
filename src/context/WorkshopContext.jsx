import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { saveToStorage, loadFromStorage } from '../utils/storage'
import { calculateProcessScore } from '../utils/calculations'

const WorkshopContext = createContext()

// Initial state
const initialState = {
  currentStep: 1,
  customer: {
    name: '',
    industry: '',
    employees: 0,
    participants: [],
    date: new Date().toISOString().split('T')[0]
  },
  tools: [],
  processes: [],
  automationScenarios: [],
  selectedPackage: null,
  hourlyRate: 45,
  notes: '',
  actionItems: [],
  customPackages: null, // null means use default packages from constants.js
  history: [],
  historyIndex: 0
}

// Action types
const Actions = {
  SET_STEP: 'SET_STEP',
  UPDATE_CUSTOMER: 'UPDATE_CUSTOMER',
  ADD_TOOL: 'ADD_TOOL',
  UPDATE_TOOL: 'UPDATE_TOOL',
  REMOVE_TOOL: 'REMOVE_TOOL',
  ADD_PROCESS: 'ADD_PROCESS',
  UPDATE_PROCESS: 'UPDATE_PROCESS',
  REMOVE_PROCESS: 'REMOVE_PROCESS',
  ADD_AUTOMATION_SCENARIO: 'ADD_AUTOMATION_SCENARIO',
  UPDATE_AUTOMATION_SCENARIO: 'UPDATE_AUTOMATION_SCENARIO',
  REMOVE_AUTOMATION_SCENARIO: 'REMOVE_AUTOMATION_SCENARIO',
  SET_SELECTED_PACKAGE: 'SET_SELECTED_PACKAGE',
  SET_HOURLY_RATE: 'SET_HOURLY_RATE',
  SET_NOTES: 'SET_NOTES',
  ADD_ACTION_ITEM: 'ADD_ACTION_ITEM',
  UPDATE_ACTION_ITEM: 'UPDATE_ACTION_ITEM',
  REMOVE_ACTION_ITEM: 'REMOVE_ACTION_ITEM',
  SET_CUSTOM_PACKAGES: 'SET_CUSTOM_PACKAGES',
  LOAD_DATA: 'LOAD_DATA',
  RESET_DATA: 'RESET_DATA',
  UNDO: 'UNDO',
  REDO: 'REDO'
}

// Reducer
const workshopReducer = (state, action) => {
  let newState

  switch (action.type) {
    case Actions.SET_STEP:
      return { ...state, currentStep: action.payload }

    case Actions.UPDATE_CUSTOMER:
      return { ...state, customer: { ...state.customer, ...action.payload } }

    case Actions.ADD_TOOL:
      newState = { ...state, tools: [...state.tools, { ...action.payload, id: Date.now().toString() }] }
      return addToHistory(state, newState)

    case Actions.UPDATE_TOOL:
      newState = {
        ...state,
        tools: state.tools.map(tool =>
          tool.id === action.payload.id ? { ...tool, ...action.payload.updates } : tool
        )
      }
      return addToHistory(state, newState)

    case Actions.REMOVE_TOOL:
      newState = { ...state, tools: state.tools.filter(tool => tool.id !== action.payload) }
      return addToHistory(state, newState)

    case Actions.ADD_PROCESS:
      const newProcess = {
        ...action.payload,
        id: Date.now().toString(),
        score: calculateProcessScore(action.payload)
      }
      newState = { ...state, processes: [...state.processes, newProcess] }
      return addToHistory(state, newState)

    case Actions.UPDATE_PROCESS:
      newState = {
        ...state,
        processes: state.processes.map(process =>
          process.id === action.payload.id
            ? { ...process, ...action.payload.updates, score: calculateProcessScore({ ...process, ...action.payload.updates }) }
            : process
        )
      }
      return addToHistory(state, newState)

    case Actions.REMOVE_PROCESS:
      newState = { ...state, processes: state.processes.filter(process => process.id !== action.payload) }
      return addToHistory(state, newState)

    case Actions.ADD_AUTOMATION_SCENARIO:
      newState = {
        ...state,
        automationScenarios: [...state.automationScenarios, { ...action.payload, id: Date.now().toString() }]
      }
      return addToHistory(state, newState)

    case Actions.UPDATE_AUTOMATION_SCENARIO:
      newState = {
        ...state,
        automationScenarios: state.automationScenarios.map(scenario =>
          scenario.id === action.payload.id
            ? { ...scenario, ...action.payload.updates }
            : scenario
        )
      }
      return addToHistory(state, newState)

    case Actions.REMOVE_AUTOMATION_SCENARIO:
      newState = {
        ...state,
        automationScenarios: state.automationScenarios.filter(scenario => scenario.id !== action.payload)
      }
      return addToHistory(state, newState)

    case Actions.SET_SELECTED_PACKAGE:
      return { ...state, selectedPackage: action.payload }

    case Actions.SET_HOURLY_RATE:
      return { ...state, hourlyRate: action.payload }

    case Actions.SET_NOTES:
      return { ...state, notes: action.payload }

    case Actions.ADD_ACTION_ITEM:
      return {
        ...state,
        actionItems: [...state.actionItems, { ...action.payload, id: Date.now().toString() }]
      }

    case Actions.UPDATE_ACTION_ITEM:
      return {
        ...state,
        actionItems: state.actionItems.map(item =>
          item.id === action.payload.id ? { ...item, ...action.payload.updates } : item
        )
      }

    case Actions.REMOVE_ACTION_ITEM:
      return {
        ...state,
        actionItems: state.actionItems.filter(item => item.id !== action.payload)
      }

    case Actions.SET_CUSTOM_PACKAGES:
      return { ...state, customPackages: action.payload }

    case Actions.LOAD_DATA:
      return { ...action.payload, history: [action.payload], historyIndex: 0 }

    case Actions.RESET_DATA:
      return { ...initialState, history: [initialState], historyIndex: 0 }

    case Actions.UNDO:
      if (state.historyIndex > 0) {
        const newIndex = state.historyIndex - 1
        return { ...state.history[newIndex], historyIndex: newIndex }
      }
      return state

    case Actions.REDO:
      if (state.historyIndex < state.history.length - 1) {
        const newIndex = state.historyIndex + 1
        return { ...state.history[newIndex], historyIndex: newIndex }
      }
      return state

    default:
      return state
  }
}

// Helper to add state to history (max 50 entries)
const addToHistory = (state, newState) => {
  const history = [...state.history.slice(0, state.historyIndex + 1), newState]
  const trimmedHistory = history.slice(-50) // Keep last 50 entries
  return {
    ...newState,
    history: trimmedHistory,
    historyIndex: trimmedHistory.length - 1
  }
}

// Context Provider
export const WorkshopProvider = ({ children }) => {
  const [state, dispatch] = useReducer(workshopReducer, initialState)

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = loadFromStorage()
    if (savedData) {
      dispatch({ type: Actions.LOAD_DATA, payload: savedData })
    }
  }, [])

  // Auto-save to localStorage (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      const { history, historyIndex, ...dataToSave } = state
      saveToStorage(dataToSave)
    }, 1000)

    return () => clearTimeout(timer)
  }, [state])

  return (
    <WorkshopContext.Provider value={{ state, dispatch, Actions }}>
      {children}
    </WorkshopContext.Provider>
  )
}

// Custom hook to use workshop context
export const useWorkshop = () => {
  const context = useContext(WorkshopContext)
  if (!context) {
    throw new Error('useWorkshop must be used within WorkshopProvider')
  }
  return context
}
