import { Gender, UserRoles } from '@/generated/prisma/enums'
import { EditBasicDataSchema, EditBasicDataSchemaType } from '@/lib/validations'
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
import { useRouter } from '@tanstack/react-router'
import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '../ui/button'
import { FieldError } from '../ui/field'
import { Input } from '../ui/input'

import { editUsersBasicDataFn } from '@/data/user.function'
import { useQueryClient } from '@tanstack/react-query'
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
  user?: UserTable
}

export default function EditBasicDataForm({ user }: Props) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EditBasicDataSchemaType>({
    defaultValues: {
      name: user?.name ?? '',
      email: user?.email,
      role: user?.role.includes('admin') ? 'admin' : 'user',
      gender: user?.gender?.includes('female') ? 'female' : 'male',
    },
    resolver: standardSchemaResolver(EditBasicDataSchema),
  })

  const [isSubmitting, startTransition] = useTransition()
  const useEditUserDataFn = useServerFn(editUsersBasicDataFn)
  const router = useRouter()
  const queryClient = useQueryClient()
  const watchRole = watch('role')
  const watchGender = watch('gender')

  function handleFormSubmit(data: EditBasicDataSchemaType) {
    startTransition(async () => {
      const result = await useEditUserDataFn({
        data: {
          ...data,
          userId: user?.id!,
        },
      })

      if (result.success) {
        toast.success('Sucessfully Saved the Changes')
        router.invalidate({ sync: true })
        queryClient.invalidateQueries({
          queryKey: ['users'],
        })
        return
      }
      toast.error(result.Errors?.message!)
    })
  }

  return (
    <div className="w-full mx-auto h-fit border rounded-2xl px-6 py-4  max-w-3xl space-y-6">
      <div className="flex items-center border-border/40  border-b justify-center">
        <h2 className="text-2xl font-bold">Edit User's Basic Data</h2>
      </div>
      <form
        className="flex flex-col gap-4 text-[1.2rem]"
        onSubmit={handleSubmit(handleFormSubmit)}
      >
        <label className="flex flex-col gap-1">
          <span className="text-lg font-medium">Full Name</span>
          <Input
            {...register('name')}
            disabled={isSubmitting}
            name="name"
            className="focus-visible:border-primary placeholder:text-lg  h-12.5"
            placeholder="Enter your Name"
          />
          <FieldError
            errors={
              errors.name ? [{ message: errors.name.message }] : undefined
            }
          />
        </label>

        <label className="flex flex-col gap-1 sm:col-span-2">
          <span className="text-lg font-medium">Email</span>
          <Input
            {...register('email')}
            disabled={isSubmitting}
            name="email"
            className="focus-visible:border-primary placeholder:text-lg  h-12.5"
            type="email"
            placeholder="Enter Your Email"
          />
          <FieldError
            errors={
              errors.email ? [{ message: errors.email.message }] : undefined
            }
          />
        </label>

        <Select
          defaultValue={watchGender}
          onValueChange={(value) => {
            setValue('gender', value as Gender)
          }}
        >
          <SelectTrigger className="w-full h-12.5  text-lg">
            <SelectValue placeholder="Select Gender" />
          </SelectTrigger>
          <SelectContent className="w-full  shadow-2xl  py-4 text-lg">
            {Object.values(Gender).map((gender) => {
              return (
                <SelectItem
                  className="text-lg focus:bg-primary focus:text-white"
                  key={gender}
                  value={gender}
                >
                  {gender}
                </SelectItem>
              )
            })}
          </SelectContent>
          <FieldError
            errors={
              errors.gender ? [{ message: errors.gender.message }] : undefined
            }
          />
        </Select>
        <Select
          defaultValue={watchRole}
          onValueChange={(value) => {
            setValue('role', value as UserRoles)
          }}
        >
          <SelectTrigger className="w-full h-12.5  text-lg">
            <SelectValue placeholder="Select Role" />
          </SelectTrigger>
          <SelectContent className="w-full  shadow-2xl  py-4 text-lg">
            {Object.values(UserRoles).map((role) => {
              return (
                <SelectItem
                  className="text-lg focus:bg-primary focus:text-white"
                  key={role}
                  value={role}
                >
                  {role}
                </SelectItem>
              )
            })}
          </SelectContent>
          <FieldError
            errors={
              errors.role ? [{ message: errors.role.message }] : undefined
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
    </div>
  )
}
