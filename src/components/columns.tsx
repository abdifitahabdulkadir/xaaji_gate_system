'use client'

import { ColumnDef } from '@tanstack/react-table'

export type Payment = {
  id: string
  amount: number
  status: 'pending' | 'processing' | 'success' | 'failed'
  email: string
}

export const userColumns: ColumnDef<Payment>[] = [
  {
    accessorKey: 'status',
    header: 'Status',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
  },
]

// Dummy data: 60 users
function randomStatus() {
  const statuses = ['pending', 'processing', 'success', 'failed'] as const
  return statuses[Math.floor(Math.random() * statuses.length)]
}

function randomAmount() {
  return Math.floor(Math.random() * 4991) + 10
}

export const dummyUsers: Payment[] = Array.from({ length: 100000 }, (_, i) => ({
  id: `user-${i + 1}`,
  amount: randomAmount(),
  status: randomStatus(),
  email: `user${i + 1}@example.com`,
}))
