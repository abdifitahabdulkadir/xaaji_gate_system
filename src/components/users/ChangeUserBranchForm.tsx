import {
  ChangeUserBranchSchema,
  ChangeUserBranchSchemaType,
} from '@/lib/validations'
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
import { useRouter } from '@tanstack/react-router'
import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '../ui/button'
import { FieldError } from '../ui/field'

import { changeUserBranchFn } from '@/data/user.function'
import { Branch } from '@/generated/prisma/client'
import { UserTable } from '@/lib/types'
import { useServerFn } from '@tanstack/react-start'
import toast from 'react-hot-toast'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'

interface Props {
  branches: Branch[]
  user: UserTable | undefined
}

export default function ChangeUserBranchForm({ branches, user }: Props) {
  const {
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ChangeUserBranchSchemaType>({
    defaultValues: {
      branchId: '',
    },
    resolver: standardSchemaResolver(ChangeUserBranchSchema),
  })

  const userBranch = branches.find(
    (eachBranch) => eachBranch.id === user?.branchId,
  )
  const [isSubmitting, startTransition] = useTransition()
  const useChangeUserBranchForm = useServerFn(changeUserBranchFn)
  const router = useRouter()

  function handleFormSubmit(data: ChangeUserBranchSchemaType) {
    if (!data.branchId) {
      toast.error('Please select Branch from the list')
      return
    }
    startTransition(async () => {
      const result = await useChangeUserBranchForm({
        data: {
          userId: user?.id,
          branchId: user?.branchId!,
        },
      })
      if (result.success) {
        toast.success('Successfully Updated.')
        await router.invalidate()
        return
      }
      toast.error(result.Errors?.message!)
    })
  }

  return (
    <div className="w-full mx-auto h-fit border rounded-2xl px-6 py-4  max-w-3xl space-y-6">
      <div className="flex items-center border-border/40  border-b justify-center">
        <h2 className="text-2xl font-bold">Manage User Branch Information</h2>
      </div>
      <div className="mb-4 p-4 bg-muted rounded-xl border flex flex-col gap-2">
        <span className="font-semibold text-lg">
          Current Branch Information
        </span>
        {userBranch ? (
          <ul className="ml-2 list-disc">
            <li>
              <span className="font-medium">Branch Name:</span>{' '}
              {userBranch.name}
            </li>
            {userBranch.location && (
              <li>
                <span className="font-medium">Location:</span>{' '}
                {userBranch.location}
              </li>
            )}
            {userBranch.city && (
              <li>
                <span className="font-medium">City:</span> {userBranch.city}
              </li>
            )}
          </ul>
        ) : (
          <span className="text-muted-foreground italic">
            No branch assigned
          </span>
        )}
      </div>
      {branches.length > 0 && (
        <form
          className="flex flex-col gap-4 text-[1.2rem]"
          onSubmit={handleSubmit(handleFormSubmit)}
        >
          <Select
            onValueChange={(value) => {
              setValue('branchId', value)
            }}
          >
            <SelectTrigger className="w-full h-12.5  text-lg">
              <SelectValue placeholder="Select Gender" />
            </SelectTrigger>
            <SelectContent className="w-full  shadow-2xl  py-4 text-lg">
              {branches.map((branch) => {
                return (
                  <SelectItem
                    className="text-lg focus:bg-primary focus:text-white"
                    key={branch.id}
                    value={branch.id}
                  >
                    {[branch.name, branch.location, branch.city]
                      .filter(Boolean)
                      .join(', ')}
                  </SelectItem>
                )
              })}
            </SelectContent>
            <FieldError
              errors={
                errors.branchId
                  ? [{ message: errors.branchId.message }]
                  : undefined
              }
            />
          </Select>

          <div className="sm:col-span-2">
            <Button
              disabled={isSubmitting}
              type="submit"
              className="w-fit h-10  mx-auto bg-primary px-4 py-2 text-white font-semibold hover:bg-primary/70 transition"
            >
              {isSubmitting ? 'Saving....' : 'Save Changes'}
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}
