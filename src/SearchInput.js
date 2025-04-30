import React, { useEffect, useState, useRef } from 'react';
import { useDebounce } from 'use-debounce';

const SearchInput = ({ label, value, onSelect }) => {
  const [query, setQuery] = useState(value || '');
  const [results, setResults] = useState([]);
  const [debouncedQuery] = useDebounce(query, 500);
  const containerRef = useRef(null);

  useEffect(() => {
    setQuery(value || '');
  }, [value]);

  useEffect(() => {
    const controller = new AbortController();

    const isLatLng = /^-?\d+(\.\d+)?\s*,\s*-?\d+(\.\d+)?$/.test(debouncedQuery);
    if (!debouncedQuery || isLatLng) {
      setResults([]);
      return;
    }

    const search = async () => {
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${debouncedQuery}`, {
          signal: controller.signal,
        });
        const data = await res.json();
        setResults(data);
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Search failed:', err);
        }
      }
    };

    search();
    return () => controller.abort();
  }, [debouncedQuery]);

  const handleSelect = (item) => {
    const formatted = `${item.lat},${item.lon}`;
    onSelect(formatted, item.display_name);
    setQuery(item.display_name);
    setResults([]);
  };

  const handleClickOutside = (e) => {
    if (containerRef.current && !containerRef.current.contains(e.target)) {
      setResults([]);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} style={{ marginBottom: 12 }}>
      <label>{label}</label><br />
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search address or lat,lng"
        style={{ width: '100%' }}
      />
      {results.length > 0 && (
        <ul
          style={{
            listStyle: 'none',
            margin: 0,
            padding: 5,
            background: '#f0f0f0',
            borderRadius: 4,
            maxHeight: 150,
            overflowY: 'auto',
          }}
        >
          {results.slice(0, 5).map((item, i) => (
            <li
              key={i}
              onClick={() => handleSelect(item)}
              style={{ cursor: 'pointer', padding: 4 }}
            >
              {item.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchInput;
