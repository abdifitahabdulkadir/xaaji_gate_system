import { getUserSalaryDetailsById, paySalaryFn } from '@/data/user.function'
import type { SalaryDetials, UserTable } from '@/lib/types'
import { formatDate } from '@/lib/utils'
import { PaySalarySchema, type PaySalarySchemaType } from '@/lib/validations'
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useServerFn } from '@tanstack/react-start'
import { useTransition } from 'react'
import { useForm, type Resolver, type SubmitHandler } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card'
import { FieldError } from '../ui/field'
import { Input } from '../ui/input'
import { Skeleton } from '../ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table'

function formatDateTime(date: Date) {
  return new Date(date).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

interface Props {
  user?: UserTable | null
}

export default function SalaryDetails({ user }: Props) {
  const queryClient = useQueryClient()
  const {
    data: queryData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['salaryDetails', user?.id],
    queryFn: () =>
      getUserSalaryDetailsById({
        data: { userId: user?.id ?? '' },
      }),
    enabled: !!user?.id,
  })

  const salaryList = queryData?.success ? queryData.data : undefined

  if (!user?.id) {
    return (
      <div className="rounded-2xl border border-border/40 bg-card p-6 text-muted-foreground">
        Select a user to view salary details.
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-40 w-full rounded-2xl" />
        <Skeleton className="h-48 w-full rounded-2xl" />
        <Skeleton className="h-32 w-full rounded-2xl" />
      </div>
    )
  }

  if (isError || salaryList === undefined) {
    return (
      <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-destructive">
        {queryData && !queryData.success
          ? (queryData.Errors?.message ?? 'Failed to load salary details.')
          : 'Failed to load salary details.'}
      </div>
    )
  }

  if (salaryList.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Salary details</CardTitle>
          <CardDescription>
            No salaries yet. Salaries are created when this user is registered.
            To add a salary
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="space-y-8">
      {salaryList.map((salaryDataItem) => (
        <SalaryBlock
          key={salaryDataItem.salary.id}
          salaryData={salaryDataItem}
          onSuccess={() =>
            queryClient.invalidateQueries({
              queryKey: ['salaryDetails', user.id],
            })
          }
        />
      ))}
    </div>
  )
}

function SalaryBlock({
  salaryData,
  onSuccess,
}: {
  salaryData: SalaryDetials
  onSuccess: () => void
}) {
  const totalPaid = salaryData.details.reduce((sum, p) => sum + p.amount, 0)
  const remaining = salaryData.salary.base - totalPaid
  const isPaid = remaining <= 0

  return (
    <div className="space-y-4 border border-primary/20 shadow-sm p-3 ">
      <SalarySummary
        salary={salaryData.salary}
        details={salaryData.details}
        isPaid={isPaid}
      />
      <PaymentsTable details={salaryData.details} />
      {isPaid ? (
        <Card>
          <CardContent className="flex items-center gap-2 pt-6">
            <Badge variant="secondary">Paid</Badge>
            <span className="text-muted-foreground text-sm">
              This salary has been fully paid.
            </span>
          </CardContent>
        </Card>
      ) : (
        <PayRestForm salaryData={salaryData} onSuccess={onSuccess} />
      )}
    </div>
  )
}

function SalarySummary({
  salary,
  details,
  isPaid,
}: {
  salary: SalaryDetials['salary']
  details: SalaryDetials['details']
  isPaid?: boolean
}) {
  const totalPaid = details.reduce((sum, p) => sum + p.amount, 0)
  const remaining = salary.base - totalPaid

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div>
          <CardTitle>Salary — {formatDate(salary.createdAt)}</CardTitle>
          <CardDescription>
            Base salary and payment status for this period.
          </CardDescription>
        </div>
        {isPaid && (
          <Badge variant="secondary" className="shrink-0">
            Paid
          </Badge>
        )}
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        <div>
          <p className="text-muted-foreground text-sm">Base salary</p>
          <p className="text-2xl font-semibold">
            {salary.base.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>
        <div>
          <p className="text-muted-foreground text-sm">Status</p>
          <p className="font-medium capitalize">
            {salary.status.toLowerCase()}
          </p>
        </div>
        <div>
          <p className="text-muted-foreground text-sm">Created</p>
          <p className="font-medium">{formatDate(salary.createdAt)}</p>
        </div>
        <div>
          <p className="text-muted-foreground text-sm">Total paid</p>
          <p className="font-medium">
            {totalPaid.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>
        <div>
          <p className="text-muted-foreground text-sm">Remaining</p>
          <p className="font-semibold">
            {remaining.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

function PaymentsTable({ details }: { details: SalaryDetials['details'] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payments under this salary</CardTitle>
        <CardDescription>
          History of payments made for this salary.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {details.length === 0 ? (
          <p className="text-muted-foreground py-6 text-center text-sm">
            No payments recorded yet.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {details.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>{formatDateTime(payment.paidAt)}</TableCell>
                  <TableCell className="text-right font-medium">
                    {payment.amount.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </TableCell>
                  <TableCell className="text-muted-foreground max-w-[200px] truncate">
                    {payment.description ?? '—'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}

function PayRestForm({
  salaryData,
  onSuccess,
}: {
  salaryData: SalaryDetials
  onSuccess: () => void
}) {
  const payFn = useServerFn(paySalaryFn)
  const [isSubmitting, startTransition] = useTransition()
  const totalPaid = salaryData.details.reduce((sum, p) => sum + p.amount, 0)
  const remaining = salaryData.salary.base - totalPaid

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PaySalarySchemaType>({
    defaultValues: {
      salaryId: salaryData.salary.id,
      amount: remaining > 0 ? remaining : 0,
      description: '',
    },
    resolver: standardSchemaResolver(
      PaySalarySchema,
    ) as Resolver<PaySalarySchemaType>,
  })

  const onSubmit: SubmitHandler<PaySalarySchemaType> = (data) => {
    startTransition(async () => {
      const result = await payFn({
        data: {
          salaryId: data.salaryId,
          amount: data.amount,
          description: data.description,
        },
      })
      if (result.success) {
        toast.success('Payment recorded.')
        reset({ amount: undefined, description: '' })
        onSuccess()
        return
      }
      toast.error(result.Errors?.message ?? 'Failed to record payment.')
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pay rest of salary</CardTitle>
        <CardDescription>
          Record a payment. Remaining balance:{' '}
          {remaining.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          <input type="hidden" {...register('salaryId')} />
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="amount">
              Amount
            </label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min={0}
              placeholder="0.00"
              {...register('amount')}
            />
            {errors.amount && <FieldError>{errors.amount.message}</FieldError>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="description">
              Description (optional)
            </label>
            <Input
              id="description"
              placeholder="e.g. Partial payment - March"
              {...register('description')}
            />
            {errors.description && (
              <FieldError>{errors.description.message}</FieldError>
            )}
          </div>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Recording…' : 'Record payment'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
