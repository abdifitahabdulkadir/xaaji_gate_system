import { getAllUsers } from '@/data/user.functions'
import { useQuery } from '@tanstack/react-query'
import { userColumns } from '../columns'
import { TableSkelton } from '../shared/loaders'
import { UsersTable } from './UsersTable'

export default function UserTableRenderer() {
  const { isLoading, data } = useQuery({
    queryKey: ['users'],
    queryFn: getAllUsers,
  })
  if (isLoading) {
    return <TableSkelton cols={8} rows={5} />
  }

  console.log(data)
  return <UsersTable columns={userColumns} data={data?.data ?? []} />
}
