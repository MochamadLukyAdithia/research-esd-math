import { useState, useRef, useEffect } from 'react';
import { Star, ArrowUp, ArrowDown, ChevronDown, ChevronUp, Search } from 'lucide-react';
import { Tag } from '@/Pages/Portal/Index';

export interface Filters {
  searchQuery: string;
  selectedTag: number;
  showFavorites: boolean;
  sortBy: 'date' | 'distance';
  sortDirection: 'asc' | 'desc';
}

interface FilterProps {
  tags: Tag[];
  filters: Filters;
  onFilterChange: (filters: Filters) => void;
}

export default function TaskFilter({ tags, filters, onFilterChange }: FilterProps) {
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  useEffect(() => {
    if (isSearchOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [isSearchOpen]);

  return (
    <div className="py-4 px-6 bg-background space-y-5">
      <div className="flex items-center justify-between border-b border-secondary pb-2">
        <h1 className="text-2xl font-bold text-secondary">Tugas</h1>

        {!isSearchOpen ? (
          <button
            onClick={() => setIsSearchOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Search size={20} className="text-secondary" />
          </button>
        ) : (
          <div className="flex-1 ml-4 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
            <input
              ref={searchRef}
              type="text"
              placeholder="Cari nama tugas..."
              value={filters.searchQuery}
              onChange={e => onFilterChange({ ...filters, searchQuery: e.target.value })}
              onBlur={() => {
                if (!filters.searchQuery) {
                  setIsSearchOpen(false);
                }
              }}
              className="w-full pl-10 pr-4 py-2 border border-secondary rounded-lg text-sm text-secondary focus:border-transparent bg-background"
            />
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <select
          value={filters.selectedTag}
          onChange={e => onFilterChange({ ...filters, selectedTag: parseInt(e.target.value) })}
          className="flex-1 px-3 py-2 border border-secondary rounded-lg text-sm text-secondary transition-all bg-background"
        >
          <option value="0">Semua Kategori</option>
          {tags.map(tag => (
            <option key={tag.id_tag} value={tag.id_tag}>{tag.tag_name}</option>
          ))}
        </select>

        <button
          onClick={() => onFilterChange({ ...filters, showFavorites: !filters.showFavorites })}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            filters.showFavorites
              ? 'bg-secondary text-background'
              : 'bg-background text-secondary hover:bg-secondary hover:text-background border border-secondary'
          }`}
        >
          <Star size={16} className={filters.showFavorites ? 'fill-secondary' : 'fill-none'} />
          Favorit
        </button>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsSortOpen(!isSortOpen)}
            className="flex items-center gap-2 text-sm font-semibold text-secondary focus:outline-none transition-colors border-b-2 border-secondary pb-2"
          >
            <span className="w-28 text-left">
              {filters.sortBy === 'distance' ? 'Jarak Terdekat' : 'Paling Baru'}
            </span>
            {isSortOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          {isSortOpen && (
            <div className="absolute mt-2 w-40 bg-white rounded-lg shadow-xl z-20 overflow-hidden border border-gray-200">
              <button
                onClick={() => { onFilterChange({ ...filters, sortBy: 'distance' }); setIsSortOpen(false); }}
                className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                  filters.sortBy === 'distance' ? 'bg-primary/10 text-secondary font-semibold' : 'text-secondary'
                }`}
              >
                Jarak Terdekat
              </button>
              <button
                onClick={() => { onFilterChange({ ...filters, sortBy: 'date' }); setIsSortOpen(false); }}
                className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                  filters.sortBy === 'date' ? 'bg-primary/10 text-secondary font-semibold' : 'text-secondary'
                }`}
              >
                Paling Baru
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onFilterChange({ ...filters, sortDirection: 'asc' })}
            className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${
              filters.sortDirection === 'asc'
                ? 'bg-secondary text-white'
                : 'bg-gray-200 text-secondary-light hover:bg-gray-300'
            }`}
            title={filters.sortBy === 'date' ? 'Terlama' : 'Terdekat'}
          >
            <ArrowUp size={16} />
          </button>
          <button
            onClick={() => onFilterChange({ ...filters, sortDirection: 'desc' })}
            className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${
              filters.sortDirection === 'desc'
                ? 'bg-secondary text-white'
                : 'bg-gray-200 text-secondary-light hover:bg-gray-300'
            }`}
            title={filters.sortBy === 'date' ? 'Terbaru' : 'Terjauh'}
          >
            <ArrowDown size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
