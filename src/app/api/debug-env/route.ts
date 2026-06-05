import { NextResponse } from "next/server";

// Debug endpoint to check environment variables (development only)
export async function GET() {
  // Only allow in development
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available in production" }, { status: 403 });
  }

  const debug = {
    nodeEnv: process.env.NODE_ENV,
    hasGoogleSheetsId: !!process.env.GOOGLE_SHEETS_ID,
    googleSheetsIdLength: process.env.GOOGLE_SHEETS_ID?.length || 0,
    hasGoogleCredentials: !!process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS,
    googleCredentialsLength: process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS?.length || 0,
    credentialsStartsWith: process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS?.substring(0, 20) + "...",
  };

  return NextResponse.json(debug, { status: 200 });
}
