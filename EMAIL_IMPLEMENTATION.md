# Email Implementation Guide

## Overview

The CourseForge AI platform now includes an email sending utility for transactional emails. Currently, it operates in development mode (logging to console) but is ready to be integrated with a production email service.

## Current Features

### Welcome Email
- Automatically sent when a user registers
- Professional HTML template with gradient design
- Includes platform features and call-to-action
- Non-blocking (registration succeeds even if email fails)

## Email Services Supported

The email utility (`lib/email.ts`) is designed to be easily integrated with popular email services:

### 1. Resend (Recommended)
**Why Resend?**
- Built for Next.js and modern web apps
- Simple API with great TypeScript support
- Generous free tier
- Excellent deliverability

**Setup:**
```bash
npm install resend
```

Add to `.env`:
```
EMAIL_API_KEY=re_your_api_key_here
```

Update `lib/email.ts`:
```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.EMAIL_API_KEY);

export async function sendEmail(options: EmailOptions): Promise<void> {
  await resend.emails.send({
    from: 'CourseForge AI <noreply@courseforgeai.org>',
    to: options.to,
    subject: options.subject,
    html: options.html,
  });
}
```

### 2. SendGrid
**Setup:**
```bash
npm install @sendgrid/mail
```

Add to `.env`:
```
SENDGRID_API_KEY=SG.your_api_key_here
```

Update `lib/email.ts`:
```typescript
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function sendEmail(options: EmailOptions): Promise<void> {
  await sgMail.send({
    from: 'noreply@courseforgeai.org',
    to: options.to,
    subject: options.subject,
    html: options.html,
    text: options.text,
  });
}
```

### 3. AWS SES
**Setup:**
```bash
npm install @aws-sdk/client-ses
```

Add to `.env`:
```
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
```

## Testing

### Development Mode
Currently enabled - emails are logged to console with:
```javascript
logger.info('Email would be sent (development mode)', {
  to: email,
  subject: subject,
  preview: text
});
```

### Testing in Production
1. Set up a test email address
2. Configure your chosen email service
3. Update `lib/email.ts` with the service integration
4. Test registration flow
5. Verify email delivery

## Email Templates

### Welcome Email
Located in: `lib/email.ts` - `sendWelcomeEmail()`

**Features:**
- Professional gradient header
- Personalized greeting
- Feature list with checkmarks
- Call-to-action button
- Plain text alternative
- Responsive design

**Customization:**
Modify the HTML template in `sendWelcomeEmail()` function to match your brand.

## Security Considerations

✅ **Already Implemented:**
- Environment variables are sanitized before use
- XSS prevention in email templates
- Email sending failures don't affect registration
- Secure error logging

## Future Enhancements

Potential email types to add:
- Password reset emails
- Email verification
- Course completion notifications
- Payment receipts
- Newsletter/updates
- Account activity alerts

## Troubleshooting

### Email not sending in production
1. Check environment variables are set correctly
2. Verify email service API key is valid
3. Check domain verification (some services require this)
4. Review email service logs
5. Check spam folder

### HTML rendering issues
1. Test with different email clients
2. Use inline CSS (already implemented)
3. Keep design simple for maximum compatibility
4. Test with email preview tools

## Support

For issues or questions:
1. Check email service documentation
2. Review application logs
3. Test with email preview services (litmus.com, emailonacid.com)
4. Verify DNS settings for your domain

## API Reference

### `sendEmail(options: EmailOptions)`
Send any email with custom content.

**Parameters:**
- `to`: Recipient email address
- `subject`: Email subject line
- `html`: HTML email content
- `text`: Plain text alternative (optional)

### `sendWelcomeEmail(email: string, name: string)`
Send welcome email to new user.

**Parameters:**
- `email`: User's email address
- `name`: User's name for personalization

**Returns:** Promise<void>
