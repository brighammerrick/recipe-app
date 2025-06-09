'use client';

import React, { useState, useEffect } from 'react';
import { signOut } from "next-auth/react";
import "@/app/globals.css";

interface Recipe {
  Id: number;
  Title: string;
  Description: string;
  Content: string;
  Author: string;
  Hidden: boolean;
}

type SortOption = 'id-asc' | 'id-desc' | 'title-asc' | 'title-desc' | 'author-asc' | 'author-desc';

export default function AdminPanel() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [sort, setSort] = useState<SortOption>('id-asc');

  const fetchRecipes = async () => {
    const res = await fetch('/api/admin/recipes');
    const data = await res.json();
    setRecipes(data);
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const handleAddOrUpdateRecipe = async () => {
    if (editingId !== null) {
      // EDIT mode
      await fetch('/api/admin/recipes', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingId, title, description, content, author }),
      });
    } else {
      // ADD mode
      await fetch('/api/admin/recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, content, author }),
      });
    }

    setTitle('');
    setDescription('');
    setContent('');
    setAuthor('');
    setEditingId(null);
    fetchRecipes();
  };

  const handleEdit = (recipe: Recipe) => {
    setTitle(recipe.Title);
    setDescription(recipe.Description);
    setContent(recipe.Content);
    setAuthor(recipe.Author);
    setEditingId(recipe.Id);
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

  // Sorting logic
  const sortedRecipes = [...recipes].sort((a, b) => {
    switch (sort) {
      case 'id-asc':
        return a.Id - b.Id;
      case 'id-desc':
        return b.Id - a.Id;
      case 'title-asc':
        return a.Title.localeCompare(b.Title);
      case 'title-desc':
        return b.Title.localeCompare(a.Title);
      case 'author-asc':
        return a.Author.localeCompare(b.Author);
      case 'author-desc':
        return b.Author.localeCompare(a.Author);
      default:
        return 0;
    }
  });

  return (
    <div className="p-6 max-w mx-auto">
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>

      <div className="flex flex-col gap-2 mb-4">
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" className="border p-2" />
        <input value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" className="border p-2" />
        <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Content" className="border p-2" />
        <input value={author} onChange={e => setAuthor(e.target.value)} placeholder="Author" className="border p-2" />
        <button onClick={handleAddOrUpdateRecipe} className="bg-blue-500 text-white px-4 py-2 rounded">
          {editingId !== null ? 'Save Changes' : 'Add Recipe'}
        </button>
        {editingId !== null && (
          <button onClick={() => {
            setEditingId(null);
            setTitle('');
            setDescription('');
            setContent('');
            setAuthor('');
          }} className="text-sm text-gray-600">Cancel Edit</button>
        )}
      </div>

      <div className="mb-4 flex gap-2 items-center">
        <span>Sort by:</span>
        <select
          value={sort}
          onChange={e => setSort(e.target.value as SortOption)}
          className="border p-1 rounded bg-black text-white"
        >
          <option value="id-asc">ID Ascending</option>
          <option value="id-desc">ID Descending</option>
          <option value="title-asc">Title A-Z</option>
          <option value="title-desc">Title Z-A</option>
          <option value="author-asc">Author A-Z</option>
          <option value="author-desc">Author Z-A</option>
        </select>
      </div>

      <ul className="space-y-2">
        {sortedRecipes.map((r) => (
          <li key={r.Id} className="border p-4 rounded flex justify-between items-center">
            <div>
              [{r.Id}] <strong>{r.Title}</strong> — By: {r.Author || 'Unknown'}{" "}
              {r.Hidden && <span style={{ color: 'red' }}>HIDDEN</span>}
            </div>
            <div className="space-x-2">
              <button onClick={() => handleEdit(r)} className="bg-yellow-400 px-2 py-1 rounded">Edit</button>
              <button onClick={() => handleDelete(r.Id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
              <button onClick={() => toggleHide(r.Id, r.Hidden)} className="bg-gray-300 px-2 py-1 rounded">
                {r.Hidden ? 'Show' : 'Hide'}
              </button>
            </div>
          </li>
        ))}
      </ul>

      <button onClick={() => signOut()} className="mt-6 bg-red-500 text-white px-4 py-2 rounded">
        Sign Out
      </button>
    </div>
  );
}
