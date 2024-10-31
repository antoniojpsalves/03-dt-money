import { createContext, ReactNode, useState, useEffect } from 'react'
import { api } from '../lib/axios'

interface TransactionProps {
  id: string
  description: string
  type: "income" | "outcome"
  category: string
  price: number
  createdAt: string
}

interface TransactionContextProps {
  transactions: TransactionProps[]
  fetchTransactions: (query?: string) => Promise<void>
  addNewTransaction: (newTransaction: TransactionProps) => void
}

interface TransactionProviderProps {
  children: ReactNode
}

export const TransactionsContext = createContext({} as TransactionContextProps)

export function TransactionsProvider({ children }: TransactionProviderProps) {

  const [transactions, setTransactions] = useState<TransactionProps[]>([])

  async function fetchTransactions(query?: string) {

    const data = await api.get('transactions', {
      params: {
        q: query
      }
    }).then(res => res.data)
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
    fetchTransactions()
  }, [])

  return (
    <TransactionsContext.Provider value={{
      transactions,
      fetchTransactions,
      addNewTransaction
    }}>
      {children}
    </TransactionsContext.Provider>
  )
}
