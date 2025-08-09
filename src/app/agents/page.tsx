'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { 
  MapPin, 
  Phone, 
  Mail, 
  Star, 
  Search,
  Filter,
  Home,
  Briefcase,
  Award,
  Users,
  Calendar,
  MessageSquare,
  Building2,
  CheckCircle,
  TrendingUp
} from 'lucide-react'

// Mock agent data
const mockAgents = [
  {
    id: 1,
    name: "Sarah Johnson",
    title: "Senior Real Estate Agent",
    company: "Luxury Properties International",
    phone: "+1 (555) 123-4567",
    email: "sarah.johnson@luxuryproperties.com",
    location: "New York, NY",
    specialties: ["Luxury Homes", "Investment Properties", "First-Time Buyers"],
    experience: 12,
    rating: 4.9,
    reviews: 127,
    propertiesSold: 342,
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400",
    verified: true,
    topAgent: true
  },
  {
    id: 2,
    name: "Michael Chen",
    title: "Real Estate Broker",
    company: "Metropolitan Real Estate",
    phone: "+1 (555) 234-5678",
    email: "michael.chen@metrorealestate.com",
    location: "Los Angeles, CA",
    specialties: ["Commercial Properties", "Luxury Condos", "Investment Properties"],
    experience: 8,
    rating: 4.8,
    reviews: 89,
    propertiesSold: 215,
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
    verified: true,
    topAgent: true
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    title: "Real Estate Agent",
    company: "Family Homes Realty",
    phone: "+1 (555) 345-6789",
    email: "emily.rodriguez@familyhomes.com",
    location: "Chicago, IL",
    specialties: ["Family Homes", "First-Time Buyers", "Suburban Properties"],
    experience: 6,
    rating: 4.7,
    reviews: 64,
    propertiesSold: 156,
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400",
    verified: true,
    topAgent: false
  },
  {
    id: 4,
    name: "David Thompson",
    title: "Commercial Real Estate Specialist",
    company: "Commercial Properties Group",
    phone: "+1 (555) 456-7890",
    email: "david.thompson@commercialprop.com",
    location: "Miami, FL",
    specialties: ["Commercial Real Estate", "Office Spaces", "Retail Properties"],
    experience: 15,
    rating: 4.9,
    reviews: 143,
    propertiesSold: 89,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    verified: true,
    topAgent: true
  },
  {
    id: 5,
    name: "Lisa Wang",
    title: "Real Estate Agent",
    company: "Urban Living Realty",
    phone: "+1 (555) 567-8901",
    email: "lisa.wang@urbanliving.com",
    location: "Seattle, WA",
    specialties: ["Urban Properties", "Condos", "Luxury Apartments"],
    experience: 5,
    rating: 4.6,
    reviews: 42,
    propertiesSold: 98,
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
    verified: true,
    topAgent: false
  },
  {
    id: 6,
    name: "Robert Martinez",
    title: "Real Estate Broker",
    company: "Premium Properties",
    phone: "+1 (555) 678-9012",
    email: "robert.martinez@premiumproperties.com",
    location: "Austin, TX",
    specialties: ["Luxury Homes", "Ranch Properties", "Investment Properties"],
    experience: 10,
    rating: 4.8,
    reviews: 78,
    propertiesSold: 187,
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
    verified: true,
    topAgent: true
  }
]

const specialties = ["Luxury Homes", "Investment Properties", "First-Time Buyers", "Commercial Properties", "Family Homes", "Urban Properties", "Condos", "Ranch Properties"]

