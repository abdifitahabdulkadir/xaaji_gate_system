import { Gender, UserRoles } from '@/generated/prisma/enums'
import { RegisterSchema, RegisterSchemaType } from '@/lib/validations'
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
import { Link, useNavigate } from '@tanstack/react-router'
import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '../ui/button'
import { FieldError } from '../ui/field'
import { Input } from '../ui/input'

import { registerFn } from '@/data/user.function'
import { useServerFn } from '@tanstack/react-start'
import toast from 'react-hot-toast'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'

export default function RegisterForm() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      role: undefined,
      password: '',
      gender: undefined,
    },
    resolver: standardSchemaResolver(RegisterSchema),
  })

  const [isSubmitting, startTransition] = useTransition()
  const useRegisterFn = useServerFn(registerFn)
  const navigate = useNavigate()

  function handleFormSubmit(data: RegisterSchemaType) {
    startTransition(async () => {
      const result = await useRegisterFn({
        data: data,
      })
      if (result.success) {
        toast.success('Sucessfully Register')
        navigate({ to: '/' })
        return
      }
      toast.error(
        result.Errors?.message ?? 'Failed to Register. please try again',
      )
    })
  }

  return (
    <section className="h-screen  flex items-center justify-center w-full">
      <div className="w-full h-fit border rounded-2xl px-6 py-4  max-w-3xl space-y-6">
        <div className="flex items-center border-border/40  border-b justify-center">
          <h2 className="text-2xl font-bold">Xaaji Gate System</h2>
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

          <label className="flex flex-col gap-1 sm:col-span-2">
            <span className="text-lg font-medium">Password</span>
            <Input
              {...register('password')}
              disabled={isSubmitting}
              name="password"
              type="text"
              placeholder="Enter Your Password"
              minLength={6}
              maxLength={16}
              className="focus-visible:border-primary placeholder:text-lg  h-12.5"
            />
            <FieldError
              errors={
                errors.password
                  ? [{ message: errors.password.message }]
                  : undefined
              }
            />
          </label>
          <Select
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
              {isSubmitting ? 'Creating....' : 'Create User'}
            </Button>
          </div>
        </form>
        <div className="text-center pt-2">
          <p className="text-[1.1rem]">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-primary font-medium hover:underline"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </section>
  )
}
