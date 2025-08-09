import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import crypto from 'crypto'
import nodemailer from 'nodemailer'

const prisma = new PrismaClient()

// Create email transporter
const createEmailTransporter = () => {
  // For development, we'll use a test account
  // In production, use your actual email service (Gmail, SendGrid, etc.)
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER, // your email
      pass: process.env.EMAIL_PASS, // your email password or app password
    },
  })
}

const sendPasswordResetEmail = async (email: string, resetToken: string) => {
  try {
    const transporter = createEmailTransporter()
    
    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset - GlobalRealEstate',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Password Reset Request</h2>
          <p>You requested to reset your password for GlobalRealEstate.</p>
          <p>Click the button below to reset your password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p>Or copy and paste this link in your browser:</p>
          <p style="word-break: break-all; color: #6b7280;">${resetUrl}</p>
          <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">
            This link will expire in 1 hour. If you didn't request this password reset, please ignore this email.
          </p>
        </div>
      `,
    }

    // Check if email configuration is available
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      // Fallback to console logging for development
      console.log('📧 EMAIL CONFIGURATION NOT FOUND - LOGGING TO CONSOLE')
      console.log(`📧 Password reset email would be sent to: ${email}`)
      console.log(`🔗 Reset link: ${resetUrl}`)
      console.log(`📧 Email HTML:`, mailOptions.html)
      return
    }

    await transporter.sendMail(mailOptions)
    console.log(`✅ Password reset email sent successfully to: ${email}`)
    
  } catch (error) {
    console.error('❌ Error sending email:', error)
    // Fallback to console logging
    console.log(`📧 Password reset email would be sent to: ${email}`)
    console.log(`🔗 Reset link: ${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`)
  }
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    // Validate email
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Check if user exists (but don't reveal if they exist or not for security)
    const user = await prisma.user.findUnique({
      where: { email }
    })

    // Always return success message regardless of whether user exists
    if (user) {
      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString('hex')
      const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour from now

      // Save reset token to database
      await prisma.user.update({
        where: { email },
        data: {
          resetToken,
          resetTokenExpiry
        }
      })

      // Send password reset email
      await sendPasswordResetEmail(email, resetToken)
    }

    // Always return success message regardless of whether user exists
    return NextResponse.json({
      message: 'If an account with that email exists, we have sent password reset instructions.'
    })

  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { error: 'Internal server error. Please try again.' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
