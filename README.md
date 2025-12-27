# CourseForge AI Pro

AI-powered course creation and management platform built with Next.js and React.

## Features

- ✨ AI-Powered Course Generation
- 📚 Comprehensive Content Management
- 🎯 Smart Learning Paths
- 📊 Progress Tracking & Analytics

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/lifetestedLLC/courseforgeaipro.git
cd courseforgeaipro
```

2. Install dependencies:
```bash
npm install
```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

**If port 3000 is already in use**, you can:
- Kill the existing process using port 3000:
  ```bash
  # On macOS/Linux
  lsof -ti:3000 | xargs kill -9
  
  # On Windows (PowerShell)
  Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process -Force
  ```
- Or run on a different port:
  ```bash
  npm run dev -- -p 3001
  ```

### Build

Build the application for production:

```bash
npm run build
```

### Production

Start the production server:

```bash
npm start
```

## Tech Stack

- **Framework:** Next.js 16.1.1
- **UI Library:** React 19.2.3
- **Styling:** Inline CSS (with gradient backgrounds)

## Project Structure

```
courseforgeaipro/
├── app/
│   ├── components/
│   │   └── GetStartedButton.js  # Interactive button component
│   ├── layout.js      # Root layout component
│   └── page.js        # Home page
├── package.json       # Project dependencies
└── README.md          # Documentation
```

## Troubleshooting

### Port Already in Use (EADDRINUSE)

If you see the error `Error: listen EADDRINUSE: address already in use :::3000`, it means port 3000 is occupied by another process.

**Solution 1: Kill the existing process**
```bash
# On macOS/Linux
lsof -ti:3000 | xargs kill -9

# On Windows (PowerShell)
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process -Force

# On Windows (CMD)
for /f "tokens=5" %a in ('netstat -aon ^| find ":3000" ^| find "LISTENING"') do taskkill /F /PID %a
```

**Solution 2: Use a different port**
```bash
npm run dev -- -p 3001
# Then open http://localhost:3001
```

**Solution 3: Set port in package.json**

Add a PORT environment variable to your dev script:
```json
"dev": "PORT=3001 next dev"
```

## License

ISC
