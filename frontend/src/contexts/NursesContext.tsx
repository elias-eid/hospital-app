import React, { createContext, useContext, useState, useEffect } from 'react';
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

    const fetchAllData = async () => {
        setLoading(true);
        try {
            await Promise.all([fetchNurses(), fetchWards()]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, []);

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