/**
 * Sync Script: Export Admin Tips from Browser to GitHub
 * 
 * This script would be run by a browser extension or automation tool
 * to sync the admin-added tips from localStorage to your GitHub repository.
 * 
 * You can also manually export tips by running this in your browser console:
 * 
 * const tips = localStorage.getItem('daily_tips');
 * console.log(tips);
 * 
 * Then save the output to data/daily_tips.json in your repo.
 */

// For use in browser console or automation
function exportAdminTips() {
  const tips = localStorage.getItem('daily_tips');
  
  if (!tips) {
    console.log('No tips found in localStorage');
    return null;
  }

  const tipsData = JSON.parse(tips);
  console.log('Found tips:', tipsData);
  
  // Create downloadable file
  const blob = new Blob([JSON.stringify(tipsData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'daily_tips.json';
  a.click();
  
  return tipsData;
}

// For GitHub Actions or Node.js environment
if (typeof window === 'undefined') {
  // Node.js environment
  console.log('Run this in the browser console on your admin page:');
  console.log('exportAdminTips()');
} else {
  // Browser environment - attach to window
  window.exportAdminTips = exportAdminTips;
  console.log('Function ready! Run: exportAdminTips()');
}
