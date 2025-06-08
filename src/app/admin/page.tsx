'use client';

import { useEffect, useState } from 'react';

interface Recipe {
  Id: number;
  Title: string;
  Description: string;
  Content: string;
  Author: string;
  Hidden: boolean;
}

// Helper function to generate image filename from title
function titleToFilename(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') + '.jpg';
}

export default function AdminPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');

  const fetchRecipes = async () => {
    const res = await fetch('/api/admin/recipes');
    const data = await res.json();
    setRecipes(data);
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const handleAddRecipe = async () => {
    await fetch('/api/admin/recipes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, content, author }),
    });
    setTitle('');
    setDescription('');
    setContent('');
    setAuthor('');
    fetchRecipes();
  };

  const handleDelete = async (id: number) => {
    await fetch('/api/admin/recipes', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    fetchRecipes();
  };

  const toggleHide = async (id: number, hidden: boolean) => {
    await fetch('/api/admin/recipes', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, hidden: !hidden }),
    });
    fetchRecipes();
  };

  return (
    <div>
      <h1>Admin Panel</h1>
      <hr/>
      <div>
        <input
          value={title}
          placeholder="Title"
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          value={description}
          placeholder="Description"
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          value={content}
          placeholder="Content / Instructions"
          onChange={(e) => setContent(e.target.value)}
        />
        <input
          value={author}
          placeholder="Author"
          onChange={(e) => setAuthor(e.target.value)}
        />
        <button onClick={handleAddRecipe}>Add Recipe</button>
      </div>
      <hr/>
      <ul>
        {recipes.map((r) => {
          const filename = titleToFilename(r.Title || '');
          const imageUrl = `/images/${filename}`;
        
        return(
          
          <li key={r.Id}>
            [{r.Id}] <strong>{r.Title || "NONE"}</strong> - {r.Description || "NONE"}{' '}
            <em>By: {r.Author || "Unknown"}</em>
            <p>{r.Content || "No instructions"}</p>
            {r.Hidden && <span style={{ color: 'red' }}>HIDDEN</span>}
            <br/>
            <span>URL: <code>{imageUrl}</code></span>
            <button onClick={() => handleDelete(r.Id)}>Delete</button>
            <button onClick={() => toggleHide(r.Id, r.Hidden)}>
              {r.Hidden ? 'Show' : 'Hide'}
            </button>
          </li>
        );
        })}
      </ul>
    </div>
  );
}