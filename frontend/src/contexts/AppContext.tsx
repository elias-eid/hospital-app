/**
 * Application Context Provider Component
 *
 * Provides global state management for the application with:
 * - Centralized access to nurses and wards data
 * - Synchronized loading state during data operations
 * - Refresh capabilities for both datasets
 *
 * @component
 * @param {React.ReactNode} children - Child components that consume the context
 *
 * @returns {AppContextType} Context containing:
 *   - nurses: Array of nurse records
 *   - wards: Array of ward records
 *   - loading: Boolean indicating fetch status
 *   - refreshNurses: Function to reload nurse data
 *   - refreshWards: Function to reload ward data
 *
 */

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Nurse, Ward } from '../types';

interface AppContextType {
    nurses: Nurse[];
    wards: Ward[];
    loading: boolean;
    refreshNurses: () => Promise<void>;
    refreshWards: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [nurses, setNurses] = useState<Nurse[]>([]);
    const [wards, setWards] = useState<Ward[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchNurses = useCallback(async () => {
        try {
            const response = await fetch('http://localhost:5000/api/nurses');
            const data = await response.json();
            setNurses(data);
        } catch (error) {
            console.error('Error fetching nurses:', error);
        }
    }, []);

    const fetchWards = useCallback(async () => {
        try {
            const response = await fetch('http://localhost:5000/api/wards');
            const data = await response.json();
            setWards(data);
        } catch (error) {
            console.error('Error fetching wards:', error);
        }
    }, []);

    const refreshAll = useCallback(async () => {
        setLoading(true);
        try {
            await Promise.all([fetchNurses(), fetchWards()]); // Wait for both
        } catch (error) {
            console.error("Error refreshing data:", error);
        } finally {
            setLoading(false); // Only set loading to false after both complete
        }
    }, [fetchNurses, fetchWards]);

    useEffect(() => {
        refreshAll();
    }, [refreshAll]);

    return (
        <AppContext.Provider value={{
            nurses,
            wards,
            loading,
            refreshNurses: refreshAll,
            refreshWards: refreshAll
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
};