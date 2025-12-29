# Deployment Guide for CourseForge AI

## Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Domain: courseforgeai.org

## Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run development server:**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Production Deployment

### Option 1: Vercel (Recommended)

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

3. Follow prompts and add your custom domain: courseforgeai.org

### Option 2: Docker

1. Create a Dockerfile:
   ```dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm install
   COPY . .
   RUN npm run build
   EXPOSE 3000
   CMD ["npm", "start"]
   ```

2. Build and run:
   ```bash
   docker build -t courseforgeai .
   docker run -p 3000:3000 courseforgeai
   ```

### Option 3: Traditional Server

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Start the production server:**
   ```bash
   npm start
   ```

3. **Configure nginx as reverse proxy:**
   ```nginx
   server {
       listen 80;
       server_name courseforgeai.org www.courseforgeai.org;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## Domain Configuration

### Namecheap DNS Settings

Point your domain to your hosting:

**For Vercel:**
- A Record: @ → 76.76.21.21
- CNAME: www → cname.vercel-dns.com

**For Custom Server:**
- A Record: @ → [Your Server IP]
- CNAME: www → courseforgeai.org

## Environment Variables

Create a `.env.local` file for API integrations:

```env
# Authentication
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=https://courseforgeai.org  # Use your custom domain, not the Vercel URL

# OpenAI API
OPENAI_API_KEY=your-openai-api-key-here

# Stripe
STRIPE_SECRET_KEY=your-stripe-secret-key-here
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret-here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key-here

# Stripe Price IDs
STRIPE_STARTER_PRICE_ID=price_starter_id_here
STRIPE_PROFESSIONAL_PRICE_ID=price_professional_id_here
STRIPE_ENTERPRISE_PRICE_ID=price_enterprise_id_here

# Database
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
```

**Important:** The application automatically detects the correct domain from request headers, so users will always be redirected to the domain they're accessing (custom domain, not Vercel URL). However, `NEXTAUTH_URL` should still be set to your custom domain for consistency.

## Custom Domain Setup

The application includes automatic domain handling to prevent redirect issues:

1. **`vercel.json`**: Automatically redirects all `.vercel.app` traffic to your custom domain
2. **Dynamic URL Detection**: The app detects the domain from request headers (`x-forwarded-host`)
3. **No hardcoded URLs**: All redirects (Stripe callbacks, OAuth, etc.) use the detected domain

This ensures users always stay on your custom domain (courseforgeai.org) and never see the Vercel deployment URL.

## SSL/HTTPS

- **Vercel:** Automatic SSL certificates
- **Custom Server:** Use Let's Encrypt:
  ```bash
  sudo certbot --nginx -d courseforgeai.org -d www.courseforgeai.org
  ```

## Next Steps for Full Functionality

This is a frontend implementation. To make it fully functional:

1. **Backend API:** Set up authentication and user management
2. **Database:** PostgreSQL or MongoDB for storing courses
3. **AI Integration:** Connect OpenAI API for course/video generation
4. **Payment Processing:** Integrate Stripe for subscriptions
5. **File Storage:** S3 or similar for video/content storage
6. **Export Features:** Implement actual export to Coursera, Udemy, etc.

## Monitoring

- Set up Vercel Analytics (if using Vercel)
- Configure error tracking (Sentry)
- Set up uptime monitoring

## Support

For issues or questions, refer to:
- Next.js docs: https://nextjs.org/docs
- Vercel deployment: https://vercel.com/docs
