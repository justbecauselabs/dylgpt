import { NextRequest, NextResponse } from 'next/server'
import twilio from 'twilio'

function getTwilioConfig() {
  const accountSid = process.env.TWILIO_ACCOUNT_SID
  const authToken = process.env.TWILIO_AUTH_TOKEN
  const twilioNumber = process.env.TWILIO_NUMBER
  const recipientNumber = process.env.RECIPIENT_NUMBER

  if (!accountSid || !authToken || !twilioNumber || !recipientNumber) {
    return null
  }

  return { accountSid, authToken, twilioNumber, recipientNumber }
}

export async function POST(request: NextRequest) {
  const config = getTwilioConfig()
  if (!config) {
    return NextResponse.json(
      { error: 'SMS is not configured' },
      { status: 500 }
    )
  }

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
      : `DylGPT: ${message}`

    const client = twilio(config.accountSid, config.authToken)
    const result = await client.messages.create({
      body: smsBody,
      from: config.twilioNumber,
      to: config.recipientNumber,
    })

    return NextResponse.json({ success: true, messageId: result.sid })
  } catch (error) {
    console.error('Error sending SMS:', error)
    return NextResponse.json(
      { error: 'Failed to send SMS' },
      { status: 500 }
    )
  }
}