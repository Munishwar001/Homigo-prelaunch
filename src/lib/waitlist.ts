import { WaitlistEntry } from "./types";
import { addToGoogleSheets } from "./googleSheets";

type WaitlistInput = Omit<WaitlistEntry, "id" | "createdAt">;

export async function addEntry(input: WaitlistInput): Promise<WaitlistEntry> {
  const entry: WaitlistEntry = {
    id: crypto.randomUUID(),
    ...input,
    createdAt: new Date().toISOString(),
  };

  // Save to Google Sheets (primary storage for production)
  try {
    // Check if environment variables are configured
    const hasGoogleConfig = 
      process.env.GOOGLE_SHEETS_ID && 
      process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS;

    if (!hasGoogleConfig) {
      console.error("❌ Google Sheets not configured");
      throw new Error("Google Sheets configuration missing. Please add GOOGLE_SHEETS_ID and GOOGLE_SERVICE_ACCOUNT_CREDENTIALS environment variables.");
    }

    console.log("📊 Saving to Google Sheets...");
    await addToGoogleSheets(entry);
    console.log("✅ Saved to Google Sheets successfully");
  } catch (error) {
    console.error("❌ Failed to save to Google Sheets:", error);
    if (error instanceof Error) {
      console.error("Details:", error.message);
    }
    // Re-throw to fail the request if Google Sheets fails
    throw error;
  }

  return entry;
}

// Read entries from Google Sheets (for duplicate check)
export async function checkDuplicateEmail(email: string): Promise<boolean> {
  try {
    // For now, we'll skip duplicate check in production
    // You can implement Google Sheets read later if needed
    console.log("⚠️ Duplicate check skipped (not implemented for Google Sheets)");
    return false;
  } catch (error) {
    console.error("Error checking duplicate:", error);
    return false;
  }
}
