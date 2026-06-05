import { google } from "googleapis";
import { WaitlistEntry } from "./types";

// Initialize Google Sheets API
function getGoogleSheetsClient() {
  const credentials = process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS;
  
  if (!credentials) {
    throw new Error("GOOGLE_SERVICE_ACCOUNT_CREDENTIALS environment variable is not set");
  }

  const auth = new google.auth.GoogleAuth({
    credentials: JSON.parse(credentials),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  return google.sheets({ version: "v4", auth });
}

// Format date and time for Google Sheets
function formatDateTime(isoString: string) {
  const date = new Date(isoString);
  const dateStr = date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const timeStr = date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  return { date: dateStr, time: timeStr };
}

// Check if email already exists in Google Sheets
export async function checkDuplicateEmail(email: string): Promise<boolean> {
  try {
    const spreadsheetId = process.env.GOOGLE_SHEETS_ID;

    if (!spreadsheetId) {
      console.warn("⚠️  GOOGLE_SHEETS_ID not set, skipping duplicate check");
      return false;
    }

    console.log("🔍 Checking for duplicate email:", email.toLowerCase());

    const sheets = getGoogleSheetsClient();

    // Read all emails from column C (Email column)
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "Sheet1!C:C", // Column C contains emails
    });

    const values = response.data.values;
    
    if (!values || values.length === 0) {
      console.log("✅ No existing emails found");
      return false;
    }

    // Check if email exists (case-insensitive)
    const emailExists = values.some(
      (row) => row[0]?.toLowerCase() === email.toLowerCase()
    );

    if (emailExists) {
      console.log("⚠️  Duplicate email found:", email);
      return true;
    }

    console.log("✅ Email is unique");
    return false;
  } catch (error) {
    console.error("❌ Error checking duplicate email:", error);
    // If check fails, allow the request (fail open)
    return false;
  }
}

// Add entry to Google Sheets
export async function addToGoogleSheets(entry: WaitlistEntry): Promise<void> {
  try {
    const spreadsheetId = process.env.GOOGLE_SHEETS_ID;

    if (!spreadsheetId) {
      console.error("❌ GOOGLE_SHEETS_ID is not configured");
      throw new Error("GOOGLE_SHEETS_ID environment variable is not set");
    }

    const credentials = process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS;
    
    if (!credentials) {
      console.error("❌ GOOGLE_SERVICE_ACCOUNT_CREDENTIALS is not configured");
      throw new Error("GOOGLE_SERVICE_ACCOUNT_CREDENTIALS environment variable is not set");
    }

    console.log("✅ Environment variables found, connecting to Google Sheets...");

    const sheets = getGoogleSheetsClient();
    const { date, time } = formatDateTime(entry.createdAt);

    const values = [
      [
        entry.id,
        entry.name,
        entry.email,
        entry.phone,
        entry.city,
        entry.role,
        date,
        time,
        entry.createdAt,
      ],
    ];

    console.log("📊 Attempting to write to Google Sheets:", spreadsheetId);

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "Sheet1!A:I", // Adjust sheet name if needed
      valueInputOption: "RAW",
      requestBody: {
        values,
      },
    });

    console.log("✅ Successfully wrote to Google Sheets");
  } catch (error) {
    console.error("❌ Google Sheets Error:", error);
    
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    
    // Re-throw to let waitlist.ts handle it
    throw error;
  }
}

// Initialize the spreadsheet with headers (run once)
export async function initializeSpreadsheet(): Promise<void> {
  const spreadsheetId = process.env.GOOGLE_SHEETS_ID;

  if (!spreadsheetId) {
    throw new Error("GOOGLE_SHEETS_ID environment variable is not set");
  }

  const sheets = getGoogleSheetsClient();

  const headers = [
    ["ID", "Name", "Email", "Phone", "City", "Role", "Date", "Time", "ISO Timestamp"],
  ];

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: "Sheet1!A1:I1",
    valueInputOption: "RAW",
    requestBody: {
      values: headers,
    },
  });
}
