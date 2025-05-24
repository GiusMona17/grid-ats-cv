// Authentication service for CV application

export interface AuthState {
  isAuthenticated: boolean;
  timestamp?: number;
}

// Session duration in milliseconds (2 hours)
const SESSION_DURATION = 2 * 60 * 60 * 1000;

export const checkAuthentication = (): boolean => {
  const isAuthenticated = localStorage.getItem('cv-authenticated') === 'true';
  const timestamp = localStorage.getItem('cv-auth-timestamp');
  
  if (!isAuthenticated || !timestamp) {
    return false;
  }

  const authTime = parseInt(timestamp, 10);
  const now = Date.now();
  
  // Check if session has expired
  if (now - authTime > SESSION_DURATION) {
    logout();
    return false;
  }

  return true;
};

export const login = (): void => {
  localStorage.setItem('cv-authenticated', 'true');
  localStorage.setItem('cv-auth-timestamp', Date.now().toString());
};

export const logout = (): void => {
  localStorage.removeItem('cv-authenticated');
  localStorage.removeItem('cv-auth-timestamp');
};

export const extendSession = (): void => {
  if (checkAuthentication()) {
    localStorage.setItem('cv-auth-timestamp', Date.now().toString());
  }
};

// Auto-logout after session expires
export const startSessionCheck = (onSessionExpired?: () => void): () => void => {
  const interval = setInterval(() => {
    // Only check if currently authenticated
    const isCurrentlyAuth = localStorage.getItem('cv-authenticated') === 'true';
    
    if (isCurrentlyAuth && !checkAuthentication() && onSessionExpired) {
      onSessionExpired();
      clearInterval(interval); // Stop checking after expiration
    }
  }, 60000); // Check every minute

  // Return cleanup function
  return () => clearInterval(interval);
};