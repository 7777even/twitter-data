'use client'

import { useState } from 'react'
import Layout from '../components/layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Progress } from '@/components/ui/progress'

// 定义任务类型
interface Task {
  id: number
  type: string
  query: string
  limit: number
  status: 'pending' | 'running' | 'completed' | 'failed'
  progress: number
  data: CollectedData[]
}

// 定义采集数据类型
interface CollectedData {
  id: number
  content: string
  timestamp: string
  metrics: {
    likes: number
    reposts: number
    comments: number
  }
}

export default function DataCollection() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const newTask: Task = {
      id: Date.now(),
      type: formData.get('type') as string,
      query: formData.get('query') as string,
      limit: Number(formData.get('limit')),
      status: 'running',
      progress: 0,
      data: []
    }
    setTasks([...tasks, newTask])

    // 模拟数据采集过程
    simulateDataCollection(newTask)
  }

  const simulateDataCollection = (task: Task) => {
    let progress = 0
    const interval = setInterval(() => {
      progress += 10
      const updatedTask = {
        ...task,
        progress,
        data: [...task.data, generateMockData(task.data.length + 1)],
        status: progress >= 100 ? 'completed' : 'running'
      }

      setTasks(prev => prev.map(t => t.id === task.id ? updatedTask : t))

      if (progress >= 100) {
        clearInterval(interval)
      }
    }, 1000)
  }

  const generateMockData = (id: number): CollectedData => ({
    id,
    content: `采集的示例内容 ${id}`,
    timestamp: new Date().toISOString(),
    metrics: {
      likes: Math.floor(Math.random() * 100),
      reposts: Math.floor(Math.random() * 50),
      comments: Math.floor(Math.random() * 30)
    }
  })

  return (
    <Layout>
      <h1 className="text-2xl font-semibold mb-6">数据采集</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>创建新采集任务</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="type">采集类型</Label>
                <select
                  id="type"
                  name="type"
                  className="w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                >
                  <option>基于关键词</option>
                  <option>基于用户</option>
                  <option>用户关注者</option>
                  <option>基于时间/位置</option>
                </select>
              </div>
              <div>
                <Label htmlFor="query">查询/用户名</Label>
                <Input type="text" id="query" name="query" placeholder="输入关键词或用户名" />
              </div>
              <div>
                <Label htmlFor="limit">数据限制</Label>
                <Input type="number" id="limit" name="limit" placeholder="输入要采集的数据点数量" />
              </div>
              <Button type="submit">开始采集</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>活跃采集任务</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              <div className="space-y-4">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
                    onClick={() => setSelectedTask(task)}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">{task.type}</span>
                      <span className={`text-sm ${task.status === 'completed' ? 'text-green-600' :
                        task.status === 'running' ? 'text-blue-600' :
                          'text-red-600'
                        }`}>
                        {task.status}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                      查询: {task.query}
                    </div>
                    <Progress value={task.progress} className="h-2" />
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {selectedTask && (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>任务详情</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>任务类型</Label>
                    <div>{selectedTask.type}</div>
                  </div>
                  <div>
                    <Label>查询内容</Label>
                    <div>{selectedTask.query}</div>
                  </div>
                  <div>
                    <Label>采集进度</Label>
                    <div>{selectedTask.progress}%</div>
                  </div>
                </div>

                <div>
                  <Label className="mb-2 block">采集数据</Label>
                  <ScrollArea className="h-[400px] border rounded-lg p-4">
                    <div className="space-y-4">
                      {selectedTask.data.map((item) => (
                        <div key={item.id} className="border-b pb-4">
                          <p className="mb-2">{item.content}</p>
                          <div className="flex gap-4 text-sm text-gray-600">
                            <span>点赞: {item.metrics.likes}</span>
                            <span>转发: {item.metrics.reposts}</span>
                            <span>评论: {item.metrics.comments}</span>
                            <span>时间: {new Date(item.timestamp).toLocaleString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  )
}