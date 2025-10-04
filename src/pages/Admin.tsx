import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  Users, 
  Mail, 
  TrendingUp, 
  AlertCircle,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  LogOut,
  Clock
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAdmin } from "@/contexts/AdminContext";
import AdminLogin from "@/components/AdminLogin";
import { Badge } from "@/components/ui/badge";

const Admin = () => {
  const [dailyTip, setDailyTip] = useState("");
  const { toast } = useToast();
  const { isAuthenticated, logout, stats, addDailyTip, getTodayTip, subscribers, dailyTips } = useAdmin();

  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  const handleSubmitTip = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!dailyTip.trim()) {
      toast({
        title: "Error",
        description: "Please enter a daily tip.",
        variant: "destructive",
      });
      return;
    }

    addDailyTip(dailyTip);
    
    toast({
      title: "Tip Saved! ✅",
      description: "The daily tip has been saved and will be used for today's newsletter.",
    });
    
    setDailyTip("");
  };

  const todayTip = getTodayTip();

  // Mock activity data - in production, this would come from your automation logs
  const recentActivity = [
    { 
      status: "success", 
      message: todayTip ? "Admin tip active - scraper skipped" : "Web scraper ready to fetch tips",
      time: "Just now" 
    },
    { 
      status: "success", 
      message: `${subscribers.length} subscribers synced`, 
      time: "5 minutes ago" 
    },
    { 
      status: "success", 
      message: "Newsletter system ready", 
      time: "1 hour ago" 
    },
    { 
      status: "info", 
      message: "Waiting for GitHub Actions setup", 
      time: "2 hours ago" 
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Site
                </Button>
              </Link>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            </div>
            <Button variant="outline" onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Subscribers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalSubscribers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Live count from subscriptions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Ready to Send</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeSubscribers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Active subscribers
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Expected Open Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.openRate}%</div>
              <p className="text-xs text-muted-foreground mt-1">
                Industry average
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Today's Tip Status</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {todayTip ? (
                <>
                  <div className="text-2xl font-bold text-green-600">Ready</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {todayTip.source === 'admin' ? 'Added by admin' : 'Auto-scraped'}
                  </p>
                </>
              ) : (
                <>
                  <div className="text-2xl font-bold text-yellow-600">Pending</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    No tip for today yet
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Manual Tip Entry */}
          <Card>
            <CardHeader>
              <CardTitle>Add Daily Tip Manually</CardTitle>
              <CardDescription>
                Admin tips take priority over web scraping. Add a tip here to override automation.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {todayTip && todayTip.source === 'admin' && (
                <div className="mb-4 p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <p className="text-sm font-medium text-green-900 dark:text-green-100">
                      Today's tip is already set
                    </p>
                  </div>
                  <p className="text-xs text-green-700 dark:text-green-300 line-clamp-2">
                    {todayTip.content}
                  </p>
                </div>
              )}
              
              <form onSubmit={handleSubmitTip} className="space-y-4">
                <Textarea
                  placeholder="Enter today's SQL tip or DBA insight..."
                  value={dailyTip}
                  onChange={(e) => setDailyTip(e.target.value)}
                  rows={6}
                  className="resize-none"
                />
                <Button type="submit" className="w-full">
                  {todayTip ? 'Update Today\'s Tip' : 'Save Daily Tip'}
                </Button>
                <p className="text-xs text-muted-foreground">
                  💡 <strong>Priority Logic:</strong> When you add a tip here, the web scraper will skip today and use your content instead.
                </p>
              </form>
            </CardContent>
          </Card>

          {/* Activity Log */}
          <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
              <CardDescription>
                Monitor automation workflows and system events.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3">
                    {activity.status === "success" && (
                      <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    )}
                    {activity.status === "warning" && (
                      <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                    )}
                    {activity.status === "error" && (
                      <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                    )}
                    {activity.status === "info" && (
                      <AlertCircle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.message}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Subscribers */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Recent Subscribers</CardTitle>
            <CardDescription>
              Live view of newsletter subscriptions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {subscribers.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No subscribers yet. Test the subscription form on the homepage!
              </p>
            ) : (
              <div className="space-y-2">
                {subscribers.slice(-10).reverse().map((subscriber, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{subscriber.email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="text-xs">
                        {subscriber.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(subscriber.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Automation Guide */}
        <Card>
          <CardHeader>
            <CardTitle>Web Scraping Priority Logic</CardTitle>
            <CardDescription>
              How the system decides between admin tips and automated scraping
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold">Admin Check</h3>
                  <p className="text-sm text-muted-foreground">
                    GitHub Actions first checks if an admin tip exists for today
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold">Priority Decision</h3>
                  <p className="text-sm text-muted-foreground">
                    If admin tip exists → Use it and skip scraping<br />
                    If no admin tip → Run web scraper to fetch content
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold">Newsletter Sending</h3>
                  <p className="text-sm text-muted-foreground">
                    Once content is ready (from either source), send to all active subscribers
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <h4 className="font-semibold mb-2">Implementation in GitHub Actions:</h4>
              <pre className="text-xs bg-background p-3 rounded overflow-x-auto">
{`# In your GitHub Actions workflow
- name: Check for Admin Tip
  run: |
    TODAY=$(date +%Y-%m-%d)
    ADMIN_TIP=$(node scripts/get-admin-tip.js $TODAY)
    
    if [ -n "$ADMIN_TIP" ]; then
      echo "Using admin tip, skipping scraper"
      echo "TIP_CONTENT=$ADMIN_TIP" >> $GITHUB_ENV
    else
      echo "No admin tip, running scraper"
      python scripts/scrape_tips.py
    fi`}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
