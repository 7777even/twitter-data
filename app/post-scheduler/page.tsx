'use client'

import { useState, useEffect } from 'react'
import Layout from '../components/layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// 定义发布内容类型
type ContentType = 'text' | 'image' | 'video' | 'link'

// 定义媒体文件类型
interface MediaFile {
  url: string
  type: 'image' | 'video'
  previewUrl?: string
}

// 定义发布计划类型
interface ScheduledPost {
  id: number
  content: string
  contentType: ContentType
  scheduledTime: string
  media?: MediaFile[]
  status: 'scheduled' | 'pending' | 'published' | 'failed'
  timeLeft?: string
  stats: {
    impressions: number
    engagements: number
    likes: number
    comments: number
    reposts: number
  }
  publishedTime?: string
  error?: string
}

// API 服务
const postingService = {
  // 上传媒体文件
  async uploadMedia(file: File): Promise<MediaFile> {
    try {
      // 模拟文件上传
      return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = () => {
          resolve({
            url: reader.result as string,
            type: file.type.startsWith('image/') ? 'image' : 'video',
            previewUrl: reader.result as string
          })
        }
        reader.readAsDataURL(file)
      })
    } catch (error) {
      throw new Error('文件上传失败')
    }
  },

  // 发布内容
  async publishPost(post: ScheduledPost): Promise<boolean> {
    try {
      // 这里替换为实际的API调用
      console.log('Publishing post:', post)

      // 模拟API调用延迟和成功率
      await new Promise(resolve => setTimeout(resolve, 2000))
      const success = Math.random() > 0.1

      if (!success) {
        throw new Error('发布失败，请重试')
      }

      return true
    } catch (error) {
      throw error
    }
  }
}

