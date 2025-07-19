import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X, Clock, TrendingUp, FileText, Users, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface SearchResult {
  id: string;
  type: 'policy' | 'transaction' | 'citizen' | 'contract' | 'report';
  title: string;
  description: string;
  relevance: number;
  tags: string[];
  url: string;
}

interface AdvancedSearchInterfaceProps {
  onResultSelect?: (result: SearchResult) => void;
  className?: string;
}

export const AdvancedSearchInterface: React.FC<AdvancedSearchInterfaceProps> = ({ 
  onResultSelect, 
  className 
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState([
    'PM Awas Yojana', 'Fund disbursement', 'Smart contract logs', 'Citizen complaints'
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const filters = [
    { id: 'policy', label: 'Policies', icon: FileText, color: 'civic-blue' },
    { id: 'transaction', label: 'Transactions', icon: Zap, color: 'civic-green' },
    { id: 'citizen', label: 'Citizens', icon: Users, color: 'civic-purple' },
    { id: 'contract', label: 'Contracts', icon: FileText, color: 'civic-orange' }
  ];

  const mockResults: SearchResult[] = [
    {
      id: '1',
      type: 'policy',
      title: 'PM Awas Yojana - Rural Housing Scheme',
      description: 'Affordable housing scheme for rural areas with smart contract automation',
      relevance: 95,
      tags: ['Housing', 'Rural Development', 'Smart Contract'],
      url: '/policy-maker'
    },
    {
      id: '2',
      type: 'transaction',
      title: 'Fund Transfer - Digital Literacy Program',
      description: '₹2.5 Cr disbursed for digital education initiatives across 15 states',
      relevance: 88,
      tags: ['Education', 'Digital', 'Fund Transfer'],
      url: '/auditor'
    },
    {
      id: '3',
      type: 'citizen',
      title: 'Infrastructure Complaint - Mumbai Region',
      description: 'Road maintenance request filed by 150+ citizens in Andheri area',
      relevance: 82,
      tags: ['Infrastructure', 'Mumbai', 'Citizen Report'],
      url: '/citizen'
    }
  ];

  const trendingSearches = [
    'Smart contract execution',
    'Fund flow transparency',
    'Citizen participation',
    'Policy automation'
  ];

  useEffect(() => {
    if (query.length > 2) {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        const filtered = mockResults.filter(result => 
          result.title.toLowerCase().includes(query.toLowerCase()) ||
          result.description.toLowerCase().includes(query.toLowerCase()) ||
          result.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
        );
        
        if (selectedFilters.length > 0) {
          setResults(filtered.filter(result => selectedFilters.includes(result.type)));
        } else {
          setResults(filtered);
        }
        setIsLoading(false);
      }, 300);
    } else {
      setResults([]);
    }
  }, [query, selectedFilters]);

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    setIsOpen(true);
    if (searchQuery && !recentSearches.includes(searchQuery)) {
      setRecentSearches(prev => [searchQuery, ...prev.slice(0, 3)]);
    }
  };

  const toggleFilter = (filterId: string) => {
    setSelectedFilters(prev => 
      prev.includes(filterId) 
        ? prev.filter(f => f !== filterId)
        : [...prev, filterId]
    );
  };

  const getResultIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'policy':
        return <FileText className="w-4 h-4 text-civic-blue" />;
      case 'transaction':
        return <Zap className="w-4 h-4 text-civic-green" />;
      case 'citizen':
        return <Users className="w-4 h-4 text-civic-purple" />;
      case 'contract':
        return <FileText className="w-4 h-4 text-civic-orange" />;
      default:
        return <Search className="w-4 h-4" />;
    }
  };

  return (
    <div className={cn("relative w-full max-w-2xl", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search policies, transactions, reports..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          className="pl-10 pr-4 h-12 text-base border-2 focus:border-civic-blue enhanced-focus"
        />
        {query && (
          <Button
            variant="ghost"
            size="icon-sm"
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
            onClick={() => {
              setQuery('');
              setResults([]);
              inputRef.current?.focus();
            }}
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Search Panel */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full mt-2 w-full bg-background border border-border rounded-lg shadow-modal z-50 overflow-hidden max-h-96"
            >
              {/* Filters */}
              <div className="p-4 border-b border-border">
                <div className="flex items-center gap-2 mb-3">
                  <Filter className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Filters:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {filters.map((filter) => (
                    <Button
                      key={filter.id}
                      variant={selectedFilters.includes(filter.id) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleFilter(filter.id)}
                      className={cn(
                        "h-8 text-xs",
                        selectedFilters.includes(filter.id) 
                          ? "bg-civic-blue text-white" 
                          : "hover:bg-civic-blue/10"
                      )}
                    >
                      <filter.icon className="w-3 h-3 mr-1" />
                      {filter.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Results or Suggestions */}
              <div className="max-h-64 overflow-y-auto">
                {query.length > 2 ? (
                  // Search Results
                  <>
                    {isLoading ? (
                      <div className="p-6 text-center">
                        <div className="animate-spin w-6 h-6 border-2 border-civic-blue/30 border-t-civic-blue rounded-full mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">Searching...</p>
                      </div>
                    ) : results.length > 0 ? (
                      <div className="divide-y divide-border">
                        {results.map((result, index) => (
                          <motion.div
                            key={result.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="p-4 hover:bg-muted/50 cursor-pointer"
                            onClick={() => {
                              onResultSelect?.(result);
                              setIsOpen(false);
                              window.location.href = result.url;
                            }}
                          >
                            <div className="flex items-start gap-3">
                              {getResultIcon(result.type)}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-medium text-sm text-foreground truncate">
                                    {result.title}
                                  </h4>
                                  <Badge variant="secondary" className="text-xs">
                                    {result.relevance}%
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                                  {result.description}
                                </p>
                                <div className="flex flex-wrap gap-1">
                                  {result.tags.map((tag) => (
                                    <Badge key={tag} variant="outline" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-6 text-center text-muted-foreground">
                        <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p>No results found for "{query}"</p>
                      </div>
                    )}
                  </>
                ) : (
                  // Suggestions
                  <div className="p-4">
                    {recentSearches.length > 0 && (
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Recent</span>
                        </div>
                        <div className="space-y-1">
                          {recentSearches.map((search) => (
                            <button
                              key={search}
                              className="block w-full text-left text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 p-2 rounded transition-colors"
                              onClick={() => handleSearch(search)}
                            >
                              {search}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Trending</span>
                      </div>
                      <div className="space-y-1">
                        {trendingSearches.map((search) => (
                          <button
                            key={search}
                            className="block w-full text-left text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 p-2 rounded transition-colors"
                            onClick={() => handleSearch(search)}
                          >
                            {search}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};