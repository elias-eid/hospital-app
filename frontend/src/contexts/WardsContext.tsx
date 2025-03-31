/**
 * Wards Context Provider Component
 *
 * Provides access to ward data with:
 * - Fetching and updating ward records
 * - Persistent loading state during data fetching
 * - Method to refresh ward data
 *
 * @component
 * @param {React.ReactNode} children - Child components that can consume the context
 *
 * @returns {WardsContextType} Wards context containing wards, loading state, and refresh function
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Ward } from '../types';

interface WardsContextType {
    wards: Ward[];
    loading: boolean;
    refreshWards: () => Promise<void>;
}

const WardsContext = createContext<WardsContextType | undefined>(undefined);

export const WardsProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const [wards, setWards] = useState<Ward[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchWards = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:5000/api/wards');
            const data: Ward[] = await response.json();
            setWards(data);
        } catch (error) {
            console.error('Error fetching wards:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWards();
    }, []);

    return (
        <WardsContext.Provider value={{ wards, loading, refreshWards: fetchWards }}>
            {children}
        </WardsContext.Provider>
    );
};

export const useWards = () => {
    const context = useContext(WardsContext);
    if (context === undefined) {
        throw new Error('useWards must be used within a WardsProvider');
    }
    return context;
};