export default function PostScheduler() {
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([])
  const [selectedPost, setSelectedPost] = useState<ScheduledPost | null>(null)
  const [selectedContentType, setSelectedContentType] = useState<ContentType>('text')
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([])
  const [isUploading, setIsUploading] = useState(false)

  // 处理媒体文件上传
  const handleMediaUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files?.length) return

    setIsUploading(true)
    try {
      const uploadPromises = Array.from(files).map(file => postingService.uploadMedia(file))
      const uploadedFiles = await Promise.all(uploadPromises)
      setMediaFiles(prev => [...prev, ...uploadedFiles])
      toast.success('媒体文件上传成功')
    } catch (error) {
      toast.error('媒体文件上传失败')
    } finally {
      setIsUploading(false)
    }
  }

  // 移除媒体文件
  const handleRemoveMedia = (index: number) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index))
  }

  // 提交表单
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const scheduledTime = formData.get('scheduledTime') as string

    // 验证发布时间
    const scheduledDate = new Date(scheduledTime)
    if (scheduledDate <= new Date()) {
      toast.error('发布时间必须是未来时间')
      return
    }

    const newPost: ScheduledPost = {
      id: Date.now(),
      content: formData.get('content') as string,
      contentType: selectedContentType,
      scheduledTime: scheduledTime,
      media: mediaFiles,
      status: 'scheduled',
      timeLeft: '',
      stats: {
        impressions: 0,
        engagements: 0,
        likes: 0,
        comments: 0,
        reposts: 0
      }
    }

    setScheduledPosts(prev => [...prev, newPost])
    setMediaFiles([])
    toast.success('发布计划已创建')
    e.currentTarget.reset()
  }

  // 执行发布
  const executePublishing = async (post: ScheduledPost) => {
    try {
      // 更新状态为发布中
      setScheduledPosts(prev =>
        prev.map(p => p.id === post.id ? { ...p, status: 'pending' } : p)
      )

      // 调用发布API
      await postingService.publishPost(post)

      // 发布成功，更新状态
      const updatedPost = {
        ...post,
        status: 'published' as const,
        publishedTime: new Date().toISOString(),
        stats: {
          impressions: Math.floor(Math.random() * 1000),
          engagements: Math.floor(Math.random() * 500),
          likes: Math.floor(Math.random() * 300),
          comments: Math.floor(Math.random() * 100),
          reposts: Math.floor(Math.random() * 50)
        }
      }

      setScheduledPosts(prev =>
        prev.map(p => p.id === post.id ? updatedPost : p)
      )
      toast.success('内容已发布')

      // 开始统计数据
      startStatsTracking(post.id)
    } catch (error) {
      setScheduledPosts(prev =>
        prev.map(p => p.id === post.id ? {
          ...p,
          status: 'failed',
          error: error instanceof Error ? error.message : '发布失败'
        } : p)
      )
      toast.error('发布失败')
    }
  }

  // 统计数据追踪
  const startStatsTracking = (postId: number) => {
    const statsInterval = setInterval(() => {
      setScheduledPosts(prev =>
        prev.map(p => {
          if (p.id === postId) {
            return {
              ...p,
              stats: {
                impressions: p.stats.impressions + Math.floor(Math.random() * 10),
                engagements: p.stats.engagements + Math.floor(Math.random() * 5),
                likes: p.stats.likes + Math.floor(Math.random() * 3),
                comments: p.stats.comments + Math.floor(Math.random() * 2),
                reposts: p.stats.reposts + Math.floor(Math.random() * 1)
              }
            }
          }
          return p
        })
      )
    }, 5000)

    setTimeout(() => {
      clearInterval(statsInterval)
      toast.info('数据统计已完成')
    }, 30000)
  }

  // 定时检查和发布
  useEffect(() => {
    const timer = setInterval(() => {
      setScheduledPosts(posts =>
        posts.map(post => {
          if (post.status === 'scheduled') {
            const now = new Date().getTime()
            const scheduledTime = new Date(post.scheduledTime).getTime()
            const timeLeft = scheduledTime - now

            if (timeLeft <= 0) {
              executePublishing(post)
              return { ...post, status: 'pending', timeLeft: '发布中...' }
            }

            return {
              ...post,
              timeLeft: formatTimeLeft(timeLeft)
            }
          }
          return post
        })
      )
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // 格式化剩余时间
  const formatTimeLeft = (ms: number) => {
    if (ms < 0) return '即将发布'

    const seconds = Math.floor((ms / 1000) % 60)
    const minutes = Math.floor((ms / 1000 / 60) % 60)
    const hours = Math.floor((ms / 1000 / 60 / 60) % 24)
    const days = Math.floor(ms / 1000 / 60 / 60 / 24)

    const parts = []
    if (days > 0) parts.push(`${days}天`)
    if (hours > 0) parts.push(`${hours}小时`)
    if (minutes > 0) parts.push(`${minutes}分钟`)
    if (seconds > 0) parts.push(`${seconds}秒`)

    return parts.join(' ')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'scheduled':
        return '已计划'
      case 'pending':
        return '发布中'
      case 'published':
        return '已发布'
      case 'failed':
        return '失败'
      default:
        return status
    }
  }


  return (
    <Layout>
      <h1 className="text-2xl font-semibold mb-6">发布计划</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 创建发布表单 */}
        <Card>
          <CardHeader>
            <CardTitle>创建新发布</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="text" onValueChange={(value) => setSelectedContentType(value as ContentType)}>
              <TabsList className="mb-4">
                <TabsTrigger value="text">纯文本</TabsTrigger>
                <TabsTrigger value="image">图文</TabsTrigger>
                <TabsTrigger value="video">视频</TabsTrigger>
                <TabsTrigger value="link">链接</TabsTrigger>
              </TabsList>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="content">发布内容</Label>
                  <Textarea
                    id="content"
                    name="content"
                    placeholder="输入发布内容"
                    required
                  />
                </div>

                {selectedContentType !== 'text' && (
                  <div>
                    <Label>媒体文件</Label>
                    <Input
                      type="file"
                      onChange={handleMediaUpload}
                      accept={selectedContentType === 'image' ? 'image/*' : 'video/*'}
                      multiple={selectedContentType === 'image'}
                      disabled={isUploading}
                    />

                    {/* 媒体预览 */}
                    {mediaFiles.length > 0 && (
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        {mediaFiles.map((file, index) => (
                          <div key={index} className="relative">
                            {file.type === 'image' ? (
                              <img
                                src={file.previewUrl}
                                alt="预览"
                                className="w-full h-24 object-cover rounded"
                              />
                            ) : (
                              <video
                                src={file.url}
                                className="w-full h-24 object-cover rounded"
                              />
                            )}
                            <button
                              type="button"
                              onClick={() => handleRemoveMedia(index)}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <div>
                  <Label htmlFor="scheduledTime">计划时间</Label>
                  <Input
                    type="datetime-local"
                    id="scheduledTime"
                    name="scheduledTime"
                    min={new Date().toISOString().slice(0, 16)}
                    required
                  />
                </div>

                <Button type="submit" disabled={isUploading}>
                  {isUploading ? '上传中...' : '创建计划'}
                </Button>
              </form>
            </Tabs>
          </CardContent>
        </Card>
        {/* 发布列表部分 */}
        <Card>
          <CardHeader>
            <CardTitle>已计划发布</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              <div className="space-y-4">
                {scheduledPosts.map((post) => (
                  <div
                    key={post.id}
                    className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
                    onClick={() => setSelectedPost(post)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <p className="font-medium mb-1">
                          {post.content.substring(0, 50)}...
                        </p>
                        <p className="text-sm text-gray-600">
                          计划时间: {new Date(post.scheduledTime).toLocaleString()}
                        </p>
                        {post.status === 'scheduled' && (
                          <p className="text-sm text-blue-600">
                            {post.timeLeft}
                          </p>
                        )}
                      </div>
                      <Badge className={getStatusColor(post.status)}>
                        {getStatusText(post.status)}
                      </Badge>
                    </div>
                    {post.status === 'published' && (
                      <div className="grid grid-cols-3 gap-2 mt-2 text-sm">
                        <div>展示: {post.stats.impressions}</div>
                        <div>互动: {post.stats.engagements}</div>
                        <div>点赞: {post.stats.likes}</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* 发布详情部分 */}
        {selectedPost && (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>发布详情</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <Label className="block mb-2">发布内容</Label>
                  <p className="p-4 bg-gray-50 rounded-lg">{selectedPost.content}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="block mb-2">计划时间</Label>
                    <p>{new Date(selectedPost.scheduledTime).toLocaleString()}</p>
                  </div>
                  {selectedPost.publishedTime && (
                    <div>
                      <Label className="block mb-2">实际发布时间</Label>
                      <p>{new Date(selectedPost.publishedTime).toLocaleString()}</p>
                    </div>
                  )}
                </div>

                <div>
                  <Label className="block mb-2">数据统计</Label>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-2xl font-bold">{selectedPost.stats.impressions}</div>
                        <div className="text-sm text-gray-600">展示量</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-2xl font-bold">{selectedPost.stats.engagements}</div>
                        <div className="text-sm text-gray-600">互动量</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-2xl font-bold">{selectedPost.stats.likes}</div>
                        <div className="text-sm text-gray-600">点赞数</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-2xl font-bold">{selectedPost.stats.comments}</div>
                        <div className="text-sm text-gray-600">评论数</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-2xl font-bold">{selectedPost.stats.reposts}</div>
                        <div className="text-sm text-gray-600">转发数</div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

      </div>
    </Layout>
  )
}