// Copyright 2025 chenjjiaa
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { createBrowserRouter } from 'react-router-dom';

import Layout from '../layouts/Layout';
import UserLayout from '../layouts/UserLayout';
import DeviceTestPage from '../pages/DeviceTestPage';
import FooterTestPage from '../pages/FooterTestPage';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import NotFoundPage from '../pages/NotFoundPage';
import RegisterPage from '../pages/RegisterPage';
import TradingPage from '../pages/TradingPage';
import UserDashboard from '../pages/UserDashboard';

import { BASE_URL } from './config';

const router = createBrowserRouter(
  [{
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'trading/:symbol',
        element: <TradingPage />,
      },
      {
        path: 'register',
        element: <RegisterPage />,
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'footer-test',
        element: <FooterTestPage />,
      },
      {
        path: 'device-test',
        element: <DeviceTestPage />,
      },
      {
        path: 'user',
        element: <UserLayout />,
        children: [
          {
            path: 'dashboard',
            element: <UserDashboard />,
          },
          {
            path: 'assets/spot',
            element: <div className="text-white p-8">现货账户页面 - 开发中</div>,
          },
          {
            path: 'assets/futures',
            element: <div className="text-white p-8">合约账户页面 - 开发中</div>,
          },
          {
            path: 'assets/earn',
            element: <div className="text-white p-8">理财账户页面 - 开发中</div>,
          },
          {
            path: 'assets/history',
            element: <div className="text-white p-8">资金流水页面 - 开发中</div>,
          },
          {
            path: 'orders/spot',
            element: <div className="text-white p-8">现货订单页面 - 开发中</div>,
          },
          {
            path: 'orders/futures',
            element: <div className="text-white p-8">合约订单页面 - 开发中</div>,
          },
          {
            path: 'orders/history',
            element: <div className="text-white p-8">订单历史页面 - 开发中</div>,
          },
          {
            path: 'account',
            element: <div className="text-white p-8">账户信息页面 - 开发中</div>,
          },
          {
            path: 'security',
            element: <div className="text-white p-8">安全设置页面 - 开发中</div>,
          },
          {
            path: 'api',
            element: <div className="text-white p-8">API管理页面 - 开发中</div>,
          },
          {
            path: 'rewards',
            element: <div className="text-white p-8">奖励页面 - 开发中</div>,
          },
          {
            path: 'settings/preferences',
            element: <div className="text-white p-8">偏好设置页面 - 开发中</div>,
          },
          {
            path: 'settings/notifications',
            element: <div className="text-white p-8">通知设置页面 - 开发中</div>,
          },
          {
            path: 'help',
            element: <div className="text-white p-8">帮助中心页面 - 开发中</div>,
          },
        ],
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  }],
  {
    basename: BASE_URL,
  },);

export default router;
