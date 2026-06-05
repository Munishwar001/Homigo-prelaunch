# Google Sheets Integration - Data Flow

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Homigo Waitlist Form                      │
│                                                              │
│  [Name] [Email] [Phone] [City] [Role: Customer/Provider]   │
└───────────────────────┬─────────────────────────────────────┘
                        │ Submit
                        ↓
┌─────────────────────────────────────────────────────────────┐
│              API Route: /api/waitlist/route.ts              │
│                                                              │
│  • Validate input                                           │
│  • Call addEntry() with sanitized data                      │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ↓
┌─────────────────────────────────────────────────────────────┐
│              Waitlist Service: lib/waitlist.ts              │
│                                                              │
│  1. Generate UUID                                           │
│  2. Add ISO timestamp                                       │
│  3. Check for duplicates                                    │
│  4. Save to JSON file (PRIMARY)                             │
│  5. Call addToGoogleSheets() (OPTIONAL)                     │
└───────────┬─────────────────────────┬───────────────────────┘
            │                         │
            ↓                         ↓
┌───────────────────────┐  ┌──────────────────────────────────┐
│   Local JSON Storage  │  │  Google Sheets: googleSheets.ts  │
│                       │  │                                   │
│  data/waitlist.json   │  │  • Authenticate with service     │
│                       │  │    account                        │
│  Always succeeds      │  │  • Format date: DD/MM/YYYY       │
│  Primary storage      │  │  • Format time: HH:MM:SS AM/PM   │
│  Immediate response   │  │  • Append to spreadsheet         │
│                       │  │                                   │
│                       │  │  May fail (non-blocking)          │
└───────────────────────┘  └──────────────────────────────────┘
```

## Data Structure

### Input (from form)
```json
{
  "name": "Rajesh Kumar",
  "email": "rajesh@example.com",
  "phone": "9876543210",
  "city": "Mumbai",
  "role": "customer"
}
```

### Processed Entry
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Rajesh Kumar",
  "email": "rajesh@example.com",
  "phone": "9876543210",
  "city": "Mumbai",
  "role": "customer",
  "createdAt": "2026-06-05T14:30:45.123Z"
}
```

### Google Sheets Row
```
| ID      | Name         | Email              | Phone      | City   | Role     | Date       | Time        | ISO Timestamp         |
|---------|--------------|-------------------|------------|--------|----------|------------|-----------|-----------------------|
| 550e... | Rajesh Kumar | rajesh@example.com| 9876543210 | Mumbai | customer | 05/06/2026 | 02:30:45 PM | 2026-06-05T14:30:45.123Z |
```

## Authentication Flow

```
┌─────────────────────────────────────────────────────────────┐
│                  Environment Variables                       │
│                                                              │
│  GOOGLE_SHEETS_ID=1abc...xyz                                │
│  GOOGLE_SERVICE_ACCOUNT_CREDENTIALS={"type":"service_..."}  │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ↓
┌─────────────────────────────────────────────────────────────┐
│                  Google Auth Library                         │
│                                                              │
│  • Parse service account JSON                               │
│  • Request OAuth2 token                                     │
│  • Authenticate with Google                                 │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ↓
┌─────────────────────────────────────────────────────────────┐
│                   Google Sheets API                          │
│                                                              │
│  • Verify spreadsheet access                                │
│  • Check service account permissions                        │
│  • Append row to sheet                                      │
└─────────────────────────────────────────────────────────────┘
```

## Error Handling Strategy

```
Try: addToGoogleSheets()
│
├─ Success ✓
│  └─ Entry appears in both JSON and Sheets
│
└─ Failure ✗
   │
   ├─ Log error to console
   │
   └─ Continue execution
      └─ User sees success message
         └─ Entry saved in JSON (always works)
```

## Setup Requirements

### Google Cloud Console
1. Create project
2. Enable Google Sheets API
3. Create service account
4. Download JSON key

### Google Spreadsheet
1. Create new spreadsheet
2. Share with service account email
3. Grant Editor permissions

### Application
1. Add environment variables
2. Restart server
3. Test connection

## Date/Time Formatting

```
ISO 8601 Timestamp
"2026-06-05T14:30:45.123Z"
         ↓
    ┌────┴────┐
    │ Format  │
    └────┬────┘
         ├─→ Date: "05/06/2026" (DD/MM/YYYY)
         └─→ Time: "02:30:45 PM" (HH:MM:SS AM/PM)
```

### Timezone Handling
- Timestamps stored in ISO 8601 (UTC)
- Display format: Indian timezone (en-IN locale)
- Date separator: `/` (Indian standard)
- Time: 12-hour format with AM/PM

## Security Layers

```
┌─────────────────────────────────────────┐
│  Service Account (Google Cloud)          │
│  • Isolated credentials                  │
│  • Limited scope (Sheets API only)       │
│  • No user impersonation                 │
└───────────────┬─────────────────────────┘
                │
                ↓
┌─────────────────────────────────────────┐
│  Environment Variables                   │
│  • Not in source code                    │
│  • Not committed to Git                  │
│  • Different per environment             │
└───────────────┬─────────────────────────┘
                │
                ↓
┌─────────────────────────────────────────┐
│  Spreadsheet Permissions                 │
│  • Explicit sharing required             │
│  • Editor access for service account     │
│  • No public access                      │
└─────────────────────────────────────────┘
```

## Production Deployment (Vercel)

```
Local Development          Vercel Production
─────────────────          ─────────────────

.env.local                 Vercel Dashboard
├─ GOOGLE_SHEETS_ID   →   Environment Variables
└─ GOOGLE_SERVICE...       ├─ GOOGLE_SHEETS_ID
                           └─ GOOGLE_SERVICE_ACCOUNT_CREDENTIALS

↓ Push code                ↓ Trigger build

Git Repository             Vercel Build
(no .env.local)           (injected env vars)
                          
                          ↓ Deploy
                          
                          Production App
                          (with Sheets access)
```

## Testing Workflow

```
1. Setup
   └─ Configure environment variables
      └─ .env.local created

2. Test Connection
   └─ Run: npm run test:sheets
      ├─ Check env vars ✓
      ├─ Initialize headers ✓
      └─ Add test entry ✓

3. Manual Test
   └─ Submit form on http://localhost:3000
      └─ Check spreadsheet for new row

4. Production Test
   └─ Deploy to Vercel
      └─ Submit real entry
         └─ Verify in spreadsheet
```

## Monitoring

### Success Indicators
- ✅ Entry appears in JSON file
- ✅ Entry appears in Google Sheets
- ✅ Date format correct (DD/MM/YYYY)
- ✅ Time format correct (HH:MM:SS AM/PM)
- ✅ User receives success message

### Failure Indicators
- ❌ Error in server console
- ❌ Entry in JSON but not Sheets
- ⚠️  Check: Service account permissions
- ⚠️  Check: API enabled
- ⚠️  Check: Credentials valid

---

This diagram provides a visual reference for understanding how the Google Sheets integration works within your Homigo waitlist system.
