import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Bell, 
  CheckCircle, 
  Clock, 
  Star, 
  User, 
  TrendingUp,
  Twitter,
  Youtube,
  Instagram,
  MessageCircle,
  Trophy
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Notifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Load notifications from localStorage
    const savedNotifications = localStorage.getItem('hypehub_notifications');
    if (savedNotifications) {
      const parsed = JSON.parse(savedNotifications);
      setNotifications(parsed);
      setUnreadCount(parsed.filter(n => !n.read).length);
    } else {
      // Create some demo notifications
      const demoNotifications = [
        {
          id: '1',
          type: 'task_completed',
          title: 'Task Completed!',
          message: 'Someone followed your Twitter account',
          platform: 'twitter',
          points: 50,
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
          read: false
        },
        {
          id: '2',
          type: 'points_earned',
          title: 'Points Earned!',
          message: 'You earned 75 points for subscribing to a YouTube channel',
          platform: 'youtube',
          points: 75,
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
          read: false
        },
        {
          id: '3',
          type: 'task_created',
          title: 'Task Posted!',
          message: 'Your Instagram like task is now live',
          platform: 'instagram',
          points: 25,
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(), // 6 hours ago
          read: true
        },
        {
          id: '4',
          type: 'milestone',
          title: 'Milestone Reached!',
          message: 'Congratulations! You\'ve earned over 1000 points',
          points: 0,
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
          read: true
        }
      ];
      setNotifications(demoNotifications);
      setUnreadCount(demoNotifications.filter(n => !n.read).length);
      localStorage.setItem('hypehub_notifications', JSON.stringify(demoNotifications));
    }
  }, []);

  const markAsRead = (notificationId) => {
    const updatedNotifications = notifications.map(notification =>
      notification.id === notificationId
        ? { ...notification, read: true }
        : notification
    );
    setNotifications(updatedNotifications);
    setUnreadCount(updatedNotifications.filter(n => !n.read).length);
    localStorage.setItem('hypehub_notifications', JSON.stringify(updatedNotifications));
  };

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(notification => ({
      ...notification,
      read: true
    }));
    setNotifications(updatedNotifications);
    setUnreadCount(0);
    localStorage.setItem('hypehub_notifications', JSON.stringify(updatedNotifications));
  };

  const getNotificationIcon = (type, platform) => {
    if (platform) {
      const platformIcons = {
        twitter: Twitter,
        youtube: Youtube,
        instagram: Instagram,
        discord: MessageCircle,
        telegram: MessageCircle,
        reddit: MessageCircle
      };
      return platformIcons[platform] || Bell;
    }

    const typeIcons = {
      task_completed: CheckCircle,
      points_earned: Star,
      task_created: TrendingUp,
      milestone: Trophy,
      system: Bell
    };
    return typeIcons[type] || Bell;
  };

  const getNotificationColor = (type) => {
    const colors = {
      task_completed: 'text-green-400',
      points_earned: 'text-yellow-400',
      task_created: 'text-blue-400',
      milestone: 'text-purple-400',
      system: 'text-gray-400'
    };
    return colors[type] || 'text-gray-400';
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const unreadNotifications = notifications.filter(n => !n.read);
  const readNotifications = notifications.filter(n => n.read);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
            <Bell className="w-8 h-8 mr-3 text-cyan-400" />
            Notifications
            {unreadCount > 0 && (
              <span className="ml-3 bg-red-500 text-white text-sm px-2 py-1 rounded-full">
                {unreadCount}
              </span>
            )}
          </h1>
          <p className="text-gray-400">Stay updated with your HypeHUB activity!</p>
        </div>
        {unreadCount > 0 && (
          <div className="mt-4 lg:mt-0">
            <Button
              onClick={markAllAsRead}
              variant="outline"
              className="border-gray-700 text-white hover:bg-gray-800"
            >
              Mark All as Read
            </Button>
          </div>
        )}
      </motion.div>

      {/* Notifications Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-900">
            <TabsTrigger value="all" className="data-[state=active]:bg-cyan-600">
              All ({notifications.length})
            </TabsTrigger>
            <TabsTrigger value="unread" className="data-[state=active]:bg-cyan-600">
              Unread ({unreadCount})
            </TabsTrigger>
            <TabsTrigger value="read" className="data-[state=active]:bg-cyan-600">
              Read ({readNotifications.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <NotificationsList 
              notifications={notifications} 
              onMarkAsRead={markAsRead}
              formatTimeAgo={formatTimeAgo}
              getNotificationIcon={getNotificationIcon}
              getNotificationColor={getNotificationColor}
            />
          </TabsContent>

          <TabsContent value="unread" className="mt-6">
            <NotificationsList 
              notifications={unreadNotifications} 
              onMarkAsRead={markAsRead}
              formatTimeAgo={formatTimeAgo}
              getNotificationIcon={getNotificationIcon}
              getNotificationColor={getNotificationColor}
            />
          </TabsContent>

          <TabsContent value="read" className="mt-6">
            <NotificationsList 
              notifications={readNotifications} 
              onMarkAsRead={markAsRead}
              formatTimeAgo={formatTimeAgo}
              getNotificationIcon={getNotificationIcon}
              getNotificationColor={getNotificationColor}
            />
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

const NotificationsList = ({ 
  notifications, 
  onMarkAsRead, 
  formatTimeAgo, 
  getNotificationIcon, 
  getNotificationColor 
}) => {
  if (notifications.length === 0) {
    return (
      <Card className="card-glow bg-black/40 backdrop-blur-lg border-gray-800">
        <CardContent className="p-12 text-center">
          <Bell className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">No notifications</h3>
          <p className="text-gray-400">You're all caught up! Check back later for updates.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {notifications.map((notification, index) => {
        const Icon = getNotificationIcon(notification.type, notification.platform);
        const iconColor = getNotificationColor(notification.type);
        
        return (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card 
              className={`card-glow bg-black/40 backdrop-blur-lg border-gray-800 hover-lift cursor-pointer transition-all ${
                !notification.read ? 'ring-2 ring-cyan-400/30' : ''
              }`}
              onClick={() => !notification.read && onMarkAsRead(notification.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className={`w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center ${!notification.read ? 'ring-2 ring-cyan-400' : ''}`}>
                    <Icon className={`w-5 h-5 ${iconColor}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className={`font-semibold ${!notification.read ? 'text-white' : 'text-gray-300'}`}>
                          {notification.title}
                        </h3>
                        <p className="text-gray-400 mt-1">{notification.message}</p>
                        {notification.points > 0 && (
                          <p className="text-cyan-400 font-semibold mt-2">
                            +{notification.points} points
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">{formatTimeAgo(notification.timestamp)}</p>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 ml-auto"></div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};

export default Notifications;