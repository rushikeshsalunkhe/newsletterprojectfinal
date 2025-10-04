/**
 * GitHub Actions Script: Check for Admin-Added Daily Tip
 * 
 * This script checks if an admin has manually added a tip for today.
 * If found, it returns the tip content so the web scraper can be skipped.
 * 
 * Usage in GitHub Actions:
 *   ADMIN_TIP=$(node scripts/get-admin-tip.js 2025-01-15)
 */

const fs = require('fs');
const path = require('path');

// Get the date argument (format: YYYY-MM-DD)
const targetDate = process.argv[2];

if (!targetDate) {
  console.error('Error: Please provide a date in YYYY-MM-DD format');
  process.exit(1);
}

// Path to the daily tips data file
// In production, this would sync from your localStorage or database
const tipsFilePath = path.join(__dirname, '..', 'data', 'daily_tips.json');

try {
  // Check if tips file exists
  if (!fs.existsSync(tipsFilePath)) {
    // No tips file means no admin tip for today
    process.exit(0);
  }

  // Read the tips file
  const tipsData = JSON.parse(fs.readFileSync(tipsFilePath, 'utf8'));
  
  // Find tip for the target date from admin source
  const todayTip = tipsData.find(
    tip => tip.date === targetDate && tip.source === 'admin'
  );

  if (todayTip) {
    // Output the tip content (will be captured by GitHub Actions)
    console.log(todayTip.content);
    process.exit(0);
  } else {
    // No admin tip found for this date
    process.exit(0);
  }
} catch (error) {
  console.error('Error reading tips file:', error.message);
  process.exit(1);
}
