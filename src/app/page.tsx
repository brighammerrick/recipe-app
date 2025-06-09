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

  useEffect(() => {
    async function fetchRecipes() {
      const res = await fetch("/api/recipes"); // <-- public endpoint
      const data = await res.json();
      if (Array.isArray(data)) {
        setRecipes(data);
      } else {
        setRecipes([]);
      }
    }
    fetchRecipes();
  }, []);


  return (
    <ul>
      {recipes
        .filter((r) => !r.Hidden)
        .map((r) => (
          <li key={r.Id}>

            <div>
            <Link href={`./recipe/${r.Id}`} className="hover:bg-gray-100 transition-colors">
              <h2 className="text-xl font-bold mb-2 self-center">{r.Title}</h2>

              {/* Image */}
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
  ))
}
    </ul >
  );
}
