'use client';

import React, { useState, useEffect } from 'react';
import { signOut } from "next-auth/react";

interface Recipe {
  Id: number;
  Title: string;
  Description: string;
  Content: string;
  Author: string;
  Hidden: boolean;
}

export default function AdminPanel() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');

  async function fetchRecipes() {
    const res = await fetch('/api/admin/recipes');
    const data = await res.json();
    setRecipes(data);
  }

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
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" />
      <input value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" />
      <input value={content} onChange={e => setContent(e.target.value)} placeholder="Content" />
      <input value={author} onChange={e => setAuthor(e.target.value)} placeholder="Author" />
      <button onClick={handleAddRecipe}>Add Recipe</button>

      <ul>
        {recipes.map(r => (
          <li key={r.Id}>
            <strong>{r.Title}</strong> - {r.Description} by {r.Author || 'Unknown'} {r.Hidden && <span style={{ color: 'red' }}>HIDDEN </span>}
            <button onClick={() => handleDelete(r.Id)}>Delete</button>
            <button onClick={() => toggleHide(r.Id, r.Hidden)}>{r.Hidden ? 'Show' : 'Hide'}</button>
          </li>
        ))}
      </ul>
      <button onClick={() => signOut()} className="px-4 py-2 bg-red-500 text-white rounded">
        Sign Out
      </button>
    </div>
  );
}
