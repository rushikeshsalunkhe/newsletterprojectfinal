#!/usr/bin/env python3
"""
Newsletter Sending Script

Sends the daily SQL tip to all active subscribers using SendGrid.
Uses either admin-provided tip or web-scraped content.
"""

import os
import pandas as pd
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail, Email, To, Content
from datetime import datetime

def load_subscribers():
    """Load subscriber list from CSV"""
    try:
        # If using synced CSV from Google Sheets
        if os.path.exists('subscribers.csv'):
            df = pd.read_csv('subscribers.csv')
        else:
            # Fallback to sample/test data
            print("⚠️ No subscribers.csv found, using test mode")
            df = pd.DataFrame({
                'email': ['test@example.com'],
                'status': ['active']
            })
        
        # Filter for active subscribers only
        active = df[df['status'] == 'active']
        print(f"📊 Found {len(active)} active subscribers")
        return active
        
    except Exception as e:
        print(f"❌ Error loading subscribers: {str(e)}")
        return pd.DataFrame()

def load_tip_content():
    """Load today's tip content"""
    # First try environment variable (from admin tip)
    tip_content = os.environ.get('TIP_CONTENT')
    
    # If not in env, read from file (scraped content)
    if not tip_content:
        try:
            with open('content/daily_tip.txt', 'r', encoding='utf-8') as f:
                tip_content = f.read()
        except FileNotFoundError:
            tip_content = "No tip available for today."
    
    return tip_content

def create_email_html(tip_content, tip_source):
    """Create beautiful HTML email template"""
    return f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
            }}
            .header {{
                background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
                color: white;
                padding: 30px;
                text-align: center;
                border-radius: 10px 10px 0 0;
            }}
            .content {{
                background: #f9fafb;
                padding: 30px;
                border-radius: 0 0 10px 10px;
            }}
            .tip-box {{
                background: white;
                border-left: 4px solid #3b82f6;
                padding: 20px;
                margin: 20px 0;
                border-radius: 5px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }}
            .footer {{
                text-align: center;
                margin-top: 30px;
                font-size: 12px;
                color: #666;
            }}
            .badge {{
                display: inline-block;
                background: #10b981;
                color: white;
                padding: 4px 12px;
                border-radius: 12px;
                font-size: 11px;
                font-weight: 600;
                text-transform: uppercase;
            }}
        </style>
    </head>
    <body>
        <div class="header">
            <h1>🗄️ Your Daily SQL Tip</h1>
            <p>{datetime.now().strftime('%B %d, %Y')}</p>
        </div>
        <div class="content">
            <p>Hello SQL Enthusiast! 👋</p>
            
            <div class="tip-box">
                <div style="margin-bottom: 10px;">
                    <span class="badge">{'Curated by Admin' if tip_source == 'admin' else 'Auto-Generated'}</span>
                </div>
                <p style="font-size: 16px; line-height: 1.8;">
                    {tip_content}
                </p>
            </div>
            
            <p>Keep learning and happy querying! 🚀</p>
            
            <div class="footer">
                <p>You're receiving this because you subscribed to SQL Daily.</p>
                <p><a href="mailto:unsubscribe@sqldaily.com">Unsubscribe</a></p>
            </div>
        </div>
    </body>
    </html>
    """

def send_newsletter():
    """Main function to send newsletter"""
    print("📧 Starting newsletter send process...")
    
    # Load data
    subscribers = load_subscribers()
    tip_content = load_tip_content()
    tip_source = os.environ.get('TIP_SOURCE', 'scraper')
    
    if subscribers.empty:
        print("❌ No subscribers found, exiting")
        return
    
    # Initialize SendGrid
    api_key = os.environ.get('SENDGRID_API_KEY')
    if not api_key:
        print("❌ SENDGRID_API_KEY not found in environment variables")
        return
    
    sg = SendGridAPIClient(api_key)
    
    # Create email HTML
    html_content = create_email_html(tip_content, tip_source)
    
    # Send to each subscriber
    sent_count = 0
    failed_count = 0
    
    for _, subscriber in subscribers.iterrows():
        try:
            message = Mail(
                from_email=Email('newsletter@sqldaily.com', 'SQL Daily'),
                to_emails=To(subscriber['email']),
                subject=f"📚 Daily SQL Tip - {datetime.now().strftime('%B %d')}",
                html_content=Content("text/html", html_content)
            )
            
            response = sg.send(message)
            
            if response.status_code in [200, 201, 202]:
                sent_count += 1
                print(f"✅ Sent to {subscriber['email']}")
            else:
                failed_count += 1
                print(f"⚠️ Failed to send to {subscriber['email']}: {response.status_code}")
                
        except Exception as e:
            failed_count += 1
            print(f"❌ Error sending to {subscriber['email']}: {str(e)}")
    
    # Summary
    print(f"\n📊 Newsletter Send Summary:")
    print(f"   ✅ Successful: {sent_count}")
    print(f"   ❌ Failed: {failed_count}")
    print(f"   📝 Tip Source: {tip_source}")
    print(f"   📅 Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

if __name__ == '__main__':
    send_newsletter()
