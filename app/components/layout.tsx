import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Database, Send, BarChart2 } from 'lucide-react'

const navItems = [
  { href: '/', label: '仪表板', icon: LayoutDashboard },
  { href: '/data-collection', label: '数据采集', icon: Database },
  { href: '/post-scheduler', label: '发布计划', icon: Send },
  { href: '/analytics', label: '数据分析', icon: BarChart2 },
]

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-md">
        <nav className="mt-5 px-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`mt-1 group flex items-center px-2 py-2 text-base leading-6 font-medium rounded-md hover:text-indigo-600 hover:bg-gray-50 ${
                pathname === item.href ? 'text-indigo-600 bg-gray-100' : 'text-gray-600'
              }`}
            >
              <item.icon className="mr-4 h-6 w-6" />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 overflow-y-auto p-5">
        {children}
      </main>
    </div>
  )
}

