import { dummyUsers, userColumns } from '../columns'
import { UsersTable } from './UsersTable'

export default function UserTableRenderer() {
  return <UsersTable columns={userColumns} data={dummyUsers} />
}
