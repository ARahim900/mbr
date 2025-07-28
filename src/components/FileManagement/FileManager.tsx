// src/components/FileManagement/FileManager.tsx
import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FolderIcon, 
  DocumentIcon, 
  PlusIcon, 
  TrashIcon,
  ArrowUpTrayIcon,
  MagnifyingGlassIcon,
  FolderPlusIcon,
  DocumentPlusIcon,
  ChevronRightIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  size?: number;
  modifiedDate: Date;
  parentId: string | null;
  content?: any;
  tags?: string[];
}

interface FileManagerProps {
  initialPath?: string;
  onFileSelect?: (file: FileItem) => void;
}

export const FileManager: React.FC<FileManagerProps> = ({ 
  initialPath = '/', 
  onFileSelect 
}) => {
  const [currentPath, setCurrentPath] = useState(initialPath);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const queryClient = useQueryClient();

  // Enhanced glassmorphism styles
  const glassmorphismStyle = {
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(20px) saturate(180%)',
    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
  };

  // Fetch files with React Query for optimal caching
  const { data: files, isLoading } = useQuery({
    queryKey: ['files', currentPath],
    queryFn: async () => {
      // Simulated API call - replace with actual API
      return fetchFiles(currentPath);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });

  // File upload mutation
  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      // Implement file upload logic
      return uploadFile(file, currentPath);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['files', currentPath]);
    },
  });

  // Create folder mutation
  const createFolderMutation = useMutation({
    mutationFn: async (name: string) => {
      return createFolder(name, currentPath);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['files', currentPath]);
    },
  });

  // Delete items mutation
  const deleteMutation = useMutation({
    mutationFn: async (itemIds: string[]) => {
      return deleteItems(itemIds);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['files']);
      setSelectedItems([]);
    },
  });

  // Filter files based on search
  const filteredFiles = useMemo(() => {
    if (!files) return [];
    if (!searchQuery) return files;
    
    return files.filter(file => 
      file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [files, searchQuery]);

  // Handle folder toggle
  const toggleFolder = useCallback((folderId: string) => {
    setExpandedFolders(prev => {
      const next = new Set(prev);
      if (next.has(folderId)) {
        next.delete(folderId);
      } else {
        next.add(folderId);
      }
      return next;
    });
  }, []);

  // Handle item selection
  const handleItemSelect = useCallback((itemId: string, multiSelect = false) => {
    if (multiSelect) {
      setSelectedItems(prev => 
        prev.includes(itemId) 
          ? prev.filter(id => id !== itemId)
          : [...prev, itemId]
      );
    } else {
      setSelectedItems([itemId]);
    }
  }, []);

  // Handle file drop
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    files.forEach(file => uploadMutation.mutate(file));
  }, [uploadMutation]);

  return (
    <div className="h-full flex flex-col" style={glassmorphismStyle}>
      {/* Header with search and actions */}
      <div className="p-4 border-b border-white/10">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search bar */}
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              id="file-search"
              name="fileSearch"
              type="text"
              placeholder="Search files and folders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-white/20 transition-all duration-300"
              style={{ backdropFilter: 'blur(10px)' }}
            />
          </div>
          
          {/* Action buttons */}
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => document.getElementById('file-upload')?.click()}
              className="px-4 py-2 bg-white/10 hover:bg-white/15 rounded-lg flex items-center gap-2 transition-all duration-300"
              style={{ backdropFilter: 'blur(10px)' }}
            >
              <ArrowUpTrayIcon className="w-5 h-5" />
              <span className="hidden sm:inline">Upload</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                const name = prompt('Enter folder name:');
                if (name) createFolderMutation.mutate(name);
              }}
              className="px-4 py-2 bg-white/10 hover:bg-white/15 rounded-lg flex items-center gap-2 transition-all duration-300"
              style={{ backdropFilter: 'blur(10px)' }}
            >
              <FolderPlusIcon className="w-5 h-5" />
              <span className="hidden sm:inline">New Folder</span>
            </motion.button>
            
            {selectedItems.length > 0 && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => deleteMutation.mutate(selectedItems)}
                className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg flex items-center gap-2 transition-all duration-300"
                style={{ backdropFilter: 'blur(10px)' }}
              >
                <TrashIcon className="w-5 h-5" />
                <span className="hidden sm:inline">Delete ({selectedItems.length})</span>
              </motion.button>
            )}
          </div>
        </div>
        
        {/* Breadcrumb */}
        <div className="mt-4 flex items-center text-sm text-gray-400">
          <span>Current Path: </span>
          <span className="ml-2 text-white">{currentPath}</span>
        </div>
      </div>
      
      {/* File list */}
      <div 
        className="flex-1 overflow-auto p-4"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white/50"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <AnimatePresence>
              {filteredFiles?.map((file) => (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ y: -4 }}
                  onClick={() => {
                    if (file.type === 'folder') {
                      setCurrentPath(`${currentPath}/${file.name}`);
                    } else {
                      onFileSelect?.(file);
                    }
                    handleItemSelect(file.id);
                  }}
                  className={`p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                    selectedItems.includes(file.id)
                      ? 'bg-white/15 border-2 border-white/30'
                      : 'bg-white/5 border border-white/10 hover:bg-white/10'
                  }`}
                  style={{ 
                    ...glassmorphismStyle,
                    boxShadow: selectedItems.includes(file.id)
                      ? '0 8px 32px 0 rgba(31, 38, 135, 0.25)'
                      : '0 4px 16px 0 rgba(31, 38, 135, 0.1)'
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {file.type === 'folder' ? (
                        <FolderIcon className="w-8 h-8 text-yellow-400" />
                      ) : (
                        <DocumentIcon className="w-8 h-8 text-blue-400" />
                      )}
                      <div>
                        <h3 className="font-medium text-white truncate max-w-[150px]">
                          {file.name}
                        </h3>
                        <p className="text-xs text-gray-400 mt-1">
                          {file.type === 'file' && file.size 
                            ? formatFileSize(file.size)
                            : 'Folder'}
                        </p>
                      </div>
                    </div>
                    
                    {file.type === 'folder' && (
                      <motion.div
                        animate={{ rotate: expandedFolders.has(file.id) ? 90 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronRightIcon className="w-5 h-5 text-gray-400" />
                      </motion.div>
                    )}
                  </div>
                  
                  {/* Tags */}
                  {file.tags && file.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {file.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs bg-white/10 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <p className="text-xs text-gray-500 mt-2">
                    Modified: {formatDate(file.modifiedDate)}
                  </p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
      
      {/* Hidden file input */}
      <input
        id="file-upload"
        name="fileUpload"
        type="file"
        multiple
        className="hidden"
        onChange={(e) => {
          const files = Array.from(e.target.files || []);
          files.forEach(file => uploadMutation.mutate(file));
        }}
      />
    </div>
  );
};

// Helper functions
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

// API simulation functions - replace with actual API calls
const fetchFiles = async (path: string): Promise<FileItem[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Return mock data
  return [
    {
      id: '1',
      name: 'Reports',
      type: 'folder',
      modifiedDate: new Date(),
      parentId: null,
      tags: ['important', 'monthly']
    },
    {
      id: '2',
      name: 'MBR_Analysis_2024.xlsx',
      type: 'file',
      size: 2457600,
      modifiedDate: new Date(),
      parentId: null,
      tags: ['analysis', '2024']
    },
    // Add more mock files as needed
  ];
};

const uploadFile = async (file: File, path: string): Promise<void> => {
  // Implement file upload logic
  await new Promise(resolve => setTimeout(resolve, 1000));
};

const createFolder = async (name: string, path: string): Promise<void> => {
  // Implement folder creation logic
  await new Promise(resolve => setTimeout(resolve, 500));
};

const deleteItems = async (itemIds: string[]): Promise<void> => {
  // Implement delete logic
  await new Promise(resolve => setTimeout(resolve, 500));
};

export default FileManager;