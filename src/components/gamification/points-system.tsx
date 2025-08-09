'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Trophy, 
  Star, 
  Gift, 
  Target, 
  Clock, 
  Home, 
  Eye, 
  Heart, 
  Share2, 
  MapPin,
  TrendingUp,
  Award,
  Coins
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface UserPoints {
  total: number
  level: number
  nextLevelPoints: number
  currentLevelPoints: number
  streak: number
  weeklyPoints: number
}

interface Reward {
  id: string
  title: string
  description: string
  pointsRequired: number
  type: 'discount' | 'gift_card' | 'early_access' | 'nft'
  icon: any
  claimed: boolean
}

interface Achievement {
  id: string
  title: string
  description: string
  icon: any
  points: number
  unlocked: boolean
  progress: number
  maxProgress: number
}

export default function PointsSystem() {
  const [userPoints, setUserPoints] = useState<UserPoints>({
    total: 1250,
    level: 3,
    nextLevelPoints: 2000,
    currentLevelPoints: 1000,
    streak: 7,
    weeklyPoints: 450
  })

  const [rewards, setRewards] = useState<Reward[]>([
    {
      id: "1",
      title: "10% Discount",
      description: "Get 10% off your next property viewing fee",
      pointsRequired: 500,
      type: "discount",
      icon: Gift,
      claimed: false
    },
    {
      id: "2",
      title: "Amazon Gift Card",
      description: "$25 Amazon gift card",
      pointsRequired: 1000,
      type: "gift_card",
      icon: Gift,
      claimed: false
    },
    {
      id: "3",
      title: "Early Access",
      description: "Get 24-hour early access to new listings",
      pointsRequired: 1500,
      type: "early_access",
      icon: Clock,
      claimed: false
    },
    {
      id: "4",
      title: "Property NFT",
      description: "Exclusive NFT for viewed properties",
      pointsRequired: 3000,
      type: "nft",
      icon: Coins,
      claimed: false
    }
  ])

  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: "1",
      title: "Property Explorer",
      description: "View 50 properties",
      icon: Eye,
      points: 100,
      unlocked: true,
      progress: 50,
      maxProgress: 50
    },
    {
      id: "2",
      title: "Heart Collector",
      description: "Like 25 properties",
      icon: Heart,
      points: 150,
      unlocked: true,
      progress: 25,
      maxProgress: 25
    },
    {
      id: "3",
      title: "Social Sharer",
      description: "Share 10 properties",
      icon: Share2,
      points: 200,
      unlocked: false,
      progress: 7,
      maxProgress: 10
    },
    {
      id: "4",
      title: "Location Master",
      description: "Explore properties in 10 different cities",
      icon: MapPin,
      points: 300,
      unlocked: false,
      progress: 6,
      maxProgress: 10
    },
    {
      id: "5",
      title: "Week Warrior",
      description: "Maintain a 7-day streak",
      icon: Target,
      points: 500,
      unlocked: true,
      progress: 7,
      maxProgress: 7
    }
  ])

  const [dailyActions, setDailyActions] = useState([
    { id: "view", title: "View 5 Properties", points: 50, completed: false, progress: 0, target: 5, icon: Eye },
    { id: "like", title: "Like 3 Properties", points: 30, completed: false, progress: 0, target: 3, icon: Heart },
    { id: "share", title: "Share 1 Property", points: 40, completed: false, progress: 0, target: 1, icon: Share2 },
    { id: "tour", title: "Take Virtual Tour", points: 100, completed: false, progress: 0, target: 1, icon: Home }
  ])

  const handleClaimReward = (rewardId: string) => {
    const reward = rewards.find(r => r.id === rewardId)
    if (reward && userPoints.total >= reward.pointsRequired) {
      setRewards(rewards.map(r => 
        r.id === rewardId ? { ...r, claimed: true } : r
      ))
      
      toast({
        title: "Reward Claimed!",
        description: `You've successfully claimed ${reward.title}`,
      })
    }
  }

  const handleCompleteAction = (actionId: string) => {
    setDailyActions(dailyActions.map(action => {
      if (action.id === actionId && action.progress < action.target) {
        const newProgress = action.progress + 1
        const completed = newProgress >= action.target
        
        if (completed && !action.completed) {
          setUserPoints(prev => ({
            ...prev,
            total: prev.total + action.points,
            weeklyPoints: prev.weeklyPoints + action.points
          }))
          
          toast({
            title: "Action Completed!",
            description: `You earned ${action.points} points!`,
          })
        }
        
        return { ...action, progress: newProgress, completed }
      }
      return action
    }))
  }

  const levelProgress = ((userPoints.total - userPoints.currentLevelPoints) / 
    (userPoints.nextLevelPoints - userPoints.currentLevelPoints)) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-purple-800 mb-2">Property Explorer Rewards</h1>
          <p className="text-lg text-purple-600">Earn points, unlock achievements, and claim amazing rewards!</p>
        </div>

        {/* User Stats Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-6 w-6 text-yellow-500" />
              Your Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">{userPoints.total}</div>
                <div className="text-sm text-gray-600">Total Points</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">Level {userPoints.level}</div>
                <div className="text-sm text-gray-600">Current Level</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{userPoints.streak}</div>
                <div className="text-sm text-gray-600">Day Streak</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">{userPoints.weeklyPoints}</div>
                <div className="text-sm text-gray-600">Weekly Points</div>
              </div>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Level Progress</span>
                <span className="text-sm text-gray-600">
                  {userPoints.total} / {userPoints.nextLevelPoints} XP
                </span>
              </div>
              <Progress value={levelProgress} className="h-3" />
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="daily" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="daily">Daily Actions</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="rewards">Rewards</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          </TabsList>

          <TabsContent value="daily">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Daily Challenges
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {dailyActions.map((action) => {
                    const Icon = action.icon
                    return (
                      <Card key={action.id} className={`${action.completed ? 'bg-green-50 border-green-200' : ''}`}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Icon className="h-5 w-5 text-blue-600" />
                              <h3 className="font-semibold">{action.title}</h3>
                            </div>
                            <Badge className="bg-yellow-500">
                              +{action.points} pts
                            </Badge>
                          </div>
                          
                          <div className="mb-3">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm text-gray-600">Progress</span>
                              <span className="text-sm font-medium">
                                {action.progress}/{action.target}
                              </span>
                            </div>
                            <Progress 
                              value={(action.progress / action.target) * 100} 
                              className="h-2"
                            />
                          </div>
                          
                          {!action.completed && action.progress < action.target && (
                            <Button 
                              onClick={() => handleCompleteAction(action.id)}
                              className="w-full"
                              size="sm"
                            >
                              Complete Action
                            </Button>
                          )}
                          
                          {action.completed && (
                            <Badge className="w-full justify-center bg-green-500">
                              Completed!
                            </Badge>
                          )}
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {achievements.map((achievement) => {
                    const Icon = achievement.icon
                    return (
                      <Card key={achievement.id} className={`${achievement.unlocked ? 'bg-yellow-50 border-yellow-200' : 'bg-gray-50'}`}>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3 mb-2">
                            <Icon className={`h-8 w-8 ${achievement.unlocked ? 'text-yellow-600' : 'text-gray-400'}`} />
                            <div className="flex-1">
                              <h3 className="font-semibold">{achievement.title}</h3>
                              <p className="text-sm text-gray-600">{achievement.description}</p>
                            </div>
                            <Badge className={achievement.unlocked ? 'bg-yellow-500' : 'bg-gray-400'}>
                              +{achievement.points} pts
                            </Badge>
                          </div>
                          
                          <div className="mb-2">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm text-gray-600">Progress</span>
                              <span className="text-sm font-medium">
                                {achievement.progress}/{achievement.maxProgress}
                              </span>
                            </div>
                            <Progress 
                              value={(achievement.progress / achievement.maxProgress) * 100} 
                              className="h-2"
                            />
                          </div>
                          
                          {achievement.unlocked && (
                            <Badge className="w-full justify-center bg-green-500">
                              Unlocked!
                            </Badge>
                          )}
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rewards">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="h-5 w-5" />
                  Available Rewards
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {rewards.map((reward) => {
                    const Icon = reward.icon
                    const canAfford = userPoints.total >= reward.pointsRequired
                    
                    return (
                      <Card key={reward.id} className={`${reward.claimed ? 'bg-green-50 border-green-200' : canAfford ? 'border-purple-200' : 'bg-gray-50'}`}>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3 mb-3">
                            <Icon className={`h-8 w-8 ${reward.claimed ? 'text-green-600' : canAfford ? 'text-purple-600' : 'text-gray-400'}`} />
                            <div className="flex-1">
                              <h3 className="font-semibold">{reward.title}</h3>
                              <p className="text-sm text-gray-600">{reward.description}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Coins className="h-4 w-4 text-yellow-500" />
                              <span className="font-semibold">{reward.pointsRequired} pts</span>
                            </div>
                            
                            {reward.claimed ? (
                              <Badge className="bg-green-500">Claimed</Badge>
                            ) : canAfford ? (
                              <Button 
                                onClick={() => handleClaimReward(reward.id)}
                                size="sm"
                                className="bg-purple-600 hover:bg-purple-700"
                              >
                                Claim Reward
                              </Button>
                            ) : (
                              <Badge className="bg-gray-400">Need More Points</Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="leaderboard">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Weekly Leaderboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { rank: 1, name: "Sarah Johnson", points: 2850, avatar: "SJ" },
                    { rank: 2, name: "Mike Chen", points: 2650, avatar: "MC" },
                    { rank: 3, name: "Emma Davis", points: 2450, avatar: "ED" },
                    { rank: 4, name: "You", points: userPoints.weeklyPoints, avatar: "ME", isUser: true },
                    { rank: 5, name: "Alex Rodriguez", points: 1850, avatar: "AR" },
                  ].map((user) => (
                    <div key={user.rank} className={`flex items-center gap-3 p-3 rounded-lg ${user.isUser ? 'bg-purple-100 border-purple-200' : 'bg-gray-50'}`}>
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 font-bold text-sm">
                        {user.rank}
                      </div>
                      <div className="flex items-center gap-2 flex-1">
                        <div className="w-8 h-8 rounded-full bg-purple-200 flex items-center justify-center text-sm font-semibold">
                          {user.avatar}
                        </div>
                        <div>
                          <div className="font-semibold">{user.name}</div>
                          <div className="text-sm text-gray-600">{user.points} points</div>
                        </div>
                      </div>
                      {user.isUser && (
                        <Badge className="bg-purple-500">You</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}