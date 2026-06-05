import { WaitlistEntry } from "./types";
import { addToGoogleSheets, checkDuplicateEmail } from "./googleSheets";
import { rateLimiter } from "./rateLimiter";

type WaitlistInput = Omit<WaitlistEntry, "id" | "createdAt">;

export async function addEntry(input: WaitlistInput): Promise<WaitlistEntry> {
  // Check for duplicate email in Google Sheets
  const isDuplicate = await checkDuplicateEmail(input.email);
  
  if (isDuplicate || rateLimiter.isEmailCached(input.email)) {
    throw new Error("already_registered");
  }

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
    
    // Cache the email to prevent duplicate checks for some time
    rateLimiter.cacheEmail(input.email);
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
