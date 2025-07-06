import React, { useState, useMemo, useEffect } from 'react';
import { HvacEntry } from '../../types';
import { hvacData } from '../../database/hvacDatabase';
import { Wind, Search, ArrowUpDown, Edit, XCircle, Save, X, Filter, AlertCircle } from 'lucide-react';
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
        <div className="group">
            <label htmlFor={name} className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                {label}
            </label>
            <textarea
                id={name}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                rows={rows}
                className="w-full rounded-xl border border-gray-200 dark:border-gray-600 shadow-sm focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all duration-200 bg-gray-50/50 dark:bg-gray-700/50 p-3 text-gray-800 dark:text-gray-200"
            />
        </div>
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md" onClick={onClose}>
            <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col border border-gray-200/50 dark:border-gray-700/50" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50 flex justify-between items-center flex-shrink-0 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700">
                    <h3 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
                        Edit HVAC Entry
                    </h3>
                    <button 
                        onClick={onClose} 
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
                    >
                        <X size={24} />
                    </button>
                </div>
                
                <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-gray-700/50 dark:to-gray-800/50 p-6 rounded-xl">
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Building</label>
                            <p className="text-lg font-bold text-gray-800 dark:text-gray-200">{formData.building}</p>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Main System</label>
                            <p className="text-lg font-bold text-gray-800 dark:text-gray-200">{formData.mainSystem}</p>
                        </div>
                        <div>
                           <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Equipment</label>
                            <p className="text-lg font-bold text-gray-800 dark:text-gray-200">{formData.equipment}</p>
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

                    <div className="pt-6 border-t border-gray-200/50 dark:border-gray-700/50 flex justify-end gap-4 flex-shrink-0">
                        <Button 
                            type="button" 
                            onClick={onClose} 
                            variant="outline"
                            className="min-w-[120px]"
                        >
                            Cancel
                        </Button>
                        <Button 
                            type="submit" 
                            variant="primary"
                            className="min-w-[120px] shadow-lg"
                        >
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
         <th className="p-4 text-left font-semibold text-gray-700 dark:text-gray-200">
            <button 
                onClick={() => requestSort(key)} 
                className="flex items-center gap-2 hover:text-accent transition-colors duration-200 group"
            >
                {label} 
                <ArrowUpDown className="h-4 w-4 text-gray-400 group-hover:text-accent transition-colors" />
            </button>
        </th>
    );

    return (
        <div className="space-y-6 p-4 sm:p-6 min-h-screen">
            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 shadow-lg">
                    <Wind size={32} className="text-white" />
                </div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
                    HVAC System Maintenance Tracker
                </h1>
            </div>
            
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                    <div className="relative">
                        <label htmlFor="search" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Search & Filter
                        </label>
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input 
                                type="text" 
                                id="search"
                                placeholder="Search across all fields..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent bg-gray-50/50 dark:bg-gray-700/50 transition-all duration-200"
                            />
                        </div>
                    </div>
                    <Button 
                        onClick={resetFilters} 
                        variant="secondary"
                        className="w-full md:w-auto h-[50px]"
                    >
                        <XCircle size={16} /> Reset Filters
                    </Button>
                </div>
                
                <div className="mt-4 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Filter size={16} />
                    <span>Showing {filteredEntries.length} of {entries.length} entries</span>
                </div>
            </div>

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gradient-to-r from-gray-50 to-gray-100/50 dark:from-gray-700/50 dark:to-gray-800/50">
                            <tr>
                                {renderSortableHeader('Building', 'building')}
                                {renderSortableHeader('Main System', 'mainSystem')}
                                {renderSortableHeader('Equipment', 'equipment')}
                                <th className="p-4 text-left font-semibold text-gray-700 dark:text-gray-200">Common Issues</th>
                                <th className="p-4 text-left font-semibold text-gray-700 dark:text-gray-200 hidden lg:table-cell">Notes</th>
                                <th className="p-4 text-center font-semibold text-gray-700 dark:text-gray-200">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {paginatedEntries.map((entry) => (
                                <tr key={entry.id} className="hover:bg-gradient-to-r hover:from-gray-50/50 hover:to-transparent dark:hover:from-gray-700/30 dark:hover:to-transparent transition-all duration-200">
                                    <td className="p-4 font-semibold text-gray-800 dark:text-gray-200">{entry.building}</td>
                                    <td className="p-4 text-gray-600 dark:text-gray-400">{entry.mainSystem}</td>
                                    <td className="p-4 text-gray-600 dark:text-gray-400">{entry.equipment}</td>
                                    <td className="p-4 text-gray-600 dark:text-gray-400">
                                        <div className="max-w-xs truncate" title={entry.commonIssues}>
                                            {entry.commonIssues && (
                                                <div className="flex items-start gap-2">
                                                    <AlertCircle size={16} className="text-yellow-500 flex-shrink-0 mt-0.5" />
                                                    <span>{entry.commonIssues}</span>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-4 text-gray-600 dark:text-gray-400 hidden lg:table-cell">
                                        <div className="max-w-xs truncate" title={entry.notes}>
                                            {entry.notes}
                                        </div>
                                    </td>
                                    <td className="p-4 text-center">
                                        <Button 
                                            onClick={() => setEditingEntry(entry)} 
                                            variant="primary"
                                            size="sm"
                                            className="shadow-md"
                                        >
                                            <Edit size={16} />
                                            <span className="hidden sm:inline">Edit</span>
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                {paginatedEntries.length === 0 && (
                    <div className="text-center p-12">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 font-medium">
                            No entries found matching your criteria
                        </p>
                    </div>
                )}
            </div>

            {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                        Page <span className="font-semibold text-gray-800 dark:text-gray-200">{currentPage}</span> of <span className="font-semibold text-gray-800 dark:text-gray-200">{totalPages}</span>
                    </span>
                    <div className="flex gap-2">
                        <Button 
                            onClick={() => setCurrentPage(p => Math.max(1, p-1))} 
                            disabled={currentPage === 1} 
                            variant="outline"
                        >
                            Previous
                        </Button>
                        <Button 
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} 
                            disabled={currentPage === totalPages} 
                            variant="outline"
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}

            {editingEntry && <EditModal entry={editingEntry} onSave={handleSave} onClose={() => setEditingEntry(null)} />}
        </div>
    );
};

export default HvacSystemModule;