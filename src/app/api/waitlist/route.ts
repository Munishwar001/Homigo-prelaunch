import { NextRequest, NextResponse } from "next/server";
import { addEntry } from "@/lib/waitlist";
import { WaitlistResponse } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email } = body as { name?: string; email?: string };

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

    addEntry(name.trim(), email.trim().toLowerCase());

    return NextResponse.json<WaitlistResponse>({
      success: true,
      message: `Welcome, ${name.trim().split(" ")[0]}! We'll be in touch with early access details soon.`,
    });
  } catch (err) {
    if (err instanceof Error && err.message === "already_registered") {
      return NextResponse.json<WaitlistResponse>(
        { success: false, message: "This email is already on the waitlist." },
        { status: 409 }
      );
    }

    return NextResponse.json<WaitlistResponse>(
      { success: false, message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
