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
  data = {
    content: "RIP Eddie Van Halen. Van Halen were a tremendous influence on both Vinnie &amp; Dime &amp; Pantera. Hopefully they are all rocking out together now! https://t.co/XtnL33aGsd",
    sentiment: "Positive",
    summary: "Pantera's account expresses sadness over the death of Eddie Van Halen, acknowledging Van Halen's influence on Pantera and hoping they are all rocking out together now.",
    timestamp: "2020-10-06T19:57:37.000Z",
    user: "Pantera"
    }
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
          <TableCell>{data.sentiment}</TableCell>
          <TableCell>{data.user}</TableCell>
          <TableCell className="text-right">{data.timestamp}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}