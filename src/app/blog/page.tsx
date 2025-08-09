'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Share2, 
  Calendar, 
  TrendingUp,
  Users,
  Heart,
  MessageCircle,
  Play,
  Image as ImageIcon,
  FileText,
  Settings,
  Zap,
  Globe,
  Instagram,
  Youtube,
  Facebook,
  Linkedin,
  Twitter,
  Clock,
  Target,
  BarChart3,
  Bot,
  Save,
  Send,
  ExternalLink
} from 'lucide-react'

interface BlogPost {
  id: number
  title: string
  content: string
  excerpt: string
  status: 'draft' | 'published' | 'archived'
  publishedAt: string
  views: number
  likes: number
  comments: number
  tags: string[]
  featuredImage: string | null
  socialMediaPosts: SocialMediaPost[]
}

interface SocialMediaPost {
  id: number
  platform: 'instagram' | 'youtube' | 'facebook' | 'linkedin' | 'twitter'
  content: string
  status: 'scheduled' | 'posted' | 'failed'
  scheduledAt: string
  postedAt?: string
  engagement: {
    likes: number
    shares: number
    comments: number
  }
}

interface MarketingAutomation {
  id: number
  name: string
  platform: string
  isActive: boolean
  lastRun: string
  nextRun: string
  performance: {
    postsGenerated: number
    engagement: number
    leadsGenerated: number
  }
}

const mockBlogPosts: BlogPost[] = [
  {
    id: 1,
    title: "5 Tips for First-Time Home Buyers in 2024",
    content: "Buying your first home can be an exciting yet overwhelming experience...",
    excerpt: "Essential tips for navigating the real estate market as a first-time buyer...",
    status: 'published',
    publishedAt: '2024-01-15',
    views: 1250,
    likes: 45,
    comments: 12,
    tags: ['first-time buyers', 'tips', '2024 market'],
    featuredImage: null,
    socialMediaPosts: [
      {
        id: 1,
        platform: 'instagram',
        content: "🏠 5 essential tips for first-time home buyers! Link in bio! #realestate #homebuying #firsttimebuyer",
        status: 'posted',
        scheduledAt: '2024-01-15T10:00:00',
        postedAt: '2024-01-15T10:00:00',
        engagement: { likes: 89, shares: 12, comments: 8 }
      },
      {
        id: 2,
        platform: 'facebook',
        content: "Just published my latest article: 5 Tips for First-Time Home Buyers in 2024. Whether you're just starting your home search or ready to make an offer, these tips will help you navigate the process with confidence!",
        status: 'posted',
        scheduledAt: '2024-01-15T11:00:00',
        postedAt: '2024-01-15T11:00:00',
        engagement: { likes: 156, shares: 23, comments: 15 }
      }
    ]
  },
  {
    id: 2,
    title: "The Impact of Remote Work on Housing Demand",
    content: "The shift to remote work has fundamentally changed what people look for in a home...",
    excerpt: "How remote work trends are shaping the real estate market and buyer preferences...",
    status: 'draft',
    publishedAt: '',
    views: 0,
    likes: 0,
    comments: 0,
    tags: ['remote work', 'market trends', 'housing demand'],
    featuredImage: null,
    socialMediaPosts: []
  }
]

const mockAutomation: MarketingAutomation[] = [
  {
    id: 1,
    name: 'Instagram Auto-Posting',
    platform: 'Instagram',
    isActive: true,
    lastRun: '2024-01-25T09:00:00',
    nextRun: '2024-01-26T09:00:00',
    performance: {
      postsGenerated: 45,
      engagement: 1250,
      leadsGenerated: 12
    }
  },
  {
    id: 2,
    name: 'Facebook Content Sharing',
    platform: 'Facebook',
    isActive: true,
    lastRun: '2024-01-25T10:00:00',
    nextRun: '2024-01-26T10:00:00',
    performance: {
      postsGenerated: 38,
      engagement: 2100,
      leadsGenerated: 18
    }
  },
  {
    id: 3,
    name: 'LinkedIn Professional Posts',
    platform: 'LinkedIn',
    isActive: false,
    lastRun: '2024-01-20T14:00:00',
    nextRun: '2024-01-27T14:00:00',
    performance: {
      postsGenerated: 25,
      engagement: 890,
      leadsGenerated: 8
    }
  }
]

