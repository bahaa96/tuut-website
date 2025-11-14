import React, { createContext, useContext, ReactNode } from 'react'

// SSR Data Types
export interface SSRData {
  [key: string]: any
  store?: any
  deals?: any[]
  product?: any
  deal?: any
  category?: any
  stores?: any[]
  categories?: any[]
  products?: any[]
  deals?: any[]
  blogs?: any[]
  articles?: any[]
}

// SSR Data Context
interface SSRDataContextType {
  data: SSRData
  setData?: (data: SSRData) => void
}

const SSRDataContext = createContext<SSRDataContextType>({
  data: {}
})

// SSR Data Provider Component
export function SSRDataProvider({ children, data }: { children: ReactNode; data: SSRData }) {
  return (
    <SSRDataContext.Provider value={{ data }}>
      {children}
    </SSRDataContext.Provider>
  )
}

// Hook to use SSR data
export function useSSRData() {
  const context = useContext(SSRDataContext)
  if (!context) {
    throw new Error('useSSRData must be used within an SSRDataProvider')
  }
  return context
}

// Global SSR data setter for server-side
let globalSSRData: SSRData = {}

export function setGlobalSSRData(data: SSRData) {
  globalSSRData = data
}

export function getGlobalSSRData(): SSRData {
  return globalSSRData
}

export { SSRDataContext }