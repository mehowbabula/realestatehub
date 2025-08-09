'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Users, 
  MessageSquare, 
  Star, 
  MapPin, 
  Heart, 
  Share2, 
  Video, 
  Image as ImageIcon,
  Phone,
  MessageCircle,
  Globe,
  Coffee,
  School,
  ShoppingBag,
  TreePine,
  Bus,
  Shield
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface NeighborhoodReview {
  id: string
  userName: string
  userAvatar: string
  rating: number
  date: string
  content: string
  neighborhood: string
  tags: string[]
  likes: number
  images: string[]
  videos: string[]
}

interface CommunityGroup {
  id: string
  name: string
  description: string
  members: number
  category: string
  isJoined: boolean
  platform: 'whatsapp' | 'telegram'
}

interface LocalBusiness {
  id: string
  name: string
  category: string
  rating: number
  reviews: number
  distance: string
  image: string
  isFavorite: boolean
}

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState('reviews')
  const [newReview, setNewReview] = useState('')
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('')
  const [rating, setRating] = useState(0)

  const neighborhoods = [
    'Downtown', 'Suburbs', 'Historic District', 'Waterfront', 'University Area'
  ]

  const reviews: NeighborhoodReview[] = [
    {
      id: "1",
      userName: "Sarah Johnson",
      userAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100",
      rating: 5,
      date: "2 days ago",
      content: "Amazing neighborhood! Very safe, great schools, and plenty of parks. The community is very welcoming and there are always events happening on weekends.",
      neighborhood: "Suburbs",
      tags: ["Family-friendly", "Safe", "Good Schools"],
      likes: 24,
      images: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=300"],
      videos: []
    },
    {
      id: "2",
      userName: "Mike Chen",
      userAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
      rating: 4,
      date: "1 week ago",
      content: "Great location for young professionals. Lots of restaurants and cafes within walking distance. The only downside is parking can be challenging on weekends.",
      neighborhood: "Downtown",
      tags: ["Nightlife", "Walkable", "Restaurants"],
      likes: 18,
      images: [],
      videos: ["https://example.com/video1"]
    },
    {
      id: "3",
      userName: "Emma Davis",
      userAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
      rating: 5,
      date: "3 days ago",
      content: "Perfect for families! The waterfront park is beautiful, and there's a great community center with activities for kids. Everyone is very friendly.",
      neighborhood: "Waterfront",
      tags: ["Family-friendly", "Parks", "Community"],
      likes: 31,
      images: ["https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=300"],
      videos: []
    }
  ]

  const communityGroups: CommunityGroup[] = [
    {
      id: "1",
      name: "Downtown Neighbors",
      description: "Connect with downtown residents and share local news, events, and recommendations",
      members: 1247,
      category: "General",
      isJoined: true,
      platform: "whatsapp"
    },
    {
      id: "2",
      name: "Suburban Parents Network",
      description: "Support group for parents in the suburbs - share tips, organize playdates, and discuss schools",
      members: 856,
      category: "Family",
      isJoined: false,
      platform: "telegram"
    },
    {
      id: "3",
      name: "Waterfront Living",
      description: "For residents who love waterfront living - share photos, events, and waterfront activities",
      members: 643,
      category: "Lifestyle",
      isJoined: false,
      platform: "whatsapp"
    },
    {
      id: "4",
      name: "University Area Students",
      description: "Connect with fellow students, find roommates, and discover student-friendly spots",
      members: 2103,
      category: "Students",
      isJoined: true,
      platform: "telegram"
    }
  ]

  const localBusinesses: LocalBusiness[] = [
    {
      id: "1",
      name: "Blue Bottle Coffee",
      category: "Cafe",
      rating: 4.8,
      reviews: 234,
      distance: "0.2 miles",
      image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=200",
      isFavorite: true
    },
    {
      id: "2",
      name: "Green Park Elementary",
      category: "School",
      rating: 4.9,
      reviews: 189,
      distance: "0.5 miles",
      image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=200",
      isFavorite: false
    },
    {
      id: "3",
      name: "Fresh Market",
      category: "Grocery",
      rating: 4.6,
      reviews: 156,
      distance: "0.3 miles",
      image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=200",
      isFavorite: true
    },
    {
      id: "4",
      name: "Central Park",
      category: "Park",
      rating: 4.7,
      reviews: 412,
      distance: "0.1 miles",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200",
      isFavorite: false
    }
  ]

  const handleSubmitReview = () => {
    if (!newReview.trim() || !selectedNeighborhood || rating === 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields and provide a rating.",
        variant: "destructive"
      })
      return
    }

    toast({
      title: "Review Posted!",
      description: "Your neighborhood review has been shared with the community.",
    })

    setNewReview('')
    setSelectedNeighborhood('')
    setRating(0)
  }

  const handleJoinGroup = (groupId: string) => {
    toast({
      title: "Joined Group!",
      description: "You've successfully joined the community group.",
    })
  }

  const renderStars = (rating: number, interactive = false) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating 
                ? 'text-yellow-500 fill-current' 
                : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
            onClick={interactive ? () => setRating(star) : undefined}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-orange-800 mb-2">
            Community & Neighborhood Reviews
          </h1>
          <p className="text-lg text-orange-600">
            Connect with neighbors, share experiences, and discover the real character of neighborhoods
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="reviews">Neighborhood Reviews</TabsTrigger>
            <TabsTrigger value="groups">Community Groups</TabsTrigger>
            <TabsTrigger value="local">Local Spots</TabsTrigger>
            <TabsTrigger value="insights">Area Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="reviews">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Reviews Feed */}
              <div className="lg:col-span-2 space-y-4">
                {reviews.map((review) => (
                  <Card key={review.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4 mb-4">
                        <Avatar>
                          <AvatarImage src={review.userAvatar} />
                          <AvatarFallback>{review.userName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-semibold">{review.userName}</h3>
                            <span className="text-sm text-gray-500">{review.date}</span>
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            {renderStars(review.rating)}
                            <Badge variant="secondary">{review.neighborhood}</Badge>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 mb-4">{review.content}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {review.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      
                      {review.images.length > 0 && (
                        <div className="grid grid-cols-3 gap-2 mb-4">
                          {review.images.map((image, index) => (
                            <img 
                              key={index}
                              src={image} 
                              alt={`Review image ${index + 1}`}
                              className="w-full h-20 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                            />
                          ))}
                        </div>
                      )}
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <button className="flex items-center gap-1 hover:text-red-500 transition-colors">
                          <Heart className="h-4 w-4" />
                          {review.likes}
                        </button>
                        <button className="flex items-center gap-1 hover:text-blue-500 transition-colors">
                          <MessageCircle className="h-4 w-4" />
                          Comment
                        </button>
                        <button className="flex items-center gap-1 hover:text-green-500 transition-colors">
                          <Share2 className="h-4 w-4" />
                          Share
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Write Review Sidebar */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Share Your Experience
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Neighborhood</label>
                    <select 
                      value={selectedNeighborhood}
                      onChange={(e) => setSelectedNeighborhood(e.target.value)}
                      className="w-full p-2 border rounded-lg"
                    >
                      <option value="">Select a neighborhood</option>
                      {neighborhoods.map(neighborhood => (
                        <option key={neighborhood} value={neighborhood}>{neighborhood}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Rating</label>
                    {renderStars(rating, true)}
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Your Review</label>
                    <Textarea
                      placeholder="Share your experience about this neighborhood..."
                      value={newReview}
                      onChange={(e) => setNewReview(e.target.value)}
                      rows={4}
                    />
                  </div>
                  
                  <Button onClick={handleSubmitReview} className="w-full">
                    Post Review
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="groups">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {communityGroups.map((group) => (
                <Card key={group.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-lg mb-1">{group.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{group.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {group.members.toLocaleString()} members
                          </span>
                          <Badge variant="outline">{group.category}</Badge>
                        </div>
                      </div>
                      <div className={`p-2 rounded-lg ${
                        group.platform === 'whatsapp' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {group.platform === 'whatsapp' ? (
                          <Phone className="h-5 w-5" />
                        ) : (
                          <MessageCircle className="h-5 w-5" />
                        )}
                      </div>
                    </div>
                    
                    <Button 
                      onClick={() => handleJoinGroup(group.id)}
                      className="w-full"
                      variant={group.isJoined ? "outline" : "default"}
                    >
                      {group.isJoined ? 'Joined' : 'Join Group'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="local">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {localBusinesses.map((business) => (
                <Card key={business.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="relative mb-3">
                      <img 
                        src={business.image} 
                        alt={business.name}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md">
                        <Heart className={`h-4 w-4 ${business.isFavorite ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
                      </button>
                    </div>
                    
                    <h3 className="font-semibold mb-1">{business.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{business.category}</p>
                    
                    <div className="flex items-center gap-2 mb-2">
                      {renderStars(Math.floor(business.rating))}
                      <span className="text-sm text-gray-600">({business.reviews})</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {business.distance}
                      </span>
                      <Button size="sm" variant="outline">
                        View
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="insights">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <Shield className="h-12 w-12 mx-auto mb-4 text-green-600" />
                  <h3 className="font-semibold mb-2">Safety Score</h3>
                  <div className="text-3xl font-bold text-green-600 mb-2">8.7/10</div>
                  <p className="text-sm text-gray-600">Very safe neighborhood with low crime rates</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <School className="h-12 w-12 mx-auto mb-4 text-blue-600" />
                  <h3 className="font-semibold mb-2">School Rating</h3>
                  <div className="text-3xl font-bold text-blue-600 mb-2">9.2/10</div>
                  <p className="text-sm text-gray-600">Excellent schools with high test scores</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <Coffee className="h-12 w-12 mx-auto mb-4 text-orange-600" />
                  <h3 className="font-semibold mb-2">Walkability</h3>
                  <div className="text-3xl font-bold text-orange-600 mb-2">85%</div>
                  <p className="text-sm text-gray-600">Very walkable with amenities nearby</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <Bus className="h-12 w-12 mx-auto mb-4 text-purple-600" />
                  <h3 className="font-semibold mb-2">Transportation</h3>
                  <div className="text-3xl font-bold text-purple-600 mb-2">7.8/10</div>
                  <p className="text-sm text-gray-600">Good public transport connections</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <TreePine className="h-12 w-12 mx-auto mb-4 text-green-600" />
                  <h3 className="font-semibold mb-2">Green Spaces</h3>
                  <div className="text-3xl font-bold text-green-600 mb-2">12 parks</div>
                  <p className="text-sm text-gray-600">Plenty of parks and recreational areas</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <ShoppingBag className="h-12 w-12 mx-auto mb-4 text-red-600" />
                  <h3 className="font-semibold mb-2">Shopping</h3>
                  <div className="text-3xl font-bold text-red-600 mb-2">8.5/10</div>
                  <p className="text-sm text-gray-600">Great variety of shopping options</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}