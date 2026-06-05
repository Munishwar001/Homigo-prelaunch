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

  entries.push(entry);
  fs.writeFileSync(DATA_FILE, JSON.stringify(entries, null, 2), "utf-8");

  // Add to Google Sheets (non-blocking, log errors)
  try {
    await addToGoogleSheets(entry);
  } catch (error) {
    console.error("Failed to add entry to Google Sheets:", error);
    // Continue even if Google Sheets fails - local storage is primary
  }

  return entry;
}
