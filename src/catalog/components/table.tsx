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

const CellSchema = z.union([z.string(), z.object({ id: z.string() })])

export const TableApi = {
  name: 'Table',
  schema: z.object({
    columns: z.array(z.string()).describe('Column header labels, in display order.'),
    rows: z
      .array(z.array(CellSchema))
      .describe(
        'Rows of data. Each cell is either a string or a component reference { id: string }. String cells render as text; component ref cells render the referenced A2UI component.'
      ),
    caption: z
      .string()
      .describe('Optional caption text displayed below the table.')
      .optional(),
  }).strict(),
} satisfies ComponentApi

type Cell = z.infer<typeof CellSchema>

export const TableImpl = createComponentImplementation(TableApi, ({ props, buildChild }) => {
  const columns = Array.isArray(props.columns) ? (props.columns as string[]) : []
  const rows = Array.isArray(props.rows) ? (props.rows as Cell[][]) : []

  const renderCell = (cell: Cell | undefined) => {
    if (cell == null) return ''
    if (typeof cell === 'object' && 'id' in cell) {
      return buildChild(cell.id) ?? null
    }
    return String(cell)
  }

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
              <TableCell key={j}>{renderCell(row[j])}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
})
