const { z } = require('zod')

const timeSlotSchema = z.object({
  start: z.string().regex(/^\d{2}:\d{2}$/, { message: 'Time should be in HH:mm format' }),
  end: z.string().regex(/^\d{2}:\d{2}$/, { message: 'Time should be in HH:mm format' })
})

const slotsSchema = z.record(z.string().regex(/^\d{2}-\d{2}-\d{4}$/, { message: 'Date should be in DD-MM-YYYY format' }),
  z.array(timeSlotSchema))

const sessionsSchema = z.union([
  z.record(z.string().regex(/^\d{2}-\d{2}-\d{4}$/, { message: 'Date should be in DD-MM-YYYY format' }),
    z.array(timeSlotSchema)),
  z.object({})])

const DataSchema = z.object({
  durationBefore: z.number().int(),
  durationAfter: z.number().int(),
  slots: slotsSchema,
  sessions: sessionsSchema
})

module.exports = DataSchema
