import type { ComponentApi } from '@a2ui/web_core/v0_9'
import { createComponentImplementation } from '@a2ui/react/v0_9'
import { z } from 'zod'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export const TableApi = {
  name: 'Table',
  schema: z.object({
    columns: z.array(z.string()).describe('Column header labels, in display order.'),
    rows: z
      .array(z.array(z.string()))
      .describe(
        'Rows of data. Each row is an array of string cell values aligned to the columns order.'
      ),
    caption: z
      .string()
      .describe('Optional caption text displayed below the table.')
      .optional(),
  }).strict(),
} satisfies ComponentApi

export const TableImpl = createComponentImplementation(TableApi, ({ props }) => {
  const columns = Array.isArray(props.columns) ? (props.columns as string[]) : []
  const rows = Array.isArray(props.rows) ? (props.rows as string[][]) : []

  return (
    <Table>
      {props.caption && <TableCaption>{String(props.caption)}</TableCaption>}
      <TableHeader>
        <TableRow>
          {columns.map((col, i) => (
            <TableHead key={i}>{col}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row, i) => (
          <TableRow key={i}>
            {columns.map((_, j) => (
              <TableCell key={j}>{row[j] ?? ''}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
})
