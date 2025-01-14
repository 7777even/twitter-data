import Layout from '../components/layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function Analytics() {
  const posts = [
    { id: 1, content: '这是一条示例推文', impressions: 1000, engagements: 50, retweets: 10 },
    { id: 2, content: '另一条示例推文', impressions: 1500, engagements: 75, retweets: 15 },
    { id: 3, content: '又一条示例推文', impressions: 2000, engagements: 100, retweets: 20 },
  ]

  return (
    <Layout>
      <h1 className="text-2xl font-semibold mb-6">数据分析</h1>
      <div className="space-y-6">
        {posts.map((post) => (
          <Card key={post.id}>
            <CardHeader>
              <CardTitle>{post.content}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500">展示次数</p>
                  <p className="text-2xl font-bold">{post.impressions}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">互动次数</p>
                  <p className="text-2xl font-bold">{post.engagements}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">转发次数</p>
                  <p className="text-2xl font-bold">{post.retweets}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </Layout>
  )
}

