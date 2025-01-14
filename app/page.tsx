import Layout from './components/layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function Dashboard() {
  return (
    <Layout>
      <h1 className="text-2xl font-semibold mb-6">仪表板</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>活跃采集任务</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">5</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>已采集数据点</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">10,234</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>计划发布</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">8</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>总互动量</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">5,678</p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}

