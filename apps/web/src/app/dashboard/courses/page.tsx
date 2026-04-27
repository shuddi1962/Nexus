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
import { Progress } from '@/components/ui/progress'
import {
  BookOpen,
  Users,
  Play,
  Plus,
  Settings,
  BarChart3,
  Trophy,
  Clock,
  FileText,
  Video,
  Image,
  CheckCircle,
  Star,
  Award,
  Upload,
  Download,
  Share2,
  Eye,
  Edit,
  Trash2,
  UserCheck,
  DollarSign
} from 'lucide-react'

interface Course {
  id: string
  title: string
  description: string
  instructor: string
  price: number
  students: number
  rating: number
  reviews: number
  duration: number
  modules: number
  status: 'draft' | 'published' | 'archived'
  createdAt: string
  thumbnail?: string
}

interface Student {
  id: string
  name: string
  email: string
  progress: number
  enrolledAt: string
  completedAt?: string
  certificate?: boolean
}

interface Module {
  id: string
  title: string
  type: 'video' | 'text' | 'quiz' | 'assignment'
  duration: number
  completed: boolean
}

export default function CoursesPage() {
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [courseTitle, setCourseTitle] = useState('')
  const [courseDescription, setCourseDescription] = useState('')

  // Mock data
  const courses: Course[] = [
    {
      id: '1',
      title: 'Complete Marketing Automation Course',
      description: 'Master the art of marketing automation with NEXUS platform',
      instructor: 'Sarah Johnson',
      price: 299,
      students: 1247,
      rating: 4.8,
      reviews: 156,
      duration: 2400, // minutes
      modules: 24,
      status: 'published',
      createdAt: '2026-03-15T10:00:00Z'
    },
    {
      id: '2',
      title: 'Advanced CRM Strategies',
      description: 'Learn advanced customer relationship management techniques',
      instructor: 'Mike Chen',
      price: 199,
      students: 892,
      rating: 4.6,
      reviews: 89,
      duration: 1800,
      modules: 18,
      status: 'published',
      createdAt: '2026-03-20T14:30:00Z'
    },
    {
      id: '3',
      title: 'AI Content Creation Masterclass',
      description: 'Create compelling content using artificial intelligence',
      instructor: 'Lisa Wong',
      price: 149,
      students: 0,
      rating: 0,
      reviews: 0,
      duration: 1200,
      modules: 12,
      status: 'draft',
      createdAt: '2026-04-20T09:15:00Z'
    }
  ]

  const students: Student[] = [
    {
      id: '1',
      name: 'John Smith',
      email: 'john@example.com',
      progress: 85,
      enrolledAt: '2026-04-01T10:00:00Z',
      completedAt: '2026-04-20T15:30:00Z',
      certificate: true
    },
    {
      id: '2',
      name: 'Emma Davis',
      email: 'emma@example.com',
      progress: 60,
      enrolledAt: '2026-04-05T14:20:00Z'
    },
    {
      id: '3',
      name: 'Alex Johnson',
      email: 'alex@example.com',
      progress: 100,
      enrolledAt: '2026-03-28T09:45:00Z',
      completedAt: '2026-04-15T12:00:00Z',
      certificate: true
    }
  ]

  const modules: Module[] = [
    { id: '1', title: 'Introduction to Marketing Automation', type: 'video', duration: 15, completed: true },
    { id: '2', title: 'Setting Up Your First Campaign', type: 'video', duration: 25, completed: true },
    { id: '3', title: 'Email Marketing Fundamentals', type: 'text', duration: 10, completed: true },
    { id: '4', title: 'Lead Scoring Quiz', type: 'quiz', duration: 20, completed: false },
    { id: '5', title: 'Advanced Segmentation Techniques', type: 'video', duration: 30, completed: false },
    { id: '6', title: 'A/B Testing Assignment', type: 'assignment', duration: 45, completed: false }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800'
      case 'draft':
        return 'bg-yellow-100 text-yellow-800'
      case 'archived':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getModuleIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="w-4 h-4" />
      case 'text':
        return <FileText className="w-4 h-4" />
      case 'quiz':
        return <CheckCircle className="w-4 h-4" />
      case 'assignment':
        return <Upload className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  const handleCreateCourse = () => {
    if (!courseTitle.trim()) return

    // In real app, this would create a new course

    setIsCreating(false)
    setCourseTitle('')
    setCourseDescription('')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Course Builder & LMS</h1>
          <p className="text-gray-600">Create and manage interactive online courses with built-in learning management.</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Import Course
          </Button>
          <Button variant="outline">
            <Share2 className="w-4 h-4 mr-2" />
            Templates
          </Button>
          <Button onClick={() => setIsCreating(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Course
          </Button>
        </div>
      </div>

      {/* Create Course Modal */}
      {isCreating && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle>Create New Course</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="courseTitle">Course Title</Label>
                <Input
                  id="courseTitle"
                  value={courseTitle}
                  onChange={(e) => setCourseTitle(e.target.value)}
                  placeholder="Enter course title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="instructor">Instructor</Label>
                <Select defaultValue="current">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="current">Current User</SelectItem>
                    <SelectItem value="sarah">Sarah Johnson</SelectItem>
                    <SelectItem value="mike">Mike Chen</SelectItem>
                    <SelectItem value="lisa">Lisa Wong</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="courseDescription">Course Description</Label>
              <Textarea
                id="courseDescription"
                value={courseDescription}
                onChange={(e) => setCourseDescription(e.target.value)}
                placeholder="Describe what students will learn..."
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select defaultValue="marketing">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="development">Development</SelectItem>
                    <SelectItem value="design">Design</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Price</Label>
                <Input type="number" placeholder="299" />
              </div>
              <div className="space-y-2">
                <Label>Difficulty</Label>
                <Select defaultValue="intermediate">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsCreating(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateCourse}>
                Create Course
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <BookOpen className="w-8 h-8 text-blue-500 mr-3" />
              <div>
                <div className="text-2xl font-bold">{courses.length}</div>
                <div className="text-sm text-gray-600">Total Courses</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-green-500 mr-3" />
              <div>
                <div className="text-2xl font-bold">
                  {courses.reduce((sum, course) => sum + course.students, 0).toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Total Students</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="w-8 h-8 text-purple-500 mr-3" />
              <div>
                <div className="text-2xl font-bold">
                  ${(courses.reduce((sum, course) => sum + (course.price * course.students), 0)).toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Revenue</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Trophy className="w-8 h-8 text-orange-500 mr-3" />
              <div>
                <div className="text-2xl font-bold">4.7</div>
                <div className="text-sm text-gray-600">Avg. Rating</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="courses" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="courses">My Courses</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="certificates">Certificates</TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="space-y-6">
          {/* Course Builder Interface */}
          {selectedCourse && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Course Builder - Marketing Automation Course</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline">
                      <Eye className="w-4 h-4 mr-2" />
                      Preview
                    </Button>
                    <Button variant="outline">
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </Button>
                    <Button onClick={() => setSelectedCourse(null)}>
                      Close
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Module Builder */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Course Modules</h3>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Module
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {modules.map((module, index) => (
                      <div key={module.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              {getModuleIcon(module.type)}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium">{module.title}</h4>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant="secondary" className="capitalize">
                                {module.type}
                              </Badge>
                              <span className="text-sm text-gray-600">
                                {formatDuration(module.duration)}
                              </span>
                              {module.completed && (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Play className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quiz Builder */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Quiz Builder</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Question Type</Label>
                          <Select defaultValue="multiple">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="multiple">Multiple Choice</SelectItem>
                              <SelectItem value="truefalse">True/False</SelectItem>
                              <SelectItem value="short">Short Answer</SelectItem>
                              <SelectItem value="essay">Essay</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Points</Label>
                          <Input type="number" defaultValue="10" />
                        </div>
                      </div>
                      <Textarea placeholder="Enter your question..." rows={3} />
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Question
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          )}

          {/* Courses Grid */}
          {!selectedCourse && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <Card key={course.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="aspect-video bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                      <BookOpen className="w-12 h-12 text-gray-400" />
                    </div>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{course.title}</CardTitle>
                      <Badge className={getStatusColor(course.status)}>
                        {course.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-600 text-sm line-clamp-2">{course.description}</p>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Students:</span>
                        <div className="font-semibold">{course.students.toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Rating:</span>
                        <div className="font-semibold flex items-center">
                          {course.rating > 0 ? (
                            <>
                              {course.rating.toFixed(1)}
                              <Star className="w-4 h-4 ml-1 text-yellow-500 fill-current" />
                            </>
                          ) : (
                            'N/A'
                          )}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-600">Duration:</span>
                        <div className="font-semibold">{formatDuration(course.duration)}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Modules:</span>
                        <div className="font-semibold">{course.modules}</div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 pt-4 border-t">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => setSelectedCourse(course.id)}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="students" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Student Enrollment & Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {students.map((student) => (
                  <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="font-medium text-gray-600">
                          {student.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{student.name}</h3>
                        <p className="text-sm text-gray-600">{student.email}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <div className="flex-1">
                            <Progress value={student.progress} className="h-2" />
                          </div>
                          <span className="text-sm font-medium">{student.progress}%</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-sm text-gray-600">Enrolled</div>
                        <div className="font-medium">
                          {new Date(student.enrolledAt).toLocaleDateString()}
                        </div>
                        {student.completedAt && (
                          <>
                            <div className="text-sm text-gray-600 mt-1">Completed</div>
                            <div className="font-medium">
                              {new Date(student.completedAt).toLocaleDateString()}
                            </div>
                          </>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        {student.certificate && (
                          <Award className="w-5 h-5 text-yellow-500" />
                        )}
                        <Button variant="outline" size="sm">
                          View Progress
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Users className="w-8 h-8 text-blue-500 mr-3" />
                  <div>
                    <div className="text-2xl font-bold">2,147</div>
                    <div className="text-sm text-gray-600">Total Enrollments</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Trophy className="w-8 h-8 text-green-500 mr-3" />
                  <div>
                    <div className="text-2xl font-bold">87%</div>
                    <div className="text-sm text-gray-600">Completion Rate</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Clock className="w-8 h-8 text-purple-500 mr-3" />
                  <div>
                    <div className="text-2xl font-bold">4.2h</div>
                    <div className="text-sm text-gray-600">Avg. Study Time</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Course Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {courses.filter(c => c.students > 0).map((course) => (
                  <div key={course.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-medium text-gray-900">{course.title}</h3>
                        <div className="text-sm text-gray-600 mt-1">
                          {course.students} students • {course.rating.toFixed(1)} ⭐
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">
                          {Math.round((course.students * 0.87))}/{course.students}
                        </div>
                        <div className="text-sm text-gray-600">Completions</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Completion Rate</span>
                        <span>87%</span>
                      </div>
                      <Progress value={87} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="certificates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Certificate Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  {
                    name: 'Professional Certificate',
                    description: 'Standard completion certificate',
                    preview: '🎓'
                  },
                  {
                    name: 'Achievement Badge',
                    description: 'Digital badge for course completion',
                    preview: '🏆'
                  },
                  {
                    name: 'Custom Certificate',
                    description: 'Fully customizable design',
                    preview: '✨'
                  }
                ].map((template, index) => (
                  <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-6 text-center">
                      <div className="text-4xl mb-4">{template.preview}</div>
                      <h3 className="font-medium text-gray-900 mb-2">{template.name}</h3>
                      <p className="text-sm text-gray-600 mb-4">{template.description}</p>
                      <Button variant="outline" size="sm">
                        Use Template
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Issued Certificates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {students.filter(s => s.certificate).map((student) => (
                  <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Award className="w-8 h-8 text-yellow-500" />
                      <div>
                        <h3 className="font-medium text-gray-900">
                          Certificate for {courses[0].title}
                        </h3>
                        <p className="text-sm text-gray-600">Issued to {student.name}</p>
                        <p className="text-sm text-gray-600">
                          Completed on {new Date(student.completedAt!).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}