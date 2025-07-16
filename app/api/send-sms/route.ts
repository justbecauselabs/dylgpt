import { NextRequest, NextResponse } from 'next/server'
import twilio from 'twilio'

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const twilioNumber = process.env.TWILIO_NUMBER
const recipientNumber = process.env.RECIPIENT_NUMBER

if (!accountSid || !authToken || !twilioNumber || !recipientNumber) {
  throw new Error('Missing required environment variables: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_NUMBER, RECIPIENT_NUMBER')
}

const client = twilio(accountSid, authToken)

export async function POST(request: NextRequest) {
  try {
    const { message, userName } = await request.json()

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    const smsBody = userName 
      ? `DylGPT: ${userName} says: ${message}`
      : `DylGPT: ${message}`;

    const result = await client.messages.create({
      body: smsBody,
      from: twilioNumber as string,
      to: recipientNumber as string,
    })

    return NextResponse.json({ success: true, messageId: result.sid })
  } catch (error: any) {
    console.error('Error sending SMS:', error)
    return NextResponse.json(
      { error: 'Failed to send SMS' },
      { status: 500 }
    )
  }
}