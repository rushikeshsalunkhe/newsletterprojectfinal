# SQL Daily Newsletter Platform - Setup Guide

Welcome to your automated newsletter platform! This guide will help you complete the setup for full automation.

## ✅ What's Already Built

Your frontend is production-ready with:
- 🎨 Beautiful landing page with hero section
- 📧 Email subscription form
- 📊 Admin dashboard for monitoring
- 📱 Fully responsive design
- 🎯 SEO-optimized pages

## 🔧 Required Setup Steps

### 1. Google Forms Integration (15 minutes)

**Create Your Google Form:**
1. Go to [Google Forms](https://forms.google.com)
2. Create a new form with an email field
3. Click "Send" → Click the `<>` (link) icon
4. Copy the form URL (it looks like: `https://docs.google.com/forms/d/e/YOUR_FORM_ID/formResponse`)

**Get the Email Field Entry ID:**
1. Open your form and click "Preview"
2. Right-click on the email field → Inspect
3. Look for `name="entry.XXXXXXXXX"` (e.g., `entry.123456789`)
4. Copy this entry ID

**Update Your Code:**
1. Open `src/components/SubscribeSection.tsx`
2. Replace `YOUR_GOOGLE_FORM_URL_HERE` with your form URL
3. Replace `entry.emailAddress` with your actual entry ID

**Link to Google Sheets:**
1. In Google Forms, go to "Responses" tab
2. Click the Google Sheets icon to create a linked spreadsheet
3. All submissions will now automatically save to this sheet!

### 2. GitHub Actions for Automation

Create a `.github/workflows/send-newsletter.yml` file in your GitHub repository:

```yaml
name: Send Daily Newsletter

on:
  schedule:
    - cron: '0 6 * * *'  # Run daily at 6 AM UTC
  workflow_dispatch:  # Allow manual trigger

jobs:
  send-newsletter:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.10'
      
      - name: Install dependencies
        run: |
          pip install pandas requests sendgrid
      
      - name: Download subscriber list
        run: |
          # Export Google Sheets to CSV (see step 3 below)
          # Or sync from your repo's subscribers.csv file
          
      - name: Send newsletter
        env:
          SENDGRID_API_KEY: ${{ secrets.SENDGRID_API_KEY }}
        run: |
          python scripts/send_newsletter.py
```

### 3. Google Sheets to GitHub CSV Sync

**Option A: Using Zapier (Easiest)**
1. Create a [Zapier](https://zapier.com) account
2. Create a new Zap:
   - Trigger: Google Sheets → New/Updated Row
   - Action: GitHub → Update File (subscribers.csv)
3. Configure to run every day

**Option B: Using Google Apps Script (Free)**
1. In your Google Sheet, go to Extensions → Apps Script
2. Add this script:

```javascript
function exportToGitHub() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const data = sheet.getDataRange().getValues();
  
  // Convert to CSV
  const csv = data.map(row => row.join(',')).join('\n');
  
  // GitHub API details
  const token = 'YOUR_GITHUB_TOKEN';
  const repo = 'your-username/your-repo';
  const path = 'subscribers.csv';
  
  // Update file in GitHub
  const url = `https://api.github.com/repos/${repo}/contents/${path}`;
  // ... (implement GitHub API call)
}
```

3. Set up a trigger to run daily

### 4. Email Sending Setup

**Choose an Email Service:**
- [SendGrid](https://sendgrid.com) - 100 emails/day free
- [Mailgun](https://mailgun.com) - 5,000 emails/month free
- [Amazon SES](https://aws.amazon.com/ses/) - Very affordable at scale

**Create Newsletter Sending Script:**

Create `scripts/send_newsletter.py`:

```python
import os
import pandas as pd
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

# Load subscribers
subscribers = pd.read_csv('subscribers.csv')

# Load today's tip (from scraping or manual entry)
with open('content/daily_tip.txt', 'r') as f:
    daily_tip = f.read()

# Send emails
sg = SendGridAPIClient(os.environ.get('SENDGRID_API_KEY'))

for _, subscriber in subscribers.iterrows():
    message = Mail(
        from_email='newsletter@sqldaily.com',
        to_emails=subscriber['email'],
        subject='Your Daily SQL Tip',
        html_content=f'<h1>Daily SQL Tip</h1><p>{daily_tip}</p>'
    )
    
    try:
        sg.send(message)
        print(f"Sent to {subscriber['email']}")
    except Exception as e:
        print(f"Error sending to {subscriber['email']}: {e}")
```

### 5. Content Scraping (Optional)

Create `scripts/scrape_tips.py`:

```python
import requests
from bs4 import BeautifulSoup
import json
from datetime import datetime

def scrape_sql_tips():
    """Scrape SQL tips from various sources"""
    sources = [
        'https://www.sqlshack.com/category/sql-server/',
        'https://www.mssqltips.com/',
        # Add your sources
    ]
    
    tips = []
    for source in sources:
        response = requests.get(source)
        soup = BeautifulSoup(response.content, 'html.parser')
        # Parse content based on site structure
        # ...
        
    # Save to file
    with open('content/daily_tip.txt', 'w') as f:
        f.write(tips[0])  # Use first tip
    
    return tips

if __name__ == '__main__':
    scrape_sql_tips()
```

Add this to your GitHub Actions before sending emails.

### 6. Admin Authentication (Recommended)

**Enable Lovable Cloud for Built-in Auth:**
1. In Lovable, click "Connect Lovable Cloud"
2. Add authentication to your Admin page
3. Protect routes with login requirements

Alternatively, use a simple password:
```typescript
// In Admin.tsx
const [isAuthenticated, setIsAuthenticated] = useState(false);
const [password, setPassword] = useState('');

const handleLogin = () => {
  if (password === 'your-secure-password') {
    setIsAuthenticated(true);
  }
};
```

### 7. User Segmentation (Future Enhancement)

In your Google Sheet, add a "tier" column:
- `free` for free subscribers
- `premium` for paying subscribers

Update your sending script to filter:
```python
# Send only to premium users
premium_subscribers = subscribers[subscribers['tier'] == 'premium']
```

## 📝 Daily Workflow (Once Automated)

1. **6:00 AM** - GitHub Actions runs
2. Scraping script fetches fresh SQL tips
3. If scraping fails → Admin gets notified
4. Email sending script runs
5. Sends to all subscribers (or segmented list)
6. Logs results to admin dashboard

## 🚀 Deployment

**Frontend (Vercel):**
1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your repository
4. Deploy! (auto-deploys on every push)

**GitHub Secrets:**
Add these secrets in your GitHub repo settings:
- `SENDGRID_API_KEY`
- `GITHUB_TOKEN`
- Any other API keys

## 📊 Monitoring

Check your admin dashboard at `/admin` to view:
- Total subscribers
- Email send status
- Automation failures
- Manual tip entry (fallback)

## 🆘 Troubleshooting

**Subscribers not showing up?**
- Check Google Forms is linked to Google Sheets
- Verify CSV sync to GitHub is running

**Emails not sending?**
- Check GitHub Actions logs
- Verify email service API key in secrets
- Check spam folder

**Need help?**
The admin dashboard will show any automation failures so you can intervene manually.

---

## 🎉 You're All Set!

Your newsletter platform will now run fully automated. Focus on growing your subscriber base!

For questions or improvements, check the code comments or create an issue in your repository.
