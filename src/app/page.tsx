'use client';

import { useEffect, useState } from 'react';
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

export default function RecipePage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [search, setSearch] = useState('');

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

  return (
    <div>
      <div className="search-bar-row">
        <input
          type="text"
          placeholder="Search recipes..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="mb-4 p-2 border rounded w-full"
          style={{ maxWidth: 320 }}
        />
      </div>
      <ul>
        {filteredRecipes.map((r) => (
          <li key={r.Id}>
            <div>
              <Link href={`./recipe/${r.Id}`}>
                <h2 className="text-xl font-bold mb-2 self-center">{r.Title}</h2>
                {r.ImageUrl && (
                  <div className="mb-2 flex justify-center">
                    <Image
                      src={r.ImageUrl}
                      alt={r.Title}
                      width={400}
                      height={300}
                      className="rounded"
                    />
                  </div>
                )}
                <p className="text-sm text-gray-500 mb-2"><em>By: {r.Author || 'Unknown'}</em></p>
                <p className="text-gray-600 mb-1">{r.Description}</p>
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
