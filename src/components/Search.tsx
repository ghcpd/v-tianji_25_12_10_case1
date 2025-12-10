import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { escapeRegex } from '../utils/helpers'
import './Search.css'

interface SearchResult {
  id: string
  title: string
  description: string
  category: string
}

const Search = () => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const debounceTimer = useRef<number | null>(null)

  const categories = ['all', 'technology', 'science', 'business', 'health']

  const searchAPI = async (searchQuery: string, category: string) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await axios.get('https://jsonplaceholder.typicode.com/posts', {
        params: {
          _limit: 10,
          q: searchQuery
        }
      })

      const filtered = response.data
        .filter((item: any) => 
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.body.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .map((item: any, index: number) => ({
          id: item.id.toString(),
          title: item.title,
          description: item.body.substring(0, 100),
          category: categories[(index % (categories.length - 1)) + 1] || categories[1]
        }))

      if (category !== 'all') {
        return filtered.filter((item: SearchResult) => item.category === category)
      }

      return filtered
    } catch (err) {
      setError('Failed to fetch results')
      return []
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
    }

    if (query.length < 2) {
      setResults([])
      return
    }

    let cancelled = false
    debounceTimer.current = setTimeout(async () => {
      const data = await searchAPI(query, selectedCategory)
      if (!cancelled) {
        setResults(data)
      }
    }, 300)

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
      }
      cancelled = true
    }
  }, [query, selectedCategory])

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    if (query.length >= 2) {
      searchAPI(query, category).then(data => setResults(data))
    }
  }

  const highlightText = (text: string, highlight: string) => {
    if (!highlight) return text
    const escaped = escapeRegex(highlight)
    const parts = text.split(new RegExp(`(${escaped})`, 'gi'))
    return parts.map((part, i) => 
      part.toLowerCase() === highlight.toLowerCase() ? (
        <mark key={i}>{part}</mark>
      ) : part
    )
  }

  return (
    <div className="search-container">
      <h1>Search</h1>
      
      <div className="search-controls">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search..."
          className="search-input"
        />
        
        <div className="category-filters">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={selectedCategory === cat ? 'active' : ''}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loading && <div className="loading">Loading...</div>}
      {error && <div className="error">{error}</div>}

      <div className="results-container">
        {results.length === 0 && !loading && query.length >= 2 && (
          <div className="no-results">No results found</div>
        )}
        
        {results.map(result => (
          <div key={result.id} className="result-item">
            <div className="result-category">{result.category}</div>
            <h3 className="result-title">
              {highlightText(result.title, query)}
            </h3>
            <p className="result-description">
              {highlightText(result.description, query)}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Search

