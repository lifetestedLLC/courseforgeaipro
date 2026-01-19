/**
 * Email utility for sending transactional emails
 * 
 * This is a placeholder implementation that logs emails to console.
 * In production, integrate with services like:
 * - Resend (recommended for Next.js)
 * - SendGrid
 * - AWS SES
 * - Postmark
 * 
 * To implement:
 * 1. Install email service: npm install resend (or your preferred service)
 * 2. Add API key to .env: EMAIL_API_KEY=your-api-key
 * 3. Replace the console.log with actual email sending
 */

import { logger } from '@/lib/logger';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * Send an email
 * @param options Email options including to, subject, html, and optional text
 * @returns Promise that resolves when email is sent
 */
export async function sendEmail(options: EmailOptions): Promise<void> {
  try {
    // TODO: Replace with actual email service implementation
    // Example with Resend:
    // const resend = new Resend(process.env.EMAIL_API_KEY);
    // await resend.emails.send({
    //   from: 'CourseForge AI <noreply@courseforgeai.org>',
    //   to: options.to,
    //   subject: options.subject,
    //   html: options.html,
    // });

    // For now, log to console (development mode)
    logger.info('Email would be sent (development mode):', {
      to: options.to,
      subject: options.subject,
      preview: options.text || options.html.substring(0, 100),
    });

    // In production without email service, you might want to throw an error:
    // throw new Error('Email service not configured');
  } catch (error) {
    logger.error('Failed to send email', error as Error, {
      to: options.to,
      subject: options.subject,
    });
    throw error;
  }
}

/**
 * Send a welcome email to a new user
 * @param email User's email address
 * @param name User's name
 */
export async function sendWelcomeEmail(email: string, name: string): Promise<void> {
  const subject = 'Welcome to CourseForge AI! 🎉';
  
  // Sanitize the base URL to prevent XSS
  const baseUrl = (process.env.NEXTAUTH_URL || 'https://courseforgeai.org')
    .replace(/[<>"']/g, '') // Remove potentially dangerous characters
    .trim();
  
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            border-radius: 10px;
            text-align: center;
            margin-bottom: 30px;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
          }
          .content {
            background: #f9fafb;
            padding: 30px;
            border-radius: 10px;
            margin-bottom: 20px;
          }
          .button {
            display: inline-block;
            background: #667eea;
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            margin: 20px 0;
          }
          .features {
            list-style: none;
            padding: 0;
          }
          .features li {
            padding: 8px 0;
            padding-left: 30px;
            position: relative;
          }
          .features li:before {
            content: '✓';
            position: absolute;
            left: 0;
            color: #10b981;
            font-weight: bold;
          }
          .footer {
            text-align: center;
            color: #6b7280;
            font-size: 14px;
            margin-top: 30px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Welcome to CourseForge AI! 🎉</h1>
        </div>
        
        <div class="content">
          <h2>Hi ${name},</h2>
          
          <p>
            Thank you for joining CourseForge AI! We're excited to help you create 
            amazing educational content with the power of artificial intelligence.
          </p>
          
          <p>
            With your new account, you can:
          </p>
          
          <ul class="features">
            <li>Generate comprehensive course outlines in minutes</li>
            <li>Create engaging AI-powered videos</li>
            <li>Build interactive quizzes and assessments</li>
            <li>Export to popular platforms like Coursera, Udemy, and more</li>
          </ul>
          
          <div style="text-align: center;">
            <a href="${baseUrl}/dashboard" class="button">
              Get Started Now
            </a>
          </div>
          
          <p>
            Need help? Check out our documentation or reach out to our support team. 
            We're here to help you succeed!
          </p>
          
          <p>
            Happy creating!<br>
            <strong>The CourseForge AI Team</strong>
          </p>
        </div>
        
        <div class="footer">
          <p>
            CourseForge AI - AI-Powered Course Creation<br>
            <a href="${baseUrl}" style="color: #667eea;">courseforgeai.org</a>
          </p>
        </div>
      </body>
    </html>
  `;

  const text = `
    Welcome to CourseForge AI!

    Hi ${name},

    Thank you for joining CourseForge AI! We're excited to help you create amazing educational content with the power of artificial intelligence.

    With your new account, you can:
    - Generate comprehensive course outlines in minutes
    - Create engaging AI-powered videos
    - Build interactive quizzes and assessments
    - Export to popular platforms like Coursera, Udemy, and more

    Get started now: ${baseUrl}/dashboard

    Need help? Check out our documentation or reach out to our support team.

    Happy creating!
    The CourseForge AI Team
  `;

  await sendEmail({
    to: email,
    subject,
    html,
    text,
  });
}
