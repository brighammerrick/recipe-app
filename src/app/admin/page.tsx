'use client';

import AdminPanel from '@/components/AdminPanel';
import { useSession, signIn } from 'next-auth/react';
import { useEffect } from 'react';
  

export default function AdminPage() {
  const { data: session, status } = useSession();
  useEffect(() => {
    if (status === "unauthenticated") {
      signIn();
    }
  }, [status]);
  useEffect(() => {
    document.title = "Admin";
  }, []);

  if (status === "loading") return <div>Loading...</div>;

  if (!session) return null;
return (
    <AdminPanel />
  );
}