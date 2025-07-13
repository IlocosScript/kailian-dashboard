'use client';

export interface AdminUser {
  username: string;
  role: string;
  loginTime: string;
}

export const authService = {
  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('isAuthenticated') === 'true';
  },

  // Get current user
  getCurrentUser: (): AdminUser | null => {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem('adminUser');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Logout user
  logout: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('adminUser');
  },

  // Check if user session is valid (spoofed - always true if authenticated)
  isSessionValid: (): boolean => {
    return authService.isAuthenticated();
  },
};