import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define user types
type UserRole = 'manager' | 'employee';

type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  employeeId: string;
  location: string;
  jobTitle: string;
  profileImage?: string;
};

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isSignedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: Omit<User, 'id'> & { password: string }) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing user session on app start
  useEffect(() => {
    const loadUser = async () => {
      try {
        const userJSON = await AsyncStorage.getItem('@user');
        if (userJSON) {
          setUser(JSON.parse(userJSON));
        }
      } catch (error) {
        console.error('Failed to load user from storage', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // In a real app, this would be an API call to authenticate
      // For demo purposes, we'll simulate successful authentication with mock data
      
      // Mock API response
      const mockUser: User = {
        id: '123456',
        name: 'Nishant Mishra',
        email: email,
        role: email.includes('manager') ? 'manager' : 'employee',
        employeeId: 'EMP12345',
        location: 'Downtown Restaurant',
        jobTitle: 'Head Chef',
        profileImage: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?q=80&w=3077&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      };
      
      // Store user in state and AsyncStorage
      setUser(mockUser);
      await AsyncStorage.setItem('@user', JSON.stringify(mockUser));
      
    } catch (error) {
      console.error('Login failed', error);
      throw new Error('Login failed. Please check your credentials and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Signup function
  const signup = async (userData: Omit<User, 'id'> & { password: string }) => {
    try {
      setIsLoading(true);
      
      // In a real app, this would be an API call to register the user
      // For demo purposes, we'll simulate successful registration
      
      // Mock API response
      const mockUser: User = {
        id: Date.now().toString(), // Generate fake ID
        name: userData.name,
        email: userData.email,
        role: userData.role,
        employeeId: userData.employeeId,
        location: userData.location,
        jobTitle: userData.jobTitle,
        profileImage: userData.profileImage
      };
      
      // Store user in state and AsyncStorage
      setUser(mockUser);
      await AsyncStorage.setItem('@user', JSON.stringify(mockUser));
      
    } catch (error) {
      console.error('Signup failed', error);
      throw new Error('Signup failed. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setIsLoading(true);
      
      // Clear user from state and AsyncStorage
      setUser(null);
      await AsyncStorage.removeItem('@user');
      
    } catch (error) {
      console.error('Logout failed', error);
      throw new Error('Logout failed. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Forgot password function
  const forgotPassword = async (email: string) => {
    try {
      setIsLoading(true);
      
      // In a real app, this would be an API call to request password reset
      // For demo purposes, we'll just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Success - in a real app this would send an email to the user
      console.log('Password reset requested for', email);
      
    } catch (error) {
      console.error('Password reset request failed', error);
      throw new Error('Password reset request failed. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isLoading, 
        isSignedIn: !!user, 
        login, 
        signup, 
        logout, 
        forgotPassword 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};