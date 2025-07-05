import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, firstName: string, lastName: string, userType: 'doctor' | 'patient', specialtyId?: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // If user just signed up and is a doctor, create doctor profile
        if (event === 'SIGNED_UP' && session?.user) {
          const userType = session.user.user_metadata?.user_type;
          const specialtyId = session.user.user_metadata?.specialty_id;
          
          if (userType === 'doctor' && specialtyId) {
            try {
              // Wait a bit for the profile to be created by the trigger
              await new Promise(resolve => setTimeout(resolve, 1000));
              
              // Create doctor profile
              const { error: doctorError } = await supabase
                .from('doctors')
                .insert({
                  user_id: session.user.id,
                  specialty_id: specialtyId,
                  years_of_experience: 0 // Default value, can be updated later
                });
              
              if (doctorError) {
                console.error('Error creating doctor profile:', doctorError);
              }
            } catch (error) {
              console.error('Error in doctor profile creation:', error);
            }
          } else if (userType === 'patient') {
            try {
              // Wait a bit for the profile to be created by the trigger
              await new Promise(resolve => setTimeout(resolve, 1000));
              
              // Create patient profile
              const { error: patientError } = await supabase
                .from('patients')
                .insert({
                  user_id: session.user.id
                });
              
              if (patientError) {
                console.error('Error creating patient profile:', patientError);
              }
            } catch (error) {
              console.error('Error in patient profile creation:', error);
            }
          }
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, firstName: string, lastName: string, userType: 'doctor' | 'patient', specialtyId?: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const userData: any = {
      first_name: firstName,
      last_name: lastName,
      user_type: userType
    };

    // Add specialty_id for doctors
    if (userType === 'doctor' && specialtyId) {
      userData.specialty_id = specialtyId;
    }
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: userData
      }
    });
    
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};