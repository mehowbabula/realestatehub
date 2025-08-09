'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { ThemeToggle } from '@/components/theme-toggle'
import ChatComponent from '@/components/chat/chat-component'
import MonitoringDashboard from '@/components/monitoring/monitoring-dashboard'
import { useSession, signOut } from 'next-auth/react'
import { useEffect } from 'react'
import { 
  Home, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  MessageSquare, 
  TrendingUp,
  Users,
  Calendar,
  DollarSign,
  Star,
  MapPin,
  Bed,
  Bath,
  Car,
  CheckCircle,
  Clock,
  Archive,
  Building2,
  User,
  Settings,
  LogOut,
  AlertTriangle,
  MoreHorizontal,
  FileText,
  Phone,
  Building,
  BarChart3,
  Activity,
  Target,
  Zap,
  Award,
  Briefcase
} from 'lucide-react'

interface Property {
  id: number
  title: string
  price: number
  location: string
  type: string
  bedrooms: number
  bathrooms: number
  area: number
  status: 'active' | 'pending' | 'archived'
  archivedType?: 'sold' | 'removed'
  views: number
  leads: number
  image: string
  dateAdded: string
}

interface Lead {
  id: number
  name: string
  email: string
  phone: string
  property: string
  message: string
  date: string
  status: 'new' | 'contacted' | 'qualified' | 'closed'
}

const mockProperties: Property[] = [
  {
    id: 1,
    title: "Luxury Downtown Penthouse",
    price: 850000,
    location: "New York, NY",
    type: "Apartment",
    bedrooms: 3,
    bathrooms: 2,
    area: 185,
    status: "active",
    views: 245,
    leads: 12,
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400",
    dateAdded: "2024-01-15"
  },
  {
    id: 2,
    title: "Modern Family Villa",
    price: 1200000,
    location: "Los Angeles, CA",
    type: "Villa",
    bedrooms: 4,
    bathrooms: 3,
    area: 250,
    status: "active",
    views: 189,
    leads: 8,
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400",
    dateAdded: "2024-01-20"
  },
  {
    id: 3,
    title: "Charming Townhouse",
    price: 650000,
    location: "Chicago, IL",
    type: "Townhouse",
    bedrooms: 2,
    bathrooms: 2,
    area: 120,
    status: "pending",
    views: 156,
    leads: 5,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400",
    dateAdded: "2024-02-01"
  },
  {
    id: 4,
    title: "Waterfront Condo",
    price: 950000,
    location: "Miami, FL",
    type: "Condo",
    bedrooms: 2,
    bathrooms: 2,
    area: 140,
    status: "archived",
    archivedType: "sold",
    views: 312,
    leads: 18,
    image: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=400",
    dateAdded: "2023-12-10"
  }
]

const mockLeads: Lead[] = [
  {
    id: 1,
    name: "John Smith",
    email: "john.smith@email.com",
    phone: "+1 (555) 123-4567",
    property: "Luxury Downtown Penthouse",
    message: "I'm interested in scheduling a viewing for this property.",
    date: "2024-01-25",
    status: "new"
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah.j@email.com",
    phone: "+1 (555) 987-6543",
    property: "Modern Family Villa",
    message: "Can you provide more information about the neighborhood?",
    date: "2024-01-24",
    status: "contacted"
  },
  {
    id: 3,
    name: "Mike Davis",
    email: "mike.davis@email.com",
    phone: "+1 (555) 456-7890",
    property: "Charming Townhouse",
    message: "I'd like to make an offer on this property.",
    date: "2024-01-23",
    status: "qualified"
  }
]

const stats = {
  totalListings: 4,
  activeListings: 2,
  pendingListings: 1,
  archivedListings: 1,
  totalViews: 902,
  totalLeads: 43,
  thisMonthLeads: 12,
  conversionRate: 15.5
}