const platformIcons = {
  instagram: Instagram,
  youtube: Youtube,
  facebook: Facebook,
  linkedin: Linkedin,
  twitter: Twitter
}

const platformColors = {
  instagram: 'bg-pink-600',
  youtube: 'bg-red-600',
  facebook: 'bg-blue-600',
  linkedin: 'bg-sky-600',
  twitter: 'bg-black'
}

export default function BlogPage() {
  const router = useRouter()
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(mockBlogPosts)
  const [automation] = useState<MarketingAutomation[]>(mockAutomation)
  const [activeTab, setActiveTab] = useState('posts')
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [automationDialogOpen, setAutomationDialogOpen] = useState(false)
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null)
  const [aiGenerating, setAiGenerating] = useState(false)
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    excerpt: '',
    tags: [] as string[]
  })

  const handleCreatePost = async () => {
    // TODO: Implement post creation
    console.log('Creating post:', newPost)
    setCreateDialogOpen(false)
    setNewPost({ title: '', content: '', excerpt: '', tags: [] })
  }

  const generateAIContent = async () => {
    setAiGenerating(true)
    // Simulate AI content generation
    setTimeout(() => {
      setNewPost(prev => ({
        ...prev,
        content: `# ${prev.title}

## Introduction

In today's dynamic real estate market, staying informed about the latest trends and best practices is crucial for both buyers and sellers. As an experienced real estate professional, I'm here to share valuable insights that can help you make informed decisions.

## Key Points

### Market Analysis
The current real estate market shows interesting patterns that every potential buyer should be aware of. Interest rates, inventory levels, and buyer demand are all factors that influence market conditions.

### Expert Tips
Based on years of experience in the industry, I've compiled essential tips that can help you navigate the complexities of buying or selling property.

## Conclusion

Whether you're a first-time homebuyer or an experienced investor, understanding these key concepts will help you achieve your real estate goals. Feel free to reach out if you have any questions or need personalized advice.

---

*This content was generated with AI assistance and reviewed by [Your Name], your trusted real estate professional.*`,
        excerpt: `Expert insights on ${prev.title.toLowerCase()} and current market trends that every buyer and seller should know.`
      }))
      setAiGenerating(false)
    }, 3000)
  }

  const generateSocialMediaPosts = (postId: number) => {
    // TODO: Implement social media post generation
    console.log('Generating social media posts for post:', postId)
  }

  const scheduleSocialMediaPost = (postId: number, platform: string) => {
    // TODO: Implement social media scheduling
    console.log(`Scheduling ${platform} post for post:`, postId)
  }

  const toggleAutomation = (automationId: number) => {
    // TODO: Implement automation toggle
    console.log('Toggling automation:', automationId)
  }

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k'
    }
    return num.toString()
  }

  const getPlatformIcon = (platform: string) => {
    const Icon = platformIcons[platform as keyof typeof platformIcons]
    return Icon ? <Icon className="h-4 w-4" /> : <Globe className="h-4 w-4" />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <FileText className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Agent Blog & Marketing</h1>
                <p className="text-sm text-gray-600">Build your brand and automate your marketing</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => setAutomationDialogOpen(true)}>
                <Zap className="h-4 w-4 mr-2" />
                Automation
              </Button>
              <Button onClick={() => setCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                New Post
              </Button>
              <Button variant="outline" onClick={() => router.push('/dashboard')}>
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Posts</p>
                  <p className="text-2xl font-bold text-gray-900">{blogPosts.length}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Views</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatNumber(blogPosts.reduce((sum, post) => sum + post.views, 0))}
                  </p>
                </div>
                <Eye className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Social Engagement</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatNumber(automation.reduce((sum, auto) => sum + auto.performance.engagement, 0))}
                  </p>
                </div>
                <Share2 className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Leads Generated</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatNumber(automation.reduce((sum, auto) => sum + auto.performance.leadsGenerated, 0))}
                  </p>
                </div>
                <Target className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="posts">Blog Posts</TabsTrigger>
            <TabsTrigger value="social">Social Media</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="automation">Automation</TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Your Blog Posts</h2>
              <Button onClick={() => setCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create New Post
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {blogPosts.map(post => (
                <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-xl font-semibold">{post.title}</h3>
                          <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                            {post.status}
                          </Badge>
                        </div>
                        <p className="text-gray-600 mb-3">{post.excerpt}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Eye className="h-4 w-4 mr-1" />
                            <span>{formatNumber(post.views)}</span>
                          </div>
                          <div className="flex items-center">
                            <Heart className="h-4 w-4 mr-1" />
                            <span>{formatNumber(post.likes)}</span>
                          </div>
                          <div className="flex items-center">
                            <MessageCircle className="h-4 w-4 mr-1" />
                            <span>{formatNumber(post.comments)}</span>
                          </div>
                          {post.publishedAt && (
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => generateSocialMediaPosts(post.id)}
                        >
                          <Share2 className="h-4 w-4 mr-1" />
                          Share
                        </Button>
                      </div>
                      <Button size="sm" variant="outline">
                        <BarChart3 className="h-4 w-4 mr-1" />
                        Stats
                      </Button>
                    </div>

                    {post.socialMediaPosts.length > 0 && (
                      <div className="mt-4 pt-4 border-t">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Social Media Posts</h4>
                        <div className="flex space-x-2">
                          {post.socialMediaPosts.map(socialPost => (
                            <div
                              key={socialPost.id}
                              className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs text-white ${platformColors[socialPost.platform]}`}
                            >
                              {getPlatformIcon(socialPost.platform)}
                              <span>{socialPost.engagement.likes}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="social" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Social Media Management</h2>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Post
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {['instagram', 'facebook', 'linkedin', 'twitter', 'youtube'].map(platform => {
                const platformPosts = blogPosts.flatMap(post => 
                  post.socialMediaPosts.filter(sp => sp.platform === platform)
                )
                const totalEngagement = platformPosts.reduce((sum, post) => 
                  sum + post.engagement.likes + post.engagement.shares + post.engagement.comments, 0
                )

                return (
                  <Card key={platform}>
                    <CardHeader className="text-center">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2 ${
                        platform === 'instagram' ? 'bg-pink-100' :
                        platform === 'facebook' ? 'bg-blue-100' :
                        platform === 'linkedin' ? 'bg-sky-100' :
                        platform === 'twitter' ? 'bg-gray-100' :
                        'bg-red-100'
                      }`}>
                        {getPlatformIcon(platform)}
                      </div>
                      <CardTitle className="capitalize">{platform}</CardTitle>
                      <CardDescription>
                        {platformPosts.length} posts • {formatNumber(totalEngagement)} engagement
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <Button 
                          className="w-full" 
                          variant="outline"
                          onClick={() => scheduleSocialMediaPost(1, platform)}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Schedule Post
                        </Button>
                        <Button className="w-full">
                          <Bot className="h-4 w-4 mr-2" />
                          Generate with AI
                        </Button>
                        <Button variant="outline" className="w-full">
                          <BarChart3 className="h-4 w-4 mr-2" />
                          View Analytics
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Content Analytics</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Posts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {blogPosts
                      .filter(post => post.status === 'published')
                      .sort((a, b) => b.views - a.views)
                      .slice(0, 5)
                      .map(post => (
                        <div key={post.id} className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium">{post.title}</h4>
                            <p className="text-sm text-gray-600">{formatNumber(post.views)} views</p>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center space-x-1 text-sm">
                              <Heart className="h-3 w-3" />
                              <span>{formatNumber(post.likes)}</span>
                            </div>
                            <div className="flex items-center space-x-1 text-sm">
                              <MessageCircle className="h-3 w-3" />
                              <span>{formatNumber(post.comments)}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Social Media Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(
                      blogPosts.flatMap(post => post.socialMediaPosts).reduce((acc, post) => {
                        if (!acc[post.platform]) {
                          acc[post.platform] = { likes: 0, shares: 0, comments: 0, posts: 0 }
                        }
                        acc[post.platform].likes += post.engagement.likes
                        acc[post.platform].shares += post.engagement.shares
                        acc[post.platform].comments += post.engagement.comments
                        acc[post.platform].posts += 1
                        return acc
                      }, {} as Record<string, { likes: number; shares: number; comments: number; posts: number }>)
                    ).map(([platform, stats]) => (
                      <div key={platform} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {getPlatformIcon(platform)}
                          <span className="capitalize font-medium">{platform}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{formatNumber(stats.likes + stats.shares + stats.comments)} engagement</p>
                          <p className="text-xs text-gray-600">{stats.posts} posts</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="automation" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Marketing Automation</h2>
              <Button onClick={() => setAutomationDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                New Automation
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {automation.map(auto => (
                <Card key={auto.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{auto.name}</CardTitle>
                      <Switch
                        checked={auto.isActive}
                        onCheckedChange={() => toggleAutomation(auto.id)}
                      />
                    </div>
                    <CardDescription className="capitalize">{auto.platform}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Posts Generated</p>
                          <p className="font-semibold">{auto.performance.postsGenerated}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Leads Generated</p>
                          <p className="font-semibold">{auto.performance.leadsGenerated}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Last Run</span>
                          <span>{new Date(auto.lastRun).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Next Run</span>
                          <span>{new Date(auto.nextRun).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="pt-2 border-t">
                        <p className="text-sm text-gray-600 mb-1">Engagement</p>
                        <p className="font-semibold">{formatNumber(auto.performance.engagement)}</p>
                      </div>

                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Settings className="h-4 w-4 mr-1" />
                          Configure
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <Play className="h-4 w-4 mr-1" />
                          Run Now
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Create Post Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Blog Post</DialogTitle>
            <DialogDescription>
              Write a new blog post and automatically generate social media content
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Post Title</Label>
              <Input
                id="title"
                placeholder="Enter your blog post title"
                value={newPost.title}
                onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea
                id="excerpt"
                placeholder="Write a brief excerpt for your post"
                value={newPost.excerpt}
                onChange={(e) => setNewPost(prev => ({ ...prev, excerpt: e.target.value }))}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="content">Content</Label>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={generateAIContent}
                  disabled={aiGenerating || !newPost.title}
                >
                  {aiGenerating ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600 mr-2"></div>
                      Generating...
                    </div>
                  ) : (
                    <>
                      <Bot className="h-4 w-4 mr-2" />
                      Generate with AI
                    </>
                  )}
                </Button>
              </div>
              <Textarea
                id="content"
                placeholder="Write your blog post content or use AI to generate it..."
                value={newPost.content}
                onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                rows={12}
              />
            </div>

            <div className="space-y-2">
              <Label>Tags</Label>
              <Input
                placeholder="Enter tags separated by commas"
                value={newPost.tags.join(', ')}
                onChange={(e) => setNewPost(prev => ({ 
                  ...prev, 
                  tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                }))}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreatePost} disabled={!newPost.title || !newPost.content}>
                <Save className="h-4 w-4 mr-2" />
                Save as Draft
              </Button>
              <Button onClick={handleCreatePost} disabled={!newPost.title || !newPost.content}>
                <Send className="h-4 w-4 mr-2" />
                Publish
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Automation Setup Dialog */}
      <Dialog open={automationDialogOpen} onOpenChange={setAutomationDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Setup Marketing Automation</DialogTitle>
            <DialogDescription>
              Connect your social media accounts and configure automated posting
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold">Connect Platforms</h3>
              <div className="grid grid-cols-2 gap-4">
                {['instagram', 'facebook', 'linkedin', 'twitter', 'youtube'].map(platform => (
                  <Card key={platform} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4 text-center">
                      {getPlatformIcon(platform)}
                      <p className="mt-2 font-medium capitalize">{platform}</p>
                      <Button size="sm" className="mt-2" variant="outline">
                        Connect
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Automation Rules</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Auto-post new blog content</p>
                    <p className="text-sm text-gray-600">Automatically share new posts to connected platforms</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Generate social media snippets</p>
                    <p className="text-sm text-gray-600">Create platform-specific content from blog posts</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Optimal posting times</p>
                    <p className="text-sm text-gray-600">Schedule posts for maximum engagement</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setAutomationDialogOpen(false)}>
                Cancel
              </Button>
              <Button>
                Save Configuration
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}