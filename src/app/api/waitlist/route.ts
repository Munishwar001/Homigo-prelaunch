import { NextRequest, NextResponse } from "next/server";
import { addEntry } from "@/lib/waitlist";
import { WaitlistResponse } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, city, role } = body as {
      name?: string;
      email?: string;
      phone?: string;
      city?: string;
      role?: "customer" | "provider";
    };

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json<WaitlistResponse>(
        { success: false, message: "Please enter your full name." },
        { status: 400 }
      );
    }

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json<WaitlistResponse>(
        { success: false, message: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    if (!phone || typeof phone !== "string" || !/^\d{10}$/.test(phone.trim())) {
      return NextResponse.json<WaitlistResponse>(
        { success: false, message: "Please enter a valid 10-digit mobile number." },
        { status: 400 }
      );
    }

    if (!city || typeof city !== "string" || city.trim().length < 2) {
      return NextResponse.json<WaitlistResponse>(
        { success: false, message: "Please enter your city." },
        { status: 400 }
      );
    }

    if (role !== "customer" && role !== "provider") {
      return NextResponse.json<WaitlistResponse>(
        { success: false, message: "Please select whether you are a homeowner or service pro." },
        { status: 400 }
      );
    }

    await addEntry({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      city: city.trim(),
      role,
    });

    return NextResponse.json<WaitlistResponse>({
      success: true,
      message: `Welcome, ${name.trim().split(" ")[0]}! We'll be in touch with early access details soon.`,
    });
  } catch (err) {
    console.error("❌ Waitlist API Error:", err);
    
    if (err instanceof Error && err.message === "already_registered") {
      return NextResponse.json<WaitlistResponse>(
        { success: false, message: "This email is already on the waitlist." },
        { status: 409 }
      );
    }

    // Return detailed error in development, generic in production
    const isDev = process.env.NODE_ENV === "development";
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    const errorStack = err instanceof Error ? err.stack : undefined;

    // Log to console
    console.error("Error details:", {
      message: errorMessage,
      stack: errorStack,
      env: {
        nodeEnv: process.env.NODE_ENV,
        hasGoogleSheetsId: !!process.env.GOOGLE_SHEETS_ID,
        hasGoogleCredentials: !!process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS,
        sheetsIdPreview: process.env.GOOGLE_SHEETS_ID?.substring(0, 20) + "...",
        credentialsPreview: process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS?.substring(0, 30) + "...",
      }
    });

    return NextResponse.json<WaitlistResponse>(
      { 
        success: false, 
        message: isDev 
          ? `Error: ${errorMessage}` 
          : "Something went wrong. Please try again.",
      },
      { status: 500 }
    );
  }
}
