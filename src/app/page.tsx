'use client';

import { useEffect, useState } from 'react';


interface Recipe {
  Id: number;
  Title: string;
  Description: string;
  Hidden: boolean;
}

function titleToFilename(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') + '.jpg';
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
    <div>
      <h1>Recipes</h1>
      <hr/>
      <ul>
        {recipes
        .filter((r) => !r.Hidden)
        .map((r) => {
          const filename = titleToFilename(r.Title || '');
          const imageUrl = `/images/${filename}`;
          return (
            <li key={r.Id}>
              [{r.Id}] <strong>{r.Title || 'NONE'}</strong> - {r.Description || 'NONE'}{' '}
              <span>URL: <code>{imageUrl}</code></span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
