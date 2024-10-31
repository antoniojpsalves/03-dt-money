import { useState, useEffect } from 'react'

import { Header } from "../../components/Header";
import { SearchForm } from "../../components/SearchForm";
import { Summary } from "../../components/Summary";
import { PriceHighLight, TransactionsContainer, TransactionsTable } from "./styles";


interface TransactionProps {
  id: string
  description: string
  type: "income" | "outcome"
  category: string
  price: number
  createdAt: string
}

export function Transactions() {

  const [transactions, setTransactions] = useState<TransactionProps[]>([])

  async function loadTransactions() {
    try {

      await fetch('http://localhost:3333/transactions')
        .then(res => res.json())
        .then(data => {
          console.log(data)
          setTransactions(data)
        })
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    loadTransactions()
  }, [])

  return (
    <div>
      <Header />
      <Summary />

      <TransactionsContainer>
        <SearchForm />
        <TransactionsTable>
          <tbody>
            {
              transactions.map(transaction => {
                const { id, description, type, category, price, createdAt } = transaction
                return (

                  <tr key={id}>
                    <td width="50%">{description}</td>
                    <td>
                      <PriceHighLight variant={type}>
                        R$ {price}
                      </PriceHighLight>
                    </td>
                    <td>{category}</td>
                    <td>{createdAt}</td>
                  </tr>

                )
              })
            }
          </tbody>
        </TransactionsTable>
      </TransactionsContainer>
    </div>
  )
}
