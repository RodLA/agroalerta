import * as z from "zod"

export const filterSchema = z.object({
  department: z.string().nullable(),
  province: z.string().nullable(),
  risk: z.string().nullable(),
  event: z.string().nullable(),
  range: z.object({
    start: z.date().nullable(),
    end: z.date().nullable()
  })
})

export const filterDefaultValues: z.infer<typeof filterSchema> = {
  department: "",
  province: "",
  risk: "",
  event: "",
  range: {
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    end: new Date(new Date().getFullYear(), new Date().getMonth() + 2, 1)
  }
}

export type Filter = z.infer<typeof filterSchema>
