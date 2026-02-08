import { Entity } from '@/generated/prisma/enums'
import { ActionResponse, CustomPrisma } from '@/lib/types'
import { createServerFn } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'
import { prisma } from 'prisma/prisma'
export async function getHeaders() {
  return await getRequestHeaders()
}

export const generateCustomIdFn = createServerFn()
  .inputValidator(
    (data: { entity: Entity; prisma: CustomPrisma | undefined }) => data,
  )
  .handler(async function ({ data }): Promise<
    ActionResponse<{
      customId: string
    }>
  > {
    try {
      const { entity } = data
      const now = new Date()
      const year = now.getFullYear()
      const month = now.getMonth() + 1
      let prefix = null
      if (entity === 'invoice') {
        prefix = 'INV'
      } else if (entity === 'payment') {
        prefix = 'PYM'
      } else if (entity === 'product') {
        prefix = 'PRO'
      } else if (entity === 'transaction') {
        prefix = 'TRA'
      } else if (entity === 'user') {
        prefix = 'USR'
      } else if (entity === 'salary') {
        prefix = 'SAL'
      } else if (entity === 'customer') {
        prefix = 'CUS'
      }
      const currentPrisma = data.prisma ? data.prisma : prisma

      const createdRecord = currentPrisma.customIdCounter.upsert({
        where: {
          entity_year_month: {
            year,
            month,
            entity,
          },
        },
        update: {
          sequence: {
            increment: 1,
          },
        },
        create: {
          entity,
          year,
          month,
          sequence: 1,
        },
      })

      const formatSequence = `${createdRecord.sequence}`.padStart(5, '0')
      const generatedId = `${prefix}${year}${month}${formatSequence}`
      return {
        success: true,
        data: {
          customId: generatedId,
        },
      }
    } catch (error) {
      return {
        success: false,
        Errors: {
          statusCode: 400,
          message:
            error instanceof Error
              ? error.message
              : 'Failed to Generate Custom ID',
        },
      }
    }
  })
