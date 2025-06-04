'use client'

import { useState } from 'react'
import { z } from 'zod'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import AnalyzeTable from '@/app/ui/analyse-table'
import { AnalyzeData } from '@/app/lib/definitions'

export default function Home() {
  const [url, setUrl] = useState('')
  const [data, setData] = useState<AnalyzeData | null>(null)

  const urlSchema = z.string().url()

  const handleClick = async () => {
    const validatedUrl = urlSchema.safeParse(url)
    if (!validatedUrl.success) {
      toast.error('Invalid URL.')
      return
    }

    try {
      const res = await fetch('/api/prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: validatedUrl.data}),
      })
      setData(await res.json())
      toast.success('Analyzed prompt successfully retrieved.')
    } catch(err: any) {
      toast.error(err.message)
    }
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center text-neutral-800 dark:text-neutral-100">
        <div className="flex flex-col gap-3">
          Enter link
          <Input
            type="url"
            className="w-md"
            onChange={(e) => setUrl(e.target.value)}
          />
          <Button
            variant="outline"
            onClick={handleClick}
          >
            Check
          </Button>
        </div>
        {data && <div>
          <AnalyzeTable data={data} />
        </div>}
      </main>
    </div>
  );
}