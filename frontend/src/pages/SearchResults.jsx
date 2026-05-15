import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { restaurantService } from '../services/api';
import RestaurantCard from '../components/RestaurantCard';

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const q = searchParams.get('q') || '';
  const [query, setQuery] = useState(q);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    setQuery(q);
    if (q.trim()) {
      doSearch(q.trim());
    } else {
      setResults([]);
    }
  }, [q]);

  const doSearch = async (term) => {
    setLoading(true);
    setError(null);
    try {
      const res = await restaurantService.search(encodeURIComponent(term));
      setResults(res.data || []);
    } catch (err) {
      console.error(err);
      setError('Search failed. Please try again.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    clearTimeout(debounceRef.current);
    if (val.trim()) {
      debounceRef.current = setTimeout(() => {
        setSearchParams({ q: val.trim() });
      }, 400);
    } else {
      setSearchParams({});
      setResults([]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && query.trim()) {
      clearTimeout(debounceRef.current);
      setSearchParams({ q: query.trim() });
    }
    if (e.key === 'Escape') {
      setQuery('');
      setSearchParams({});
      setResults([]);
    }
  };

  return (
    <div className="bg-grey-full-light min-h-screen pb-24">
      <div className="p-4">

        {/* Search bar */}
        <div className="flex items-center space-x-3 mb-5">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 bg-white border border-grey-light-dark rounded-full flex items-center justify-center text-blackc hover:bg-grey-light transition-colors shadow-sm flex-shrink-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <div className="relative flex-1">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </div>
            <input
              type="text"
              value={query}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Search restaurants, cuisine, address..."
              className="w-full pl-10 pr-10 py-3 rounded-xl text-sm outline-none text-gray-700 bg-white shadow-sm border border-grey-light-dark focus:ring-2 focus:ring-primary/30"
              autoFocus
            />
            {query && (
              <button
                onClick={() => { setQuery(''); setSearchParams({}); setResults([]); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            )}
          </div>
        </div>

        {/* Results count */}
        {q && !loading && !error && (
          <p className="text-sm text-gray-500 mb-4">
            {results.length === 0
              ? `No results for "${q}"`
              : `${results.length} result${results.length !== 1 ? 's' : ''} for "${q}"`}
          </p>
        )}

        {/* Error */}
        {error && (
          <div className="text-center py-8">
            <p className="text-red-500 text-sm mb-2">{error}</p>
            <button onClick={() => doSearch(q)} className="text-primary text-sm font-bold hover:underline">Retry</button>
          </div>
        )}

        {/* Loading skeletons */}
        {loading && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-40 bg-grey-light-dark rounded-2xl mb-2" />
                <div className="h-3 bg-grey-light-dark rounded w-3/4 mb-1" />
                <div className="h-2 bg-grey-light-dark rounded w-1/2" />
              </div>
            ))}
          </div>
        )}

        {/* Results grid */}
        {!loading && results.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {results.map((r) => (
              <RestaurantCard key={r.id} restaurant={r} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && q && results.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-grey-light rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">🔍</div>
            <h3 className="text-lg font-bold text-blackc mb-1">No results found</h3>
            <p className="text-gray-400 text-sm mb-4">Try searching for a restaurant name, cuisine type, or location.</p>
            <button
              onClick={() => { setQuery(''); setSearchParams({}); }}
              className="text-primary text-sm font-bold hover:underline"
            >
              Clear search
            </button>
          </div>
        )}

        {/* Prompt to search */}
        {!q && !loading && (
          <div className="text-center py-16 text-gray-400">
            <div className="text-5xl mb-3">🍽️</div>
            <p className="text-sm">Type above to search for restaurants, food, or locations.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
