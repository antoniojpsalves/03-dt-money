import { createContext, ReactNode, useState, useEffect } from 'react'

interface TransactionProps {
  id: string
  description: string
  type: "income" | "outcome"
  category: string
  price: number
  createdAt: string
}

interface TransactionContextProps {
  transactions: TransactionProps[],
  addNewTransaction: (newTransaction: TransactionProps) => void
}

interface TransactionProviderProps {
  children: ReactNode
}

export const TransactionsContext = createContext({} as TransactionContextProps)

export function TransactionsProvider({ children }: TransactionProviderProps) {

  const [transactions, setTransactions] = useState<TransactionProps[]>([])

  async function loadTransactions() {
    const response = await fetch('http://localhost:3333/transactions')
    const data = await response.json()
    setTransactions(data)
  }

  function addNewTransaction(newTransaction: TransactionProps) {
    return (
      setTransactions(state => {
        return [...state, newTransaction]
      })
    )
  }

  useEffect(() => {
    loadTransactions()
  }, [])

  return (
    <TransactionsContext.Provider value={{
      transactions,
      addNewTransaction
    }}>
      {children}
    </TransactionsContext.Provider>
  )
}
