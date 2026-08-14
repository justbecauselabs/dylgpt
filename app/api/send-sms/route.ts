import { NextRequest, NextResponse } from 'next/server'
import twilio from 'twilio'

export async function POST(request: NextRequest) {
  try {
    // Read Twilio config and construct the client inside the handler (not at
    // module scope) so `next build` doesn't evaluate it. Hoisting this out
    // makes the build fail during "Collecting page data" when the env vars
    // aren't present in the deployment environment.
    const accountSid = process.env.TWILIO_ACCOUNT_SID
    const authToken = process.env.TWILIO_AUTH_TOKEN
    const twilioNumber = process.env.TWILIO_NUMBER
    const recipientNumber = process.env.RECIPIENT_NUMBER

    if (!accountSid || !authToken || !twilioNumber || !recipientNumber) {
      console.error('Missing required environment variables: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_NUMBER, RECIPIENT_NUMBER')
      return NextResponse.json(
        { error: 'Failed to send SMS' },
        { status: 500 }
      )
    }

    const { message, userName } = await request.json()

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    const client = twilio(accountSid, authToken)

    const smsBody = userName 
      ? `DylGPT: ${userName} says: ${message}`
      : `DylGPT: ${message}`;

    const result = await client.messages.create({
      body: smsBody,
      from: twilioNumber,
      to: recipientNumber,
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