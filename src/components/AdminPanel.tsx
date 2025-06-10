'use client';

import React, { useState, useEffect } from 'react';
import { signOut } from "next-auth/react";
import "./AdminPanel.css";

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
    window.scrollTo({ top: 0, behavior: 'smooth' }); // <-- Add this line
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

  // Example structure for your AdminPanel component
  return (
    <div className="admin-panel-container p-6 max-w mx-auto">
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
      <form className="admin-form flex flex-col gap-2 mb-4" onSubmit={e => { e.preventDefault(); handleAddOrUpdateRecipe(); }}>
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" className="border p-2" />
        <input value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" className="border p-2" />
        <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Content" className="border p-2" />
        <input value={author} onChange={e => setAuthor(e.target.value)} placeholder="Author" className="border p-2" />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
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
      </form>
      <div className="admin-sort-row mb-4 flex gap-2 items-center">
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
      <ul className="admin-list space-y-2">
        {sortedRecipes.map(r => (
          <li
            key={r.Id}
            className={
              `border p-4 rounded flex justify-between items-center` +
              (r.Hidden ? ' hidden-card' : '') +
              ((!r.Author || r.Author === 'Unknown') ? ' author-missing-card' : '')
            }
          >
            <div>
              [{r.Id}] <strong>{r.Title}</strong> — By:{" "}
              <span>
                {r.Author || 'Unknown'}
              </span>
              {r.Hidden && <span className="hidden-label">HIDDEN</span>}
            </div>
            <div className="admin-actions space-x-2">
              <button className="edit-btn bg-yellow-400 px-2 py-1 rounded" onClick={() => handleEdit(r)}>Edit</button>
              <button className="delete-btn bg-red-500 text-white px-2 py-1 rounded" onClick={() => handleDelete(r.Id)}>Delete</button>
              <button className="hide-btn bg-gray-300 px-2 py-1 rounded" onClick={() => toggleHide(r.Id, r.Hidden)}>
                {r.Hidden ? 'Show' : 'Hide'}
              </button>
            </div>
          </li>
        ))}
      </ul>
      <button className="signout-btn mt-6 bg-red-500 text-white px-4 py-2 rounded" onClick={() => signOut()}>
        Sign Out
      </button>
    </div>
  );
}
