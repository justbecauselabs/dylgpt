import { NextRequest, NextResponse } from 'next/server'
import twilio from 'twilio'
import { checkAndConsumeRateLimit } from '@/utils/rate-limit'
import {
  DEFAULT_GLOBAL_PER_DAY,
  DEFAULT_MAX_SMS_BODY,
  DEFAULT_MAX_USER_MESSAGE,
  DEFAULT_RATE_PER_DAY,
  DEFAULT_RATE_PER_MINUTE,
  buildCheapSmsBody,
  envInt,
  getClientIp,
} from '@/utils/sms-cost'

function getTwilioClient() {
  const accountSid = process.env.TWILIO_ACCOUNT_SID
  const authToken = process.env.TWILIO_AUTH_TOKEN
  const twilioNumber = process.env.TWILIO_NUMBER
  const recipientNumber = process.env.RECIPIENT_NUMBER

  if (!accountSid || !authToken || !twilioNumber || !recipientNumber) {
    return null
  }

  return {
    client: twilio(accountSid, authToken),
    twilioNumber,
    recipientNumber,
  }
}

export async function POST(request: NextRequest) {
  try {
    const twilioConfig = getTwilioClient()
    if (!twilioConfig) {
      return NextResponse.json(
        { error: 'SMS is not configured' },
        { status: 503 }
      )
    }

    const { message, userName } = await request.json()

    if (typeof message !== 'string' || !message.trim()) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    const maxUserMessage = envInt('SMS_MAX_USER_MESSAGE', DEFAULT_MAX_USER_MESSAGE)
    const maxBodyLength = envInt('SMS_MAX_BODY_LENGTH', DEFAULT_MAX_SMS_BODY)
    const perMinute = envInt('SMS_RATE_LIMIT_PER_MINUTE', DEFAULT_RATE_PER_MINUTE)
    const perDay = envInt('SMS_RATE_LIMIT_PER_DAY', DEFAULT_RATE_PER_DAY)
    const globalPerDay = envInt('SMS_GLOBAL_DAILY_LIMIT', DEFAULT_GLOBAL_PER_DAY)

    if (message.trim().length > maxUserMessage) {
      return NextResponse.json(
        {
          error: `Message too long. Keep it under ${maxUserMessage} characters to stay on one cheap SMS.`,
          maxLength: maxUserMessage,
        },
        { status: 400 }
      )
    }

    const ip = getClientIp(request.headers)
    const rateKey = `${ip}:${typeof userName === 'string' ? userName.trim().toLowerCase() : 'anon'}`
    const rate = checkAndConsumeRateLimit(rateKey, {
      perMinute,
      perDay,
      globalPerDay,
    })

    if (!rate.ok) {
      return NextResponse.json(
        { error: rate.error, retryAfterSeconds: rate.retryAfterSeconds },
        {
          status: rate.status,
          headers: { 'Retry-After': String(rate.retryAfterSeconds) },
        }
      )
    }

    const { body: smsBody, truncated } = buildCheapSmsBody(
      message,
      typeof userName === 'string' ? userName : null,
      maxBodyLength
    )

    const result = await twilioConfig.client.messages.create({
      body: smsBody,
      from: twilioConfig.twilioNumber,
      to: twilioConfig.recipientNumber,
    })

    return NextResponse.json({
      success: true,
      messageId: result.sid,
      truncated,
      remainingMinute: rate.remainingMinute,
      remainingDay: rate.remainingDay,
      charsUsed: smsBody.length,
    })
  } catch (error: unknown) {
    console.error('Error sending SMS:', error)
    return NextResponse.json(
      { error: 'Failed to send SMS' },
      { status: 500 }
    )
  }
}
