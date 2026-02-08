import { BanUserSchema, BanUserSchemaType } from '@/lib/validations'
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
import { useRouter } from '@tanstack/react-router'
import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '../ui/button'
import { FieldError } from '../ui/field'
import { Input } from '../ui/input'

import { banUnBanUserFn } from '@/data/user.function'
import { useQueryClient } from '@tanstack/react-query'
import { useServerFn } from '@tanstack/react-start'
import toast from 'react-hot-toast'
import { DatePicker } from '../shared/DatePicker'
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

export default function BanUserForm({ user }: Props) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BanUserSchemaType>({
    defaultValues: {
      banExpires: user?.banExpires ?? undefined,
      banned: user?.banned ?? undefined,
      bannedReason: user?.banReason ?? undefined,
    },
    resolver: standardSchemaResolver(BanUserSchema),
  })

  const [isSubmitting, startTransition] = useTransition()
  const useBanUnBanUserFn = useServerFn(banUnBanUserFn)
  const router = useRouter()
  const queryClient = useQueryClient()
  const watchBanned = watch('banned')
  const watchSelectedDate = watch('banExpires')

  function handleFormSubmit(data: BanUserSchemaType) {
    startTransition(async () => {
      const result = await useBanUnBanUserFn({
        data: {
          ...data,
          userId: user?.id,
        },
      })
      if (result.success) {
        toast.success('Sucessfully Updated.')
        router.invalidate()
        await queryClient.invalidateQueries({
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
        <h2 className="text-2xl font-bold">
          Manage Banning and UnBanning User State
        </h2>
      </div>
      <form
        className="flex flex-col gap-4 text-[1.2rem]"
        onSubmit={handleSubmit(handleFormSubmit)}
      >
        <label className="flex flex-col gap-1">
          <span className="text-lg font-medium">Enter The reason</span>
          <Input
            {...register('bannedReason')}
            disabled={isSubmitting}
            name="name"
            className="focus-visible:border-primary placeholder:text-lg  h-12.5"
            placeholder="Enter The reason to ban"
          />
          <FieldError
            errors={
              errors.bannedReason
                ? [{ message: errors.bannedReason.message }]
                : undefined
            }
          />
        </label>

        <Select
          defaultValue={String(watchBanned)}
          onValueChange={(value) => {
            setValue('banned', !!value)
          }}
        >
          <SelectTrigger className="w-full h-12.5  text-lg">
            <SelectValue placeholder="Select Gender" />
          </SelectTrigger>
          <SelectContent className="w-full  shadow-2xl  py-4 text-lg">
            {['true', 'false'].map((status) => {
              return (
                <SelectItem
                  className="text-lg focus:bg-primary focus:text-white"
                  key={status}
                  value={status}
                >
                  {status}
                </SelectItem>
              )
            })}
          </SelectContent>
          <FieldError
            errors={
              errors.banned ? [{ message: errors.banned.message }] : undefined
            }
          />
        </Select>
        <DatePicker
          disabled={isSubmitting}
          date={watchSelectedDate}
          placeholder="Enter Expiration Date"
          setDate={(selectedDate) => setValue('banExpires', selectedDate)}
        />
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
