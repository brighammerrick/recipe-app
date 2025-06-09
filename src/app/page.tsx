'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

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

  useEffect(() => {
    async function fetchRecipes() {
      const res = await fetch("/api/admin/recipes"); // admin API endpoint, not /api/recipes
      const data = await res.json();
      setRecipes(data);
    }
    fetchRecipes();
  }, []);


  return (
    <ul>
      {recipes
      .filter((r) => !r.Hidden)
      .map((r) => (
        <li key={r.Id}>
          <div className="border rounded p-4 shadow-md max-w-md bg-white mb-4 text-gray-900">
            <h2 className="text-xl font-bold mb-2 self-center">{r.Title}</h2>

            {/* Image */}
            {r.ImageUrl && (
              <div className="mb-2">
                <Image
                  src={r.ImageUrl}
                  alt={r.Title}
                  width={400}
                  height={300}
                  className="rounded"
                />
              </div>
            )}

            {/* Description */}
            <p className="text-gray-600 mb-1"><strong>Description:</strong> {r.Description}</p>

            {/* Author */}
            <p className="text-sm text-gray-500 mb-2"><em>By {r.Author || 'Unknown'}</em></p>

          </div>
        </li>
      ))}
    </ul>
  );
}
