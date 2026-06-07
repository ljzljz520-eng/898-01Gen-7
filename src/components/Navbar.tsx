import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChefHat, Home, BookOpen, Users, Utensils, PlusCircle, User, Settings, Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'

interface NavbarProps {
  className?: string
}

const menuItems = [
  { label: '首页', href: '/', icon: Home },
  { label: '菜谱', href: '/recipes', icon: BookOpen },
  { label: '拼菜', href: '/potlucks', icon: Users },
  { label: '共享厨房', href: '/kitchens', icon: Utensils },
  { label: '发布菜谱', href: '/recipes/publish', icon: PlusCircle },
  { label: '个人中心', href: '/profile', icon: User },
  { label: '管理后台', href: '/admin', icon: Settings, admin: true },
]

export default function Navbar({ className }: NavbarProps) {
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav
      className={cn(
        'sticky top-0 z-50 w-full bg-warm-50/90 backdrop-blur-md border-b border-brown-100 shadow-sm',
        className
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <ChefHat className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-brown-700 font-display hidden sm:block">
              邻里厨房
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    'flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-gradient-primary text-white shadow-md'
                      : 'text-brown-600 hover:bg-primary-50 hover:text-primary-600'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <Button variant="outline" size="sm">
              登录
            </Button>
            <Button variant="primary" size="sm">
              注册
            </Button>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-full hover:bg-primary-50 transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-brown-600" />
            ) : (
              <Menu className="w-6 h-6 text-brown-600" />
            )}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-brown-100 animate-fade-in">
            <div className="flex flex-col gap-2">
              {menuItems.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.href
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                      isActive
                        ? 'bg-gradient-primary text-white shadow-md'
                        : 'text-brown-600 hover:bg-primary-50'
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  登录
                </Button>
                <Button variant="primary" size="sm" className="flex-1">
                  注册
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
