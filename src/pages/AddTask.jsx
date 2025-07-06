import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Twitter, 
  Youtube, 
  Instagram, 
  MessageCircle as DiscordIcon,
  Send as TelegramIcon,
  Film as TikTokIcon,
  Link as GenericLinkIcon,
  Plus, 
  Star,
  DollarSign,
  Info
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'; // Updated Select import
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'; // Keep original Tabs for platform selection
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabaseClient';
import { Slider } from '@/components/ui/slider';


const AddTask = () => {
  const { user, updateUserPoints } = useAuth();
  const [selectedPlatformId, setSelectedPlatformId] = useState('twitter');
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    action: 'follow',
    url: '',
    reward: 50 
  });

  const platforms = [
    { id: 'twitter', name: 'Twitter / X', icon: Twitter, actions: [
        { id: 'follow', name: 'Follow Account', minReward: 25, defaultReward: 50 },
        { id: 'like', name: 'Like Post', minReward: 10, defaultReward: 20 },
        { id: 'retweet', name: 'Retweet / Repost', minReward: 15, defaultReward: 30 },
        { id: 'comment', name: 'Comment', minReward: 20, defaultReward: 40 }
    ]},
    { id: 'youtube', name: 'YouTube', icon: Youtube, actions: [
        { id: 'subscribe', name: 'Subscribe to Channel', minReward: 50, defaultReward: 75 },
        { id: 'like', name: 'Like Video', minReward: 15, defaultReward: 25 },
        { id: 'comment', name: 'Comment on Video', minReward: 25, defaultReward: 50 },
    ]},
    { id: 'instagram', name: 'Instagram', icon: Instagram, actions: [
        { id: 'follow', name: 'Follow Account', minReward: 25, defaultReward: 50 },
        { id: 'like', name: 'Like Post', minReward: 10, defaultReward: 20 },
        { id: 'comment', name: 'Comment on Post', minReward: 20, defaultReward: 40 },
    ]},
    { id: 'discord', name: 'Discord', icon: DiscordIcon, actions: [
        { id: 'join', name: 'Join Server', minReward: 75, defaultReward: 100 },
    ]},
    { id: 'telegram', name: 'Telegram', icon: TelegramIcon, actions: [
        { id: 'join', name: 'Join Channel/Group', minReward: 50, defaultReward: 75 },
    ]},
    { id: 'tiktok', name: 'TikTok', icon: TikTokIcon, actions: [
        { id: 'follow', name: 'Follow Account', minReward: 20, defaultReward: 40 },
        { id: 'like', name: 'Like Video', minReward: 10, defaultReward: 20 },
    ]},
    { id: 'other', name: 'Other URL', icon: GenericLinkIcon, actions: [
        { id: 'visit', name: 'Visit Website / URL', minReward: 10, defaultReward: 20 },
    ]},
  ];

  const currentPlatform = platforms.find(p => p.id === selectedPlatformId);
  
  useEffect(() => {
    if (currentPlatform) {
      const defaultAction = currentPlatform.actions[0];
      setTaskData(prev => ({
        ...prev,
        action: defaultAction.id,
        reward: defaultAction.defaultReward
      }));
    }
  }, [selectedPlatformId, currentPlatform]);
  
  const currentActionDetails = currentPlatform?.actions.find(a => a.id === taskData.action);

  const handleInputChange = (field, value) => {
    setTaskData(prev => ({ ...prev, [field]: value }));
  };

  const handlePlatformChange = (platformId) => {
    setSelectedPlatformId(platformId);
    // Reset related fields or set defaults for the new platform
    const newPlatform = platforms.find(p => p.id === platformId);
    if (newPlatform && newPlatform.actions.length > 0) {
      const firstAction = newPlatform.actions[0];
      setTaskData(prev => ({
        ...prev,
        action: firstAction.id,
        reward: firstAction.defaultReward,
        title: '', // Optionally reset title/desc
        description: '',
        url: '',
      }));
    }
  };

  const handleActionChange = (actionId) => {
    const actionDetails = currentPlatform?.actions.find(a => a.id === actionId);
    if (actionDetails) {
      setTaskData(prev => ({
        ...prev,
        action: actionId,
        reward: actionDetails.defaultReward, // Set to default reward for the new action
      }));
    }
  };
  
  const handleRewardChange = (value) => {
    // Slider gives an array, input gives a number
    const newReward = Array.isArray(value) ? value[0] : parseInt(value, 10);
    if (!isNaN(newReward)) {
      handleInputChange('reward', newReward);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast({ title: "⚠️ Authentication Error", description: "Please log in to create tasks.", variant: "destructive" });
      return;
    }

    if (!taskData.title || !taskData.description || !taskData.url) {
      toast({ title: "❌ Missing Information", description: "Please fill in all required fields.", variant: "destructive" });
      return;
    }

    if (!currentActionDetails) {
      toast({ title: "❌ Invalid Action", description: "Please select a valid action.", variant: "destructive" });
      return;
    }
    
    const minRewardForAction = currentActionDetails.minReward;
    if (taskData.reward < minRewardForAction) {
      toast({ title: "❌ Reward Too Low", description: `Minimum reward for this action is ${minRewardForAction} points.`, variant: "destructive" });
      return;
    }

    if (taskData.reward > user.points) {
      toast({ title: "❌ Insufficient Points", description: "You don't have enough points to fund this task.", variant: "destructive" });
      return;
    }

    try {
      const { data: insertedTask, error } = await supabase
        .from('tasks')
        .insert({
          user_id: user.id,
          title: taskData.title,
          description: taskData.description,
          platform: selectedPlatformId,
          action: taskData.action,
          url: taskData.url,
          reward: taskData.reward,
          completions: 0 // Initial completions
        })
        .select()
        .single();

      if (error) throw error;

      const newPoints = user.points - taskData.reward;
      await updateUserPoints(newPoints);

      toast({
        title: "🎉 Task Created Successfully!",
        description: `Your task "${insertedTask.title}" is live! ${taskData.reward} points deducted.`,
      });

      // Reset form
      const defaultAction = currentPlatform.actions[0];
      setTaskData({
        title: '',
        description: '',
        action: defaultAction.id,
        url: '',
        reward: defaultAction.defaultReward
      });

    } catch (error) {
      toast({
        title: "Database Error",
        description: `Failed to create task: ${error.message}`,
        variant: "destructive",
      });
    }
  };
  
  const maxReward = Math.max(currentActionDetails?.minReward || 10, user?.points || 10);


  return (
    <div className="space-y-6 p-4 md:p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">Create New Task ✨</h1>
          <p className="text-gray-400 text-base md:text-lg">Promote your content and reward HypeHUB users!</p>
        </div>
        <div className="shrink-0">
          <div className="text-right p-3 rounded-lg bg-gray-800/50 shadow-lg">
            <p className="text-xs text-gray-400 uppercase tracking-wider">Your Balance</p>
            <p className="text-2xl font-bold text-gradient">{user?.points || 0} Points</p>
          </div>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6 items-start">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:sticky lg:top-24"
        >
          <Card className="card-glow bg-black/40 backdrop-blur-lg border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">1. Choose Platform</CardTitle>
              <CardDescription>Select where your task is hosted.</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={selectedPlatformId} onValueChange={handlePlatformChange} orientation="vertical">
                <TabsList className="grid w-full grid-cols-1 bg-gray-900/50 h-auto rounded-md p-1 gap-1">
                  {platforms.map((platform) => {
                    const Icon = platform.icon;
                    return (
                      <TabsTrigger 
                        key={platform.id} 
                        value={platform.id}
                        className="flex items-center justify-start space-x-3 p-3 data-[state=active]:bg-cyan-600 data-[state=active]:text-white text-gray-200 hover:bg-gray-700/50 rounded-md transition-all text-sm"
                      >
                        <Icon className="w-5 h-5 shrink-0" />
                        <span>{platform.name}</span>
                      </TabsTrigger>
                    );
                  })}
                </TabsList>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card className="card-glow bg-black/40 backdrop-blur-lg border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                {currentPlatform && <currentPlatform.icon className="w-7 h-7 mr-3 text-cyan-400" />}
                2. Task Details for {currentPlatform?.name}
              </CardTitle>
              <CardDescription>Provide all necessary info for users to complete your task.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-white font-medium">Task Title *</Label>
                  <Input id="title" value={taskData.title} onChange={(e) => handleInputChange('title', e.target.value)} placeholder="e.g., Follow @HypeHub on Twitter" className="bg-gray-900/70 border-gray-700 text-white placeholder:text-gray-500" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-white font-medium">Description *</Label>
                  <Textarea id="description" value={taskData.description} onChange={(e) => handleInputChange('description', e.target.value)} placeholder="e.g., Click the link, follow our account, and help us grow!" className="bg-gray-900/70 border-gray-700 text-white min-h-[100px] placeholder:text-gray-500" />
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="action" className="text-white font-medium">Action Type *</Label>
                      <Select onValueChange={handleActionChange} value={taskData.action}>
                        <SelectTrigger className="w-full bg-gray-900/70 border-gray-700 text-white">
                          <SelectValue placeholder="Select action" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700 text-white">
                          {currentPlatform?.actions.map((action) => (
                            <SelectItem key={action.id} value={action.id} className="hover:bg-gray-700 focus:bg-gray-700">
                              {action.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="url" className="text-white font-medium">Target URL *</Label>
                        <Input id="url" type="url" value={taskData.url} onChange={(e) => handleInputChange('url', e.target.value)} placeholder="https://twitter.com/HypeHub" className="bg-gray-900/70 border-gray-700 text-white placeholder:text-gray-500" />
                    </div>
                </div>


                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                         <Label htmlFor="reward" className="text-white font-medium flex items-center">
                            <DollarSign className="w-4 h-4 mr-2 text-cyan-400"/>
                            Reward Points per Completion *
                        </Label>
                        <span className="text-sm text-cyan-400 font-bold">{taskData.reward} points</span>
                    </div>
                  
                    <Slider
                        id="reward"
                        min={currentActionDetails?.minReward || 10}
                        max={Math.min(user?.points || 1000, 10000)} // Cap max slider to 10k or user points
                        step={1}
                        value={[taskData.reward]}
                        onValueChange={handleRewardChange}
                        className="[&>span:first-child]:h-3 [&>span:first-child]:w-3 [&_[role=slider]]:bg-cyan-500 [&_[role=slider]]:shadow-md"
                    />
                    <div className="flex justify-between text-xs text-gray-400">
                        <span>Min: {currentActionDetails?.minReward || 10}</span>
                        <span>Max: {Math.min(user?.points || 1000, 10000)}</span>
                    </div>
                     {taskData.reward > (user?.points || 0) && (
                        <p className="text-sm text-red-500 flex items-center"><Info className="w-4 h-4 mr-1"/> Not enough points for this reward.</p>
                    )}
                </div>


                <Button type="submit" className="w-full h-12 turquoise-gradient text-black font-semibold text-base hover:scale-[1.02] transition-transform active:scale-[0.98]" disabled={!user || taskData.reward > (user?.points || 0) || !taskData.title || !taskData.url}>
                  <Plus className="w-5 h-5 mr-2" />
                  Create Task & Deduct {taskData.reward} Points
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="card-glow bg-black/40 backdrop-blur-lg border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center"><Star className="w-5 h-5 mr-2 text-yellow-400" />Task Creation Tips</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-x-6 gap-y-4 text-sm text-gray-400">
              <div className="p-3 bg-gray-800/30 rounded-md">
                <h4 className="text-white font-semibold mb-1">Higher Rewards = Faster Completion</h4>
                <p>Tasks with more points are prioritized and attract users quicker.</p>
              </div>
              <div className="p-3 bg-gray-800/30 rounded-md">
                <h4 className="text-white font-semibold mb-1">Be Specific & Clear</h4>
                <p>Ensure your title and description are precise. Vague tasks get ignored.</p>
              </div>
              <div className="p-3 bg-gray-800/30 rounded-md">
                <h4 className="text-white font-semibold mb-1">Verify Your URL</h4>
                <p>A correct and working link is crucial. Test it before submitting.</p>
              </div>
              <div className="p-3 bg-gray-800/30 rounded-md">
                <h4 className="text-white font-semibold mb-1">Set Fair Rewards</h4>
                <p>Balance reward points with task difficulty to encourage participation.</p>
              </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AddTask;