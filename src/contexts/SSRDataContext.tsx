import React, { createContext, useContext, ReactNode } from 'react';

interface SSRDataType {
  product?: any;
  store?: any;
  related_deals?: any[];
  [key: string]: any;
}

interface SSRDataContextType {
  data: SSRDataType;
}

const SSRDataContext = createContext<SSRDataContextType | undefined>(undefined);

export function SSRDataProvider({
  children,
  data
}: {
  children: ReactNode;
  data: SSRDataType;
}) {
  return (
    <SSRDataContext.Provider value={{ data }}>
      {children}
    </SSRDataContext.Provider>
  );
}

export function useSSRData() {
  const context = useContext(SSRDataContext);
  if (context === undefined) {
    throw new Error('useSSRData must be used within an SSRDataProvider');
  }
  return context;
}

// For server-side use
let globalSSRData: SSRDataType = {};

export function setGlobalSSRData(data: SSRDataType) {
  globalSSRData = data;
}

export function getGlobalSSRData(): SSRDataType {
  return globalSSRData;
}