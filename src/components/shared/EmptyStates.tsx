import { cn } from '@/lib/utils'
import { Link } from '@tanstack/react-router'
import { LayoutDashboard } from 'lucide-react'
import { buttonVariants } from '../ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '../ui/empty'

interface Props {
  title: string
  description: string
  buttonText: string
  to: string
}
export default function ApplicationEmptyState({
  title,
  buttonText,
  description,
  to,
}: Props) {
  return (
    <Empty className="flex items-center justify-center border ">
      <EmptyHeader>
        <EmptyMedia variant="icon" className="scale-125">
          <LayoutDashboard className="opacity-40" />
        </EmptyMedia>
        <EmptyTitle className="text-2xl">{title}</EmptyTitle>
        <EmptyDescription className="text-sm text-muted-foreground">
          {description}
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="flex-row justify-center gap-2">
        <Link to={to} className={cn('scale-[1.1]', buttonVariants())}>
          {buttonText}
        </Link>
      </EmptyContent>
    </Empty>
  )
}
