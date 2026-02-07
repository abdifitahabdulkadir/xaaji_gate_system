'use client'

import { ColumnDef } from '@tanstack/react-table'

export const userColumns: ColumnDef<UserTable>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'createdAt',
    header: 'Joined At',
  },
  {
    accessorKey: 'gender',
    header: 'Gender',
  },

  {
    accessorKey: 'banned',
    header: 'Banned State',
  },
  {
    accessorKey: 'banReason',
    header: 'Reason for ban',
  },
  {
    accessorKey: 'banExpires',
    header: 'Ban Expiration Date',
  },
  {
    accessorKey: 'actions',
    header: 'Actions',
  },
]
