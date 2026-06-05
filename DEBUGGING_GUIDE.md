# 🐛 Debugging Guide - Fix 500 Errors

## Quick Debug Steps

### Step 1: Check Environment Variables (Local)

Visit in browser: `http://localhost:3000/api/debug-env`

You should see:
```json
{
  "nodeEnv": "development",
  "hasGoogleSheetsId": true,
  "googleSheetsIdLength": 44,
  "hasGoogleCredentials": true,
  "googleCredentialsLength": 1234,
  "credentialsStartsWith": "{\"type\":\"service_acc..."
}
```

**If FALSE** → Environment variables not loading!

---

### Step 2: Check Server Logs

When you submit the form, check your terminal where `npm run dev` is running.

You should see logs like:
```
✅ Entry saved to local JSON file
📊 Attempting to sync to Google Sheets...
✅ Synced to Google Sheets successfully
```

**If you see errors** → Read the error message carefully!

---

### Step 3: Common Errors & Solutions

#### ❌ Error: "GOOGLE_SHEETS_ID environment variable is not set"

**Solution:**
1. Make sure `.env.local` file exists
2. Check spelling: `GOOGLE_SHEETS_ID` (not SHEET_ID)
3. Restart dev server: `Ctrl+C` then `npm run dev`

#### ❌ Error: "GOOGLE_SERVICE_ACCOUNT_CREDENTIALS environment variable is not set"

**Solution:**
1. Check `.env.local` has the credentials
2. Make sure it's ONE SINGLE LINE (no line breaks)
3. Restart dev server

#### ❌ Error: "The caller does not have permission"

**Solution:**
1. Open your spreadsheet: https://docs.google.com/spreadsheets/d/1SpWr8RBPDbZ5eAD-l-MMNLPRHR2Cv7Je3A-2gPcKHOE/edit
2. Click "Share"
3. Add: `homigo-sheets-writer@homigo-waitlist.iam.gserviceaccount.com`
4. Give "Editor" permission
5. Click "Share"

#### ❌ Error: "Unable to parse credentials"

**Solution:**
1. Open `.env.local`
2. Check the JSON is valid (no extra commas, quotes matched)
3. Make sure it starts with `{"type":"service_account"`
4. Try copying from the original JSON file again

---

## 🎯 Best FREE Alternative (No Google Sheets Setup Needed!)

If Google Sheets is causing issues, you can **SKIP IT COMPLETELY**:

### Option 1: Use Local JSON Only (Already Working!)

Your app ALREADY saves data to `data/waitlist.json` - this works 100%!

**To disable Google Sheets:**
1. Don't add Google environment variables
2. App will automatically use local storage only
3. No errors, no setup needed!

**To access data:**
- File location: `data/waitlist.json`
- You can open this file anytime
- Download it, view in Excel, etc.

### Option 2: Free Alternatives to Google Sheets

#### A) Airtable (Free - Better UI)
- Sign up: https://airtable.com
- Create a base
- Use Airtable API (simpler than Google Sheets)
- Free tier: Unlimited records!

#### B) Notion Database (Free)
- Sign up: https://notion.so
- Create a database
- Use Notion API
- Very easy setup

#### C) Google Forms (Easiest!)
- Create a Google Form
- Responses auto-save to Google Sheets
- No API setup needed!
- Just embed the form on your site

#### D) Email Notifications (Simplest!)
Send yourself an email for each signup:
```typescript
// Use Resend, SendGrid, or Nodemailer
await sendEmail({
  to: "your@email.com",
  subject: `New Waitlist: ${name}`,
  body: JSON.stringify(entry, null, 2)
});
```

---

## 🚀 Recommended: Use Local JSON Only for Now

**Why?**
- ✅ Zero setup
- ✅ No errors
- ✅ Works 100% reliably
- ✅ You can always add Google Sheets later
- ✅ Data is safe in `data/waitlist.json`

**How to access data:**
```bash
# View data
cat data/waitlist.json

# Or open in VS Code
code data/waitlist.json

# Convert to CSV (for Excel)
# Use online tool: https://konklone.io/json/
```

---

## 📊 View Your Data

### Method 1: VS Code
1. Open file: `data/waitlist.json`
2. Install extension: "JSON Viewer"
3. Nice formatted view!

### Method 2: Online Viewer
1. Open: https://jsonviewer.stack.hu/
2. Paste your JSON
3. Click "Format"

### Method 3: Convert to CSV
1. Open: https://www.convertcsv.com/json-to-csv.htm
2. Paste your JSON
3. Download CSV
4. Open in Excel/Google Sheets

---

## 🎯 My Recommendation

**For MVP/Testing Phase:**
- Use **local JSON only** (no Google Sheets)
- It's faster, simpler, zero errors
- Data is safe and accessible

**When you have real users:**
- Add Google Sheets later
- Or use Airtable (better UI)
- Or set up email notifications

**Right now:** Just remove Google env vars and your app works perfectly! ✅

---

## Quick Test (Without Google Sheets)

1. **Remove or comment out** these lines in `.env.local`:
   ```
   # GOOGLE_SHEETS_ID=...
   # GOOGLE_SERVICE_ACCOUNT_CREDENTIALS=...
   ```

2. **Restart server:**
   ```bash
   npm run dev
   ```

3. **Submit test entry** in browser

4. **Check logs** - should see:
   ```
   ✅ Entry saved to local JSON file
   ⚠️  Google Sheets not configured, using local storage only
   ```

5. **Check data:**
   ```bash
   cat data/waitlist.json
   ```

**IT WORKS!** 🎉

No 500 errors, no Google setup needed!

---

## Need Help?

1. Check terminal logs when submitting form
2. Visit: `http://localhost:3000/api/debug-env`
3. Share the error message with me
4. We'll fix it together! 😊
