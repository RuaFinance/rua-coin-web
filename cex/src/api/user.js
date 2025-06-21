import api from './index';

/**
 * 用户登录
 * @param {Object} credentials - 登录凭证
 * @param {string} credentials.email - 用户邮箱
 * @param {string} credentials.password - 用户密码
 */
export const login = async (credentials) => {
  try {
    // 实际项目中应该使用API请求
    // return await api.post('/user/login', credentials);
    
    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // 模拟成功登录
    if (credentials.email && credentials.password) {
      const token = 'mock-jwt-token-' + Date.now();
      localStorage.setItem('token', token);
      
      return {
        token,
        user: {
          id: 1,
          email: credentials.email,
          username: credentials.email.split('@')[0],
          avatar: null
        }
      };
    } else {
      throw new Error('Invalid credentials');
    }
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

/**
 * 用户注册
 * @param {Object} userData - 用户数据
 */
export const register = async (userData) => {
  try {
    // 实际项目中应该使用API请求
    // return await api.post('/user/register', userData);
    
    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 模拟成功注册
    if (userData.email && userData.password && userData.password === userData.confirmPassword) {
      return {
        success: true,
        message: '注册成功，请登录'
      };
    } else {
      throw new Error('Invalid registration data');
    }
  } catch (error) {
    console.error('Registration failed:', error);
    throw error;
  }
};

/**
 * 用户登出
 */
export const logout = async () => {
  try {
    // 实际项目中应该使用API请求
    // return await api.post('/user/logout');
    
    // 清除本地存储的token
    localStorage.removeItem('token');
    
    return {
      success: true,
      message: '已成功登出'
    };
  } catch (error) {
    console.error('Logout failed:', error);
    throw error;
  }
};

/**
 * 获取用户信息
 */
export const getUserInfo = async () => {
  try {
    // 实际项目中应该使用API请求
    // return await api.get('/user/info');
    
    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // 检查是否有token
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Not authenticated');
    }
    
    // 模拟用户数据
    return {
      id: 1,
      username: 'user123',
      email: 'user@example.com',
      avatar: null,
      kycLevel: 1,
      createdAt: '2023-01-15T08:30:00Z'
    };
  } catch (error) {
    console.error('Failed to get user info:', error);
    throw error;
  }
};