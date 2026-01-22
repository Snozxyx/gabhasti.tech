import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
    user: User | null;
    session: Session | null;
    loading: boolean;
    isAdmin: boolean;
    refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const isAbortError = (error: any) => {
    if (!error) return false;
    return (
        error.name === 'AbortError' ||
        error.message?.includes('AbortError') ||
        error.message?.includes('signal is aborted')
    );
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    const lastUserId = useRef<string | null>(null);
    const adminCheckPromise = useRef<Promise<void> | null>(null);
    const isRefreshing = useRef(false);

    const checkAdminStatus = async (userId: string) => {
        // If we already verified this user, skip
        if (lastUserId.current === userId) {
            console.log('[AuthContext] Already verified user, skipping check');
            return;
        }

        // If a check is already in progress, wait for it
        if (adminCheckPromise.current) {
            console.log('[AuthContext] Waiting for existing admin check...');
            return adminCheckPromise.current;
        }

        console.log('[AuthContext] Starting admin check for:', userId);
        adminCheckPromise.current = (async () => {
            try {
                // Add timeout to prevent hanging
                const timeoutId = setTimeout(() => {
                    console.error('[AuthContext] Admin check timeout - taking too long');
                }, 10000);

                const { data, error } = await supabase
                    .from('user_roles')
                    .select('role')
                    .eq('user_id', userId)
                    .maybeSingle();

                clearTimeout(timeoutId);

                if (error) {
                    if (!isAbortError(error)) {
                        console.error('[AuthContext] Admin check error:', error);
                    }
                    setIsAdmin(false);
                    return;
                }

                console.log('[AuthContext] Admin check result:', data?.role);
                setIsAdmin(data?.role === 'admin');
                lastUserId.current = userId;
            } catch (err: any) {
                if (!isAbortError(err)) {
                    console.error('[AuthContext] Admin check exception:', err);
                    if (err.message === 'Admin check timeout') {
                        console.error('[AuthContext] Admin check timed out after 10 seconds');
                    }
                }
                setIsAdmin(false);
            } finally {
                adminCheckPromise.current = null;
                console.log('[AuthContext] Admin check complete');
            }
        })();

        return adminCheckPromise.current;
    };

    const refresh = async () => {
        if (isRefreshing.current) return;
        isRefreshing.current = true;

        try {
            console.log('[AuthContext] Refreshing session...');
            const { data: { session: currentSession }, error } = await supabase.auth.getSession();

            if (error) {
                if (!isAbortError(error)) {
                    console.error('[AuthContext] getSession failed:', error);
                    throw error;
                }
                return;
            }

            setSession(currentSession);
            setUser(currentSession?.user ?? null);

            if (currentSession?.user) {
                await checkAdminStatus(currentSession.user.id);
            } else {
                setIsAdmin(false);
                lastUserId.current = null;
            }
        } catch (error) {
            if (!isAbortError(error)) {
                console.error('[AuthContext] Auth initialization failed:', error);
            }
        } finally {
            isRefreshing.current = false;
            setLoading(false);
            console.log('[AuthContext] Auth initialization complete, loading=false');
        }
    };

    useEffect(() => {
        console.log('[AuthContext] Provider mounted');
        refresh();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
            console.log('[AuthContext] Auth state change:', event);

            setSession(currentSession);
            setUser(currentSession?.user ?? null);

            if (currentSession?.user) {
                // Don't await - let it run in background, but set loading to false
                checkAdminStatus(currentSession.user.id).catch(err => {
                    console.error('[AuthContext] Admin check failed in auth state change:', err);
                });
            } else {
                setIsAdmin(false);
                lastUserId.current = null;
            }

            // Set loading to false immediately - don't wait for admin check
            setLoading(false);
            console.log('[AuthContext] State transition complete, loading=false');
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    return (
        <AuthContext.Provider value={{ user, session, loading, isAdmin, refresh }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuthContext must be used within an AuthProvider');
    }
    return context;
};
