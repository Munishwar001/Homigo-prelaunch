# Homigo Pre-Launch App

This is a [Next.js](https://nextjs.org) project for Homigo's pre-launch waitlist campaign.

## Features

- 🎯 Landing page with service information
- 📝 Waitlist form with validation
- 💾 Dual storage: Local JSON + Google Sheets
- 📅 Automatic date and time tracking
- 💬 AI chat widget for visitor engagement

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Google Sheets (Optional)

The waitlist works with local JSON storage by default. To enable Google Sheets integration:

1. Follow the detailed setup guide in [GOOGLE_SHEETS_SETUP.md](./GOOGLE_SHEETS_SETUP.md)
2. Create `.env.local` with your credentials:
   ```env
   GOOGLE_SHEETS_ID=your_spreadsheet_id
   GOOGLE_SERVICE_ACCOUNT_CREDENTIALS={"type":"service_account",...}
   ```

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Waitlist Data Storage

### Local Storage
- Location: `data/waitlist.json`
- Format: JSON array of entries
- Used as primary/fallback storage

### Google Sheets (Optional)
- Real-time sync when configured
- Columns: ID, Name, Email, Phone, City, Role, Date, Time, ISO Timestamp
- Date format: DD/MM/YYYY (Indian format)
- Time format: HH:MM:SS AM/PM (12-hour format)

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── chat/          # AI chat endpoint
│   │   └── waitlist/      # Waitlist submission endpoint
│   └── page.tsx           # Main landing page
├── components/
│   ├── sections/          # Page sections (Hero, Services, etc.)
│   └── ui/                # Reusable UI components
├── lib/
│   ├── googleSheets.ts    # Google Sheets integration
│   ├── waitlist.ts        # Waitlist logic
│   └── types.ts           # TypeScript types
└── constants/
    └── index.ts           # App constants
```

## Environment Variables

See `.env.example` for all available configuration options.

Required for Google Sheets:
- `GOOGLE_SHEETS_ID` - Your spreadsheet ID
- `GOOGLE_SERVICE_ACCOUNT_CREDENTIALS` - Service account JSON credentials

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

**Important:** Remember to add your environment variables in Vercel's project settings!
