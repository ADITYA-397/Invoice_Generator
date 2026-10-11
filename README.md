# Invoice Generator 🧾

An interactive, production-grade, print-ready Invoice Generator web app built with React 19, TypeScript, Tailwind CSS, and Lenis smooth scrolling.

## ✨ Features

- **Header Section**: In-place editable business name, logo upload/preset selector, invoice #, issue date, due date (Net 15, Net 30, Net 60 presets), and client details.
- **Dynamic Line Items**: Add, duplicate, reorder, and remove itemized rows with real-time subtotal calculation.
- **Financial Calculations**: Subtotal, configurable discount % and tax %, and grand total in tabular monospace figures.
- **Currency Support**: USD ($), EUR (€), GBP (£), CAD (CA$), AUD (A$), JPY (¥), and CHF (CHF).
- **Payment Instructions**: Formatted sections for Bank Wire/ACH, Stripe, PayPal, and Custom instructions.
- **Save as Template**: Store custom templates directly in browser `localStorage`.
- **Download PDF**: Print-ready stylesheet (`@media print`) that formats the invoice cleanly for A4/Letter paper export without UI chrome.
- **Smooth Scroll**: Powered by Lenis with exponential easing.

---

## 🚀 How to Deploy to GitHub

### Option 1: Automated GitHub Pages (Recommended)

1. Create a new repository on [GitHub](https://github.com/new) (e.g. `invoice-generator`).
2. Push this project to your repository:
   ```bash
   git branch -M main
   git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/invoice-generator.git
   git push -u origin main
   ```
3. In your GitHub repository:
   - Go to **Settings** > **Pages**.
   - Under **Build and deployment** > **Source**, choose **GitHub Actions**.
   - The included `.github/workflows/deploy.yml` workflow will automatically build and publish your site!

---

### Option 2: Deploy to Vercel or Netlify

- **Vercel**: Import your GitHub repo on [vercel.com](https://vercel.com). Framework preset: `Vite`. Build command: `npm run build`. Output directory: `dist`.
- **Netlify**: Import repository on [netlify.com](https://netlify.com). Build command: `npm run build`. Publish directory: `dist`.

---

## 💻 Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```
