import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { z } from 'zod';
import { google } from 'googleapis'
import { GoogleAuth } from 'google-auth-library';

const structure = z.object({
  content: z.string().describe('Whole content of the tweet.'),
  summary: z.string().describe('Summary of the tweet.'),
  sentiment: z.string().describe('Sentimental analysis of the tweet'),
  user: z.string().describe('Username of poster.'),
  timestamp: z.string().describe('Date and time of the post.'),
})

const model = new ChatGoogleGenerativeAI({
  model: 'gemini-2.0-flash',
  temperature: 0,
  apiKey: process.env.GOOGLE_API_KEY,
}).withStructuredOutput(structure)

const systemTemplate =
  'You will analyse a given tweet\'s content. Return\n' +
  'Content itself\n' +
  'Short summary of its content\n' +
  'Sentimental analysis of its content\n' +
  'Username of its poster.\n' +
  'Timestamp of the date it was posted.'

function parseTweetId(url: string) {
  const match = url.match(/status\/(\d+)/)
  if (match) {
    return match[1]
  }
}

export async function appendToSheet(values: any[][]) {
  const auth = new GoogleAuth({
    credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS!),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })
  const client = await auth.getClient()
  const sheets = google.sheets({ version: 'v4', auth })
  const spreadsheetId = process.env.SPREADSHEET_ID
  const range = 'Sheet1!A:E'

  const req = {
    spreadsheetId,
    range,
    valueInputOption: 'USER_ENTERED',
    insertDataOption: 'INSERT_ROWS',
    requestBody: {
      values,
    },
    auth: client,
  }
  try {
    const res = await sheets.spreadsheets.values.append(req)
    return res.data
  } catch (err) {
    console.error('Error.')
    throw err
  }
}

export async function saveAnalysisToSheet(result: any) {
  const values = [[
    result.content,
    result.summary,
    result.sentiment,
    result.user,
    result.timestamp,
  ]]
  await appendToSheet(values)
}

export async function handlePrompt(url: string) {
  const id = parseTweetId(url);

  const res = await fetch(
    `https://api.twitter.com/2/tweets/${id}?tweet.fields=created_at&expansions=author_id&user.fields=username`, {
      headers: {
        Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
      },
      next: { revalidate: 0 },
    }
  )
  if (!res.ok) {
    throw new Error()
  }

  const tweetData = await res.json()

  const tweetText = tweetData.data.text
  const user = tweetData.includes.users[0].username
  const timestamp = tweetData.data.created_at

  const promptTemplate = ChatPromptTemplate.fromMessages([
    ["system", systemTemplate],
    ["user",
      `Analyze this tweet.\n` +
      `Tweet's content: ${tweetText}\n` +
      `Username: ${user}\n` +
      `Timestamp: ${timestamp}\n` +
      `Give me a short summary of its content.\n` +
      `Sentimental analysis of its content`
    ],
  ]);

  const messages = await promptTemplate.formatMessages({});

  return await model.invoke(messages)
}