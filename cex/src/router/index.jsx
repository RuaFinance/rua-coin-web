import { createBrowserRouter } from 'react-router-dom';

import Layout from '../layouts/Layout';
import HomePage from '../pages/HomePage';
import NotFoundPage from '../pages/NotFoundPage';
import TradingPage from '../pages/TradingPage';

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
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  }],
  {
    basename: BASE_URL,
  },);

export default router;
