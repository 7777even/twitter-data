'use client'

import { useState } from 'react'
import Layout from '../components/layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function DataCollection() {
  const [tasks, setTasks] = useState([])

  const handleSubmit = (e) => {
    e.preventDefault()
    // 这里通常会将表单数据发送到后端API
    // 在这个例子中,我们只是将一个虚拟任务添加到状态中
    setTasks([...tasks, { id: Date.now(), status: '运行中', type: e.target.type.value }])
  }

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
                <select id="type" className="w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                  <option>基于关键词</option>
                  <option>基于用户</option>
                  <option>用户关注者</option>
                  <option>基于时间/位置</option>
                </select>
              </div>
              <div>
                <Label htmlFor="query">查询/用户名</Label>
                <Input type="text" id="query" placeholder="输入关键词或用户名" />
              </div>
              <div>
                <Label htmlFor="limit">数据限制</Label>
                <Input type="number" id="limit" placeholder="输入要采集的数据点数量" />
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
            <ul className="space-y-2">
              {tasks.map((task) => (
                <li key={task.id} className="flex justify-between items-center bg-gray-100 p-2 rounded">
                  <span>{task.type}</span>
                  <span className="text-green-600 font-semibold">{task.status}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}

