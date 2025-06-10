'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import './page.css';

interface Recipe {
  Id: number;
  Title: string;
  Description: string;
  Hidden: boolean;
  ImageUrl?: string;
  Author?: string;
  Content?: string;
}

const RECIPES_PER_PAGE = 10;

export default function RecipePage() {
  const searchParams = useSearchParams();

  // Read page from URL, default to 1
  const initialPage = parseInt(searchParams.get('page') || '1', 10);
  const [page, setPage] = useState(initialPage);

  // When page changes, update the URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set('page', page.toString());
    window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
  }, [page]);

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    async function fetchRecipes() {
      const res = await fetch("/api/recipes");
      const data = await res.json();
      if (Array.isArray(data)) {
        setRecipes(data);
      } else {
        setRecipes([]);
      }
    }
    fetchRecipes();
  }, []);

  // Sort recipes A-Z by Title, then filter by search
  const filteredRecipes = recipes
    .filter((r) => !r.Hidden)
    .sort((a, b) => a.Title.localeCompare(b.Title))
    .filter((r) =>
      r.Title.toLowerCase().includes(search.toLowerCase()) ||
      (r.Description && r.Description.toLowerCase().includes(search.toLowerCase())) ||
      (r.Author && r.Author.toLowerCase().includes(search.toLowerCase()))
    );

  // Pagination logic
  const totalPages = Math.ceil(filteredRecipes.length / RECIPES_PER_PAGE);
  const paginatedRecipes = filteredRecipes.slice(
    (page - 1) * RECIPES_PER_PAGE,
    page * RECIPES_PER_PAGE
  );

  const isFirstSearch = useRef(true);

  // Reset to page 1 when search changes
  useEffect(() => {
    if (isFirstSearch.current) {
      isFirstSearch.current = false;
      return; // Skip on initial mount
    }
    setPage(1);
    const params = new URLSearchParams(window.location.search);
    params.set('page', '1');
    window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
  }, [search]);

  // Handler for Enter key
  function handleSearchKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      setSearch(searchInput);
    }
  }

  // Handler for button click
  function handleSearchClick() {
    setSearch(searchInput);
  }

  return (
    <div className="main-content">
      <div className="search-bar-row sticky-search">
        <input
          id="search"
          type="text"
          placeholder="Search recipes..."
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
          onKeyDown={handleSearchKeyDown}
          className="search-input"
        />
        <button className="theme-btn" onClick={handleSearchClick}>Search</button>
      </div>
      <div>
        <ul>
          {paginatedRecipes.map((r) => {
            // Normalize local image paths
            let imgSrc = r.ImageUrl;
            if (imgSrc && !imgSrc.startsWith('http') && !imgSrc.startsWith('/')) {
              imgSrc = '/' + imgSrc.replace(/^public\//, '');
            }
            console.log('imgSrc:', imgSrc);

            if (!imgSrc || typeof imgSrc !== 'string' || imgSrc.length === 0) {
              console.warn('Invalid imgSrc for recipe:', r.Id, imgSrc);
            }

            return (
              <li key={r.Id}>
                <div>
                  <Link href={`/recipe/${r.Id}`}>
                    <h2 className="text-xl font-bold mb-2 self-center">{r.Title}</h2>
                    {typeof imgSrc === 'string' &&
                      imgSrc.length > 0 &&
                      (imgSrc.startsWith('http://') ||
                        imgSrc.startsWith('https://') ||
                        imgSrc.startsWith('/')) ? (
                      <div className="mb-2 flex justify-center">
                        <Image
                          src={imgSrc}
                          alt={r.Title}
                          width={400}
                          height={300}
                          className="rounded"
                        />
                      </div>
                    ) : null}
                    <p className="text-sm text-gray-500 mb-2"><em>By: {r.Author || 'Unknown'}</em></p>
                    <p className="text-gray-600 mb-1">{r.Description}</p>
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
        <div className="pagination-row">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="theme-btn"
          >
            <strong>&lt;</strong>
          </button>
          <span style={{ minWidth: 90, textAlign: 'center', color: '#a5b4fc', fontWeight: 600 }}>
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
            className="theme-btn"
          >
            <strong>&gt;</strong>
          </button>
        </div>
      </div>
    </div>
  );
}
