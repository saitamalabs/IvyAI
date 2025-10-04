"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  name: string | null;
  email: string | null;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
}

interface AuthContextType {
  user: GitHubUser | null;
  accessToken: string | null;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
  setUser: (user: GitHubUser | null) => void;
  setAccessToken: (token: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user and token on mount
    const storedUser = localStorage.getItem('github_user');
    const storedToken = localStorage.getItem('github_token');
    
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setAccessToken(storedToken);
    }
    
    setIsLoading(false);
  }, []);

  const login = () => {
    const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
    const redirectUri = process.env.NEXT_PUBLIC_GITHUB_REDIRECT_URI || `${window.location.origin}/api/auth/callback`;
    const scope = 'repo read:user';
    
    if (!clientId) {
      console.error('GitHub Client ID not configured');
      alert('GitHub OAuth is not configured. Please set NEXT_PUBLIC_GITHUB_CLIENT_ID in your environment variables.');
      return;
    }
    
    console.log('[AuthContext] Starting GitHub OAuth flow');
    console.log('[AuthContext] Redirect URI:', redirectUri);
    
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}`;
    window.location.href = githubAuthUrl;
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem('github_user');
    localStorage.removeItem('github_token');
    window.location.href = '/';
  };

  const handleSetUser = (user: GitHubUser | null) => {
    setUser(user);
    if (user) {
      localStorage.setItem('github_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('github_user');
    }
  };

  const handleSetAccessToken = (token: string | null) => {
    setAccessToken(token);
    if (token) {
      localStorage.setItem('github_token', token);
    } else {
      localStorage.removeItem('github_token');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isLoading,
        login,
        logout,
        setUser: handleSetUser,
        setAccessToken: handleSetAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}