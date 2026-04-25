'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Calendar,
  Clock,
  Users,
  Plus,
  Settings,
  Bell,
  Zap,
  Video,
  MapPin,
  CheckCircle,
  AlertTriangle,
  User,
  CalendarDays,
  ArrowLeft,
  ArrowRight,
  Filter,
  Search
} from 'lucide-react'

interface CalendarEvent {
  id: string
  title: string
  description: string
  startTime: string
  endTime: string
  attendees: string[]
  location?: string
  type: 'meeting' | 'call' | 'task' | 'reminder' | 'appointment'
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled'
  calendarId: string
}

interface Calendar {
  id: string
  name: string
  color: string
  isDefault: boolean
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null)
  const [view, setView] = useState<'month' | 'week' | 'day'>('month')

  // Mock data
  const calendars: Calendar[] = [
    { id: '1', name: 'Personal', color: '#3B82F6', isDefault: true },
    { id: '2', name: 'Work', color: '#10B981', isDefault: false },
    { id: '3', name: 'NEXUS Events', color: '#F59E0B', isDefault: false },
    { id: '4', name: 'Client Meetings', color: '#EF4444', isDefault: false }
  ]

  const events: CalendarEvent[] = [
    {
      id: '1',
      title: 'Team Standup',
      description: 'Daily team standup meeting',
      startTime: '2026-04-25T09:00:00Z',
      endTime: '2026-04-25T09:30:00Z',
      attendees: ['john@nexus.demo', 'sarah@nexus.demo', 'mike@nexus.demo'],
      type: 'meeting',
      status: 'confirmed',
      calendarId: '2'
    },
    {
      id: '2',
      title: 'Client Demo',
      description: 'Product demo for ABC Corp',
      startTime: '2026-04-25T14:00:00Z',
      endTime: '2026-04-25T15:00:00Z',
      attendees: ['client@abc.com', 'john@nexus.demo'],
      location: 'Conference Room A',
      type: 'meeting',
      status: 'scheduled',
      calendarId: '4'
    },
    {
      id: '3',
      title: 'Project Review',
      description: 'Q1 project review and planning',
      startTime: '2026-04-26T10:00:00Z',
      endTime: '2026-04-26T11:30:00Z',
      attendees: ['john@nexus.demo', 'sarah@nexus.demo', 'mike@nexus.demo', 'lisa@nexus.demo'],
      type: 'meeting',
      status: 'scheduled',
      calendarId: '2'
    },
    {
      id: '4',
      title: 'Doctor Appointment',
      description: 'Annual checkup',
      startTime: '2026-04-27T15:30:00Z',
      endTime: '2026-04-27T16:30:00Z',
      attendees: [],
      location: 'Medical Center',
      type: 'appointment',
      status: 'confirmed',
      calendarId: '1'
    }
  ]

  const getEventColor = (event: CalendarEvent) => {
    const calendar = calendars.find(c => c.id === event.calendarId)
    return calendar?.color || '#6B7280'
  }

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'meeting':
        return <Users className="w-4 h-4" />
      case 'call':
        return <Video className="w-4 h-4" />
      case 'appointment':
        return <Calendar className="w-4 h-4" />
      case 'task':
        return <CheckCircle className="w-4 h-4" />
      case 'reminder':
        return <Bell className="w-4 h-4" />
      default:
        return <Calendar className="w-4 h-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800'
      case 'scheduled':
        return 'bg-blue-100 text-blue-800'
      case 'completed':
        return 'bg-gray-100 text-gray-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate)
    if (view === 'month') {
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1))
    } else if (view === 'week') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7))
    } else {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1))
    }
    setCurrentDate(newDate)
  }

  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.startTime)
      return eventDate.toDateString() === date.toDateString()
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Calendar & Scheduling</h1>
          <p className="text-gray-600">AI-powered scheduling with team collaboration and smart optimization.</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline">
            <Zap className="w-4 h-4 mr-2" />
            AI Suggest
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Event
          </Button>
        </div>
      </div>

      {/* Calendar Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" onClick={() => navigateDate('prev')}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <h2 className="text-xl font-semibold">
                {currentDate.toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric',
                  ...(view !== 'month' && { day: 'numeric' })
                })}
              </h2>
              <Button variant="outline" size="sm" onClick={() => navigateDate('next')}>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex rounded-lg border">
                <Button
                  variant={view === 'month' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setView('month')}
                >
                  Month
                </Button>
                <Button
                  variant={view === 'week' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setView('week')}
                >
                  Week
                </Button>
                <Button
                  variant={view === 'day' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setView('day')}
                >
                  Day
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Simple Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="p-2 text-center font-medium text-gray-600 text-sm">
                {day}
              </div>
            ))}
            {Array.from({ length: 35 }, (_, i) => {
              const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i - currentDate.getDay() + 1)
              const dayEvents = getEventsForDate(date)
              const isCurrentMonth = date.getMonth() === currentDate.getMonth()
              const isToday = date.toDateString() === new Date().toDateString()

              return (
                <div
                  key={i}
                  className={`min-h-24 p-2 border rounded-lg ${
                    isCurrentMonth ? 'bg-white' : 'bg-gray-50'
                  } ${isToday ? 'ring-2 ring-blue-500' : ''}`}
                >
                  <div className={`text-sm font-medium ${isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}`}>
                    {date.getDate()}
                  </div>
                  <div className="space-y-1 mt-1">
                    {dayEvents.slice(0, 3).map(event => (
                      <div
                        key={event.id}
                        className="text-xs p-1 rounded cursor-pointer hover:opacity-80"
                        style={{ backgroundColor: getEventColor(event) + '20', borderLeft: `3px solid ${getEventColor(event)}` }}
                        onClick={() => setSelectedEvent(event.id)}
                      >
                        <div className="font-medium truncate">{event.title}</div>
                        <div className="text-gray-600">{formatTime(event.startTime)}</div>
                      </div>
                    ))}
                    {dayEvents.length > 3 && (
                      <div className="text-xs text-gray-500">
                        +{dayEvents.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="events" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="calendars">Calendars</TabsTrigger>
          <TabsTrigger value="availability">Availability</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="space-y-6">
          {/* Upcoming Events */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {events.map(event => (
                  <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div
                          className="w-12 h-12 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: getEventColor(event) + '20' }}
                        >
                          {getEventTypeIcon(event.type)}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{event.title}</h3>
                        <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {formatTime(event.startTime)} - {formatTime(event.endTime)}
                          </span>
                          {event.location && (
                            <span className="flex items-center">
                              <MapPin className="w-4 h-4 mr-1" />
                              {event.location}
                            </span>
                          )}
                          <Badge className={getStatusColor(event.status)}>
                            {event.status}
                          </Badge>
                        </div>
                        <div className="flex items-center mt-2">
                          <Users className="w-4 h-4 mr-2 text-gray-400" />
                          <div className="flex -space-x-2">
                            {event.attendees.slice(0, 3).map((attendee, i) => (
                              <div
                                key={i}
                                className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-xs font-medium"
                              >
                                {attendee.charAt(0).toUpperCase()}
                              </div>
                            ))}
                            {event.attendees.length > 3 && (
                              <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs">
                                +{event.attendees.length - 3}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        Join
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendars" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {calendars.map(calendar => (
              <Card key={calendar.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: calendar.color }}
                      ></div>
                      <CardTitle className="text-lg">{calendar.name}</CardTitle>
                      {calendar.isDefault && (
                        <Badge variant="secondary">Default</Badge>
                      )}
                    </div>
                    <Button variant="ghost" size="sm">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-sm text-gray-600">
                      {events.filter(e => e.calendarId === calendar.id).length} events
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Event
                      </Button>
                      <Button variant="outline" size="sm">
                        Share
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardContent className="p-8 text-center">
              <CalendarDays className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Create New Calendar</h3>
              <p className="text-gray-600 mb-6">
                Organize your events with custom calendars for different purposes.
              </p>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Calendar
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="availability" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Team Availability</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: 'John Smith', role: 'CEO', available: true, nextFree: '2:00 PM' },
                  { name: 'Sarah Johnson', role: 'Marketing Lead', available: false, nextFree: 'Tomorrow 9:00 AM' },
                  { name: 'Mike Chen', role: 'Developer', available: true, nextFree: 'Now' },
                  { name: 'Lisa Wong', role: 'Designer', available: false, nextFree: '3:30 PM' }
                ].map((person, i) => (
                  <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-medium">{person.name}</div>
                        <div className="text-sm text-gray-600">{person.role}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className={`flex items-center space-x-2 ${person.available ? 'text-green-600' : 'text-red-600'}`}>
                        <div className={`w-3 h-3 rounded-full ${person.available ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span className="text-sm">
                          {person.available ? 'Available' : 'Busy'}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        Next: {person.nextFree}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>AI Scheduling Assistant</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <Zap className="w-5 h-5 text-blue-500 mr-2" />
                    <span className="text-blue-800 font-medium">Smart Scheduling</span>
                  </div>
                  <p className="text-blue-700 text-sm mt-2">
                    AI will find the best time for your meeting considering everyone's availability and preferences.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Meeting Duration</Label>
                    <Select defaultValue="60">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="90">1.5 hours</SelectItem>
                        <SelectItem value="120">2 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Preferred Time Range</Label>
                    <Select defaultValue="business">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="morning">Morning (9 AM - 12 PM)</SelectItem>
                        <SelectItem value="afternoon">Afternoon (1 PM - 5 PM)</SelectItem>
                        <SelectItem value="business">Business Hours</SelectItem>
                        <SelectItem value="any">Any Time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button className="w-full">
                  <Zap className="w-4 h-4 mr-2" />
                  Find Best Time
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Calendar Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Default View</Label>
                  <Select defaultValue="month">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="month">Month</SelectItem>
                      <SelectItem value="week">Week</SelectItem>
                      <SelectItem value="day">Day</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Start of Week</Label>
                  <Select defaultValue="monday">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sunday">Sunday</SelectItem>
                      <SelectItem value="monday">Monday</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Timezone</Label>
                  <Select defaultValue="est">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="est">Eastern Time</SelectItem>
                      <SelectItem value="cst">Central Time</SelectItem>
                      <SelectItem value="mst">Mountain Time</SelectItem>
                      <SelectItem value="pst">Pacific Time</SelectItem>
                      <SelectItem value="utc">UTC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Email Reminders</div>
                    <div className="text-sm text-gray-600">Get email notifications for upcoming events</div>
                  </div>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Push Notifications</div>
                    <div className="text-sm text-gray-600">Receive push notifications on mobile</div>
                  </div>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Calendar Sync</div>
                    <div className="text-sm text-gray-600">Sync with Google Calendar and Outlook</div>
                  </div>
                  <input type="checkbox" className="rounded" />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">AI Suggestions</div>
                    <div className="text-sm text-gray-600">Get AI-powered scheduling recommendations</div>
                  </div>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}