import { Resend } from "resend";
import { WaitlistEntry } from "./types";

const FROM_EMAIL = () => process.env.EMAIL_FROM || "onboarding@resend.dev";
const ADMIN_EMAIL = () => process.env.ADMIN_EMAIL || "your@email.com";

// Send confirmation email to user
export async function sendUserConfirmationEmail(entry: WaitlistEntry): Promise<void> {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.warn("⚠️  RESEND_API_KEY not set, skipping user email");
      return;
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const firstName = entry.name.split(" ")[0];

    await resend.emails.send({
      from: FROM_EMAIL(),
      to: entry.email,
      subject: "You're on the Homizy waitlist",
      html: getUserEmailTemplate(entry, firstName),
    });

    console.log(`✅ Confirmation email sent to: ${entry.email}`);
  } catch (error) {
    console.error("❌ Failed to send user confirmation email:", error);
    // Don't throw - email failure shouldn't block signup
  }
}

// Send notification email to admin
export async function sendAdminNotificationEmail(entry: WaitlistEntry): Promise<void> {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.warn("⚠️  RESEND_API_KEY not set, skipping admin email");
      return;
    }

    if (!process.env.ADMIN_EMAIL) {
      console.warn("⚠️  ADMIN_EMAIL not set, skipping admin notification");
      return;
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: FROM_EMAIL(),
      to: ADMIN_EMAIL(),
      subject: `New signup: ${entry.name} (${entry.role === "customer" ? "Homeowner" : "Service Pro"}) — ${entry.city}`,
      html: getAdminEmailTemplate(entry),
    });

    console.log(`✅ Admin notification sent to: ${ADMIN_EMAIL()}`);
  } catch (error) {
    console.error("❌ Failed to send admin notification email:", error);
    // Don't throw - email failure shouldn't block signup
  }
}

