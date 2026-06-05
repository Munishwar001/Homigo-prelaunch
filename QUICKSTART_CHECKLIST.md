# Google Sheets Integration - Quick Start Checklist

Follow this checklist to get your Google Sheets integration up and running.

## ☑️ Setup Checklist

### 1. Google Cloud Setup
- [ ] Create/select a Google Cloud project
- [ ] Enable Google Sheets API
- [ ] Create a Service Account
- [ ] Download the Service Account JSON key file
- [ ] Save the `client_email` from the JSON file

### 2. Google Sheets Setup
- [ ] Create a new Google Spreadsheet
- [ ] Copy the Spreadsheet ID from the URL
- [ ] Click "Share" on the spreadsheet
- [ ] Add the service account email with Editor permissions
- [ ] Uncheck "Notify people" and click Share

### 3. Environment Configuration
- [ ] Copy `.env.example` to `.env.local`
- [ ] Add `GOOGLE_SHEETS_ID` to `.env.local`
- [ ] Add `GOOGLE_SERVICE_ACCOUNT_CREDENTIALS` to `.env.local`
  - Copy the entire JSON file contents as a single line
- [ ] Verify `.env.local` is in `.gitignore`

### 4. Test the Integration
- [ ] Run `npm run test:sheets` to verify connection
- [ ] Check your spreadsheet for test data
- [ ] Remove the test entry from the spreadsheet

### 5. Production Deployment (Vercel)
- [ ] Add `GOOGLE_SHEETS_ID` to Vercel environment variables
- [ ] Add `GOOGLE_SERVICE_ACCOUNT_CREDENTIALS` to Vercel environment variables
- [ ] Redeploy your application
- [ ] Test a submission in production

## 📝 Expected Spreadsheet Columns

Your spreadsheet will have these columns (automatically initialized on first entry):

| Column | Description | Format |
|--------|-------------|--------|
| ID | Unique identifier | UUID |
| Name | Full name | Text |
| Email | Email address | Text (lowercase) |
| Phone | Mobile number | 10 digits |
| City | City name | Text |
| Role | User type | "customer" or "provider" |
| Date | Submission date | DD/MM/YYYY |
| Time | Submission time | HH:MM:SS AM/PM |
| ISO Timestamp | Full timestamp | ISO 8601 format |

## 🔧 Useful Commands

```bash
# Test Google Sheets connection
npm run test:sheets

# Start development server
npm run dev

# Build for production
npm run build
```

## ⚠️ Common Issues

### Environment variables not loading
- Restart your development server after changing `.env.local`
- Make sure the file is named exactly `.env.local`

### Permission denied errors
- Verify the service account email has Editor access
- Check that Google Sheets API is enabled
- Ensure the service account JSON is valid

### Entries not appearing in sheets
- Check server console for error messages
- Verify the Spreadsheet ID is correct
- Try running `npm run test:sheets`

## 💡 Tips

- The app works without Google Sheets (uses local JSON storage)
- Google Sheets is optional but recommended for easy access
- Both storage methods run simultaneously for redundancy
- Local storage: `data/waitlist.json`
- Test locally before deploying to production

## 📚 Additional Resources

- Full setup guide: [GOOGLE_SHEETS_SETUP.md](./GOOGLE_SHEETS_SETUP.md)
- Google Cloud Console: https://console.cloud.google.com/
- Google Sheets API Docs: https://developers.google.com/sheets/api

---

**Need help?** Review the detailed setup guide in `GOOGLE_SHEETS_SETUP.md`
