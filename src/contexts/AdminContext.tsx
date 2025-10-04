import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Subscriber {
  email: string;
  timestamp: string;
  status: 'active' | 'unsubscribed';
}

interface DailyTip {
  content: string;
  date: string;
  source: 'admin' | 'scraper';
}

interface AdminContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  subscribers: Subscriber[];
  addSubscriber: (email: string) => void;
  dailyTips: DailyTip[];
  addDailyTip: (content: string) => void;
  getTodayTip: () => DailyTip | null;
  stats: {
    totalSubscribers: number;
    activeSubscribers: number;
    emailsSentToday: number;
    openRate: number;
  };
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

// Admin credentials - In production, use Lovable Cloud for proper authentication
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123';

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [dailyTips, setDailyTips] = useState<DailyTip[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedAuth = localStorage.getItem('admin_authenticated');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
    }

    const savedSubscribers = localStorage.getItem('newsletter_subscribers');
    if (savedSubscribers) {
      setSubscribers(JSON.parse(savedSubscribers));
    }

    const savedTips = localStorage.getItem('daily_tips');
    if (savedTips) {
      setDailyTips(JSON.parse(savedTips));
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem('admin_authenticated', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin_authenticated');
  };

  const addSubscriber = (email: string) => {
    const newSubscriber: Subscriber = {
      email,
      timestamp: new Date().toISOString(),
      status: 'active',
    };

    const updatedSubscribers = [...subscribers, newSubscriber];
    setSubscribers(updatedSubscribers);
    localStorage.setItem('newsletter_subscribers', JSON.stringify(updatedSubscribers));
  };

  const addDailyTip = (content: string) => {
    const today = new Date().toISOString().split('T')[0];
    
    // Remove any existing tip for today
    const filteredTips = dailyTips.filter(tip => tip.date !== today);
    
    const newTip: DailyTip = {
      content,
      date: today,
      source: 'admin',
    };

    const updatedTips = [newTip, ...filteredTips];
    setDailyTips(updatedTips);
    localStorage.setItem('daily_tips', JSON.stringify(updatedTips));
  };

  const getTodayTip = (): DailyTip | null => {
    const today = new Date().toISOString().split('T')[0];
    return dailyTips.find(tip => tip.date === today) || null;
  };

  const stats = {
    totalSubscribers: subscribers.length,
    activeSubscribers: subscribers.filter(s => s.status === 'active').length,
    emailsSentToday: subscribers.filter(s => s.status === 'active').length,
    openRate: 42.5, // Mock data - would come from email service in production
  };

  return (
    <AdminContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        subscribers,
        addSubscriber,
        dailyTips,
        addDailyTip,
        getTodayTip,
        stats,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
