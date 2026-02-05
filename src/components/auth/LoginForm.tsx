import { loginFn } from '@/data/user.functions'
import { LoginSchema, LoginSchemaType } from '@/lib/validations'
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
import { Link, useNavigate } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Button } from '../ui/button'
import { FieldError } from '../ui/field'
import { Input } from '../ui/input'

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchemaType>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: standardSchemaResolver(LoginSchema),
  })
  const [isSubmitting, startTransition] = useTransition()
  const useLoginFn = useServerFn(loginFn)
  const navigate = useNavigate()

  function handleFormSubmit(data: LoginSchemaType) {
    startTransition(async () => {
      const result = await useLoginFn({
        data,
      })
      if (result.success) {
        toast.success('Sucessfully Logged In.')
        navigate({ to: '/' })
        return
      }
      toast.error(result.Errors?.message!)
    })
  }

  return (
    <section className="h-screen  flex items-center justify-center w-full">
      <div className="w-full h-fit border rounded-2xl px-6 py-4  max-w-3xl space-y-4">
        <div className="flex items-center border-border/40  border-b justify-center">
          <h2 className="text-2xl font-bold">Xaaji Gate System</h2>
        </div>
        <form
          className="flex flex-col gap-4 text-[1.2rem]"
          onSubmit={handleSubmit(handleFormSubmit)}
        >
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

          <div className="sm:col-span-2">
            <Button
              disabled={isSubmitting}
              type="submit"
              className="w-full  bg-primary px-4 py-2 text-white font-semibold hover:bg-primary/70 transition"
            >
              {isSubmitting ? 'Loging....' : 'Login'}
            </Button>
          </div>
        </form>
        <div className="text-center pt-2">
          <p className="text-[1.1rem]">
            Dont have an account?{' '}
            <Link
              to="/register"
              className="text-primary font-medium hover:underline"
            >
              Register Here
            </Link>
          </p>
        </div>
      </div>
    </section>
  )
}