// User confirmation email template
function getUserEmailTemplate(entry: WaitlistEntry, firstName: string): string {
  const isCustomer = entry.role === "customer";

  const features = isCustomer
    ? [
        ["Voice booking", "Describe what you need — our AI finds the right professional instantly."],
        ["Verified professionals", "Every service provider is background-checked and rated."],
        ["Transparent pricing", "Get upfront quotes with no hidden fees."],
        ["Secure payments", "Pay safely through the app with full protection."],
      ]
    : [
        ["Steady work pipeline", "Get matched with homeowners actively looking for your skills."],
        ["Zero lead-buying", "No pay-per-lead. Just quality job matches sent to you."],
        ["Simple job management", "Accept, schedule, and complete jobs from one dashboard."],
        ["Build your reputation", "Collect verified reviews that help you win more work."],
      ];

  const featureRows = features
    .map(
      ([title, desc]) => `
        <tr>
          <td style="padding: 14px 0; border-bottom: 1px solid #f3f4f6; vertical-align: top;">
            <table cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding-right: 14px; vertical-align: top; padding-top: 2px;">
                  <div style="width: 8px; height: 8px; background-color: #0D9488; border-radius: 50%; margin-top: 6px;"></div>
                </td>
                <td>
                  <p style="margin: 0 0 3px; color: #111827; font-size: 14px; font-weight: 600;">${title}</p>
                  <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.5;">${desc}</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>You're on the Homizy waitlist</title>
  <!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #f4f6f8; -webkit-font-smoothing: antialiased;">

  <!-- Preheader (hidden preview text) -->
  <div style="display: none; max-height: 0; overflow: hidden; color: transparent;">
    Hi ${firstName}, you're in. We'll let you know the moment Homizy goes live in ${entry.city}.
    &nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f6f8;">
    <tr>
      <td align="center" style="padding: 48px 16px;">

        <!-- Card -->
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb;">

          <!-- Top accent bar -->
          <tr>
            <td style="background-color: #0D9488; height: 4px; font-size: 0; line-height: 0;">&nbsp;</td>
          </tr>

          <!-- Logo / Brand -->
          <tr>
            <td style="padding: 36px 48px 28px; border-bottom: 1px solid #f3f4f6;">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background-color: #0D9488; border-radius: 8px; padding: 6px 14px;">
                    <span style="color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; font-size: 18px; font-weight: 700; letter-spacing: -0.3px;">Homizy</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding: 36px 48px 0;">
              <h1 style="margin: 0 0 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; font-size: 26px; font-weight: 700; color: #111827; letter-spacing: -0.5px; line-height: 1.3;">
                You're on the list, ${firstName}.
              </h1>
              <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; font-size: 16px; color: #4b5563; line-height: 1.65;">
                Thanks for signing up as ${isCustomer ? "a homeowner" : "a service professional"}. We'll send you a direct invite the moment Homizy goes live in <strong style="color: #111827;">${entry.city}</strong> — no spam, just the real launch email.
              </p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding: 28px 48px 0;">
              <div style="height: 1px; background-color: #f3f4f6; font-size: 0; line-height: 0;">&nbsp;</div>
            </td>
          </tr>

          <!-- What you get -->
          <tr>
            <td style="padding: 28px 48px 0;">
              <p style="margin: 0 0 18px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; font-size: 11px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 1px;">
                ${isCustomer ? "What Homizy does for you" : "Why pros choose Homizy"}
              </p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                ${featureRows}
              </table>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="padding: 36px 48px;">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background-color: #0D9488; border-radius: 8px;">
                    <a href="https://homizy.in" style="display: inline-block; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; font-size: 14px; font-weight: 600; color: #ffffff; text-decoration: none; padding: 13px 28px; letter-spacing: 0.1px;">
                      Learn more about Homizy
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 48px; background-color: #f9fafb; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 6px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; font-size: 13px; color: #6b7280; line-height: 1.6;">
                Questions? Email us at <a href="mailto:hello@homizy.in" style="color: #0D9488; text-decoration: none; font-weight: 500;">hello@homizy.in</a>
              </p>
              <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; font-size: 12px; color: #9ca3af;">
                &copy; ${new Date().getFullYear()} Homizy &bull; India's AI-powered home services platform
              </p>
            </td>
          </tr>

        </table>
        <!-- /Card -->

      </td>
    </tr>
  </table>

</body>
</html>`;
}

// Admin notification email template
function getAdminEmailTemplate(entry: WaitlistEntry): string {
  const date = new Date(entry.createdAt);
  const formattedDate = date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const formattedTime = date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const isCustomer = entry.role === "customer";
  const badgeBg = isCustomer ? "#dbeafe" : "#fef3c7";
  const badgeColor = isCustomer ? "#1d4ed8" : "#b45309";
  const badgeLabel = isCustomer ? "Homeowner" : "Service Pro";

  const rows: [string, string][] = [
    ["Name", entry.name],
    ["Email", entry.email],
    ["Phone", `+91 ${entry.phone}`],
    ["City", entry.city],
    ["Signup time", `${formattedDate} at ${formattedTime}`],
    ["Record ID", entry.id],
  ];

  const tableRows = rows
    .map(
      ([label, value]) => `
      <tr>
        <td style="padding: 11px 0; border-bottom: 1px solid #f3f4f6; width: 130px; vertical-align: top;">
          <span style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; font-size: 12px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.8px;">${label}</span>
        </td>
        <td style="padding: 11px 0 11px 16px; border-bottom: 1px solid #f3f4f6; vertical-align: top;">
          <span style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; font-size: 14px; color: #111827; font-weight: 500;">${value}</span>
        </td>
      </tr>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Waitlist Signup</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f6f8; -webkit-font-smoothing: antialiased;">

  <div style="display: none; max-height: 0; overflow: hidden; color: transparent;">
    ${entry.name} just joined the Homizy waitlist as a ${badgeLabel} from ${entry.city}.
    &nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f6f8;">
    <tr>
      <td align="center" style="padding: 48px 16px;">

        <table role="presentation" width="540" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb;">

          <!-- Top accent bar -->
          <tr>
            <td style="background-color: #0D9488; height: 4px; font-size: 0; line-height: 0;">&nbsp;</td>
          </tr>

          <!-- Header -->
          <tr>
            <td style="padding: 32px 40px 24px; border-bottom: 1px solid #f3f4f6;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <p style="margin: 0 0 6px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; font-size: 11px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 1px;">Homizy &bull; Waitlist</p>
                    <h1 style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; font-size: 22px; font-weight: 700; color: #111827; letter-spacing: -0.3px;">New signup</h1>
                  </td>
                  <td align="right" style="vertical-align: top;">
                    <span style="display: inline-block; background-color: ${badgeBg}; color: ${badgeColor}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; font-size: 12px; font-weight: 700; padding: 5px 12px; border-radius: 20px; letter-spacing: 0.2px;">
                      ${badgeLabel}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Details -->
          <tr>
            <td style="padding: 28px 40px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                ${tableRows}
              </table>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="padding: 0 40px 36px;">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background-color: #0D9488; border-radius: 8px;">
                    <a href="https://docs.google.com/spreadsheets/d/${process.env.GOOGLE_SHEETS_ID}/edit" style="display: inline-block; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; font-size: 13px; font-weight: 600; color: #ffffff; text-decoration: none; padding: 11px 22px;">
                      Open spreadsheet
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 40px; background-color: #f9fafb; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; font-size: 12px; color: #9ca3af;">
                This is an automated notification from Homizy &bull; &copy; ${new Date().getFullYear()} Homizy
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>`;
}
