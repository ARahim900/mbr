import React, { useState, useMemo, useEffect } from 'react';
import { HvacEntry } from '../../types';
import { hvacData } from '../../database/hvacDatabase';
import { Wind, Search, ArrowUpDown, Edit, XCircle, Save, X } from 'lucide-react';
import Button from '../ui/Button';

const EditModal: React.FC<{ entry: HvacEntry; onSave: (entry: HvacEntry) => void; onClose: () => void; }> = ({ entry, onSave, onClose }) => {
    const [formData, setFormData] = useState<HvacEntry>(entry);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    const renderTextarea = (label: string, name: keyof HvacEntry, rows: number = 3) => (
        <div>
            <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
            <textarea
                id={name}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                rows={rows}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-accent focus:ring-accent sm:text-sm bg-gray-50 dark:bg-gray-700 p-2"
            />
        </div>
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center flex-shrink-0">
                    <h3 className="text-xl font-semibold text-primary dark:text-white">Edit HVAC Entry</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2 rounded-full">
                        <X size={24} />
                    </button>
                </div>
                <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                        <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Building</label>
                            <p className="mt-1 text-primary dark:text-gray-200 font-semibold">{formData.building}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Main System</label>
                             <p className="mt-1 text-primary dark:text-gray-200 font-semibold">{formData.mainSystem}</p>
                        </div>
                        <div>
                           <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Equipment</label>
                            <p className="mt-1 text-primary dark:text-gray-200 font-semibold">{formData.equipment}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {renderTextarea("PPM1 Findings", "ppm1Findings")}
                        {renderTextarea("PPM2 Findings", "ppm2Findings")}
                        {renderTextarea("PPM3 Findings", "ppm3Findings")}
                        {renderTextarea("PPM4 Findings", "ppm4Findings")}
                        {renderTextarea("Common Issues", "commonIssues")}
                        {renderTextarea("Fixed Issues", "fixedIssues")}
                    </div>
                     {renderTextarea("Notes", "notes", 4)}


                    <div className="pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-4 flex-shrink-0">
                        <Button type="button" onClick={onClose} className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500">
                            Cancel
                        </Button>
                        <Button type="submit" className="bg-accent text-white hover:bg-primary-dark flex items-center gap-2">
                            <Save size={16} /> Save Changes
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const HvacSystemModule: React.FC = () => {
    const [entries, setEntries] = useState<HvacEntry[]>(hvacData);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: keyof HvacEntry; direction: 'ascending' | 'descending' } | null>({ key: 'building', direction: 'ascending'});
    const [currentPage, setCurrentPage] = useState(1);
    const [editingEntry, setEditingEntry] = useState<HvacEntry | null>(null);
    const itemsPerPage = 10;

    const filteredEntries = useMemo(() => {
        return entries.filter(e => 
            Object.values(e).some(val => 
                String(val).toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [entries, searchTerm]);

    const sortedEntries = useMemo(() => {
        let sortableItems = [...filteredEntries];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                const aVal = a[sortConfig.key] || '';
                const bVal = b[sortConfig.key] || '';
                if (aVal < bVal) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (aVal > bVal) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [filteredEntries, sortConfig]);

    const paginatedEntries = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return sortedEntries.slice(startIndex, startIndex + itemsPerPage);
    }, [sortedEntries, currentPage]);

    const totalPages = Math.ceil(sortedEntries.length / itemsPerPage);

    const requestSort = (key: keyof HvacEntry) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
        setCurrentPage(1);
    };

    const handleSave = (updatedEntry: HvacEntry) => {
        setEntries(prevEntries => 
            prevEntries.map(e => e.id === updatedEntry.id ? updatedEntry : e)
        );
        setEditingEntry(null);
    };

    const resetFilters = () => {
        setSearchTerm('');
        setSortConfig({ key: 'building', direction: 'ascending' });
        setCurrentPage(1);
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const renderSortableHeader = (label: string, key: keyof HvacEntry) => (
         <th className="p-3 text-left font-semibold text-primary dark:text-gray-200">
            <button onClick={() => requestSort(key)} className="flex items-center gap-2 hover:text-accent dark:hover:text-accent">
                {label} <ArrowUpDown className="h-4 w-4" />
            </button>
        </th>
    );

    return (
        <div className="space-y-6 p-4 sm:p-6 bg-background-primary dark:bg-gray-900 min-h-screen">
            <h1 className="text-3xl font-bold text-primary dark:text-white flex items-center gap-3"><Wind size={32} />HVAC System Maintenance Tracker</h1>
            
            <div className="bg-white dark:bg-gray-800 shadow p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                    <div className="relative">
                        <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Search</label>
                        <Search className="absolute left-3 top-9 h-5 w-5 text-gray-400" />
                        <input 
                          type="text" 
                          id="search"
                          placeholder="Search across all fields..." 
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full mt-1 pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-accent bg-transparent"
                        />
                    </div>
                    <Button onClick={resetFilters} className="bg-secondary text-white w-full md:w-auto flex items-center justify-center gap-2">
                        <XCircle size={16} /> Reset
                    </Button>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-x-auto border border-gray-200 dark:border-gray-700">
                <table className="w-full text-sm">
                    <thead className="bg-primary-dark/5 dark:bg-gray-700/50">
                        <tr>
                            {renderSortableHeader('Building', 'building')}
                            {renderSortableHeader('Main System', 'mainSystem')}
                            {renderSortableHeader('Equipment', 'equipment')}
                            <th className="p-3 text-left font-semibold text-primary dark:text-gray-200">Common Issues</th>
                            <th className="p-3 text-left font-semibold text-primary dark:text-gray-200">Notes</th>
                            <th className="p-3 text-center font-semibold text-primary dark:text-gray-200">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedEntries.map((entry) => (
                            <tr key={entry.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30">
                                <td className="p-3 font-medium text-primary dark:text-gray-200">{entry.building}</td>
                                <td className="p-3 text-secondary dark:text-gray-400">{entry.mainSystem}</td>
                                <td className="p-3 text-secondary dark:text-gray-400">{entry.equipment}</td>
                                <td className="p-3 text-secondary dark:text-gray-400 max-w-xs truncate" title={entry.commonIssues}>{entry.commonIssues}</td>
                                <td className="p-3 text-secondary dark:text-gray-400 max-w-xs truncate" title={entry.notes}>{entry.notes}</td>
                                <td className="p-3 text-center">
                                    <Button onClick={() => setEditingEntry(entry)} className="bg-accent text-white !p-2 rounded-md hover:bg-primary-dark">
                                        <Edit size={16} />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {paginatedEntries.length === 0 && (
                    <div className="text-center p-8 text-secondary dark:text-gray-400">
                        No entries found matching your criteria.
                    </div>
                )}
            </div>

            {totalPages > 1 && (
                <div className="flex justify-between items-center mt-4">
                    <span className="text-sm text-secondary dark:text-gray-400">Page {currentPage} of {totalPages}</span>
                    <div className="flex gap-2">
                        <Button onClick={() => setCurrentPage(p => Math.max(1, p-1))} disabled={currentPage === 1} className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50">Previous</Button>
                        <Button onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} disabled={currentPage === totalPages} className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50">Next</Button>
                    </div>
                </div>
            )}

            {editingEntry && <EditModal entry={editingEntry} onSave={handleSave} onClose={() => setEditingEntry(null)} />}
        </div>
    );
};

export default HvacSystemModule;
