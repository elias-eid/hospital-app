/**
 * Nurses Context Provider Component
 *
 * Provides access to nurse data with:
 * - Fetching and updating nurse records
 * - Persistent loading state during data fetching
 * - Method to refresh nurse data
 *
 * @component
 * @param {React.ReactNode} children - Child components that can consume the context
 *
 * @returns {NursesContextType} Nurses context containing nurses, wards, loading state, and refresh functions
 */

import React, {createContext, useContext, useState, useEffect, useCallback} from 'react';
import { Nurse, Ward } from '../types';

interface NursesContextType {
    nurses: Nurse[];
    wards: Ward[];
    loading: boolean;
    refreshNurses: () => Promise<void>;
    refreshWards: () => Promise<void>;
}

const NursesContext = createContext<NursesContextType | undefined>(undefined);

export const NursesProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const [nurses, setNurses] = useState<Nurse[]>([]);
    const [wards, setWards] = useState<Ward[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchNurses = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/nurses');
            const data: Nurse[] = await response.json();
            setNurses(data);
        } catch (error) {
            console.error('Error fetching nurses:', error);
        }
    };

    const fetchWards = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/wards');
            const data: Ward[] = await response.json();
            setWards(data);
        } catch (error) {
            console.error('Error fetching wards:', error);
        }
    };

    const fetchAllData = useCallback(async () => {
        setLoading(true);
        try {
            await Promise.all([fetchNurses(), fetchWards()]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAllData();
    }, [fetchAllData]);

    return (
        <NursesContext.Provider value={{
            nurses,
            wards,
            loading,
            refreshNurses: fetchNurses,
            refreshWards: fetchWards
        }}>
            {children}
        </NursesContext.Provider>
    );
};

export const useNurses = () => {
    const context = useContext(NursesContext);
    if (context === undefined) {
        throw new Error('useNurses must be used within a NursesProvider');
    }
    return context;
};