/**
 * Test Google Sheets Connection
 * 
 * This script tests your Google Sheets integration setup.
 * Run with: npx tsx scripts/test-sheets-connection.ts
 */

// Load environment variables from .env.local
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

import { initializeSpreadsheet, addToGoogleSheets } from "../src/lib/googleSheets";
import type { WaitlistEntry } from "../src/lib/types";

async function testConnection() {
  console.log("🧪 Testing Google Sheets connection...\n");

  // Check environment variables
  console.log("1️⃣  Checking environment variables...");
  if (!process.env.GOOGLE_SHEETS_ID) {
    console.error("❌ GOOGLE_SHEETS_ID is not set");
    process.exit(1);
  }
  if (!process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS) {
    console.error("❌ GOOGLE_SERVICE_ACCOUNT_CREDENTIALS is not set");
    process.exit(1);
  }
  console.log("✅ Environment variables found\n");

  // Initialize spreadsheet with headers
  console.log("2️⃣  Initializing spreadsheet with headers...");
  try {
    await initializeSpreadsheet();
    console.log("✅ Headers initialized successfully\n");
  } catch (error) {
    console.error("❌ Failed to initialize headers:", error);
    process.exit(1);
  }

  // Test adding a sample entry
  console.log("3️⃣  Adding a test entry...");
  const testEntry: WaitlistEntry = {
    id: crypto.randomUUID(),
    name: "Test User",
    email: "test@example.com",
    phone: "9876543210",
    city: "Mumbai",
    role: "customer",
    createdAt: new Date().toISOString(),
  };

  try {
    await addToGoogleSheets(testEntry);
    console.log("✅ Test entry added successfully\n");
  } catch (error) {
    console.error("❌ Failed to add test entry:", error);
    process.exit(1);
  }

  console.log("🎉 All tests passed!");
  console.log("\nYour Google Sheets integration is working correctly.");
  console.log(`📊 Check your spreadsheet: https://docs.google.com/spreadsheets/d/${process.env.GOOGLE_SHEETS_ID}/edit\n`);
}

testConnection().catch((error) => {
  console.error("\n💥 Unexpected error:", error);
  process.exit(1);
});
