import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { restaurantService } from '../services/api';
import RestaurantCard from '../components/RestaurantCard';

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get('q') || '';
  const [query, setQuery] = useState(q);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setQuery(q);
    if (q.trim()) search(q.trim());
    else setResults([]);
  }, [q]);

  const search = async (term) => {
    setLoading(true);
    try {
      const res = await restaurantService.getAll();
      const lower = term.toLowerCase();
      const filtered = res.data.filter(r =>
        r.name?.toLowerCase().includes(lower) ||
        r.description?.toLowerCase().includes(lower) ||
        r.cuisine_type?.toLowerCase().includes(lower) ||
        r.address?.toLowerCase().includes(lower)
      );
      setResults(filtered);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && query.trim()) {
      setSearchParams({ q: query.trim() });
    }
  };

  return (
    <div className="bg-grey-full-light min-h-screen pb-24">
      <div className="p-4">
        <div className="flex items-center space-x-3 mb-5">
          <Link to="/" className="w-9 h-9 bg-white border border-grey-light-dark rounded-full flex items-center justify-center text-blackc hover:bg-grey-light transition-colors shadow-sm flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
          </Link>
          <div className="relative flex-1">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Search restaurants, groceries..."
              className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none text-gray-700 bg-white shadow-sm border border-grey-light-dark focus:ring-2 focus:ring-primary/30"
              autoFocus
            />
          </div>
        </div>

        {q && (
          <p className="text-sm text-gray-500 mb-4">
            {loading ? 'Searching…' : `${results.length} result${results.length !== 1 ? 's' : ''} for "${q}"`}
          </p>
        )}

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="animate-pulse">
                <div className="h-32 bg-grey-light-dark rounded-2xl mb-2" />
                <div className="h-3 bg-grey-light-dark rounded w-3/4 mb-1" />
                <div className="h-2 bg-grey-light-dark rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {results.map(r => (
              <RestaurantCard key={r.id} restaurant={r} />
            ))}
          </div>
        ) : q ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-grey-light rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </div>
            <h3 className="text-lg font-bold text-blackc mb-1">No results found</h3>
            <p className="text-gray-400 text-sm">Try a different search term.</p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default SearchResults;