export default function DashboardPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const user = (session?.user as any) || null
  
  const [properties, setProperties] = useState<Property[]>(mockProperties)
  const [leads] = useState<Lead[]>(mockLeads)
  const [activeTab, setActiveTab] = useState('overview')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [statusDialogOpen, setStatusDialogOpen] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [newStatus, setNewStatus] = useState<'active' | 'pending' | 'archived'>('active')
  const [archivedType, setArchivedType] = useState<'sold' | 'removed'>('sold')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [leadFilterStatus, setLeadFilterStatus] = useState<string>('all')
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [leadDetailsOpen, setLeadDetailsOpen] = useState(false)
  
  useEffect(() => {
    // Add a small delay to ensure auth context is properly initialized
    const timer = setTimeout(() => {
      if (status !== 'loading' && !user) {
        router.push('/')
      }
    }, 500)
    
    return () => clearTimeout(timer)
  }, [user, status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to home
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(price)
  }

  const handlePropertyAction = (propertyId: number, action: string) => {
    const property = properties.find(p => p.id === propertyId)
    if (!property) return

    switch (action) {
      case 'edit':
        router.push(`/add-listing?edit=${propertyId}`)
        break
      case 'delete':
        setSelectedProperty(property)
        setDeleteDialogOpen(true)
        break
      case 'status':
        setSelectedProperty(property)
        setNewStatus(property.status)
        setStatusDialogOpen(true)
        break
      default:
        console.log(`Property ${propertyId} - ${action}`)
    }
  }

  const confirmDelete = () => {
    if (selectedProperty) {
      setProperties(prev => prev.filter(p => p.id !== selectedProperty.id))
      setDeleteDialogOpen(false)
      setSelectedProperty(null)
    }
  }

  const confirmStatusChange = () => {
    if (selectedProperty) {
      setProperties(prev => prev.map(p => 
        p.id === selectedProperty.id 
          ? { 
              ...p, 
              status: newStatus,
              archivedType: newStatus === 'archived' ? archivedType : undefined
            } as Property
          : p
      ))
      setStatusDialogOpen(false)
      setSelectedProperty(null)
    }
  }

  const filteredProperties = filterStatus === 'all' 
    ? properties 
    : properties.filter(p => p.status === filterStatus)

  const filteredLeads = leadFilterStatus === 'all' 
    ? leads 
    : leads.filter(l => l.status === leadFilterStatus)

  const handleLeadAction = (leadId: number, action: string) => {
    const lead = leads.find(l => l.id === leadId)
    if (!lead) return

    switch (action) {
      case 'view':
        setSelectedLead(lead)
        setLeadDetailsOpen(true)
        break
      case 'contact':
        setSelectedLead(lead)
        setLeadDetailsOpen(true)
        break
      default:
        console.log(`Lead ${leadId} - ${action}`)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'archived': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
      case 'new': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'contacted': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      case 'qualified': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
      case 'closed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const isNewAgent = properties.length === 0

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Welcome back, {user.name}!
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Here's what's happening with your real estate business today.
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-2">
              <div className="text-right">
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</div>
                <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  $2.4M
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center">
                  <Home className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="text-right">
                  <div className="text-sm text-green-600 dark:text-green-400 font-medium">+12%</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">vs last month</div>
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalListings}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Listings</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-xl flex items-center justify-center">
                  <Eye className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="text-right">
                  <div className="text-sm text-green-600 dark:text-green-400 font-medium">+8%</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">vs last month</div>
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalViews.toLocaleString()}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Views</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-xl flex items-center justify-center">
                  <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="text-right">
                  <div className="text-sm text-green-600 dark:text-green-400 font-medium">+15%</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">vs last month</div>
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalLeads}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Leads</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-xl flex items-center justify-center">
                  <Target className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div className="text-right">
                  <div className="text-sm text-green-600 dark:text-green-400 font-medium">+3%</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">vs last month</div>
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.conversionRate}%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Conversion Rate</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="properties">Properties</TabsTrigger>
            <TabsTrigger value="leads">Leads</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5" />
                    <span>Recent Activity</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">New lead received</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">2 minutes ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Property view increased</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">1 hour ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">New listing added</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">3 hours ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5" />
                    <span>Upcoming Tasks</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Property viewing</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Today, 2:00 PM</p>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        Scheduled
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Follow up with lead</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Tomorrow, 10:00 AM</p>
                      </div>
                      <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                        Pending
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">List new property</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Friday, 3:00 PM</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        Planned
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="properties" className="space-y-6">
            {/* Load real listings */}
            <div className="flex items-center justify-between">
              <Button variant="outline" size="sm" onClick={async () => {
                try {
                  const res = await fetch('/api/listings')
                  const data = await res.json()
                  const mapped: Property[] = (data.listings || []).map((l: any) => ({
                    id: l.id,
                    title: l.title,
                    price: l.price,
                    location: l.location,
                    type: l.type,
                    bedrooms: 0,
                    bathrooms: 0,
                    area: 0,
                    status: (l.status as any) as 'active'|'pending'|'archived',
                    views: 0,
                    leads: 0,
                    image: l.images?.[0]?.url || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400',
                    dateAdded: new Date(l.createdAt).toISOString().slice(0,10),
                  }))
                  setProperties(mapped)
                } catch {}
              }}>
                Refresh Listings
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Properties</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={() => router.push('/add-listing')}>
                <Plus className="h-4 w-4 mr-2" />
                Add Property
              </Button>
            </div>

            <div className="grid gap-6">
              {filteredProperties.map((property) => (
                <Card key={property.id} className="bg-white dark:bg-gray-800 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                      <div className="lg:w-48 lg:h-32 rounded-lg overflow-hidden">
                        <img 
                          src={property.image} 
                          alt={property.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="flex-1 space-y-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                              {property.title}
                            </h3>
                            <p className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
                              {formatPrice(property.price)}
                            </p>
                            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                              <span className="flex items-center space-x-1">
                                <MapPin className="h-4 w-4" />
                                <span>{property.location}</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <Bed className="h-4 w-4" />
                                <span>{property.bedrooms} beds</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <Bath className="h-4 w-4" />
                                <span>{property.bathrooms} baths</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <Car className="h-4 w-4" />
                                <span>{property.area} m²</span>
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Badge className={getStatusColor(property.status)}>
                              {property.status}
                            </Badge>
                            {property.archivedType && (
                              <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200">
                                {property.archivedType}
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
                            <span className="flex items-center space-x-1">
                              <Eye className="h-4 w-4" />
                              <span>{property.views} views</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Users className="h-4 w-4" />
                              <span>{property.leads} leads</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4" />
                              <span>{property.dateAdded}</span>
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handlePropertyAction(property.id, 'edit')}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handlePropertyAction(property.id, 'status')}
                            >
                              <Archive className="h-4 w-4 mr-1" />
                              Status
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handlePropertyAction(property.id, 'delete')}
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="leads" className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Select value={leadFilterStatus} onValueChange={setLeadFilterStatus}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Leads</SelectItem>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="contacted">Contacted</SelectItem>
                    <SelectItem value="qualified">Qualified</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4">
              {filteredLeads.map((lead) => (
                <Card key={lead.id} className="bg-white dark:bg-gray-800 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-full flex items-center justify-center">
                          <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {lead.name}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {lead.email} • {lead.phone}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                            Interested in: {lead.property}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <Badge className={getStatusColor(lead.status)}>
                            {lead.status}
                          </Badge>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {lead.date}
                          </p>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleLeadAction(lead.id, 'view')}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleLeadAction(lead.id, 'contact')}
                          >
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Contact
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="messages" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Demo Chat - For testing purposes */}
              <div className="h-[500px]">
                <ChatComponent />
              </div>
              
              {/* Instructions */}
              <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MessageSquare className="h-5 w-5" />
                    <span>Real-time Messaging</span>
                  </CardTitle>
                  <CardDescription>
                    Real-time chat functionality for communicating with clients and other agents.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Features:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Real-time message delivery</li>
                      <li>• Typing indicators</li>
                      <li>• Message read receipts</li>
                      <li>• Authenticated user sessions</li>
                      <li>• Conversation history</li>
                    </ul>
                  </div>
                  
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      <strong>Demo Mode:</strong> This is a demonstration of the real-time messaging system. 
                      In production, conversations would be linked to specific leads, properties, or client interactions.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Technical Implementation:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Socket.IO for real-time communication</li>
                      <li>• JWT authentication for secure connections</li>
                      <li>• Conversation rooms and user presence</li>
                      <li>• Message persistence in database</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="monitoring" className="space-y-6">
            <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Eye className="h-5 w-5" />
                  <span>System Monitoring</span>
                </CardTitle>
                <CardDescription>
                  Monitor system health, errors, and performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MonitoringDashboard isAdmin={true} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Delete Property Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Property</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedProperty?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Change Status Dialog */}
      <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Property Status</DialogTitle>
            <DialogDescription>
              Update the status for "{selectedProperty?.title}"
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={newStatus} onValueChange={(value) => setNewStatus(value as 'active' | 'pending' | 'archived')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {newStatus === 'archived' && (
              <div>
                <Label htmlFor="archivedType">Archived Type</Label>
                <Select value={archivedType} onValueChange={(value: 'sold' | 'removed') => setArchivedType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sold">Sold</SelectItem>
                    <SelectItem value="removed">Removed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setStatusDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={confirmStatusChange}>
                Update Status
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Lead Details Dialog */}
      <Dialog open={leadDetailsOpen} onOpenChange={setLeadDetailsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Lead Details</DialogTitle>
            <DialogDescription>
              View and manage lead information
            </DialogDescription>
          </DialogHeader>
          {selectedLead && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-700 dark:text-gray-300">Name</Label>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedLead.name}</p>
                </div>
                <div>
                  <Label className="text-gray-700 dark:text-gray-300">Status</Label>
                  <Badge className={getStatusColor(selectedLead.status)}>
                    {selectedLead.status}
                  </Badge>
                </div>
                <div>
                  <Label className="text-gray-700 dark:text-gray-300">Email</Label>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedLead.email}</p>
                </div>
                <div>
                  <Label className="text-gray-700 dark:text-gray-300">Phone</Label>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedLead.phone}</p>
                </div>
                <div>
                  <Label className="text-gray-700 dark:text-gray-300">Property</Label>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedLead.property}</p>
                </div>
                <div>
                  <Label className="text-gray-700 dark:text-gray-300">Date</Label>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedLead.date}</p>
                </div>
              </div>
              <div>
                <Label className="text-gray-700 dark:text-gray-300">Message</Label>
                <p className="text-gray-900 dark:text-white">{selectedLead.message}</p>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setLeadDetailsOpen(false)}>
                  Close
                </Button>
                <Button>
                  Contact Lead
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}