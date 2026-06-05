# 📧 Email Setup Guide - Resend Integration

## ✅ What's Implemented:

### 1. User Confirmation Email ✉️
- Beautiful, professional HTML email
- Personalized with user's name and city
- Different content for customers vs service providers
- "Thank you for joining!" message
- What happens next explanation

### 2. Admin Notification Email 🔔
- Instant notification when someone signs up
- All user details in organized format
- Direct link to Google Spreadsheet
- Customer/Provider badge
- Clickable email and phone links

### 3. Speed Insights 📊
- Real-time performance monitoring
- Core Web Vitals tracking
- Automatic optimization suggestions

---

## 🚀 Setup Instructions

### Step 1: Sign Up for Resend (FREE)

1. **Go to:** https://resend.com
2. Click **"Sign Up"** (GitHub login recommended)
3. Verify your email

**Free Tier:**
- ✅ 3,000 emails per month
- ✅ 100 emails per day
- ✅ Perfect for waitlist!

---

### Step 2: Get API Key

1. Go to: https://resend.com/api-keys
2. Click **"Create API Key"**
3. Name: `Homigo Waitlist`
4. Permission: **"Sending access"**
5. Click **"Add"**
6. **Copy the API key** (starts with `re_`)

---

### Step 3: Add to Environment Variables

#### Local Development (`.env.local`):

```env
RESEND_API_KEY=re_your_api_key_here
EMAIL_FROM=onboarding@resend.dev
ADMIN_EMAIL=your@email.com
```

