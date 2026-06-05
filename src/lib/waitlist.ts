import fs from "fs";
import path from "path";
import { WaitlistEntry } from "./types";
import { addToGoogleSheets } from "./googleSheets";

const DATA_FILE = path.join(process.cwd(), "data", "waitlist.json");

function ensureDataFile() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, "[]", "utf-8");
}

export function readEntries(): WaitlistEntry[] {
  ensureDataFile();
  const raw = fs.readFileSync(DATA_FILE, "utf-8");
  return JSON.parse(raw) as WaitlistEntry[];
}

type WaitlistInput = Omit<WaitlistEntry, "id" | "createdAt">;

export async function addEntry(input: WaitlistInput): Promise<WaitlistEntry> {
  const entries = readEntries();
  const existing = entries.find((e) => e.email.toLowerCase() === input.email.toLowerCase());
  if (existing) throw new Error("already_registered");

  const entry: WaitlistEntry = {
    id: crypto.randomUUID(),
    ...input,
    createdAt: new Date().toISOString(),
  };

  // Save to local JSON first (primary storage - always works)
  entries.push(entry);
  fs.writeFileSync(DATA_FILE, JSON.stringify(entries, null, 2), "utf-8");
  console.log("✅ Entry saved to local JSON file");

  // Try to add to Google Sheets (optional, non-blocking)
  try {
    // Only attempt if environment variables are configured
    const hasGoogleConfig = 
      process.env.GOOGLE_SHEETS_ID && 
      process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS;

    if (hasGoogleConfig) {
      console.log("📊 Attempting to sync to Google Sheets...");
      await addToGoogleSheets(entry);
      console.log("✅ Synced to Google Sheets successfully");
    } else {
      console.log("⚠️  Google Sheets not configured, using local storage only");
    }
  } catch (error) {
    // Log error but don't fail the request
    console.error("⚠️  Failed to sync to Google Sheets (local backup saved):", error);
    if (error instanceof Error) {
      console.error("Details:", error.message);
    }
    // Continue - local storage is primary, Sheets is just a backup
  }

  return entry;
}
