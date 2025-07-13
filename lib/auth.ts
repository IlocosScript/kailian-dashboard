'use client';

// Simple client-side auth utilities
export const AUTH_CONFIG = {
  SESSION_DURATION: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
};

export const authUtils = {
  // Check if user is logged in
  isLoggedIn: (): boolean => {
    if (typeof window === 'undefined') return false;
    
    const isLoggedIn = localStorage.getItem('isAdminLoggedIn');
    const loginTime = localStorage.getItem('adminLoginTime');
    
    if (!isLoggedIn || !loginTime) return false;
    
    // Check if session has expired
    const now = Date.now();
    const loginTimestamp = parseInt(loginTime);
    
    if (now - loginTimestamp > AUTH_CONFIG.SESSION_DURATION) {
      // Session expired, clear storage
      authUtils.logout();
      return false;
    }
    
    return isLoggedIn === 'true';
  },

  // Logout user
  logout: (): void => {
    if (typeof window === 'undefined') return;
    
    localStorage.removeItem('isAdminLoggedIn');
    localStorage.removeItem('adminLoginTime');
  },

  // Get session info
  getSessionInfo: () => {
    if (typeof window === 'undefined') return null;
    
    const loginTime = localStorage.getItem('adminLoginTime');
    if (!loginTime) return null;
    
    const loginTimestamp = parseInt(loginTime);
    const expiresAt = loginTimestamp + AUTH_CONFIG.SESSION_DURATION;
    
    return {
      loginTime: new Date(loginTimestamp),
      expiresAt: new Date(expiresAt),
      isExpired: Date.now() > expiresAt,
    };
  },

  // Extend session
  extendSession: (): void => {
    if (typeof window === 'undefined') return;
    
    if (authUtils.isLoggedIn()) {
      localStorage.setItem('adminLoginTime', Date.now().toString());
    }
  },
};