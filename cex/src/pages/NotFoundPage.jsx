import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="container mx-auto p-4 text-center">
      <div className="py-16">
        <h1 className="text-4xl font-bold text-white mb-4">404</h1>
        <p className="text-xl text-gray-400 mb-8">页面未找到</p>
        <Link to="/" className="btn-primary px-6 py-3">
          返回首页
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;