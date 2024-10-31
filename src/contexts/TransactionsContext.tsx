import { createContext, ReactNode, useState, useEffect } from 'react'
import { api } from '../lib/axios'

interface TransactionProps {
  id: string
  description: string
  type: 'income' | 'outcome'
  category: string
  price: number
  createdAt: string
}

interface CreateNewTransaction {
  description: string
  type: 'income' | 'outcome'
  category: string
  price: number
  createdAt?: Date
}

interface TransactionContextProps {
  transactions: TransactionProps[]
  fetchTransactions: (query?: string) => Promise<void>
  createNewTransaction: (newTransaction: CreateNewTransaction) => Promise<void>
}

interface TransactionProviderProps {
  children: ReactNode
}

export const TransactionsContext = createContext({} as TransactionContextProps)

export function TransactionsProvider({ children }: TransactionProviderProps) {
  const [transactions, setTransactions] = useState<TransactionProps[]>([])

  async function fetchTransactions(query?: string) {
    const data = await api
      .get('transactions', {
        params: {
          _sort: 'createdAt',
          _order: 'desc',
          q: query,
        },
      })
      .then((res) => res.data)
    setTransactions(data)
  }

  async function createNewTransaction(newTransaction: CreateNewTransaction) {
    const { category, description, price, type } = newTransaction

    const response = await api.post('/transactions', {
      category,
      description,
      price,
      type,
      createdAt: new Date(),
    })

    setTransactions((state) => [response.data, ...state])
  }

  useEffect(() => {
    fetchTransactions()
  }, [])

  return (
    <TransactionsContext.Provider
      value={{
        transactions,
        fetchTransactions,
        createNewTransaction,
      }}
    >
      {children}
    </TransactionsContext.Provider>
  )
}
