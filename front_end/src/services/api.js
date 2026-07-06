// src/services/api.js
import axios from 'axios';

// ============================================
// Base Configuration
// ============================================

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
  withCredentials: true,
});

// ============================================
// Request Interceptor - Add Token
// ============================================

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ============================================
// Response Interceptor - Handle Token Refresh
// ============================================

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and not already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        // Call refresh token endpoint
        const response = await axios.post(`${API_URL}/auth/refresh-token`, {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data.data;

        // Save new tokens
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', newRefreshToken);

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axios(originalRequest);

      } catch (refreshError) {
        // Refresh failed - logout user
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// ============================================
// ============================================
// AUTH API
// ============================================
// ============================================

export const authAPI = {
  // Register
  register: (data) => api.post('/auth/register', data),
  
  // Login
  login: (data) => api.post('/auth/login', data),
  
  // Refresh Token
  refreshToken: (refreshToken) => api.post('/auth/refresh-token', { refreshToken }),
  
  // Logout
  logout: (refreshToken) => api.post('/auth/logout', { refreshToken }),
  
  // Get Current User
  getMe: () => api.get('/auth/me'),
  
  // Change Password
  changePassword: (data) => api.patch('/auth/change-password', data),
};

// ============================================
// ============================================
// USER API
// ============================================
// ============================================

export const userAPI = {
  // Get Profile
  getProfile: () => api.get('/users/profile'),
  
  // Update Profile
  updateProfile: (data) => api.patch('/users/profile', data),
  
  // Upload Profile Image
  uploadProfileImage: (file) => {
    const formData = new FormData();
    formData.append('profileImage', file);
    return api.post('/users/profile-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

// ============================================
// ============================================
// POST API
// ============================================
// ============================================

export const postAPI = {
  // Get Feed Posts (with pagination)
  getFeed: (page = 1, limit = 20) => 
    api.get(`/posts?page=${page}&limit=${limit}`),
  
  // Get Single Post
  getPost: (id) => api.get(`/posts/${id}`),
  
  // Create Post (with image)
  createPost: (data, imageFile = null) => {
    if (imageFile) {
      const formData = new FormData();
      formData.append('content', data.content);
      formData.append('visibility', data.visibility || 'PUBLIC');
      formData.append('image', imageFile);
      
      return api.post('/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    }
    return api.post('/posts', data);
  },
  
  // Update Post
  updatePost: (id, data) => api.patch(`/posts/${id}`, data),
  
  // Delete Post
  deletePost: (id) => api.delete(`/posts/${id}`),
  
  // Like Post
  likePost: (id) => api.post(`/posts/${id}/like`),
  
  // Unlike Post
  unlikePost: (id) => api.delete(`/posts/${id}/like`),
  
  // Get Post Likes
  getPostLikes: (id, page = 1, limit = 20) => 
    api.get(`/posts/${id}/likes?page=${page}&limit=${limit}`),
};

// ============================================
// ============================================
// COMMENT API
// ============================================
// ============================================

export const commentAPI = {
  // Get Comments for Post
  getComments: (postId, page = 1, limit = 20) => 
    api.get(`/comments/post/${postId}?page=${page}&limit=${limit}`),
  
  // Create Comment
  createComment: (data) => api.post('/comments', data),
  
  // Update Comment
  updateComment: (id, data) => api.patch(`/comments/${id}`, data),
  
  // Delete Comment
  deleteComment: (id) => api.delete(`/comments/${id}`),
  
  // Like Comment
  likeComment: (id) => api.post(`/comments/${id}/like`),
  
  // Unlike Comment
  unlikeComment: (id) => api.delete(`/comments/${id}/like`),
  
  // Get Comment Likes
  getCommentLikes: (id, page = 1, limit = 20) => 
    api.get(`/comments/${id}/likes?page=${page}&limit=${limit}`),
};

// ============================================
// ============================================
// REPLY API
// ============================================
// ============================================

export const replyAPI = {
  // Get Replies for Comment
  getReplies: (commentId, page = 1, limit = 20) => 
    api.get(`/replies/comment/${commentId}?page=${page}&limit=${limit}`),
  
  // Create Reply
  createReply: (data) => api.post('/replies', data),
  
  // Update Reply
  updateReply: (id, data) => api.patch(`/replies/${id}`, data),
  
  // Delete Reply
  deleteReply: (id) => api.delete(`/replies/${id}`),
  
  // Like Reply
  likeReply: (id) => api.post(`/replies/${id}/like`),
  
  // Unlike Reply
  unlikeReply: (id) => api.delete(`/replies/${id}/like`),
  
  // Get Reply Likes
  getReplyLikes: (id, page = 1, limit = 20) => 
    api.get(`/replies/${id}/likes?page=${page}&limit=${limit}`),
};

// ============================================
// ============================================
// LIKE API (Alternative way)
// ============================================
// ============================================

export const likeAPI = {
  // Post Likes
  likePost: (id) => api.post(`/likes/posts/${id}/like`),
  unlikePost: (id) => api.delete(`/likes/posts/${id}/like`),
  getPostLikes: (id, page = 1, limit = 20) => 
    api.get(`/likes/posts/${id}/likes?page=${page}&limit=${limit}`),
  
  // Comment Likes
  likeComment: (id) => api.post(`/likes/comments/${id}/like`),
  unlikeComment: (id) => api.delete(`/likes/comments/${id}/like`),
  getCommentLikes: (id, page = 1, limit = 20) => 
    api.get(`/likes/comments/${id}/likes?page=${page}&limit=${limit}`),
  
  // Reply Likes
  likeReply: (id) => api.post(`/likes/replies/${id}/like`),
  unlikeReply: (id) => api.delete(`/likes/replies/${id}/like`),
  getReplyLikes: (id, page = 1, limit = 20) => 
    api.get(`/likes/replies/${id}/likes?page=${page}&limit=${limit}`),
};

 

export default api;