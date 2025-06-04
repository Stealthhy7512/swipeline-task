import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { AnalyzeData } from '@/app/lib/definitions'

export default function AnalyzeTable({ data }: { data: AnalyzeData }) {
  return (
    <Table>
      <TableCaption>Analyzed tweet data.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Content</TableHead>
          <TableHead>Summary</TableHead>
          <TableHead>Sentiment</TableHead>
          <TableHead>Username</TableHead>
          <TableHead className="text-right">Timestamp</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-medium whitespace-pre-wrap break-words max-w-[1/3]">{data.content}</TableCell>
          <TableCell className="whitespace-pre-wrap max-w-[1/3]">{data.summary}</TableCell>
          <TableCell className="whitespace-pre-wrap max-w-[1/3]">{data.sentiment}</TableCell>
          <TableCell>{data.user}</TableCell>
          <TableCell className="text-right">{data.timestamp}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}