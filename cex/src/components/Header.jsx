import React, { useState } from 'react';
import { Menu, X, User, Settings, Bell, Search } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <header className="bg-slate-950 border-b border-slate-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold gradient-text">
                <a href="/">CryptoEx</a>
              </h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:ml-8 md:flex md:space-x-8">
              <a href="#" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                交易
              </a>
              <a href="#" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                现货
              </a>
              <a href="#" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                合约
              </a>
              <a href="#" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                资产
              </a>
              <a href="#" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                理财
              </a>
            </nav>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-slate-600 rounded-lg bg-slate-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="搜索交易对..."
              />
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="p-2 text-gray-400 hover:text-white transition-colors">
              <Bell className="h-5 w-5" />
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2 p-2 text-gray-400 hover:text-white transition-colors"
              >
                <User className="h-5 w-5" />
                <span className="hidden md:block text-sm">账户</span>
              </button>

              {isUserMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-lg py-1 z-50"
                  onMouseLeave={() => setIsUserMenuOpen(false)}
                  onMouseEnter={() => setIsUserMenuOpen(true)}
                >
                  <a href="#" className="block px-4 py-2 text-sm text-gray-300 hover:bg-slate-700 hover:text-white">
                    个人资料
                  </a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-300 hover:bg-slate-700 hover:text-white">
                    安全设置
                  </a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-300 hover:bg-slate-700 hover:text-white">
                    API管理
                  </a>
                  <hr className="my-1 border-slate-700" />
                  <a href="#" className="block px-4 py-2 text-sm text-gray-300 hover:bg-slate-700 hover:text-white">
                    退出登录
                  </a>
                </div>
              )}
            </div>

            {/* Login/Register Buttons */}
            <div className="hidden md:flex items-center space-x-2">
              <button className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors">
                登录
              </button>
              <button className="btn-primary text-sm">
                注册
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 border-t border-slate-700">
              <a href="#" className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-slate-700 rounded-md">
                交易
              </a>
              <a href="#" className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-slate-700 rounded-md">
                现货
              </a>
              <a href="#" className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-slate-700 rounded-md">
                合约
              </a>
              <a href="#" className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-slate-700 rounded-md">
                资产
              </a>
              <a href="#" className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-slate-700 rounded-md">
                理财
              </a>
              <div className="pt-4 pb-3 border-t border-slate-700">
                <div className="flex items-center px-3 space-x-3">
                  <button className="btn-primary w-full">登录</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;