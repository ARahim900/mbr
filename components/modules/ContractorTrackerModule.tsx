import React, { useState, useMemo } from 'react';
import { contractorData, getContractStats } from '../../database/contractorDatabase';
import { Contractor } from '../../types';
import MetricCard from '../ui/MetricCard';
import { FileText, ShieldCheck, ShieldX, Coins, Search, ArrowUpDown, XCircle, Edit, Save, X } from 'lucide-react';
import Button from '../ui/Button';

const ContractorTrackerModule: React.FC = () => {
  const [contracts, setContracts] = useState<Contractor[]>(contractorData);
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof Contractor, direction: 'ascending' | 'descending' } | null>({ key: 'endDate', direction: 'ascending' });
  const [currentPage, setCurrentPage] = useState(1);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Contractor>>({});
  const itemsPerPage = 10;

  const stats = useMemo(() => getContractStats(contracts), [contracts]);

  const filteredContracts = useMemo(() => {
    return contracts
      .filter(c => statusFilter === 'All' || c.status === statusFilter)
      .filter(c => typeFilter === 'All' || c.contractType === typeFilter)
      .filter(c => 
        c.contractor.toLowerCase().includes(searchTerm.toLowerCase()) || 
        c.serviceProvided.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [contracts, statusFilter, typeFilter, searchTerm]);

  const sortedContracts = useMemo(() => {
    let sortableItems = [...filteredContracts];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];
        
        if (aVal === null) return 1;
        if (bVal === null) return -1;

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
  }, [filteredContracts, sortConfig]);

  const paginatedContracts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedContracts.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedContracts, currentPage]);

  const totalPages = Math.ceil(sortedContracts.length / itemsPerPage);

  const requestSort = (key: keyof Contractor) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
    setCurrentPage(1);
  };
  
  const formatDate = (date: Date | null) => {
    if (!date) return 'N/A';
    return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(date);
  };

  const formatDateForInput = (date: Date | null) => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };

  const isNearingExpiration = (endDate: Date | null) => {
      if (!endDate) return false;
      const today = new Date();
      if (endDate < today) return false;
      const ninetyDaysFromNow = new Date();
      ninetyDaysFromNow.setDate(today.getDate() + 90);
      return endDate <= ninetyDaysFromNow;
  };

  const resetFilters = () => {
    setStatusFilter('All');
    setTypeFilter('All');
    setSearchTerm('');
    setSortConfig({ key: 'endDate', direction: 'ascending' });
    setCurrentPage(1);
  };

  const startEdit = (contractor: Contractor) => {
    setEditingId(contractor.id);
    setEditForm({
      ...contractor,
      startDate: contractor.startDate,
      endDate: contractor.endDate
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = () => {
    if (editingId !== null) {
      setContracts(contracts.map(c => {
        if (c.id === editingId) {
          const updatedContract = {
            ...c,
            ...editForm,
            startDate: editForm.startDate ? new Date(editForm.startDate as any) : null,
            endDate: editForm.endDate ? new Date(editForm.endDate as any) : null,
            status: (editForm.endDate && new Date(editForm.endDate as any) < new Date() ? 'Expired' : 'Active') as 'Active' | 'Expired'
          };
          return updatedContract;
        }
        return c;
      }));
      setEditingId(null);
      setEditForm({});
    }
  };

  const handleEditChange = (field: keyof Contractor, value: any) => {
    setEditForm({ ...editForm, [field]: value });
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 bg-background-primary dark:bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold text-primary dark:text-white">Contractor Tracker</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Total Contracts" value={stats.total.toString()} unit="" icon={FileText} subtitle="All registered contracts" iconColor="text-blue-500" />
        <MetricCard title="Active Contracts" value={stats.active.toString()} unit="" icon={ShieldCheck} subtitle="Currently ongoing" iconColor="text-green-500" />
        <MetricCard title="Expired Contracts" value={stats.expired.toString()} unit="" icon={ShieldX} subtitle="Past due date" iconColor="text-red-500" />
        <MetricCard title="Total Annual Value" value={stats.totalAnnualValue.toLocaleString(undefined, {minimumFractionDigits: 2})} unit="OMR" icon={Coins} subtitle="Sum of yearly values" iconColor="text-yellow-500" />
      </div>

      <div className="bg-white dark:bg-gray-800 shadow p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div className="relative">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Search Contractor/Service</label>
            <Search className="absolute left-3 top-9 h-5 w-5 text-gray-400" />
            <input 
              type="text" 
              id="search"
              placeholder="Search..." 
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full mt-1 pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-accent bg-transparent"
            />
          </div>
          <div>
            <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Filter by Status</label>
            <select id="statusFilter" value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }} className="w-full mt-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-accent bg-transparent">
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Expired">Expired</option>
            </select>
          </div>
          <div>
            <label htmlFor="typeFilter" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Filter by Type</label>
            <select id="typeFilter" value={typeFilter} onChange={e => { setTypeFilter(e.target.value); setCurrentPage(1); }} className="w-full mt-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-accent bg-transparent">
              <option value="All">All Types</option>
              <option value="Contract">Contract</option>
              <option value="PO">PO</option>
            </select>
          </div>
          <Button onClick={resetFilters} className="bg-secondary text-white w-full flex items-center justify-center gap-2">
            <XCircle size={16} /> Reset
          </Button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-x-auto border border-gray-200 dark:border-gray-700">
        <table className="w-full text-sm">
          <thead className="bg-primary-dark/5 dark:bg-gray-700/50">
            <tr>
              {[{label: 'Contractor', key: 'contractor'}, {label: 'Service Provided', key: 'serviceProvided'}, {label: 'Status', key: 'status'}, {label: 'Type', key: 'contractType'}, {label: 'Start Date', key: 'startDate'}, {label: 'End Date', key: 'endDate'}, {label: 'Annual Value (OMR)', key: 'numericTotalOMRYear'}].map(col => (
                <th key={col.key} className="p-3 text-left font-semibold text-primary dark:text-gray-200">
                  <button onClick={() => requestSort(col.key as keyof Contractor)} className="flex items-center gap-2 hover:text-accent dark:hover:text-accent">
                    {col.label} <ArrowUpDown className="h-4 w-4" />
                  </button>
                </th>
              ))}
              <th className="p-3 text-left font-semibold text-primary dark:text-gray-200">Note</th>
              <th className="p-3 text-center font-semibold text-primary dark:text-gray-200">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedContracts.map((c) => (
              <tr key={c.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30">
                {editingId === c.id ? (
                  <>
                    <td className="p-3">
                      <input
                        type="text"
                        value={editForm.contractor || ''}
                        onChange={(e) => handleEditChange('contractor', e.target.value)}
                        className="w-full p-1 border rounded dark:bg-gray-700 dark:border-gray-600"
                      />
                    </td>
                    <td className="p-3">
                      <input
                        type="text"
                        value={editForm.serviceProvided || ''}
                        onChange={(e) => handleEditChange('serviceProvided', e.target.value)}
                        className="w-full p-1 border rounded dark:bg-gray-700 dark:border-gray-600"
                      />
                    </td>
                    <td className="p-3">
                      <select
                        value={editForm.status || ''}
                        onChange={(e) => handleEditChange('status', e.target.value)}
                        className="w-full p-1 border rounded dark:bg-gray-700 dark:border-gray-600"
                      >
                        <option value="Active">Active</option>
                        <option value="Expired">Expired</option>
                      </select>
                    </td>
                    <td className="p-3">
                      <select
                        value={editForm.contractType || ''}
                        onChange={(e) => handleEditChange('contractType', e.target.value)}
                        className="w-full p-1 border rounded dark:bg-gray-700 dark:border-gray-600"
                      >
                        <option value="Contract">Contract</option>
                        <option value="PO">PO</option>
                      </select>
                    </td>
                    <td className="p-3">
                      <input
                        type="date"
                        value={formatDateForInput(editForm.startDate as Date)}
                        onChange={(e) => handleEditChange('startDate', e.target.value)}
                        className="w-full p-1 border rounded dark:bg-gray-700 dark:border-gray-600"
                      />
                    </td>
                    <td className="p-3">
                      <input
                        type="date"
                        value={formatDateForInput(editForm.endDate as Date)}
                        onChange={(e) => handleEditChange('endDate', e.target.value)}
                        className="w-full p-1 border rounded dark:bg-gray-700 dark:border-gray-600"
                      />
                    </td>
                    <td className="p-3">
                      <input
                        type="number"
                        value={editForm.numericTotalOMRYear || ''}
                        onChange={(e) => handleEditChange('numericTotalOMRYear', parseFloat(e.target.value))}
                        className="w-full p-1 border rounded dark:bg-gray-700 dark:border-gray-600"
                      />
                    </td>
                    <td className="p-3">
                      <input
                        type="text"
                        value={editForm.note || ''}
                        onChange={(e) => handleEditChange('note', e.target.value)}
                        className="w-full p-1 border rounded dark:bg-gray-700 dark:border-gray-600"
                      />
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex justify-center gap-2">
                        <Button onClick={saveEdit} className="bg-green-500 hover:bg-green-600 text-white p-1">
                          <Save size={16} />
                        </Button>
                        <Button onClick={cancelEdit} className="bg-gray-500 hover:bg-gray-600 text-white p-1">
                          <X size={16} />
                        </Button>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="p-3 font-medium text-primary dark:text-gray-200">{c.contractor}</td>
                    <td className="p-3 text-secondary dark:text-gray-400">{c.serviceProvided}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 text-xs font-bold rounded-full ${c.status === 'Active' ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300' : 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300'}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="p-3 text-secondary dark:text-gray-400">{c.contractType}</td>
                    <td className="p-3 text-secondary dark:text-gray-400">{formatDate(c.startDate)}</td>
                    <td className={`p-3 font-medium ${isNearingExpiration(c.endDate) ? 'text-yellow-600 dark:text-yellow-400' : 'text-secondary dark:text-gray-400'}`}>
                      {formatDate(c.endDate)}
                      {isNearingExpiration(c.endDate) && <div className="text-xs font-normal">Expires soon</div>}
                    </td>
                    <td className="p-3 text-right font-semibold text-primary dark:text-gray-300">
                      {c.numericTotalOMRYear !== null ? c.numericTotalOMRYear.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) : 'N/A'}
                    </td>
                    <td className="p-3 text-secondary dark:text-gray-400 max-w-xs truncate" title={c.note}>{c.note}</td>
                    <td className="p-3 text-center">
                      <Button 
                        onClick={() => startEdit(c)} 
                        className="bg-blue-500 hover:bg-blue-600 text-white p-1"
                        title="Edit Contract"
                      >
                        <Edit size={16} />
                      </Button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        {paginatedContracts.length === 0 && (
            <div className="text-center p-8 text-secondary dark:text-gray-400">
                No contracts found matching your criteria.
            </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <span className="text-sm text-secondary dark:text-gray-400">Page {currentPage} of {totalPages}</span>
          <div className="flex gap-2">
            <Button onClick={() => setCurrentPage(p => Math.max(1, p-1))} disabled={currentPage === 1}>Previous</Button>
            <Button onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} disabled={currentPage === totalPages}>Next</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContractorTrackerModule;