import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  Twitter, 
  Instagram, 
  MessageCircle as DiscordIcon, 
  Send as TelegramIcon, 
  Film as TikTokIcon,
  Youtube,
  BookOpen as DocsIcon,
  Github,
  Users,
  Star, 
  CheckCircle, 
  ExternalLink,
  Zap,
  ListFilter
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabaseClient';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const OFFICIAL_TASK_URLS = [
  'https://x.com/HypeHUB_Social',
  'https://t.me/HypeHubPortal',
  'https://www.instagram.com/hypehub_social/',
  'https://discord.gg/bJFgn3RH',
  'https://www.tiktok.com/@hypehub_social'
];

const PLATFORM_ICONS = {
  twitter: Twitter,
  telegram: TelegramIcon,
  instagram: Instagram,
  discord: DiscordIcon,
  tiktok: TikTokIcon,
  youtube: Youtube,
  docs: DocsIcon,
  github: Github,
  default: Star,
};

const EarnPoints = () => {
  const { user, updateUserPoints } = useAuth();
  const [allTasks, setAllTasks] = useState([]);
  const [completedDbTaskIds, setCompletedDbTaskIds] = useState(new Set());
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  const getPlatformIcon = (platform) => {
    const normalizedPlatform = platform?.toLowerCase() || 'default';
    return PLATFORM_ICONS[normalizedPlatform] || PLATFORM_ICONS.default;
  };

  const fetchAllTasksAndCompletions = useCallback(async () => {
    if (!user) return;
    setLoadingStatus(true);
    try {
      const { data: dbTasksData, error: dbTasksError } = await supabase
        .from('tasks')
        .select('id, user_id, url, reward, title, description, platform, action, created_at, is_official')
        .order('is_official', { ascending: false, nullsFirst: false }) 
        .order('reward', { ascending: false }) 
        .order('created_at', { ascending: false });

      if (dbTasksError) throw dbTasksError;
      
      const processedTasks = dbTasksData.map(task => ({
        ...task,
        dbId: task.id,
        isOfficial: task.is_official === true, // Rely directly on the DB flag
        icon: getPlatformIcon(task.platform)
      }));
      
      setAllTasks(processedTasks);
      
      const numericDbTaskIds = processedTasks.map(t => t.id).filter(id => id != null);

      if (numericDbTaskIds.length > 0) {
          const { data: completionsData, error: completionsError } = await supabase
            .from('task_completions')
            .select('task_id')
            .eq('user_id', user.id)
            .in('task_id', numericDbTaskIds);

          if (completionsError) throw completionsError;
          
          setCompletedDbTaskIds(new Set(completionsData.map(c => c.task_id)));
      } else {
        setCompletedDbTaskIds(new Set());
      }

    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast({ title: "Error loading tasks", description: error.message, variant: "destructive" });
      setAllTasks([]); 
    } finally {
      setLoadingStatus(false);
    }
  }, [user]);

  useEffect(() => {
    fetchAllTasksAndCompletions();
  }, [fetchAllTasksAndCompletions]);

  const handleCompleteTask = async (task) => {
    if (!user || !task.dbId) {
      toast({ title: "Error", description: "User not found or task ID missing.", variant: "destructive" });
      return;
    }

    if (completedDbTaskIds.has(task.dbId)) {
      toast({ title: "⚠️ Already Completed", description: "You've already earned points for this task!", variant: "default" });
      window.open(task.url, '_blank', 'noopener,noreferrer');
      return;
    }

    window.open(task.url, '_blank', 'noopener,noreferrer');
    toast({ title: "🔄 Verifying Task...", description: "We've opened the link. After you complete the action, we'll verify and award points." });

    setTimeout(async () => {
      try {
        // Users cannot complete their own non-official tasks.
        if (!task.isOfficial && task.user_id === user.id) {
            toast({ title: "Self-completion", description: "You cannot complete your own task.", variant: "destructive" });
            return;
        }

        const { error: completionError } = await supabase
          .from('task_completions')
          .insert({ task_id: task.dbId, user_id: user.id });

        if (completionError) {
          if (completionError.code === '23505') { // Unique violation
             toast({ title: "Already Completed", description: "Points already awarded for this task!", variant: "default" });
             setCompletedDbTaskIds(prev => new Set(prev).add(task.dbId));
             fetchAllTasksAndCompletions(); // Re-fetch to ensure UI consistency
             return;
          }
          throw completionError;
        }

        const newPoints = (user.points || 0) + task.reward;
        await updateUserPoints(newPoints);
        
        setCompletedDbTaskIds(prev => new Set(prev).add(task.dbId));
        
        await supabase.rpc('increment_task_completions', { task_id_to_increment: task.dbId });

        toast({ title: "🎉 Task Verified!", description: `You earned ${task.reward} points!`, variant: "default" });
        // No need to call fetchAllTasksAndCompletions here unless task data changes,
        // user points update is handled by AuthContext.

      } catch (error) {
        console.error("Verification failed error: ", error);
        toast({ title: "Verification Failed", description: error.message, variant: "destructive" });
      }
    }, 3000);
  };

  const uniquePlatforms = ['all', ...new Set(allTasks.map(task => task.platform?.toLowerCase()).filter(Boolean))];

  const filteredTasks = activeTab === 'all' 
    ? allTasks 
    : allTasks.filter(task => task.platform?.toLowerCase() === activeTab);


  return (
    <div className="space-y-8 p-4 md:p-6">
      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row justify-between items-center gap-4"
      >
        <div className="text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-2">Earn Hype Points</h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl">
            Complete tasks from HypeHUB and the community to boost your points!
          </p>
        </div>
        <div className="text-center md:text-right">
            <p className="text-sm text-gray-400">Your Balance</p>
            <p className="text-3xl font-bold text-gradient">{user?.points || 0} Points</p>
        </div>
      </motion.div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:flex lg:flex-wrap bg-gray-900/70 backdrop-blur-sm p-2 rounded-lg gap-2">
          {uniquePlatforms.map(platform => {
            const Icon = getPlatformIcon(platform);
            return (
              <TabsTrigger 
                key={platform} 
                value={platform}
                className="flex-grow data-[state=active]:bg-cyan-600 data-[state=active]:text-white text-gray-300 hover:bg-gray-800/50 p-3 rounded-md transition-all"
              >
                <Icon className="w-5 h-5 mr-2 opacity-80" />
                <span className="capitalize">{platform === 'all' ? 'All Tasks' : platform}</span>
              </TabsTrigger>
            )
          })}
        </TabsList>
      
        <TabsContent value={activeTab} className="mt-6">
          {loadingStatus && (
            <Card className="glass-container">
              <CardContent className="p-12 text-center">
                <Zap className="w-16 h-16 text-cyan-400 mx-auto mb-4 animate-pulse" />
                <h3 className="text-lg font-semibold text-white mb-2">Loading Tasks...</h3>
                <p className="text-gray-400">Fetching the latest opportunities to earn!</p>
              </CardContent>
            </Card>
          )}

          {!loadingStatus && filteredTasks.length === 0 && (
            <Card className="glass-container">
                <CardContent className="p-12 text-center">
                  <ListFilter className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">No Tasks Found</h3>
                  <p className="text-gray-400">
                    There are no tasks available for this category right now. Try another, or check back soon!
                  </p>
                  {activeTab === 'all' && <p className="text-gray-500 mt-2">Maybe create your own task?</p>}
                </CardContent>
              </Card>
          )}

          {!loadingStatus && filteredTasks.length > 0 && (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
            >
              {filteredTasks.map((task) => {
                const IconComponent = task.icon || Star;
                const isCompleted = completedDbTaskIds.has(task.dbId);
                
                return (
                  <motion.div
                    key={task.dbId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Card className={`glass-container overflow-hidden h-full flex flex-col ${isCompleted ? 'opacity-60 border-green-500/50' : 'hover:border-cyan-400/50 transition-all duration-300 ease-in-out hover:shadow-cyan-500/30 hover:shadow-2xl'}`}>
                      {task.isOfficial && (
                        <div className="absolute top-0 right-0 bg-yellow-500 text-black px-3 py-1 text-xs font-bold rounded-bl-lg z-10 flex items-center">
                          <Star className="w-3 h-3 mr-1 fill-current" /> OFFICIAL
                        </div>
                      )}
                      <CardContent className="p-6 flex flex-col flex-grow">
                        <div className="flex items-start space-x-4 mb-4">
                          <div className="w-12 h-12 rounded-lg bg-gray-800 flex-shrink-0 flex items-center justify-center">
                            <IconComponent className="w-7 h-7 text-cyan-400" />
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold text-white leading-tight">{task.title}</h3>
                            <p className="text-xs text-cyan-400 capitalize">{task.platform} - {task.action}</p>
                          </div>
                        </div>
                        <p className="text-gray-400 text-sm mb-6 flex-grow line-clamp-3">{task.description}</p>
                        
                        <div className="flex items-center justify-between mt-auto">
                          <div className="text-left">
                            <p className="text-2xl font-bold text-gradient">{task.reward}</p>
                            <p className="text-xs text-gray-400 -mt-1">points</p>
                          </div>
                          {isCompleted ? (
                            <Button disabled size="lg" className="bg-green-600 hover:bg-green-700 text-white font-semibold text-base">
                              <CheckCircle className="w-5 h-5 mr-2" />
                              Completed
                            </Button>
                          ) : (
                            <Button 
                              onClick={() => handleCompleteTask(task)} 
                              size="lg" 
                              className="turquoise-gradient text-black font-semibold hover:scale-105 transition-transform text-base"
                              disabled={!task.dbId || (!task.isOfficial && task.user_id === user.id)}
                            >
                              <ExternalLink className="w-5 h-5 mr-2" />
                              Do Task
                            </Button>
                          )}
                        </div>
                        {!task.isOfficial && task.user_id && <p className="text-xs text-gray-500 mt-2 text-right">Added by community</p>}
                        {!task.isOfficial && !task.user_id && <p className="text-xs text-gray-500 mt-2 text-right">Community Task (Legacy)</p>}
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EarnPoints;