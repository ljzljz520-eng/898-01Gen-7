import { Link } from 'react-router-dom'
import { ChefHat, Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FooterProps {
  className?: string
}

export default function Footer({ className }: FooterProps) {
  return (
    <footer
      className={cn(
        'bg-gradient-warm border-t border-brown-100 pt-12 pb-6',
        className
      )}
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center shadow-md">
                <ChefHat className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-brown-700 font-display">
                邻里厨房
              </span>
            </Link>
            <p className="text-brown-500 text-sm leading-relaxed mb-4">
              分享美食，传递温暖。让邻里关系因美味而更加紧密，打造有温度的社区生活。
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 hover:bg-primary-200 transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 hover:bg-primary-200 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 hover:bg-primary-200 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-brown-700 mb-4">快速链接</h4>
            <ul className="space-y-2">
              {['首页', '菜谱', '拼菜活动', '共享厨房', '发布菜谱'].map((item) => (
                <li key={item}>
                  <Link
                    to="#"
                    className="text-brown-500 hover:text-primary-600 transition-colors text-sm"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-brown-700 mb-4">关于我们</h4>
            <ul className="space-y-2">
              {['平台介绍', '社区公约', '加入我们', '意见反馈', '帮助中心'].map((item) => (
                <li key={item}>
                  <Link
                    to="#"
                    className="text-brown-500 hover:text-primary-600 transition-colors text-sm"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-brown-700 mb-4">联系方式</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-brown-500">
                <MapPin className="w-4 h-4 text-primary-500 mt-0.5 flex-shrink-0" />
                <span>阳光社区服务中心 2楼</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-brown-500">
                <Phone className="w-4 h-4 text-primary-500 flex-shrink-0" />
                <span>400-888-8888</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-brown-500">
                <Mail className="w-4 h-4 text-primary-500 flex-shrink-0" />
                <span>hello@linlichufang.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-brown-200 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-brown-400 text-sm">
              © 2024 邻里厨房. All rights reserved. 用心分享每一道菜
            </p>
            <div className="flex gap-6 text-sm">
              <Link to="#" className="text-brown-400 hover:text-primary-600 transition-colors">
                隐私政策
              </Link>
              <Link to="#" className="text-brown-400 hover:text-primary-600 transition-colors">
                服务条款
              </Link>
              <Link to="#" className="text-brown-400 hover:text-primary-600 transition-colors">
                网站地图
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
