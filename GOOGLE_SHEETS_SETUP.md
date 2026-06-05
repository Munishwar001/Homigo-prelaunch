# Google Sheets Waitlist Integration Setup

This guide will help you set up Google Sheets integration for your Homigo waitlist.

## Prerequisites

- A Google account
- Access to Google Cloud Console

## Step 1: Create a Google Spreadsheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it something like "Homigo Waitlist"
4. Copy the **Spreadsheet ID** from the URL:
   ```
   https://docs.google.com/spreadsheets/d/SPREADSHEET_ID_HERE/edit
   ```
5. The spreadsheet will automatically be initialized with headers when the first entry is added

**Expected columns:**
| ID | Name | Email | Phone | City | Role | Date | Time | ISO Timestamp |

## Step 2: Create a Google Cloud Service Account

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select an existing one)
3. Enable the **Google Sheets API**:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Sheets API"
   - Click "Enable"

4. Create a Service Account:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "Service Account"
   - Fill in the service account details
   - Click "Create and Continue"
   - Skip the optional steps and click "Done"

5. Create and download the JSON key:
   - Click on the service account you just created
   - Go to the "Keys" tab
   - Click "Add Key" > "Create new key"
   - Select "JSON" format
   - Click "Create" - the key file will download

## Step 3: Share Your Spreadsheet with the Service Account

1. Open the downloaded JSON key file
2. Find the `client_email` field (looks like: `xxx@xxx.iam.gserviceaccount.com`)
3. Open your Google Spreadsheet
4. Click "Share" button
5. Paste the service account email
6. Give it **Editor** permissions
7. Uncheck "Notify people"
8. Click "Share"

## Step 4: Configure Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and add your credentials:

   ```env
   GOOGLE_SHEETS_ID=your_spreadsheet_id_from_step_1
   GOOGLE_SERVICE_ACCOUNT_CREDENTIALS={"type":"service_account","project_id":"..."}
   ```

   **Important:** For the credentials, copy the **entire contents** of the downloaded JSON key file as a single-line string.

## Step 5: Test the Integration

1. Restart your development server:
   ```bash
   npm run dev
   ```

2. Submit a test entry through your waitlist form

3. Check your Google Spreadsheet - the entry should appear with:
   - All user details (name, email, phone, city, role)
   - Date in DD/MM/YYYY format
   - Time in HH:MM:SS AM/PM format
   - ISO timestamp for reference

## Data Format

Each waitlist entry will be stored with:

- **ID**: Unique identifier (UUID)
- **Name**: Full name of the person
- **Email**: Email address (lowercase)
- **Phone**: 10-digit mobile number
- **City**: City name
- **Role**: Either "customer" or "provider"
- **Date**: Formatted as DD/MM/YYYY (Indian format)
- **Time**: Formatted as HH:MM:SS AM/PM (12-hour format)
- **ISO Timestamp**: Full ISO 8601 timestamp for precise record-keeping

## Troubleshooting

### "GOOGLE_SERVICE_ACCOUNT_CREDENTIALS environment variable is not set"
- Make sure `.env.local` exists and contains the credentials
- Verify the JSON is valid (no extra spaces or line breaks)
- Restart your development server

### "GOOGLE_SHEETS_ID environment variable is not set"
- Check that you've added the spreadsheet ID to `.env.local`
- Make sure the ID matches the one from your spreadsheet URL

### "The caller does not have permission"
- Verify you shared the spreadsheet with the service account email
- Check that the service account has Editor permissions
- Make sure Google Sheets API is enabled in your Google Cloud project

### Entries save locally but not to Google Sheets
- Check the server console for error messages
- The app will continue working even if Google Sheets fails
- Local JSON backup in `data/waitlist.json` is maintained as fallback

## Security Notes

- **Never commit** `.env.local` to version control
- Keep your service account JSON key secure
- The `.gitignore` file already excludes `.env*.local` files
- Consider rotating your service account key periodically

## Optional: Initialize Headers Manually

If you want to set up the spreadsheet headers before the first entry:

1. Create a temporary script `scripts/init-sheets.ts`:
   ```typescript
   import { initializeSpreadsheet } from "../src/lib/googleSheets";

   async function main() {
     await initializeSpreadsheet();
     console.log("✓ Spreadsheet initialized with headers");
   }

   main().catch(console.error);
   ```

2. Run it with:
   ```bash
   tsx scripts/init-sheets.ts
   ```
