#!/usr/bin/env python3
"""
Web Scraper for SQL Tips and DBA Best Practices

This script scrapes SQL tips from various educational websites.
It only runs if no admin tip is found for today.

Add your favorite SQL/DBA resources to the SOURCES list below.
"""

import requests
from bs4 import BeautifulSoup
import json
from datetime import datetime
import os

# SQL/DBA tip sources - customize these for your preferred content
SOURCES = [
    {
        'name': 'SQL Shack',
        'url': 'https://www.sqlshack.com/',
        'selector': 'article h2',  # Adjust based on site structure
    },
    {
        'name': 'MSSQLTips',
        'url': 'https://www.mssqltips.com/',
        'selector': '.tip-title',  # Adjust based on site structure
    },
]

def scrape_sql_tip(source):
    """Scrape a single source for SQL tips"""
    try:
        print(f"🔍 Scraping {source['name']}...")
        
        response = requests.get(source['url'], timeout=10)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Find tip content based on selector
        # This is a basic example - you'll need to customize for each source
        elements = soup.select(source['selector'])
        
        if elements:
            # Get the first tip found
            tip_text = elements[0].get_text(strip=True)
            print(f"✅ Found tip from {source['name']}")
            return tip_text
        else:
            print(f"⚠️ No content found at {source['name']}")
            return None
            
    except Exception as e:
        print(f"❌ Error scraping {source['name']}: {str(e)}")
        return None

def get_fallback_tips():
    """Fallback tips in case scraping fails"""
    fallback_tips = [
        "Use EXPLAIN ANALYZE to understand query performance and identify bottlenecks in your SQL queries.",
        "Always use parameterized queries to prevent SQL injection attacks and improve query plan reuse.",
        "Index your foreign keys! They're often used in JOIN conditions and can dramatically improve query performance.",
        "Use VACUUM regularly in PostgreSQL to reclaim storage and update statistics for better query planning.",
        "Keep your statistics up to date with ANALYZE to help the query optimizer make better decisions.",
    ]
    
    # Rotate through fallback tips based on day of year
    day_of_year = datetime.now().timetuple().tm_yday
    return fallback_tips[day_of_year % len(fallback_tips)]

def main():
    """Main scraping function"""
    print("🕷️ Starting SQL tip scraper...")
    
    # Try each source until we find a tip
    tip_content = None
    for source in SOURCES:
        tip_content = scrape_sql_tip(source)
        if tip_content:
            break
    
    # Use fallback if scraping failed
    if not tip_content:
        print("⚠️ Scraping failed, using fallback tip")
        tip_content = get_fallback_tips()
    
    # Ensure content directory exists
    os.makedirs('content', exist_ok=True)
    
    # Save the tip
    with open('content/daily_tip.txt', 'w', encoding='utf-8') as f:
        f.write(tip_content)
    
    print(f"✅ Tip saved to content/daily_tip.txt")
    print(f"Preview: {tip_content[:100]}...")
    
    return tip_content

if __name__ == '__main__':
    main()
