"use client";

import Link from "next/link";
import { useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

type SearchUser = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  telephone: string;
};

export default function CustomersPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchUser[] | null>(null);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (query.trim().length < 2) {
      setError("Type at least 2 characters");
      setResults(null);
      return;
    }

    setSearching(true);
    try {
      const res = await fetch(
        `${API_BASE}/users/search?q=${encodeURIComponent(query.trim())}`,
        { credentials: "include" },
      );
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message || "Search failed");
      }
      const data = await res.json();
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setResults(null);
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-2xl p-6">
      <h1 className="text-2xl font-bold">Customers</h1>

      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, email, or phone"
          className="border rounded p-2 flex-1"
        />
        <button
          type="submit"
          disabled={searching}
          className="bg-black text-white rounded px-4 disabled:opacity-50"
        >
          {searching ? "Searching…" : "Search"}
        </button>
      </form>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      {results !== null && (
        <div className="flex flex-col gap-2">
          {results.length === 0 ? (
            <p className="text-gray-500">No customers found.</p>
          ) : (
            results.map((customer) => (
              <Link
                key={customer.id}
                href={`/admin/customers/${customer.id}`}
                className="border rounded p-4 hover:bg-gray-50 flex flex-col"
              >
                <span className="font-medium">
                  {customer.firstName} {customer.lastName}
                </span>
                <span className="text-sm text-gray-500">{customer.email}</span>
                <span className="text-sm text-gray-500">
                  {customer.telephone}
                </span>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}