export default function AgentsPage() {
  const [agents] = useState(mockAgents)
  const [filteredAgents, setFilteredAgents] = useState(mockAgents)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSpecialty, setSelectedSpecialty] = useState('all')
  const [sortBy, setSortBy] = useState('rating')
  const [selectedAgent, setSelectedAgent] = useState<typeof mockAgents[0] | null>(null)
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  const applyFilters = () => {
    let filtered = agents

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(agent => 
        agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.specialties.some(specialty => 
          specialty.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    }

    // Specialty filter
    if (selectedSpecialty !== 'all') {
      filtered = filtered.filter(agent => 
        agent.specialties.includes(selectedSpecialty)
      )
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating
        case 'experience':
          return b.experience - a.experience
        case 'properties':
          return b.propertiesSold - a.propertiesSold
        case 'reviews':
          return b.reviews - a.reviews
        default:
          return 0
      }
    })

    setFilteredAgents(filtered)
  }

  const handleViewProfile = (agent: typeof mockAgents[0]) => {
    setSelectedAgent(agent)
    setIsProfileOpen(true)
  }

  useEffect(() => {
    applyFilters()
  }, [searchTerm, selectedSpecialty, sortBy])

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Hero Section */}
      <section className="relative pt-24 pb-12 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Find Your Perfect Real Estate
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Agent
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Connect with experienced, verified agents who will help you find your dream property
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-2 flex items-center space-x-2">
              <div className="flex-1 flex items-center space-x-2">
                <Search className="h-5 w-5 text-gray-400 ml-4" />
                <Input 
                  placeholder="Search agents by name, location, or specialty..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border-0 bg-transparent focus-visible:ring-0"
                />
              </div>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl px-6">
                Search
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Filters and Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Real Estate Agents
            </h2>
            <Badge variant="secondary" className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
              {filteredAgents.length} found
            </Badge>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
              <SelectTrigger className="w-full sm:w-48 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                <SelectValue placeholder="All Specialties" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Specialties</SelectItem>
                {specialties.map(specialty => (
                  <SelectItem key={specialty} value={specialty}>{specialty}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-48 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="experience">Most Experience</SelectItem>
                <SelectItem value="properties">Most Properties Sold</SelectItem>
                <SelectItem value="reviews">Most Reviews</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Agents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAgents.map(agent => (
            <Card key={agent.id} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white dark:bg-gray-800 overflow-hidden">
              <div className="relative">
                <img 
                  src={agent.image} 
                  alt={agent.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  {agent.verified && (
                    <Badge className="bg-green-500 text-white">
                      <Award className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                  {agent.topAgent && (
                    <Badge className="bg-blue-600 text-white">
                      <Star className="w-3 h-3 mr-1" />
                      Top Agent
                    </Badge>
                  )}
                </div>
              </div>
              
              <CardContent className="p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                    {agent.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                    {agent.title}
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    {agent.company}
                  </p>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <MapPin className="w-4 h-4 mr-2" />
                    {agent.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <Phone className="w-4 h-4 mr-2" />
                    {agent.phone}
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <Mail className="w-4 h-4 mr-2" />
                    {agent.email}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {agent.specialties.slice(0, 3).map(specialty => (
                    <Badge key={specialty} variant="outline" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                  {agent.specialties.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{agent.specialties.length - 3} more
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300 mb-4">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-500 mr-1" />
                    <span className="font-medium">{agent.rating}</span>
                    <span className="mx-1">•</span>
                    <span>{agent.reviews} reviews</span>
                  </div>
                  <div className="flex items-center">
                    <Briefcase className="w-4 h-4 mr-1" />
                    <span>{agent.experience} years</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <Home className="w-4 h-4 mr-1" />
                    <span>{agent.propertiesSold} sold</span>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleViewProfile(agent)}>
                      View Profile
                    </Button>
                    <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                      Contact
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredAgents.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No agents found
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Try adjusting your search criteria or filters
            </p>
          </div>
        )}
      </div>

      {/* Agent Profile Dialog */}
      <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
        <DialogContent className="max-w-5xl w-[95vw] max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800">
          {selectedAgent && (
            <div className="space-y-6">
              {/* Header */}
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <img 
                      src={selectedAgent.image} 
                      alt={selectedAgent.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {selectedAgent.name}
                </DialogTitle>
              </DialogHeader>

              {/* Hero Section */}
              <div className="relative rounded-lg overflow-hidden">
                <img 
                  src={selectedAgent.image} 
                  alt={selectedAgent.name}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex flex-wrap gap-2">
                    {selectedAgent.verified && (
                      <Badge className="bg-green-500 text-white">
                        <Award className="w-3 h-3 mr-1" />
                        Verified Agent
                      </Badge>
                    )}
                    {selectedAgent.topAgent && (
                      <Badge className="bg-blue-600 text-white">
                        <Star className="w-3 h-3 mr-1" />
                        Top Agent
                      </Badge>
                    )}
                    <Badge className="bg-purple-600 text-white">
                      <Briefcase className="w-3 h-3 mr-1" />
                      {selectedAgent.experience} years experience
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-w-0">
                <Card className="min-w-0">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-blue-600" />
                      Contact Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Mail className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm break-all min-w-0">{selectedAgent.email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      <span className="text-sm">{selectedAgent.phone}</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm break-words min-w-0">{selectedAgent.location}</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Building2 className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm break-words min-w-0">{selectedAgent.company}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="min-w-0">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                      Performance Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm">Rating</span>
                      </div>
                      <span className="font-semibold">{selectedAgent.rating}/5.0</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-blue-500" />
                        <span className="text-sm">Reviews</span>
                      </div>
                      <span className="font-semibold">{selectedAgent.reviews}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Home className="w-4 h-4 text-purple-500" />
                        <span className="text-sm">Properties Sold</span>
                      </div>
                      <span className="font-semibold">{selectedAgent.propertiesSold}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-orange-500" />
                        <span className="text-sm">Experience</span>
                      </div>
                      <span className="font-semibold">{selectedAgent.experience} years</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Specialties */}
              <Card className="min-w-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    Areas of Expertise
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {selectedAgent.specialties.map((specialty, index) => (
                      <Badge key={index} variant="outline" className="text-sm">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
                <Button variant="outline" className="flex-1">
                  <Phone className="w-4 h-4 mr-2" />
                  Call Now
                </Button>
                <Button variant="outline" className="flex-1">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Meeting
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}