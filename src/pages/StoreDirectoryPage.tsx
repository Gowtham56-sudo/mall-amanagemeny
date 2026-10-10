import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Store, Search, MapPin, Phone, Mail, Filter } from 'lucide-react';
import { ShopCategory, Stall } from '../types';

export const StoreDirectoryPage: React.FC = () => {
  const { stalls } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ShopCategory | 'ALL'>('ALL');

  // Filter only occupied stalls that have shop info
  const stores = useMemo(() => {
    return stalls.filter(stall => stall.status === 'OCCUPIED' && stall.shopName);
  }, [stalls]);

  const categories = ['ALL', ...Array.from(new Set(stores.map(s => s.category).filter(Boolean)))];

  const filteredStores = useMemo(() => {
    return stores.filter(store => {
      const matchesSearch = store.shopName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            store.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            store.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'ALL' || store.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [stores, searchTerm, selectedCategory]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Store className="w-5 h-5 text-purple-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">
              STORE DIRECTORY
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Interactive catalog of all currently active stores, locations, and categories in the mall.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search stores, stall ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 text-sm rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:border-purple-500 transition-colors placeholder:text-slate-500 text-white"
            />
          </div>
          
          <div className="relative w-full sm:w-auto">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as any)}
              className="w-full sm:w-auto bg-slate-800 border border-slate-700 text-sm rounded-lg pl-3 pr-8 py-2 appearance-none focus:outline-none focus:border-purple-500 transition-colors text-white"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <Filter className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStores.map(store => (
          <StoreCard key={store.id} store={store} />
        ))}
        {filteredStores.length === 0 && (
          <div className="col-span-full py-12 text-center border-2 border-dashed border-slate-800 rounded-2xl">
            <Store className="w-8 h-8 text-slate-600 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-white">No Stores Found</h3>
            <p className="text-xs text-slate-500 mt-1">Try adjusting your search or category filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const StoreCard = ({ store }: { store: Stall }) => {
  return (
    <div className="bg-slate-900/50 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 transition-all group hover:bg-slate-900 flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors">
            {store.shopName}
          </h3>
          <span className="inline-block mt-1 text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
            {store.category}
          </span>
        </div>
        <div className="bg-slate-800 border border-slate-700 px-2 py-1 rounded text-xs font-mono text-slate-300 whitespace-nowrap">
          {store.id}
        </div>
      </div>
      
      <div className="mt-auto space-y-2 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5 text-slate-500" />
          <span>{store.zone} • {store.floor}</span>
        </div>
        <div className="flex items-center gap-2">
          <Phone className="w-3.5 h-3.5 text-slate-500" />
          <span>{store.ownerContact || 'N/A'}</span>
        </div>
        <div className="flex items-center gap-2">
          <Mail className="w-3.5 h-3.5 text-slate-500" />
          <span>{store.ownerEmail || 'N/A'}</span>
        </div>
      </div>
    </div>
  );
};
