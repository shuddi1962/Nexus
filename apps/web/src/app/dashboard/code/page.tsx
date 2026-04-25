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
  Code,
  Play,
  Save,
  Download,
  Upload,
  Settings,
  Plus,
  FileText,
  Database,
  Globe,
  Zap,
  Terminal,
  Eye,
  Copy,
  Share2,
  GitBranch,
  Server,
  TestTube,
  Bug,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  FolderOpen,
  File
} from 'lucide-react'

interface Project {
  id: string
  name: string
  type: 'web' | 'api' | 'mobile' | 'automation'
  status: 'active' | 'completed' | 'archived'
  lastModified: string
  collaborators: number
  files: number
  commits: number
}

interface CodeSnippet {
  id: string
  name: string
  language: string
  description: string
  code: string
  tags: string[]
  usage: number
}

interface APIEndpoint {
  id: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  path: string
  description: string
  status: 'active' | 'deprecated'
  lastCalled: string
}

export default function CodePage() {
  const [selectedProject, setSelectedProject] = useState<string | null>(null)
  const [codeContent, setCodeContent] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState('javascript')

  // Mock data
  const projects: Project[] = [
    {
      id: '1',
      name: 'NEXUS Web Dashboard',
      type: 'web',
      status: 'active',
      lastModified: '2026-04-24T14:30:00Z',
      collaborators: 3,
      files: 247,
      commits: 156
    },
    {
      id: '2',
      name: 'Marketing Automation API',
      type: 'api',
      status: 'active',
      lastModified: '2026-04-23T10:15:00Z',
      collaborators: 2,
      files: 89,
      commits: 78
    },
    {
      id: '3',
      name: 'Mobile App Prototype',
      type: 'mobile',
      status: 'completed',
      lastModified: '2026-04-20T16:45:00Z',
      collaborators: 1,
      files: 45,
      commits: 23
    },
    {
      id: '4',
      name: 'Workflow Automation Scripts',
      type: 'automation',
      status: 'active',
      lastModified: '2026-04-22T09:20:00Z',
      collaborators: 2,
      files: 34,
      commits: 45
    }
  ]

  const codeSnippets: CodeSnippet[] = [
    {
      id: '1',
      name: 'API Authentication Middleware',
      language: 'javascript',
      description: 'JWT authentication middleware for Node.js APIs',
      code: `const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

module.exports = authenticateToken;`,
      tags: ['authentication', 'jwt', 'middleware'],
      usage: 45
    },
    {
      id: '2',
      name: 'React Custom Hook',
      language: 'typescript',
      description: 'Custom hook for API data fetching with loading states',
      code: `import { useState, useEffect } from 'react';

interface UseApiDataResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

function useApiData<T>(url: string): UseApiDataResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(url);
      const result = await response.json();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [url]);

  return { data, loading, error, refetch: fetchData };
}

export default useApiData;`,
      tags: ['react', 'hooks', 'api', 'typescript'],
      usage: 67
    }
  ]

  const apiEndpoints: APIEndpoint[] = [
    {
      id: '1',
      method: 'GET',
      path: '/api/users',
      description: 'Get all users with pagination',
      status: 'active',
      lastCalled: '2026-04-24T15:30:00Z'
    },
    {
      id: '2',
      method: 'POST',
      path: '/api/users',
      description: 'Create a new user',
      status: 'active',
      lastCalled: '2026-04-24T14:45:00Z'
    },
    {
      id: '3',
      method: 'PUT',
      path: '/api/users/:id',
      description: 'Update user information',
      status: 'active',
      lastCalled: '2026-04-24T12:20:00Z'
    },
    {
      id: '4',
      method: 'DELETE',
      path: '/api/users/:id',
      description: 'Delete a user account',
      status: 'deprecated',
      lastCalled: '2026-04-20T10:15:00Z'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'completed':
        return 'bg-blue-100 text-blue-800'
      case 'deprecated':
        return 'bg-yellow-100 text-yellow-800'
      case 'archived':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET':
        return 'bg-green-100 text-green-800'
      case 'POST':
        return 'bg-blue-100 text-blue-800'
      case 'PUT':
        return 'bg-yellow-100 text-yellow-800'
      case 'DELETE':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getLanguageIcon = (language: string) => {
    switch (language.toLowerCase()) {
      case 'javascript':
        return '🟨'
      case 'typescript':
        return '🔷'
      case 'python':
        return '🐍'
      case 'java':
        return '☕'
      case 'php':
        return '🐘'
      default:
        return '📄'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Code Builder & Development</h1>
          <p className="text-gray-600">Visual programming interface, API builder, and development tools.</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <GitBranch className="w-4 h-4 mr-2" />
            Git Integration
          </Button>
          <Button variant="outline">
            <TestTube className="w-4 h-4 mr-2" />
            Run Tests
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </div>
      </div>

      {/* Code Editor Interface */}
      {selectedProject && (
        <div className="grid grid-cols-12 gap-6 h-screen">
          {/* File Explorer */}
          <div className="col-span-3 bg-gray-50 rounded-lg p-4 space-y-4">
            <h3 className="font-medium text-gray-900 flex items-center">
              <FolderOpen className="w-4 h-4 mr-2" />
              Project Files
            </h3>
            <div className="space-y-1">
              {[
                { name: 'src', type: 'folder', children: 5 },
                { name: 'components', type: 'folder', children: 12 },
                { name: 'lib', type: 'folder', children: 8 },
                { name: 'pages', type: 'folder', children: 15 },
                { name: 'styles.css', type: 'file' },
                { name: 'package.json', type: 'file' },
                { name: 'README.md', type: 'file' }
              ].map((item, index) => (
                <div key={index} className="flex items-center space-x-2 px-2 py-1 hover:bg-gray-100 rounded cursor-pointer">
                  {item.type === 'folder' ? (
                    <FolderOpen className="w-4 h-4 text-blue-500" />
                  ) : (
                    <File className="w-4 h-4 text-gray-500" />
                  )}
                  <span className="text-sm">{item.name}</span>
                  {item.children && (
                    <span className="text-xs text-gray-500 ml-auto">({item.children})</span>
                  )}
                </div>
              ))}
            </div>

            <div className="border-t pt-4">
              <Button variant="outline" size="sm" className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                New File
              </Button>
            </div>
          </div>

          {/* Code Editor */}
          <div className="col-span-6 bg-white border rounded-lg">
            {/* Editor Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center space-x-2">
                <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="javascript">JavaScript</SelectItem>
                    <SelectItem value="typescript">TypeScript</SelectItem>
                    <SelectItem value="python">Python</SelectItem>
                    <SelectItem value="java">Java</SelectItem>
                    <SelectItem value="php">PHP</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-sm text-gray-600">main.js</span>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Play className="w-4 h-4 mr-2" />
                  Run
                </Button>
                <Button variant="outline" size="sm">
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
              </div>
            </div>

            {/* Code Editor Area */}
            <div className="p-4 h-96">
              <Textarea
                value={codeContent}
                onChange={(e) => setCodeContent(e.target.value)}
                placeholder="Start coding..."
                className="w-full h-full font-mono text-sm resize-none"
                style={{ fontFamily: 'monospace' }}
              />
            </div>
          </div>

          {/* Properties Panel */}
          <div className="col-span-3 bg-gray-50 rounded-lg p-4 space-y-4">
            <h3 className="font-medium text-gray-900">Code Analysis</h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Lines of code</span>
                <span className="font-medium">247</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Functions</span>
                <span className="font-medium">18</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Complexity</span>
                <span className="font-medium text-green-600">Low</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Test coverage</span>
                <span className="font-medium text-yellow-600">78%</span>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-medium text-gray-900 mb-2">Quick Actions</h3>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Zap className="w-4 h-4 mr-2" />
                  Generate Tests
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Bug className="w-4 h-4 mr-2" />
                  Debug Code
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Optimize
                </Button>
              </div>
            </div>

            <div className="border-t pt-4">
              <Button className="w-full" variant="outline">
                <Share2 className="w-4 h-4 mr-2" />
                Share Project
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Projects Grid */}
      {!selectedProject && (
        <Tabs defaultValue="projects" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="projects">My Projects</TabsTrigger>
            <TabsTrigger value="snippets">Code Snippets</TabsTrigger>
            <TabsTrigger value="apis">API Builder</TabsTrigger>
            <TabsTrigger value="deploy">Deploy</TabsTrigger>
          </TabsList>

          <TabsContent value="projects" className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Code className="w-8 h-8 text-blue-500 mr-3" />
                    <div>
                      <div className="text-2xl font-bold">{projects.length}</div>
                      <div className="text-sm text-gray-600">Active Projects</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <FileText className="w-8 h-8 text-green-500 mr-3" />
                    <div>
                      <div className="text-2xl font-bold">
                        {projects.reduce((sum, p) => sum + p.files, 0)}
                      </div>
                      <div className="text-sm text-gray-600">Total Files</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <GitBranch className="w-8 h-8 text-purple-500 mr-3" />
                    <div>
                      <div className="text-2xl font-bold">
                        {projects.reduce((sum, p) => sum + p.commits, 0)}
                      </div>
                      <div className="text-sm text-gray-600">Total Commits</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <CheckCircle className="w-8 h-8 text-orange-500 mr-3" />
                    <div>
                      <div className="text-2xl font-bold">
                        {projects.filter(p => p.status === 'completed').length}
                      </div>
                      <div className="text-sm text-gray-600">Completed</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <Card key={project.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{project.name}</CardTitle>
                      <Badge className={getStatusColor(project.status)}>
                        {project.status}
                      </Badge>
                    </div>
                    <Badge variant="secondary" className="w-fit capitalize">
                      {project.type}
                    </Badge>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Files</span>
                        <div className="font-semibold">{project.files}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Commits</span>
                        <div className="font-semibold">{project.commits}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Team</span>
                        <div className="font-semibold">{project.collaborators}</div>
                      </div>
                    </div>

                    <div className="text-xs text-gray-600">
                      Modified {new Date(project.lastModified).toLocaleDateString()}
                    </div>

                    <div className="flex items-center space-x-2 pt-4 border-t">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => setSelectedProject(project.id)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Open
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <Settings className="w-4 h-4 mr-2" />
                        Settings
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="snippets" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Code Snippets Library</CardTitle>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Snippet
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {codeSnippets.map((snippet) => (
                    <Card key={snippet.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <span className="text-lg">{getLanguageIcon(snippet.language)}</span>
                            <div>
                              <h3 className="font-medium text-gray-900">{snippet.name}</h3>
                              <div className="flex items-center space-x-2 mt-1">
                                <Badge variant="outline">{snippet.language}</Badge>
                                <span className="text-sm text-gray-600">
                                  Used {snippet.usage} times
                                </span>
                              </div>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>

                        <p className="text-gray-600 text-sm mb-3">{snippet.description}</p>

                        <div className="bg-gray-50 rounded p-3 mb-3">
                          <pre className="text-xs font-mono text-gray-800 overflow-x-auto">
                            {snippet.code.length > 200
                              ? snippet.code.substring(0, 200) + '...'
                              : snippet.code
                            }
                          </pre>
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {snippet.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="apis" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>API Endpoints</CardTitle>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Endpoint
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {apiEndpoints.map((endpoint) => (
                    <div key={endpoint.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Badge className={getMethodColor(endpoint.method)}>
                          {endpoint.method}
                        </Badge>
                        <div>
                          <div className="font-mono text-sm font-medium">{endpoint.path}</div>
                          <div className="text-sm text-gray-600">{endpoint.description}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge className={getStatusColor(endpoint.status)}>
                          {endpoint.status}
                        </Badge>
                        <span className="text-sm text-gray-600">
                          Last called: {new Date(endpoint.lastCalled).toLocaleDateString()}
                        </span>
                        <Button variant="outline" size="sm">
                          Test
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* API Documentation Generator */}
            <Card>
              <CardHeader>
                <CardTitle>API Documentation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Base URL</Label>
                      <Input defaultValue="https://api.nexus.app/v1" />
                    </div>
                    <div className="space-y-2">
                      <Label>API Version</Label>
                      <Select defaultValue="v1">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="v1">v1.0</SelectItem>
                          <SelectItem value="v2">v2.0 (Beta)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button>
                      <FileText className="w-4 h-4 mr-2" />
                      Generate Docs
                    </Button>
                    <Button variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Export OpenAPI
                    </Button>
                    <Button variant="outline">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share API
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="deploy" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Deployment Options</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {[
                      { name: 'Vercel', icon: '▲', description: 'Deploy to Vercel with one click' },
                      { name: 'Netlify', icon: 'N', description: 'Deploy static sites and serverless functions' },
                      { name: 'Heroku', icon: 'H', description: 'Deploy web applications easily' },
                      { name: 'AWS', icon: '☁️', description: 'Deploy to Amazon Web Services' },
                      { name: 'DigitalOcean', icon: '💧', description: 'Deploy to DigitalOcean droplets' }
                    ].map((platform, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <span className="text-xl">{platform.icon}</span>
                          <div>
                            <div className="font-medium">{platform.name}</div>
                            <div className="text-sm text-gray-600">{platform.description}</div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Deploy
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Deployment History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        version: 'v1.2.3',
                        environment: 'Production',
                        status: 'success',
                        deployedAt: '2026-04-24T14:30:00Z',
                        deployer: 'John Smith'
                      },
                      {
                        version: 'v1.2.2',
                        environment: 'Staging',
                        status: 'success',
                        deployedAt: '2026-04-24T12:15:00Z',
                        deployer: 'Sarah Johnson'
                      },
                      {
                        version: 'v1.2.1',
                        environment: 'Production',
                        status: 'failed',
                        deployedAt: '2026-04-23T16:45:00Z',
                        deployer: 'Mike Chen'
                      }
                    ].map((deployment, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">{deployment.version}</div>
                          <div className="text-sm text-gray-600">
                            {deployment.environment} • {new Date(deployment.deployedAt).toLocaleDateString()}
                          </div>
                          <div className="text-sm text-gray-600">By {deployment.deployer}</div>
                        </div>
                        <Badge className={deployment.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {deployment.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}