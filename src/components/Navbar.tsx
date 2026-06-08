import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChefHat, Home, BookOpen, Users, Utensils, PlusCircle, User, Settings, Menu, X, ChevronDown, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { Tag } from '@/components/ui/Tag'
import { useStore } from '@/store/useStore'
import type { User as UserType } from '../../shared/types'

interface NavbarProps {
  className?: string
}

const menuItems = [
  { label: '首页', href: '/', icon: Home },
  { label: '拼菜', href: '/potlucks', icon: Users },
  { label: '共享厨房', href: '/kitchens', icon: Utensils },
  { label: '发布菜谱', href: '/publish', icon: PlusCircle },
  { label: '节日专题', href: '/specials', icon: BookOpen },
  { label: '个人中心', href: '/profile', icon: User },
  { label: '管理后台', href: '/admin', icon: Settings, admin: true },
]

export default function Navbar({ className }: NavbarProps) {
  const location = useLocation()
  const { currentUser, allUsers, fetchCurrentUser, fetchAllUsers, switchUser } = useStore()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  useEffect(() => {
    fetchCurrentUser()
    fetchAllUsers()
  }, [fetchCurrentUser, fetchAllUsers])

  const handleSwitchUser = async (user: UserType) => {
    await switchUser(user.id)
    setUserMenuOpen(false)
  }

  const visibleMenuItems = menuItems.filter(item => {
    if (item.admin) {
      return currentUser?.role === 'admin'
    }
    return true
  })

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
            {visibleMenuItems.map((item) => {
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
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-brown-200 hover:border-primary-300 transition-colors"
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <span className="text-sm font-medium text-brown-700">{currentUser.name}</span>
                  {currentUser.role === 'admin' && (
                    <Tag variant="warning" size="sm" className="bg-yellow-100 text-yellow-700">
                      管理员
                    </Tag>
                  )}
                  <ChevronDown className={cn('w-4 h-4 text-brown-400 transition-transform', userMenuOpen && 'rotate-180')} />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-lg border border-brown-100 py-2 animate-fade-in z-50">
                    <div className="px-4 py-2 border-b border-brown-100">
                      <p className="text-xs text-brown-400 mb-2">切换身份</p>
                      <div className="space-y-1">
                        {allUsers.map((user) => (
                          <button
                            key={user.id}
                            onClick={() => handleSwitchUser(user)}
                            className={cn(
                              'w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-left transition-colors',
                              currentUser.id === user.id
                                ? 'bg-primary-50 text-primary-700'
                                : 'hover:bg-warm-50 text-brown-600'
                            )}
                          >
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="w-6 h-6 rounded-full object-cover"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{user.name}</p>
                              <p className="text-xs text-brown-400">{user.building}</p>
                            </div>
                            {user.role === 'admin' && (
                              <Tag variant="warning" size="sm" className="bg-yellow-100 text-yellow-700">
                                管理员
                              </Tag>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="px-2 pt-2">
                      <button className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-brown-500 hover:bg-red-50 hover:text-red-600 transition-colors">
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm">退出登录</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Button variant="outline" size="sm">
                  登录
                </Button>
                <Button variant="primary" size="sm">
                  注册
                </Button>
              </>
            )}
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
              {visibleMenuItems.map((item) => {
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

              {currentUser && (
                <div className="mt-2 pt-2 border-t border-brown-100">
                  <p className="text-xs text-brown-400 px-4 mb-2">当前身份</p>
                  <div className="flex items-center gap-3 px-4 py-2">
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium text-brown-700">{currentUser.name}</p>
                      <p className="text-xs text-brown-400">{currentUser.building}</p>
                    </div>
                    {currentUser.role === 'admin' && (
                      <Tag variant="warning" size="sm" className="bg-yellow-100 text-yellow-700">
                        管理员
                      </Tag>
                    )}
                  </div>
                  <div className="mt-2 px-4">
                    <p className="text-xs text-brown-400 mb-2">切换身份</p>
                    <div className="flex flex-wrap gap-2">
                      {allUsers.map((user) => (
                        <button
                          key={user.id}
                          onClick={() => {
                            handleSwitchUser(user)
                            setMobileMenuOpen(false)
                          }}
                          className={cn(
                            'flex items-center gap-1.5 px-2 py-1 rounded-full text-xs transition-colors',
                            currentUser.id === user.id
                              ? 'bg-primary-100 text-primary-700'
                              : 'bg-white text-brown-600 hover:bg-warm-100'
                          )}
                        >
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-5 h-5 rounded-full object-cover"
                          />
                          <span>{user.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
