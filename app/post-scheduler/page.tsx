'use client'

import { useState } from 'react'
import Layout from '../components/layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function PostScheduler() {
  const [scheduledPosts, setScheduledPosts] = useState([])

  const handleSubmit = (e) => {
    e.preventDefault()
    // 这里通常会将表单数据发送到后端API
    // 在这个例子中,我们只是将一个虚拟的计划发布添加到状态中
    setScheduledPosts([...scheduledPosts, { id: Date.now(), content: e.target.content.value, scheduledTime: e.target.scheduledTime.value }])
  }

  return (
    <Layout>
      <h1 className="text-2xl font-semibold mb-6">发布计划</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>安排新发布</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="content">发布内容</Label>
                <Textarea id="content" placeholder="输入你的推文内容" />
              </div>
              <div>
                <Label htmlFor="media">上传媒体（可选）</Label>
                <Input type="file" id="media" />
              </div>
              <div>
                <Label htmlFor="scheduledTime">计划时间</Label>
                <Input type="datetime-local" id="scheduledTime" />
              </div>
              <Button type="submit">安排发布</Button>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>已计划发布</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {scheduledPosts.map((post) => (
                <li key={post.id} className="bg-gray-100 p-2 rounded">
                  <p className="font-semibold">{post.content.substring(0, 50)}...</p>
                  <p className="text-sm text-gray-600">计划发布时间: {post.scheduledTime}</p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}