**Notes:**
- `onboarding@resend.dev` works immediately (Resend's test domain)
- Replace `your@email.com` with YOUR email to receive notifications

#### Production (Vercel):

1. Go to: Vercel Dashboard → Your Project → **Settings** → **Environment Variables**
2. Add these 3 variables:

| Name | Value | Environment |
|------|-------|-------------|
| `RESEND_API_KEY` | `re_your_key...` | Production, Preview, Development |
| `EMAIL_FROM` | `onboarding@resend.dev` | Production, Preview, Development |
| `ADMIN_EMAIL` | `your@email.com` | Production, Preview, Development |

3. Click **"Redeploy"**

---

### Step 4: (Optional) Use Custom Domain

**To send from your own domain (e.g., hello@homigo.in):**

1. Go to: https://resend.com/domains
2. Click **"Add Domain"**
3. Enter: `homigo.in` (or your domain)
4. Add the DNS records shown (SPF, DKIM, DMARC)
5. Wait for verification (~10 minutes)
6. Update `EMAIL_FROM` to `hello@homigo.in`

**Benefits:**
- ✅ Professional sender address
- ✅ Better email deliverability
- ✅ Branded experience

---

## 📨 Email Templates

### User Confirmation Email

**Features:**
- 🎉 Welcome header with gradient background
- 📍 Personalized with city name
- 💼 Different content for customers vs providers
- 🔗 Call-to-action button
- 📞 Contact information in footer

**Preview:**
```
Subject: 🎉 Welcome to Homigo Waitlist!

Hi Rajesh,

Thank you for joining Homigo as a homeowner looking for 
reliable services! We're excited to have you on our waitlist.

What happens next?
We'll notify you as soon as Homigo launches in Mumbai...
```

### Admin Notification Email

**Features:**
- 🔔 Instant notification
- 👤 All user details in table format
- 📊 Direct link to spreadsheet
- 📱 Clickable phone number
- ✉️ Clickable email address

**Preview:**
```
Subject: 🔔 New Waitlist Signup: Homeowner

New Signup Details:
Name: Rajesh Kumar
Email: rajesh@example.com
Phone: +91 9876543210
City: Mumbai
```

---

## 🧪 Testing

### Test Locally:

1. **Start dev server:**
   ```bash
   npm run dev
   ```

2. **Submit waitlist form** at http://localhost:3000

3. **Check your email** (ADMIN_EMAIL address)

4. **Check terminal logs:**
   ```
   ✅ Saved to Google Sheets successfully
   ✅ Confirmation email sent to: user@example.com
   ✅ Admin notification sent to: your@email.com
   ```

### Test on Production:

1. Deploy to Vercel
2. Submit form on live site
3. Check emails arrive
4. Verify links work

---

## 🔍 Monitoring

### Check Email Delivery:

1. Go to: https://resend.com/emails
2. View all sent emails
3. Click on any email to see:
   - Delivery status
   - Open rate
   - Click rate
   - Full email preview

### Troubleshooting:

**Emails not sending?**
- ✅ Check API key is correct
- ✅ Verify environment variables in Vercel
- ✅ Check Resend dashboard for errors
- ✅ Look at function logs in Vercel

**Emails going to spam?**
- ✅ Use custom domain (better deliverability)
- ✅ Add SPF/DKIM records
- ✅ Ask recipients to whitelist your address

---

## 📊 Speed Insights

### What It Does:

Tracks Core Web Vitals:
- **LCP** (Largest Contentful Paint) - Load performance
- **FID** (First Input Delay) - Interactivity
- **CLS** (Cumulative Layout Shift) - Visual stability
- **TTFB** (Time to First Byte) - Server response
- **FCP** (First Contentful Paint) - Perceived load

### View Metrics:

1. Go to: Vercel Dashboard → Your Project → **Speed Insights**
2. View real user metrics
3. Get optimization suggestions

**Free Tier:**
- ✅ Real User Monitoring
- ✅ Core Web Vitals
- ✅ Up to 10k pageviews/month

---

## 💰 Costs

### Resend Pricing:

| Plan | Emails/Month | Price |
|------|--------------|-------|
| **Free** | 3,000 | $0 |
| Pro | 50,000 | $20 |
| Enterprise | Custom | Custom |

**For waitlist:** Free tier is perfect! ✅

### Vercel Speed Insights:

| Plan | Pageviews/Month | Price |
|------|----------------|-------|
| **Hobby** | 10,000 | $0 |
| Pro | 100,000 | $0 (included) |

**For MVP:** Free tier is enough! ✅

---

## 🎨 Customization

### Change Email Content:

Edit `src/lib/email.ts`:

```typescript
// User email template
function getUserEmailTemplate(entry: WaitlistEntry, firstName: string): string {
  // Customize HTML here
}

// Admin email template
function getAdminEmailTemplate(entry: WaitlistEntry): string {
  // Customize HTML here
}
```

### Change Email Styling:

Emails use inline CSS (required for email clients):
- Colors: Update hex codes
- Fonts: Use web-safe fonts
- Layout: Modify table structure

---

## ✅ Checklist

### Local Setup:
- [ ] Signed up for Resend
- [ ] Got API key
- [ ] Added to `.env.local`
- [ ] Tested locally
- [ ] Received test emails

### Production Setup:
- [ ] Added env vars to Vercel
- [ ] Redeployed application
- [ ] Tested on live site
- [ ] Confirmed emails arrive
- [ ] Checked Resend dashboard

### Optional:
- [ ] Added custom domain
- [ ] Configured DNS records
- [ ] Verified domain
- [ ] Updated EMAIL_FROM

---

## 📧 Email Behavior

### Success Flow:

```
User submits form
    ↓
Validate data
    ↓
Save to Google Sheets ✅
    ↓
Send confirmation email to user ✉️
    ↓
Send notification email to admin 🔔
    ↓
Return success response
```

### If Email Fails:

```
Signup still succeeds! ✅
Data is saved to Google Sheets ✅
Error logged but not shown to user
Admin can check logs for issues
```

**Email failures are non-blocking!**

---

## 🚀 What's Next?

1. **Test everything:**
   - Submit test entries
   - Verify emails arrive
   - Check all links work

2. **Monitor:**
   - Check Resend dashboard daily
   - Review Speed Insights weekly
   - Monitor function logs

3. **Optimize:**
   - Add custom domain (better deliverability)
   - Customize email templates
   - A/B test subject lines

4. **Scale:**
   - Upgrade Resend plan if needed (after 3000 emails)
   - Add email sequences (welcome series)
   - Set up automation (drip campaigns)

---

## 💡 Pro Tips

### Better Deliverability:
- ✅ Use custom domain
- ✅ Add SPF, DKIM, DMARC records
- ✅ Warm up email domain gradually
- ✅ Monitor bounce rates

### Better User Experience:
- ✅ Send confirmation within seconds
- ✅ Include clear CTA buttons
- ✅ Mobile-responsive design
- ✅ Unsubscribe link (for future campaigns)

### Security:
- ✅ Never expose API keys
- ✅ Rate limit email sending (already done!)
- ✅ Validate email addresses
- ✅ Monitor for abuse

---

## 📚 Resources

- **Resend Docs:** https://resend.com/docs
- **Email Testing:** https://resend.com/emails
- **Speed Insights:** https://vercel.com/docs/speed-insights
- **Vercel Analytics:** https://vercel.com/docs/analytics

---

## 🎉 You're All Set!

Your waitlist now has:
- ✅ Professional confirmation emails
- ✅ Admin notifications
- ✅ Speed monitoring
- ✅ Analytics tracking
- ✅ Production-ready setup

**Launch with confidence!** 🚀
