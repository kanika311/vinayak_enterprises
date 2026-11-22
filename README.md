# Vinayak Enterprises — Web & Admin Platform

Manufacturer, Bulk Supplier & Distributor of Scientific Instruments, Laboratory Equipment, Human Anatomy Models, Microscopes, and Medical Training Products based in Ambala Cantt, Haryana, India.

Official Canonical Domain: `https://www.vinayakenterprisess.agency`

---

## Vercel Production Environment Settings

In your **Vercel Project Settings → Environment Variables**, ensure the following variables are configured:

| Variable | Recommended Production Value | Description |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://www.vinayakenterprisess.agency` | Canonical website domain used for metadataBase, sitemap, OpenGraph, JSON-LD schemas and hreflang |
| `CLIENT_URL` | `https://www.vinayakenterprisess.agency` | Server-side canonical URL fallback for API CORS and reset password emails |
| `NEXT_PUBLIC_API_URL` | `/api/v1` | Public API base path |
| `MONGODB_URI` | `mongodb+srv://...` | MongoDB Atlas production database connection string |
| `JWT_SECRET` | `...` | Secret key for JWT session encryption |
| `JWT_EXPIRES_IN` | `7d` | Token expiration |
| `CLOUDINARY_CLOUD_NAME` | `dd29usied` | Cloudinary CDN bucket |
| `CLOUDINARY_API_KEY` | `174528277852462` | Cloudinary API Key |
| `CLOUDINARY_API_SECRET` | `...` | Cloudinary API Secret |
| `SMTP_HOST` | `smtp.gmail.com` | Mailer SMTP server (optional) |
| `SMTP_PORT` | `587` | Mailer port (optional) |
| `SMTP_USER` | `...` | Mailer account (optional) |
| `SMTP_PASS` | `...` | Mailer app password (optional) |

---

## Local Development

```bash
# 1. Install dependencies
npm install

# 2. Run custom dev server (Next.js App Router + Express backend on port 3002)
npm run dev

# 3. Production Build
npm run build
```
